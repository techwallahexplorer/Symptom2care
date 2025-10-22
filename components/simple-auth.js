/**
 * Simple CSV-Based Authentication
 * No Firebase - Uses localStorage only
 */

// Simple CSV Logger for users
class SimpleAuthSystem {
    constructor() {
        this.usersKey = 'registeredUsers';
        this.currentUserKey = 'currentUser';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    // Hash password (simple hash for demo - use bcrypt in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Register new user
    signup(name, email, password) {
        try {
            const users = JSON.parse(localStorage.getItem(this.usersKey));
            
            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                throw new Error('Email already registered');
            }

            // Create new user
            const newUser = {
                uid: 'user_' + Date.now(),
                name: name,
                email: email,
                password: this.hashPassword(password),
                verified: false,
                createdAt: new Date().toISOString(),
                loginCount: 0,
                lastLogin: null
            };

            // Add to users array
            users.push(newUser);
            localStorage.setItem(this.usersKey, JSON.stringify(users));

            // Log to CSV
            this.logToCSV(newUser, 'signup');

            console.log('✅ Signup successful:', email);
            return { success: true, user: this.sanitizeUser(newUser) };
        } catch (error) {
            console.error('❌ Signup error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Login user
    login(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem(this.usersKey));
            
            // Find user
            const user = users.find(u => u.email === email);
            if (!user) {
                throw new Error('No account found with this email');
            }

            // Check password
            const hashedPassword = this.hashPassword(password);
            if (user.password !== hashedPassword) {
                throw new Error('Incorrect password');
            }

            // Update login info
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastLogin = new Date().toISOString();

            // Update in storage
            const userIndex = users.findIndex(u => u.email === email);
            users[userIndex] = user;
            localStorage.setItem(this.usersKey, JSON.stringify(users));

            // Set current user
            localStorage.setItem(this.currentUserKey, JSON.stringify(this.sanitizeUser(user)));

            // Log to CSV
            this.logToCSV(user, 'login');

            console.log('✅ Login successful:', email);
            return { success: true, user: this.sanitizeUser(user) };
        } catch (error) {
            console.error('❌ Login error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Guest mode
    guestLogin() {
        const guestUser = {
            uid: 'guest_' + Date.now(),
            name: 'Guest User',
            email: 'guest@local',
            verified: false,
            createdAt: new Date().toISOString(),
            loginCount: 1,
            lastLogin: new Date().toISOString(),
            isGuest: true
        };

        localStorage.setItem(this.currentUserKey, JSON.stringify(guestUser));
        localStorage.setItem('guestMode', 'true');
        
        this.logToCSV(guestUser, 'guest');
        
        console.log('✅ Guest login successful');
        return { success: true, user: guestUser };
    }

    // Logout
    logout() {
        localStorage.removeItem(this.currentUserKey);
        localStorage.removeItem('guestMode');
        console.log('✅ Logged out');
    }

    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Check if logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Remove password from user object
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    // Log to CSV format
    logToCSV(user, action) {
        const csvKey = 'authLogs';
        let csv = localStorage.getItem(csvKey) || 'timestamp,action,uid,name,email,verified,loginCount\n';
        
        const row = [
            new Date().toISOString(),
            action,
            user.uid,
            this.escapeCSV(user.name),
            this.escapeCSV(user.email),
            user.verified,
            user.loginCount || 0
        ].join(',') + '\n';

        csv += row;
        localStorage.setItem(csvKey, csv);
    }

    // Escape CSV values
    escapeCSV(value) {
        if (!value) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    }

    // Get all users (admin function)
    getAllUsers() {
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        return users.map(u => this.sanitizeUser(u));
    }

    // Export CSV
    exportCSV() {
        const csv = localStorage.getItem('authLogs');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auth_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('✅ CSV exported');
    }

    // Get statistics
    getStats() {
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        return {
            totalUsers: users.length,
            verifiedUsers: users.filter(u => u.verified).length,
            unverifiedUsers: users.filter(u => !u.verified).length,
            todaySignups: users.filter(u => {
                const signupDate = new Date(u.createdAt);
                const today = new Date();
                return signupDate.toDateString() === today.toDateString();
            }).length
        };
    }
}

// Initialize auth system
const authSystem = new SimpleAuthSystem();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTabs = document.querySelectorAll('.auth-tab');
const guestBtn = document.getElementById('guestBtn');
const authLoading = document.getElementById('authLoading');

// Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tabName === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
        const result = authSystem.login(email, password);
        
        showLoading(false);
        
        if (result.success) {
            alert('✅ Login successful!');
            window.location.href = '../landing.html';
        } else {
            alert('❌ ' + result.error);
        }
    }, 500);
});

// Signup Form Submit
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters!');
        return;
    }
    
    showLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
        const result = authSystem.signup(name, email, password);
        
        showLoading(false);
        
        if (result.success) {
            alert('✅ Signup successful! You can now login.');
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
            // Pre-fill email
            document.getElementById('loginEmail').value = email;
        } else {
            alert('❌ ' + result.error);
        }
    }, 500);
});

// Guest Mode
if (guestBtn) {
    guestBtn.addEventListener('click', () => {
        const result = authSystem.guestLogin();
        if (result.success) {
            window.location.href = '../landing.html';
        }
    });
}

// Helper Functions
function showLoading(show) {
    if (authLoading) {
        authLoading.style.display = show ? 'flex' : 'none';
    }
}

// Check if already logged in
if (authSystem.isLoggedIn() && !window.location.href.includes('auth')) {
    console.log('✅ User already logged in');
    // Optionally redirect
    // window.location.href = '../landing.html';
}

console.log('✅ Simple Auth System initialized');
console.log('📊 Stats:', authSystem.getStats());
