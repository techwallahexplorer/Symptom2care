/**
 * Navigation & Settings Logic
 * Handles profile dropdown, settings modal, and user preferences
 */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSettings();
    checkUserAuth();
});

// ========================================
// Navigation
// ========================================
function initializeNavigation() {
    const profileBtn = document.getElementById('profileBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const settingsOverlay = document.getElementById('settingsOverlay');
    
    // Settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openSettings();
        });
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', closeSettingsModal);
    }
    
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', closeSettingsModal);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const profileDropdown = document.querySelector('.profile-dropdown');
        if (profileDropdown && !profileDropdown.contains(e.target)) {
            const dropdownMenu = document.getElementById('profileMenu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            }
        }
    });
}

// ========================================
// Settings Modal
// ========================================
function openSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.add('active');
        loadSettings();
    }
}

function closeSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.remove('active');
    }
}

// ========================================
// Settings Management
// ========================================
function initializeSettings() {
    // Dark mode switch
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
        });
    }
    
    // Language select
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
    
    // Notifications switch
    const notificationsSwitch = document.getElementById('notificationsSwitch');
    if (notificationsSwitch) {
        notificationsSwitch.addEventListener('change', (e) => {
            toggleNotifications(e.target.checked);
        });
    }
    
    // Data sharing switch
    const dataSharingSwitch = document.getElementById('dataSharingSwitch');
    if (dataSharingSwitch) {
        dataSharingSwitch.addEventListener('change', (e) => {
            toggleDataSharing(e.target.checked);
        });
    }
    
    // Load saved settings
    loadSettings();
}

function loadSettings() {
    // Load dark mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.checked = isDarkMode;
    }
    
    // Load language
    const language = localStorage.getItem('language') || 'en';
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = language;
    }
    
    // Load notifications
    const notifications = localStorage.getItem('notifications') === 'true';
    const notificationsSwitch = document.getElementById('notificationsSwitch');
    if (notificationsSwitch) {
        notificationsSwitch.checked = notifications;
    }
    
    // Load data sharing
    const dataSharing = localStorage.getItem('dataSharing') === 'true';
    const dataSharingSwitch = document.getElementById('dataSharingSwitch');
    if (dataSharingSwitch) {
        dataSharingSwitch.checked = dataSharing;
    }
}

function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        
        // Update dark mode toggle button
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.querySelector('.icon').textContent = '☀️';
        }
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.querySelector('.icon').textContent = '🌙';
        }
    }
}

function changeLanguage(language) {
    localStorage.setItem('language', language);
    console.log('Language changed to:', language);
    
    // Show notification
    showNotification(`Language changed to ${getLanguageName(language)}`, 'success');
    
    // In a full implementation, this would reload the page with new translations
    // For now, we just save the preference
}

function toggleNotifications(enabled) {
    localStorage.setItem('notifications', enabled);
    
    if (enabled) {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Notifications enabled!', 'success');
                }
            });
        } else {
            showNotification('Notifications enabled!', 'success');
        }
    } else {
        showNotification('Notifications disabled', 'info');
    }
}

function toggleDataSharing(enabled) {
    localStorage.setItem('dataSharing', enabled);
    showNotification(
        enabled ? 'Data sharing enabled' : 'Data sharing disabled',
        'info'
    );
}

// ========================================
// User Authentication Check
// ========================================
function checkUserAuth() {
    // Check if user is logged in (from Firebase or guest mode)
    const guestMode = localStorage.getItem('guestMode') === 'true';
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const authLink = document.getElementById('authLink');
    const authText = document.getElementById('authText');
    
    if (guestMode) {
        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'guest@symptom2care.com';
        if (authText) authText.textContent = 'Login';
    } else {
        // Check for Firebase user (would need Firebase SDK)
        // For now, show guest
        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'Click to login';
        if (authText) authText.textContent = 'Login';
    }
}

// ========================================
// Helper Functions
// ========================================
function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'हिंदी (Hindi)',
        'es': 'Español (Spanish)',
        'fr': 'Français (French)',
        'ar': 'العربية (Arabic)'
    };
    return languages[code] || code;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Navigation & Settings initialized');
