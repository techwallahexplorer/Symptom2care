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
        // [FIX A7] Only queue locally if Firebase is unavailable — never on success
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
        // [FIX A7] Do NOT double-write to localStorage on success.
        // localStorage is the OFFLINE QUEUE only — not a permanent backup.
    } catch (error) {
        console.error('❌ Error saving session to Firestore:', error);
        // Only queue locally if Firestore write actually failed
        storeLocally('sessions', sessionData);
        console.log('💾 Session queued locally for later sync');
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
        // [FIX A7] Do NOT double-write to localStorage on success.
    } catch (error) {
        console.error('❌ Error saving feedback to Firestore:', error);
        storeLocally('feedback', feedbackData);
        console.log('💾 Feedback queued locally for later sync');
    }
}

/**
 * Store data locally in IndexedDB/LocalStorage
 * @param {string} type - Type of data (sessions/feedback)
 * @param {Object} data - Data to store
 */
// [FIX A7] storeLocally accepts spread items so bulk re-queuing works atomically
function storeLocally(type, ...items) {
    try {
        const key = `symptom2care_${type}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(...items);
        // Keep only last 50 items to respect storage limits
        const trimmed = existing.slice(-50);
        localStorage.setItem(key, JSON.stringify(trimmed));
        console.log(`💾 Queued ${items.length} ${type} item(s) locally (total: ${trimmed.length})`);
    } catch (error) {
        console.error('❌ Error storing locally:', error);
    }
}

/**
 * Sync locally stored data to Firestore when online
 */
export async function syncLocalData() {
    if (!isFirebaseInitialized || !navigator.onLine) return;

    // [FIX A7] Atomic dequeue: read the queue, clear it FIRST, then attempt upload.
    // If an upload fails, re-queue only that item — never re-process already-saved items.
    try {
        console.log('🔄 Syncing local data to Firestore...');

        // --- Sessions ---
        const sessionKey = 'symptom2care_sessions';
        const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]');
        // Clear immediately to prevent re-processing on concurrent sync calls
        localStorage.removeItem(sessionKey);

        const failedSessions = [];
        for (const session of sessions) {
            try {
                const ref = await addDoc(collection(db, 'sessions'), {
                    sessionId: session.id,
                    inputText: session.inputText,
                    extractedSymptoms: session.extractedSymptoms,
                    recommendations: session.recommendations,
                    isOnline: session.isOnline,
                    timestamp: serverTimestamp(),
                    createdAt: session.timestamp,
                    syncedFromLocal: true
                });
                console.log('✅ Synced session:', ref.id);
            } catch (err) {
                console.error('❌ Failed to sync session, re-queuing:', err);
                failedSessions.push(session); // only re-queue failures
            }
        }
        if (failedSessions.length > 0) {
            storeLocally('sessions', ...failedSessions);
        }

        // --- Feedback ---
        const feedbackKey = 'symptom2care_feedback';
        const feedbacks = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
        localStorage.removeItem(feedbackKey);

        const failedFeedbacks = [];
        for (const feedback of feedbacks) {
            try {
                const ref = await addDoc(collection(db, 'feedback'), {
                    sessionId: feedback.sessionId,
                    rating: feedback.rating,
                    comments: feedback.comments,
                    timestamp: serverTimestamp(),
                    createdAt: feedback.timestamp,
                    syncedFromLocal: true
                });
                console.log('✅ Synced feedback:', ref.id);
            } catch (err) {
                console.error('❌ Failed to sync feedback, re-queuing:', err);
                failedFeedbacks.push(feedback);
            }
        }
        if (failedFeedbacks.length > 0) {
            storeLocally('feedback', ...failedFeedbacks);
        }

        console.log('✅ Sync complete.');
    } catch (error) {
        console.error('❌ syncLocalData top-level error:', error);
    }
}

// Export db instance for advanced usage
export { db };
