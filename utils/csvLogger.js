/**
 * CSV Logger for User Signups and Authentication
 * Tracks signups, verification status, and login redirects
 */

class CSVLogger {
    constructor() {
        this.storageKey = 'userSignupLogs';
        this.initializeStorage();
    }

    // Initialize localStorage with CSV structure
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const headers = 'timestamp,uid,name,email,verified,loginCount,lastLogin,signupMethod,redirectTo\n';
            localStorage.setItem(this.storageKey, headers);
        }
    }

    // Log new signup
    logSignup(userData) {
        try {
            const timestamp = new Date().toISOString();
            const csvRow = [
                timestamp,
                userData.uid || '',
                this.escapeCSV(userData.name || ''),
                this.escapeCSV(userData.email || ''),
                userData.verified ? 'true' : 'false',
                '1', // Initial login count
                timestamp,
                userData.signupMethod || 'email',
                userData.redirectTo || 'landing.html'
            ].join(',') + '\n';

            // Append to localStorage CSV
            const currentCSV = localStorage.getItem(this.storageKey);
            localStorage.setItem(this.storageKey, currentCSV + csvRow);

            // Also save individual user record
            this.saveUserRecord(userData);

            console.log('✅ Signup logged to CSV:', userData.email);
            return true;
        } catch (error) {
            console.error('❌ Error logging signup:', error);
            return false;
        }
    }

    // Log user login
    logLogin(userData) {
        try {
            const timestamp = new Date().toISOString();
            
            // Get user record
            const userRecord = this.getUserRecord(userData.uid);
            if (userRecord) {
                userRecord.loginCount = (parseInt(userRecord.loginCount) || 0) + 1;
                userRecord.lastLogin = timestamp;
                userRecord.verified = userData.verified ? 'true' : 'false';
                this.saveUserRecord(userRecord);
            }

            console.log('✅ Login logged:', userData.email);
            return true;
        } catch (error) {
            console.error('❌ Error logging login:', error);
            return false;
        }
    }

    // Update verification status
    updateVerificationStatus(uid, verified) {
        try {
            const userRecord = this.getUserRecord(uid);
            if (userRecord) {
                userRecord.verified = verified ? 'true' : 'false';
                this.saveUserRecord(userRecord);
                console.log('✅ Verification status updated:', uid);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error updating verification:', error);
            return false;
        }
    }

    // Save individual user record
    saveUserRecord(userData) {
        const userKey = `user_${userData.uid}`;
        localStorage.setItem(userKey, JSON.stringify(userData));
    }

    // Get user record
    getUserRecord(uid) {
        const userKey = `user_${uid}`;
        const data = localStorage.getItem(userKey);
        return data ? JSON.parse(data) : null;
    }

    // Get all signups as array
    getAllSignups() {
        const csv = localStorage.getItem(this.storageKey);
        if (!csv) return [];

        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            return obj;
        });
    }

    // Get user statistics
    getUserStats(uid) {
        const userRecord = this.getUserRecord(uid);
        if (!userRecord) return null;

        return {
            uid: userRecord.uid,
            name: userRecord.name,
            email: userRecord.email,
            verified: userRecord.verified === 'true',
            loginCount: parseInt(userRecord.loginCount) || 0,
            lastLogin: userRecord.lastLogin,
            signupMethod: userRecord.signupMethod,
            signupDate: userRecord.timestamp
        };
    }

    // Export CSV for download
    exportCSV() {
        const csv = localStorage.getItem(this.storageKey);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signups_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('✅ CSV exported');
    }

    // Parse CSV line (handles commas in quoted strings)
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
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

    // Clear all logs (admin function)
    clearLogs() {
        if (confirm('Are you sure you want to clear all signup logs?')) {
            localStorage.removeItem(this.storageKey);
            this.initializeStorage();
            console.log('✅ Logs cleared');
            return true;
        }
        return false;
    }

    // Get summary statistics
    getSummaryStats() {
        const signups = this.getAllSignups();
        
        return {
            totalSignups: signups.length,
            verifiedUsers: signups.filter(s => s.verified === 'true').length,
            unverifiedUsers: signups.filter(s => s.verified === 'false').length,
            emailSignups: signups.filter(s => s.signupMethod === 'email').length,
            googleSignups: signups.filter(s => s.signupMethod === 'google').length,
            guestSignups: signups.filter(s => s.signupMethod === 'guest').length,
            todaySignups: signups.filter(s => {
                const signupDate = new Date(s.timestamp);
                const today = new Date();
                return signupDate.toDateString() === today.toDateString();
            }).length
        };
    }
}

// Export for use in other modules
export default CSVLogger;
