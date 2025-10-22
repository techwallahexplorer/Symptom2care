/**
 * Symptom2Care - Main Application Script
 * Handles UI interactions, symptom analysis, and recommendations
 */

import { saveSession, saveFeedback, initializeFirebase } from './firebase/firebase-config.js';
import { extractSymptomsOffline } from './nlp/nlp.js';

// ========================================
// Global State
// ========================================
let currentSession = {
    id: null,
    inputText: '',
    extractedSymptoms: [],
    recommendations: {
        asanas: [],
        medicines: [],
        precautions: []
    },
    timestamp: null,
    isOnline: navigator.onLine
};

let selectedRating = 0;
let csvData = {
    asanas: [],
    medicines: [],
    symptomMap: []
};

let redFlagsData = [];

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏥 Symptom2Care initializing...');
    
    // Initialize Firebase
    await initializeFirebase();
    
    // Load CSV data
    await loadAllData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup online/offline detection
    setupConnectionMonitoring();
    
    // Register service worker for PWA
    registerServiceWorker();
    
    // Check for dark mode preference
    checkDarkModePreference();
    
    console.log('✅ Application ready');
});

// ========================================
// Event Listeners Setup
// ========================================
function setupEventListeners() {
    // Analyze button
    document.getElementById('analyzeBtn').addEventListener('click', analyzeSymptoms);
    
    // Enter key in textarea
    document.getElementById('symptomInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            analyzeSymptoms();
        }
    });
    
    // Character counter
    document.getElementById('symptomInput').addEventListener('input', (e) => {
        const count = e.target.value.length;
        document.getElementById('charCount').textContent = `${count} / 500`;
        
        if (count > 500) {
            e.target.value = e.target.value.substring(0, 500);
        }
    });
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Download PDF
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
    
    // Print
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    
    // Star rating
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', handleStarClick);
        star.addEventListener('mouseenter', handleStarHover);
    });
    
    document.getElementById('starRating').addEventListener('mouseleave', resetStarHover);
    
    // Submit feedback
    document.getElementById('submitFeedbackBtn').addEventListener('click', submitFeedback);
}

// ========================================
// Connection Monitoring
// ========================================
function setupConnectionMonitoring() {
    updateConnectionStatus();
    
    window.addEventListener('online', () => {
        updateConnectionStatus();
        console.log('🌐 Connection restored');
        syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
        updateConnectionStatus();
        console.log('📴 Connection lost - switching to offline mode');
    });
}

function updateConnectionStatus() {
    const statusIndicator = document.getElementById('connectionStatus');
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        statusIndicator.classList.remove('offline');
        statusIndicator.querySelector('.status-text').textContent = 'Online';
    } else {
        statusIndicator.classList.add('offline');
        statusIndicator.querySelector('.status-text').textContent = 'Offline';
    }
    
    currentSession.isOnline = isOnline;
}

// ========================================
// Data Loading
// ========================================
async function loadAllData() {
    try {
        console.log('📊 Loading datasets...');
        
        // Load CSV files
        csvData.asanas = await loadCSV('./data/asanas.csv');
        csvData.medicines = await loadCSV('./data/medicines.csv');
        csvData.symptomMap = await loadCSV('./data/symptom_map.csv');
        
        // Load red flags JSON
        const response = await fetch('./data/red_flags.json');
        redFlagsData = await response.json();
        
        console.log('✅ All datasets loaded successfully');
    } catch (error) {
        console.error('❌ Error loading data:', error);
        showNotification('Failed to load some datasets. Some features may be limited.', 'warning');
    }
}

function loadCSV(filepath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filepath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log(`✅ Loaded ${filepath}: ${results.data.length} rows`);
                resolve(results.data);
            },
            error: (error) => {
                console.error(`❌ Error loading ${filepath}:`, error);
                reject(error);
            }
        });
    });
}

// ========================================
// Main Analysis Function
// ========================================
async function analyzeSymptoms() {
    const input = document.getElementById('symptomInput').value.trim();
    
    if (!input) {
        showNotification('Please describe your symptoms', 'warning');
        return;
    }
    
    // Show loading state
    showLoading(true);
    hideResults();
    
    // Update session
    currentSession.inputText = input;
    currentSession.timestamp = new Date().toISOString();
    currentSession.id = generateSessionId();
    
    try {
        // Extract symptoms
        let symptoms = [];
        
        if (navigator.onLine) {
            console.log('🌐 Using Gemini API for symptom extraction');
            symptoms = await extractSymptomsWithGemini(input);
        } else {
            console.log('📴 Using offline NLP for symptom extraction');
            symptoms = extractSymptomsOffline(input);
        }
        
        currentSession.extractedSymptoms = symptoms;
        
        // Check for red flags
        const redFlag = checkRedFlags(symptoms);
        if (redFlag) {
            showRedFlagAlert(redFlag);
        }
        
        // Get recommendations
        const recommendations = getRecommendations(symptoms);
        currentSession.recommendations = recommendations;
        
        // Display results
        displayResults(symptoms, recommendations);
        
        // Save session to Firebase
        await saveSession(currentSession);
        
        // Show feedback section
        document.getElementById('feedbackSection').style.display = 'block';
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        showNotification('An error occurred during analysis. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ========================================
// Gemini API Integration
// ========================================
async function extractSymptomsWithGemini(text) {
    const GEMINI_API_KEY = '***REDACTED_API_KEY***';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `You are a medical symptom analyzer. Extract all symptoms from the following text and return them as a JSON array of strings. Only return the symptom names, nothing else.

Text: "${text}"

Return format: ["symptom1", "symptom2", "symptom3"]`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON array from response
        const jsonMatch = resultText.match(/\[.*\]/s);
        if (jsonMatch) {
            const symptoms = JSON.parse(jsonMatch[0]);
            return symptoms.map(s => s.toLowerCase().trim());
        }
        
        // Fallback to offline if parsing fails
        console.warn('⚠️ Failed to parse Gemini response, using offline fallback');
        return extractSymptomsOffline(text);
        
    } catch (error) {
        console.error('❌ Gemini API error:', error);
        // Fallback to offline NLP
        return extractSymptomsOffline(text);
    }
}

// ========================================
// Red Flag Detection
// ========================================
function checkRedFlags(symptoms) {
    for (const flag of redFlagsData) {
        const matchedSymptoms = symptoms.filter(s => 
            flag.symptoms.some(fs => s.includes(fs.toLowerCase()))
        );
        
        if (matchedSymptoms.length >= flag.threshold) {
            return flag;
        }
    }
    return null;
}

function showRedFlagAlert(flag) {
    const alert = document.getElementById('redFlagAlert');
    const message = document.getElementById('redFlagMessage');
    
    message.textContent = flag.message;
    alert.style.display = 'flex';
    
    // Scroll to alert
    alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========================================
// Recommendations Engine
// ========================================
function getRecommendations(symptoms) {
    const recommendations = {
        asanas: [],
        medicines: [],
        precautions: []
    };
    
    // Match symptoms to conditions
    const matchedConditions = new Set();
    
    symptoms.forEach(symptom => {
        csvData.symptomMap.forEach(mapping => {
            if (mapping.symptom && symptom.includes(mapping.symptom.toLowerCase())) {
                matchedConditions.add(mapping.condition.toLowerCase());
            }
        });
    });
    
    // Get asanas for matched conditions
    csvData.asanas.forEach(asana => {
        if (asana.conditions) {
            const asanaConditions = asana.conditions.toLowerCase().split(',').map(c => c.trim());
            if (asanaConditions.some(c => matchedConditions.has(c))) {
                recommendations.asanas.push(asana);
            }
        }
    });
    
    // Get medicines for matched conditions
    csvData.medicines.forEach(medicine => {
        if (medicine.conditions) {
            const medConditions = medicine.conditions.toLowerCase().split(',').map(c => c.trim());
            if (medConditions.some(c => matchedConditions.has(c))) {
                recommendations.medicines.push(medicine);
            }
        }
    });
    
    // General precautions
    recommendations.precautions = [
        'Stay hydrated - drink at least 8 glasses of water daily',
        'Get adequate rest - aim for 7-9 hours of sleep',
        'Maintain a balanced diet rich in fruits and vegetables',
        'Avoid self-medication beyond recommended OTC doses',
        'Monitor your symptoms and seek medical help if they worsen',
        'Practice stress management techniques like meditation',
        'Maintain good hygiene practices'
    ];
    
    return recommendations;
}

// ========================================
// Display Results
// ========================================
function displayResults(symptoms, recommendations) {
    // Display symptoms
    const symptomsList = document.getElementById('symptomsList');
    symptomsList.innerHTML = symptoms.map(s => 
        `<span class="symptom-tag">🔹 ${capitalizeFirst(s)}</span>`
    ).join('');
    
    // Display asanas
    const asanasList = document.getElementById('asanasList');
    const asanasEmpty = document.getElementById('asanasEmpty');
    
    if (recommendations.asanas.length > 0) {
        asanasList.innerHTML = recommendations.asanas.map((asana, idx) => 
            createAsanaCard(asana, idx)
        ).join('');
        asanasList.style.display = 'grid';
        asanasEmpty.style.display = 'none';
    } else {
        asanasList.style.display = 'none';
        asanasEmpty.style.display = 'block';
    }
    
    // Display medicines
    const medicinesList = document.getElementById('medicinesList');
    const medicinesEmpty = document.getElementById('medicinesEmpty');
    
    if (recommendations.medicines.length > 0) {
        medicinesList.innerHTML = recommendations.medicines.map((medicine, idx) => 
            createMedicineCard(medicine, idx)
        ).join('');
        medicinesList.style.display = 'grid';
        medicinesEmpty.style.display = 'none';
    } else {
        medicinesList.style.display = 'none';
        medicinesEmpty.style.display = 'block';
    }
    
    // Display precautions
    const precautionsList = document.getElementById('precautionsList');
    precautionsList.innerHTML = recommendations.precautions.map(p => 
        `<li>✓ ${p}</li>`
    ).join('');
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function createAsanaCard(asana, idx) {
    return `
        <div class="recommendation-item">
            <div class="recommendation-header">
                <h4 class="recommendation-name">${asana.name || 'Unnamed Asana'}</h4>
                <div class="recommendation-meta">
                    ${asana.difficulty ? `<span class="meta-badge difficulty-${asana.difficulty.toLowerCase()}">${asana.difficulty}</span>` : ''}
                    ${asana.duration ? `<span class="meta-badge">⏱️ ${asana.duration}</span>` : ''}
                </div>
            </div>
            <p class="recommendation-description">${asana.description || 'No description available'}</p>
            <div class="recommendation-details">
                ${asana.steps ? `
                    <div class="detail-section">
                        <button class="toggle-btn" onclick="toggleDetails('asana-steps-${idx}')">
                            📝 View Steps <span id="asana-steps-${idx}-icon">▼</span>
                        </button>
                        <div class="toggle-content" id="asana-steps-${idx}">
                            <div class="detail-content">${asana.steps}</div>
                        </div>
                    </div>
                ` : ''}
                ${asana.contraindications ? `
                    <div class="detail-section">
                        <button class="toggle-btn" onclick="toggleDetails('asana-contra-${idx}')">
                            ⚠️ Contraindications <span id="asana-contra-${idx}-icon">▼</span>
                        </button>
                        <div class="toggle-content" id="asana-contra-${idx}">
                            <div class="detail-content">${asana.contraindications}</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function createMedicineCard(medicine, idx) {
    return `
        <div class="recommendation-item">
            <div class="recommendation-header">
                <h4 class="recommendation-name">${medicine.name || 'Unnamed Medicine'}</h4>
                ${medicine.type ? `<div class="recommendation-meta"><span class="meta-badge">${medicine.type}</span></div>` : ''}
            </div>
            <p class="recommendation-description">${medicine.description || 'No description available'}</p>
            <div class="recommendation-details">
                ${medicine.dosage ? `
                    <div class="detail-section">
                        <div class="detail-label">💊 Dosage:</div>
                        <div class="detail-content">${medicine.dosage}</div>
                    </div>
                ` : ''}
                ${medicine.precautions ? `
                    <div class="detail-section">
                        <button class="toggle-btn" onclick="toggleDetails('med-precautions-${idx}')">
                            ⚠️ Precautions <span id="med-precautions-${idx}-icon">▼</span>
                        </button>
                        <div class="toggle-content" id="med-precautions-${idx}">
                            <div class="detail-content">${medicine.precautions}</div>
                        </div>
                    </div>
                ` : ''}
                ${medicine.side_effects ? `
                    <div class="detail-section">
                        <button class="toggle-btn" onclick="toggleDetails('med-side-${idx}')">
                            🔍 Side Effects <span id="med-side-${idx}-icon">▼</span>
                        </button>
                        <div class="toggle-content" id="med-side-${idx}">
                            <div class="detail-content">${medicine.side_effects}</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Make toggle function global
window.toggleDetails = function(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`${id}-icon`);
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.textContent = '▼';
    } else {
        content.classList.add('active');
        icon.textContent = '▲';
    }
};

// ========================================
// PDF Download
// ========================================
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(8, 145, 178);
    doc.text('Symptom2Care - Health Report', 20, yPos);
    yPos += 15;
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
    yPos += 15;
    
    // Symptoms
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Identified Symptoms:', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    currentSession.extractedSymptoms.forEach(symptom => {
        doc.text(`• ${capitalizeFirst(symptom)}`, 25, yPos);
        yPos += 6;
    });
    yPos += 5;
    
    // Recommendations
    doc.setFontSize(14);
    doc.text('Recommendations:', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text('Please consult the full report for detailed information.', 25, yPos);
    
    // Save
    doc.save(`symptom2care-report-${currentSession.id}.pdf`);
    showNotification('PDF downloaded successfully', 'success');
}

// ========================================
// Feedback System
// ========================================
function handleStarClick(e) {
    selectedRating = parseInt(e.target.dataset.rating);
    updateStarDisplay(selectedRating);
}

function handleStarHover(e) {
    const rating = parseInt(e.target.dataset.rating);
    updateStarDisplay(rating);
}

function resetStarHover() {
    updateStarDisplay(selectedRating);
}

function updateStarDisplay(rating) {
    document.querySelectorAll('.star').forEach((star, idx) => {
        if (idx < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

async function submitFeedback() {
    if (selectedRating === 0) {
        showNotification('Please select a rating', 'warning');
        return;
    }
    
    const comments = document.getElementById('feedbackComments').value.trim();
    
    const feedback = {
        sessionId: currentSession.id,
        rating: selectedRating,
        comments: comments,
        timestamp: new Date().toISOString()
    };
    
    try {
        await saveFeedback(feedback);
        showNotification('Thank you for your feedback!', 'success');
        
        // Reset feedback form
        selectedRating = 0;
        updateStarDisplay(0);
        document.getElementById('feedbackComments').value = '';
        document.getElementById('feedbackSection').style.display = 'none';
        
    } catch (error) {
        console.error('❌ Error saving feedback:', error);
        showNotification('Failed to save feedback. It will be synced when online.', 'warning');
    }
}

// ========================================
// Dark Mode
// ========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const icon = document.querySelector('#darkModeToggle .icon');
    icon.textContent = isDark ? '☀️' : '🌙';
}

function checkDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.querySelector('#darkModeToggle .icon').textContent = '☀️';
    }
}

// ========================================
// Service Worker Registration
// ========================================
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js');
            console.log('✅ Service Worker registered:', registration);
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
}

// ========================================
// Offline Data Sync
// ========================================
async function syncOfflineData() {
    // This would sync any offline-stored sessions to Firebase
    console.log('🔄 Syncing offline data...');
    // Implementation would retrieve from IndexedDB and sync to Firebase
}

// ========================================
// Utility Functions
// ========================================
function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    document.getElementById('analyzeBtn').disabled = show;
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('redFlagAlert').style.display = 'none';
    document.getElementById('feedbackSection').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Simple console notification - could be enhanced with toast notifications
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
