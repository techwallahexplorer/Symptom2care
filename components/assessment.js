/**
 * Assessment Form Logic
 * Handles multi-step form, validation, voice input, and risk scoring
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global state
let currentStep = 1;
const totalSteps = 6;
let currentUser = null;
let assessmentData = {};
let isRecording = false;
let recognition = null;

// DOM Elements
const steps = document.querySelectorAll('.assessment-step');
const progressSteps = document.querySelectorAll('.progress-step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Voice input
const voiceBtn = document.getElementById('voiceBtn');
const mainSymptomsInput = document.getElementById('mainSymptoms');

// Severity sliders
const symptomSeverity = document.getElementById('symptomSeverity');
const severityValue = document.getElementById('severityValue');
const severityLabel = document.getElementById('severityLabel');
const stressLevel = document.getElementById('stressLevel');
const stressValue = document.getElementById('stressValue');

// Body parts
const bodyParts = document.querySelectorAll('.body-part');

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 Assessment form initializing...');
    
    // Check authentication
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            console.log('✅ User authenticated:', user.email);
            loadUserProfile();
        } else if (!localStorage.getItem('guestMode')) {
            // Not logged in and not guest mode
            console.log('❌ Not authenticated, redirecting...');
            window.location.href = '../components/simple-auth.html';
        } else {
            console.log('👤 Guest mode active');
        }
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize voice recognition
    initializeVoiceRecognition();
    
    // Show first step
    showStep(1);
});

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateStep(-1));
    nextBtn.addEventListener('click', () => navigateStep(1));
    submitBtn.addEventListener('click', submitAssessment);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Voice input
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecording);
    }
    
    // Severity sliders
    if (symptomSeverity) {
        symptomSeverity.addEventListener('input', updateSeverityDisplay);
    }
    
    if (stressLevel) {
        stressLevel.addEventListener('input', updateStressDisplay);
    }
    
    // Body part selector
    bodyParts.forEach(part => {
        part.addEventListener('click', () => selectBodyPart(part));
    });
}

// ========================================
// User Profile
// ========================================
async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Pre-fill basic info if available
            if (userData.name) {
                document.getElementById('userName').value = userData.name;
            }
        }
    } catch (error) {
        console.error('❌ Error loading user profile:', error);
    }
}

// ========================================
// Step Navigation
// ========================================
function showStep(stepNumber) {
    // Hide all steps
    steps.forEach(step => step.classList.remove('active'));
    progressSteps.forEach(step => step.classList.remove('active', 'completed'));
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStepElement && currentStepElement.classList.contains('assessment-step')) {
        currentStepElement.classList.add('active');
    }
    
    // Update progress bar
    progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < stepNumber) {
            step.classList.add('completed');
        } else if (stepNum === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update buttons
    prevBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
    nextBtn.style.display = stepNumber === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = stepNumber === totalSteps ? 'flex' : 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateStep(direction) {
    const newStep = currentStep + direction;
    
    // Validate current step before moving forward
    if (direction > 0 && !validateStep(currentStep)) {
        return;
    }
    
    // Collect data from current step
    if (direction > 0) {
        collectStepData(currentStep);
    }
    
    // Update step
    if (newStep >= 1 && newStep <= totalSteps) {
        currentStep = newStep;
        showStep(currentStep);
        
        // Generate summary on last step
        if (currentStep === totalSteps) {
            generateSummary();
            calculateRiskScore();
        }
    }
}

// ========================================
// Form Validation
// ========================================
function validateStep(stepNumber) {
    let isValid = true;
    let errorMessage = '';
    
    switch (stepNumber) {
        case 1: // Basic Info
            const name = document.getElementById('userName').value.trim();
            const age = document.getElementById('userAge').value;
            const gender = document.getElementById('userGender').value;
            const height = document.getElementById('userHeight').value;
            const weight = document.getElementById('userWeight').value;
            
            if (!name || !age || !gender || !height || !weight) {
                errorMessage = 'Please fill in all required fields (marked with *)';
                isValid = false;
            } else if (age < 1 || age > 120) {
                errorMessage = 'Please enter a valid age';
                isValid = false;
            }
            break;
            
        case 2: // Medical History
            // Optional fields, no validation needed
            break;
            
        case 3: // Symptoms
            const symptoms = document.getElementById('mainSymptoms').value.trim();
            const duration = document.getElementById('symptomDuration').value;
            const severity = document.getElementById('symptomSeverity').value;
            
            if (!symptoms || !duration || !severity) {
                errorMessage = 'Please describe your symptoms and select duration/severity';
                isValid = false;
            }
            break;
            
        case 4: // Lifestyle
            const sleep = document.getElementById('sleepHours').value;
            const exercise = document.getElementById('exerciseFrequency').value;
            const diet = document.getElementById('dietType').value;
            const water = document.getElementById('waterIntake').value;
            const stress = document.getElementById('stressLevel').value;
            const alcohol = document.getElementById('alcoholConsumption').value;
            const smoking = document.getElementById('smokingStatus').value;
            
            if (!sleep || !exercise || !diet || !water || !stress || !alcohol || !smoking) {
                errorMessage = 'Please fill in all lifestyle factors';
                isValid = false;
            }
            break;
            
        case 5: // Daily Schedule & Diet
            const schedule = document.getElementById('dailySchedule').value.trim();
            const typicalDiet = document.getElementById('typicalDiet').value.trim();
            
            if (!schedule || !typicalDiet) {
                errorMessage = 'Please describe your daily schedule and typical diet';
                isValid = false;
            }
            break;
            
        case 6: // Confirmation
            const confirmed = document.getElementById('confirmAccuracy').checked;
            
            if (!confirmed) {
                errorMessage = 'Please confirm that the information is accurate';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

// ========================================
// Data Collection
// ========================================
function collectStepData(stepNumber) {
    switch (stepNumber) {
        case 1: // Basic Info
            assessmentData.basicInfo = {
                name: document.getElementById('userName').value.trim(),
                age: parseInt(document.getElementById('userAge').value),
                gender: document.getElementById('userGender').value,
                height: parseFloat(document.getElementById('userHeight').value),
                weight: parseFloat(document.getElementById('userWeight').value),
                bloodType: document.getElementById('userBloodType').value || 'Not specified'
            };
            
            // Calculate BMI
            const heightM = assessmentData.basicInfo.height / 100;
            assessmentData.basicInfo.bmi = (assessmentData.basicInfo.weight / (heightM * heightM)).toFixed(1);
            break;
            
        case 2: // Medical History
            const chronicDiseases = Array.from(document.querySelectorAll('input[name="chronicDiseases"]:checked'))
                .map(cb => cb.value);
            
            const otherDiseases = document.getElementById('otherDiseases').value.trim();
            if (otherDiseases) {
                chronicDiseases.push(otherDiseases);
            }
            
            assessmentData.medicalHistory = {
                chronicDiseases: chronicDiseases,
                currentMedications: document.getElementById('currentMedications').value.trim(),
                allergies: document.getElementById('allergies').value.trim(),
                surgeries: document.getElementById('surgeries').value.trim()
            };
            break;
            
        case 3: // Symptoms
            assessmentData.symptoms = {
                mainComplaint: document.getElementById('mainSymptoms').value.trim(),
                duration: document.getElementById('symptomDuration').value,
                severity: parseInt(document.getElementById('symptomSeverity').value),
                bodyArea: document.getElementById('bodyArea').value || 'Not specified'
            };
            break;
            
        case 4: // Lifestyle
            assessmentData.lifestyle = {
                sleepHours: parseFloat(document.getElementById('sleepHours').value),
                exerciseFrequency: document.getElementById('exerciseFrequency').value,
                dietType: document.getElementById('dietType').value,
                waterIntake: parseInt(document.getElementById('waterIntake').value),
                stressLevel: parseInt(document.getElementById('stressLevel').value),
                alcoholConsumption: document.getElementById('alcoholConsumption').value,
                smokingStatus: document.getElementById('smokingStatus').value
            };
            break;
            
        case 5: // Daily Schedule & Diet
            assessmentData.dailyRoutine = {
                schedule: document.getElementById('dailySchedule').value.trim(),
                typicalDiet: document.getElementById('typicalDiet').value.trim(),
                dietaryGoals: document.getElementById('dietaryGoals').value.trim()
            };
            break;
    }
}

// ========================================
// Summary Generation
// ========================================
function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    
    let html = '';
    
    // Basic Info
    html += `
        <div class="summary-group">
            <h3 class="summary-title">👤 Basic Information</h3>
            <div class="summary-item">
                <span class="summary-label">Name:</span>
                <span class="summary-value">${assessmentData.basicInfo.name}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Age:</span>
                <span class="summary-value">${assessmentData.basicInfo.age} years</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Gender:</span>
                <span class="summary-value">${assessmentData.basicInfo.gender}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Height:</span>
                <span class="summary-value">${assessmentData.basicInfo.height} cm</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Weight:</span>
                <span class="summary-value">${assessmentData.basicInfo.weight} kg</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">BMI:</span>
                <span class="summary-value">${assessmentData.basicInfo.bmi}</span>
            </div>
        </div>
    `;
    
    // Medical History
    html += `
        <div class="summary-group">
            <h3 class="summary-title">🏥 Medical History</h3>
            <div class="summary-item">
                <span class="summary-label">Chronic Diseases:</span>
                <span class="summary-value">${assessmentData.medicalHistory.chronicDiseases.length > 0 ? assessmentData.medicalHistory.chronicDiseases.join(', ') : 'None'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Allergies:</span>
                <span class="summary-value">${assessmentData.medicalHistory.allergies || 'None'}</span>
            </div>
        </div>
    `;
    
    // Symptoms
    html += `
        <div class="summary-group">
            <h3 class="summary-title">🩺 Current Symptoms</h3>
            <div class="summary-item">
                <span class="summary-label">Main Complaint:</span>
                <span class="summary-value">${assessmentData.symptoms.mainComplaint.substring(0, 100)}...</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Duration:</span>
                <span class="summary-value">${assessmentData.symptoms.duration}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Severity:</span>
                <span class="summary-value">${assessmentData.symptoms.severity}/10</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Body Area:</span>
                <span class="summary-value">${assessmentData.symptoms.bodyArea}</span>
            </div>
        </div>
    `;
    
    // Lifestyle
    html += `
        <div class="summary-group">
            <h3 class="summary-title">🏃 Lifestyle</h3>
            <div class="summary-item">
                <span class="summary-label">Sleep:</span>
                <span class="summary-value">${assessmentData.lifestyle.sleepHours} hours/night</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Exercise:</span>
                <span class="summary-value">${assessmentData.lifestyle.exerciseFrequency}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Diet Type:</span>
                <span class="summary-value">${assessmentData.lifestyle.dietType}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Stress Level:</span>
                <span class="summary-value">${assessmentData.lifestyle.stressLevel}/10</span>
            </div>
        </div>
    `;
    
    summaryContent.innerHTML = html;
}

// ========================================
// Risk Score Calculation
// ========================================
function calculateRiskScore() {
    let score = 0;
    const factors = [];
    
    // Age factor (0-15 points)
    const age = assessmentData.basicInfo.age;
    if (age > 65) {
        score += 15;
        factors.push('Age > 65');
    } else if (age > 50) {
        score += 10;
        factors.push('Age > 50');
    } else if (age < 18) {
        score += 5;
        factors.push('Age < 18');
    }
    
    // Chronic diseases (0-25 points)
    const diseaseCount = assessmentData.medicalHistory.chronicDiseases.length;
    if (diseaseCount > 0) {
        const diseaseScore = Math.min(diseaseCount * 5, 25);
        score += diseaseScore;
        factors.push(`${diseaseCount} chronic disease(s)`);
    }
    
    // Symptom severity (0-20 points)
    const severity = assessmentData.symptoms.severity;
    const severityScore = (severity / 10) * 20;
    score += severityScore;
    if (severity >= 7) {
        factors.push('High symptom severity');
    }
    
    // Symptom duration (0-15 points)
    const duration = assessmentData.symptoms.duration;
    if (duration === 'more-than-month') {
        score += 15;
        factors.push('Symptoms > 1 month');
    } else if (duration === '1-month') {
        score += 10;
        factors.push('Symptoms = 1 month');
    } else if (duration === '2-weeks') {
        score += 7;
        factors.push('Symptoms = 2 weeks');
    }
    
    // Lifestyle factors (0-25 points)
    const sleep = assessmentData.lifestyle.sleepHours;
    if (sleep < 6 || sleep > 9) {
        score += 5;
        factors.push('Poor sleep');
    }
    
    if (assessmentData.lifestyle.exerciseFrequency === 'never') {
        score += 5;
        factors.push('No exercise');
    }
    
    if (assessmentData.lifestyle.smokingStatus === 'current') {
        score += 10;
        factors.push('Current smoker');
    }
    
    if (assessmentData.lifestyle.alcoholConsumption === 'daily') {
        score += 5;
        factors.push('Daily alcohol');
    }
    
    // Cap at 100
    score = Math.min(Math.round(score), 100);
    
    // Determine category
    let category, label, description, cssClass;
    
    if (score <= 40) {
        category = 'normal';
        label = 'Normal';
        description = 'Your health indicators are within normal range. Continue with the recommended care plan.';
        cssClass = 'normal';
    } else if (score <= 70) {
        category = 'moderate';
        label = 'Moderate Concern';
        description = 'Some health factors require attention. Follow recommendations closely and monitor symptoms.';
        cssClass = 'moderate';
    } else {
        category = 'high';
        label = 'Seek Medical Review';
        description = 'Multiple risk factors detected. Please consult a healthcare professional for proper evaluation.';
        cssClass = 'high';
    }
    
    // Store in assessment data
    assessmentData.riskScore = {
        value: score,
        category: category,
        factors: factors
    };
    
    // Display risk score
    const riskScoreCard = document.getElementById('riskScoreCard');
    const riskScoreValue = document.getElementById('riskScoreValue');
    const riskScoreLabel = document.getElementById('riskScoreLabel');
    const riskScoreDescription = document.getElementById('riskScoreDescription');
    
    riskScoreCard.className = `risk-score-card ${cssClass}`;
    riskScoreValue.textContent = score;
    riskScoreLabel.textContent = label;
    riskScoreDescription.textContent = description;
    riskScoreCard.style.display = 'block';
}

// ========================================
// Voice Recognition
// ========================================
function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Speech recognition not supported');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        console.log('🎤 Voice recognition started');
        isRecording = true;
        voiceBtn.classList.add('recording');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 Transcript:', transcript);
        
        // Append to existing text
        const currentText = mainSymptomsInput.value;
        mainSymptomsInput.value = currentText + (currentText ? ' ' : '') + transcript;
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        isRecording = false;
        voiceBtn.classList.remove('recording');
        
        if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access in your browser settings.');
        }
    };
    
    recognition.onend = () => {
        console.log('🎤 Voice recognition ended');
        isRecording = false;
        voiceBtn.classList.remove('recording');
    };
}

function toggleVoiceRecording() {
    if (!recognition) {
        alert('Voice recognition is not supported in your browser.');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// ========================================
// UI Helpers
// ========================================
function updateSeverityDisplay() {
    const value = symptomSeverity.value;
    severityValue.textContent = value;
    
    let label;
    if (value <= 3) label = 'Mild';
    else if (value <= 6) label = 'Moderate';
    else label = 'Severe';
    
    severityLabel.textContent = label;
}

function updateStressDisplay() {
    const value = stressLevel.value;
    stressValue.textContent = value;
}

function selectBodyPart(partElement) {
    // Remove selection from all parts
    bodyParts.forEach(part => part.classList.remove('selected'));
    
    // Select clicked part
    partElement.classList.add('selected');
    
    // Store value
    document.getElementById('bodyArea').value = partElement.dataset.part;
}

// ========================================
// Form Submission
// ========================================
async function submitAssessment() {
    if (!validateStep(6)) {
        return;
    }
    
    // Collect final step data
    collectStepData(6);
    
    // Add metadata
    assessmentData.assessmentId = `assess_${Date.now()}`;
    assessmentData.timestamp = new Date().toISOString();
    assessmentData.userId = currentUser ? currentUser.uid : 'guest';
    
    // Show loading
    showLoading(true);
    
    try {
        // Save to Firestore
        if (currentUser) {
            await setDoc(doc(db, 'assessments', assessmentData.assessmentId), {
                ...assessmentData,
                createdAt: serverTimestamp()
            });
            
            console.log('✅ Assessment saved to Firestore');
        } else {
            // Save to localStorage for guest
            const guestAssessments = JSON.parse(localStorage.getItem('guestAssessments') || '[]');
            guestAssessments.push(assessmentData);
            localStorage.setItem('guestAssessments', JSON.stringify(guestAssessments));
            
            console.log('✅ Assessment saved locally (guest mode)');
        }
        
        // Redirect to results page with assessment ID
        window.location.href = `../index.html?assessment=${assessmentData.assessmentId}`;
        
    } catch (error) {
        console.error('❌ Error saving assessment:', error);
        alert('Failed to save assessment. Please try again.');
        showLoading(false);
    }
}

// ========================================
// Logout
// ========================================
async function handleLogout() {
    try {
        await signOut(auth);
        localStorage.removeItem('guestMode');
        window.location.href = '../components/simple-auth.html';
    } catch (error) {
        console.error('❌ Logout error:', error);
    }
}

// ========================================
// Loading State
// ========================================
function showLoading(show) {
    let loadingDiv = document.querySelector('.assessment-loading');
    
    if (show && !loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.className = 'assessment-loading';
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            <p>Processing your assessment...</p>
        `;
        document.body.appendChild(loadingDiv);
    } else if (!show && loadingDiv) {
        loadingDiv.remove();
    }
}

console.log('✅ Assessment script loaded');
