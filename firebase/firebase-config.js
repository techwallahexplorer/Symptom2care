/**
 * Firebase Configuration and Firestore Integration
 * Handles database operations and authentication
 */

// Firebase SDK imports (using CDN version 9+)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "***REDACTED_API_KEY***",
    authDomain: "symptom2care.firebaseapp.com",
    databaseURL: "https://symptom2care-default-rtdb.firebaseio.com",
    projectId: "symptom2care",
    storageBucket: "symptom2care.appspot.com",
    messagingSenderId: "100686432761277155946",
    appId: "1:100686432761277155946:web:8f3c4a5b6d7e8f9a0b1c2d"
};

// Initialize Firebase
let app;
let db;
let isFirebaseInitialized = false;

export async function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');
        
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
        // Enable offline persistence
        try {
            await enableIndexedDbPersistence(db);
            console.log('✅ Offline persistence enabled');
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Browser does not support persistence');
            }
        }
        
        isFirebaseInitialized = true;
        console.log('✅ Firebase initialized successfully');
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.log('📴 App will continue in offline-only mode');
    }
}

/**
 * Save a user session to Firestore
 * @param {Object} sessionData - Session data to save
 */
export async function saveSession(sessionData) {
    if (!isFirebaseInitialized) {
        console.warn('⚠️ Firebase not initialized, storing locally');
        storeLocally('sessions', sessionData);
        return;
    }
    
    try {
        const sessionsRef = collection(db, 'sessions');
        
        const docData = {
            sessionId: sessionData.id,
            inputText: sessionData.inputText,
            extractedSymptoms: sessionData.extractedSymptoms,
            recommendations: sessionData.recommendations,
            isOnline: sessionData.isOnline,
            timestamp: serverTimestamp(),
            createdAt: sessionData.timestamp
        };
        
        const docRef = await addDoc(sessionsRef, docData);
        console.log('✅ Session saved to Firestore:', docRef.id);
        
        // Also store locally as backup
        storeLocally('sessions', sessionData);
        
    } catch (error) {
        console.error('❌ Error saving session to Firestore:', error);
        
        // Fallback to local storage
        storeLocally('sessions', sessionData);
        console.log('💾 Session saved locally for later sync');
    }
}

/**
 * Save user feedback to Firestore
 * @param {Object} feedbackData - Feedback data to save
 */
export async function saveFeedback(feedbackData) {
    if (!isFirebaseInitialized) {
        console.warn('⚠️ Firebase not initialized, storing locally');
        storeLocally('feedback', feedbackData);
        return;
    }
    
    try {
        const feedbackRef = collection(db, 'feedback');
        
        const docData = {
            sessionId: feedbackData.sessionId,
            rating: feedbackData.rating,
            comments: feedbackData.comments,
            timestamp: serverTimestamp(),
            createdAt: feedbackData.timestamp
        };
        
        const docRef = await addDoc(feedbackRef, docData);
        console.log('✅ Feedback saved to Firestore:', docRef.id);
        
        // Also store locally as backup
        storeLocally('feedback', feedbackData);
        
    } catch (error) {
        console.error('❌ Error saving feedback to Firestore:', error);
        
        // Fallback to local storage
        storeLocally('feedback', feedbackData);
        console.log('💾 Feedback saved locally for later sync');
    }
}

/**
 * Store data locally in IndexedDB/LocalStorage
 * @param {string} type - Type of data (sessions/feedback)
 * @param {Object} data - Data to store
 */
function storeLocally(type, data) {
    try {
        const key = `symptom2care_${type}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(data);
        
        // Keep only last 50 items to avoid storage limits
        if (existing.length > 50) {
            existing.shift();
        }
        
        localStorage.setItem(key, JSON.stringify(existing));
        console.log(`💾 Stored ${type} locally`);
        
    } catch (error) {
        console.error('❌ Error storing locally:', error);
    }
}

/**
 * Sync locally stored data to Firestore when online
 */
export async function syncLocalData() {
    if (!isFirebaseInitialized || !navigator.onLine) {
        return;
    }
    
    try {
        console.log('🔄 Syncing local data to Firestore...');
        
        // Sync sessions
        const sessions = JSON.parse(localStorage.getItem('symptom2care_sessions') || '[]');
        for (const session of sessions) {
            await saveSession(session);
        }
        
        // Sync feedback
        const feedbacks = JSON.parse(localStorage.getItem('symptom2care_feedback') || '[]');
        for (const feedback of feedbacks) {
            await saveFeedback(feedback);
        }
        
        // Clear local storage after successful sync
        localStorage.removeItem('symptom2care_sessions');
        localStorage.removeItem('symptom2care_feedback');
        
        console.log('✅ Local data synced successfully');
        
    } catch (error) {
        console.error('❌ Error syncing local data:', error);
    }
}

// Export db instance for advanced usage
export { db };
