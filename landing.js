/**
 * Landing Page JavaScript
 * Features: Voice Input, TTS, Multi-language, Dark Mode, Settings
 */

// Translations Dictionary
const translations = {
    en: {
        nav_home: "Home",
        nav_features: "Features",
        nav_how: "How It Works",
        nav_safety: "Safety",
        nav_start: "Start Assessment",
        nav_assessment: "Assessment",
        nav_profile: "Profile",
        guest_user: "Guest User",
        profile: "Profile Info",
        settings: "Settings",
        dark_mode: "Dark Mode",
        language: "Language",
        logout: "Logout",
        hero_title: "Smart Health Recommendations at Your Fingertips",
        hero_subtitle: "Get instant, AI-powered health guidance tailored to your symptoms. Our intelligent system analyzes your condition and provides personalized recommendations including yoga asanas, OTC medicines, and lifestyle advice.",
        voice_placeholder: "Try saying: 'I have a headache and fever...'",
        start_assessment: "Start Symptom Assessment",
        watch_demo: "Watch Demo",
        chat_user: "I have a headache and mild fever",
        chat_bot: "I understand. Let me help you with personalized recommendations...",
        disclaimer_title: "Important Medical Disclaimer:",
        disclaimer_text: "This tool provides general wellness suggestions only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.",
        features_title: "Comprehensive Health Guidance",
        features_subtitle: "Powered by advanced AI and evidence-based medical knowledge",
        feature1_title: "NLP Symptom Processing",
        feature1_desc: "Advanced natural language processing understands your symptoms in plain language, extracting key health indicators.",
        feature2_title: "Personalized Yoga Asanas",
        feature2_desc: "Receive customized yoga poses and breathing exercises tailored to your specific symptoms and conditions.",
        feature3_title: "OTC Medicine Guidance",
        feature3_desc: "Get evidence-based recommendations for over-the-counter medicines with dosage and safety information.",
        feature4_title: "Safety First Approach",
        feature4_desc: "Built-in red flag detection system alerts you to potentially serious conditions requiring immediate care.",
        feature5_title: "Evidence-Based Recommendations",
        feature5_desc: "All suggestions backed by medical research and continuously updated with latest health guidelines.",
        feature6_title: "Intelligent Follow-ups",
        feature6_desc: "Smart clarifying questions ensure accurate assessment and personalized recommendations for your situation.",
        hear_demo: "Hear How It Works",
        how_title: "How It Works",
        how_subtitle: "Get personalized health guidance in 4 simple steps",
        step1_title: "Describe Your Symptoms",
        step1_desc: "Tell us what you're experiencing in your own words. Use voice or text input for convenience.",
        step2_title: "Clarifying Questions",
        step2_desc: "Answer a few targeted questions to help us understand your condition better and provide accurate guidance.",
        step3_title: "AI Analysis",
        step3_desc: "Our advanced AI analyzes your symptoms against medical databases and identifies the best recommendations.",
        step4_title: "Personalized Plan",
        step4_desc: "Receive a comprehensive health plan with yoga poses, medicines, precautions, and lifestyle recommendations.",
        safety_title: "Safety & Compliance",
        safety_subtitle: "Your health and privacy are our top priorities",
        safety1_title: "Red Flag Detection",
        safety1_desc: "Automatic identification of serious symptoms that require immediate medical attention with urgent care alerts.",
        safety2_title: "Data Privacy (GDPR/HIPAA)",
        safety2_desc: "End-to-end encryption and compliance with international healthcare data protection standards.",
        safety3_title: "Medical Review",
        safety3_desc: "All recommendations reviewed by healthcare professionals and updated with latest medical guidelines.",
        emergency_title: "Emergency Protocols",
        emergency1_title: "Immediate Emergency",
        emergency1_desc: "Chest pain, difficulty breathing, severe bleeding",
        call_911: "Call 911 Now",
        emergency2_title: "Urgent Care",
        emergency2_desc: "High fever, severe pain, persistent symptoms",
        find_urgent: "Find Urgent Care",
        emergency3_title: "Schedule Appointment",
        emergency3_desc: "Routine check-up, follow-up consultation",
        book_appointment: "Book Appointment",
        cta_title: "Ready to Get Personalized Health Guidance?",
        cta_subtitle: "Start your health assessment now and receive instant, AI-powered recommendations",
        begin_assessment: "Begin Assessment",
        footer_product: "Product",
        footer_features: "Features",
        footer_how: "How It Works",
        footer_assessment: "Start Assessment",
        footer_medicines: "Medicine Search",
        footer_resources: "Resources",
        footer_docs: "Documentation",
        footer_quickstart: "Quick Start Guide",
        footer_safety: "Safety Guidelines",
        footer_faq: "FAQ",
        footer_community: "Community",
        footer_blog: "Blog",
        footer_forum: "Community Forum",
        footer_feedback: "Feedback",
        footer_contribute: "Contribute",
        footer_contact: "Contact",
        footer_rights: "All rights reserved.",
        footer_disclaimer: "For educational purposes only. Not a substitute for professional medical advice.",
        settings_appearance: "Appearance",
        dark_mode_desc: "Toggle dark theme",
        font_size: "Font Size",
        font_size_desc: "Adjust text size",
        settings_language: "Language",
        app_language: "App Language",
        language_desc: "Choose your preferred language",
        reset_preferences: "Reset Preferences"
    },
    hi: {
        nav_home: "होम",
        nav_features: "विशेषताएं",
        nav_how: "कैसे काम करता है",
        nav_safety: "सुरक्षा",
        nav_start: "मूल्यांकन शुरू करें",
        nav_assessment: "मूल्यांकन",
        nav_profile: "प्रोफ़ाइल",
        guest_user: "अतिथि उपयोगकर्ता",
        profile: "प्रोफ़ाइल जानकारी",
        settings: "सेटिंग्स",
        dark_mode: "डार्क मोड",
        language: "भाषा",
        logout: "लॉगआउट",
        hero_title: "आपकी उंगलियों पर स्मार्ट स्वास्थ्य सिफारिशें",
        hero_subtitle: "अपने लक्षणों के अनुरूप तत्काल, AI-संचालित स्वास्थ्य मार्गदर्शन प्राप्त करें।",
        voice_placeholder: "कहने की कोशिश करें: 'मुझे सिरदर्द और बुखार है...'",
        start_assessment: "लक्षण मूल्यांकन शुरू करें",
        watch_demo: "डेमो देखें",
        features_title: "व्यापक स्वास्थ्य मार्गदर्शन",
        features_subtitle: "उन्नत AI और साक्ष्य-आधारित चिकित्सा ज्ञान द्वारा संचालित",
        hear_demo: "यह कैसे काम करता है सुनें",
        how_title: "यह कैसे काम करता है",
        how_subtitle: "4 सरल चरणों में व्यक्तिगत स्वास्थ्य मार्गदर्शन प्राप्त करें",
        safety_title: "सुरक्षा और अनुपालन",
        safety_subtitle: "आपका स्वास्थ्य और गोपनीयता हमारी सर्वोच्च प्राथमिकताएं हैं",
        cta_title: "व्यक्तिगत स्वास्थ्य मार्गदर्शन प्राप्त करने के लिए तैयार हैं?",
        begin_assessment: "मूल्यांकन शुरू करें",
        reset_preferences: "प्राथमिकताएं रीसेट करें"
    },
    es: {
        nav_home: "Inicio",
        nav_features: "Características",
        nav_how: "Cómo Funciona",
        nav_safety: "Seguridad",
        nav_start: "Iniciar Evaluación",
        nav_assessment: "Evaluación",
        nav_profile: "Perfil",
        guest_user: "Usuario Invitado",
        profile: "Información del Perfil",
        settings: "Configuración",
        dark_mode: "Modo Oscuro",
        language: "Idioma",
        logout: "Cerrar Sesión",
        hero_title: "Recomendaciones de Salud Inteligentes al Alcance de tu Mano",
        hero_subtitle: "Obtén orientación de salud instantánea impulsada por IA adaptada a tus síntomas.",
        voice_placeholder: "Intenta decir: 'Tengo dolor de cabeza y fiebre...'",
        start_assessment: "Iniciar Evaluación de Síntomas",
        watch_demo: "Ver Demo",
        features_title: "Orientación de Salud Integral",
        features_subtitle: "Impulsado por IA avanzada y conocimiento médico basado en evidencia",
        hear_demo: "Escucha Cómo Funciona",
        how_title: "Cómo Funciona",
        how_subtitle: "Obtén orientación de salud personalizada en 4 simples pasos",
        safety_title: "Seguridad y Cumplimiento",
        safety_subtitle: "Tu salud y privacidad son nuestras principales prioridades",
        cta_title: "¿Listo para Obtener Orientación de Salud Personalizada?",
        begin_assessment: "Comenzar Evaluación",
        reset_preferences: "Restablecer Preferencias"
    }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Voice Recognition
let recognition = null;
let isRecording = false;

// Text-to-Speech
let speechSynthesis = window.speechSynthesis;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 Landing page initializing...');
    
    checkAuthentication();
    initializeNavigation();
    initializeVoiceInput();
    initializeSettings();
    initializeScrollEffects();
    loadPreferences();
    applyTranslations();
    
    console.log('✅ Landing page ready');
});

// ========================================
// Authentication Check
// ========================================
function checkAuthentication() {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const authLink = document.getElementById('authLink');
    const authText = document.getElementById('authText');
    
    if (guestMode) {
        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'guest@symptom2care.com';
        if (authText) authText.textContent = 'Login';
        if (authLink) authLink.href = 'components/simple-auth.html';
    } else {
        // Check for user data in localStorage or session
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (userName) userName.textContent = user.name || 'User';
                if (userEmail) userEmail.textContent = user.email || '';
                if (authText) authText.textContent = 'Logout';
                if (authLink) {
                    authLink.href = '#';
                    authLink.addEventListener('click', handleLogout);
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        } else {
            if (userName) userName.textContent = 'Guest User';
            if (userEmail) userEmail.textContent = 'Click to login';
            if (authText) authText.textContent = 'Login';
            if (authLink) authLink.href = 'components/simple-auth.html';
        }
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    
    // Clear all auth data
    localStorage.removeItem('guestMode');
    localStorage.removeItem('userData');
    localStorage.removeItem('guestSession');
    
    showNotification('Logged out successfully', 'success');
    
    // Redirect to auth page
    setTimeout(() => {
        window.location.href = 'components/simple-auth.html';
    }, 1000);
}

// ========================================
// Navigation
// ========================================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const profileBtn = document.getElementById('profileBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const darkModeMenuItem = document.getElementById('darkModeMenuItem');
    const languageMenuItem = document.getElementById('languageMenuItem');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openSettings();
        });
    }
    
    // Dark mode from dropdown
    if (darkModeMenuItem) {
        darkModeMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const currentMode = localStorage.getItem('darkMode') === 'true';
            toggleDarkMode(!currentMode);
        });
    }
    
    // Language from dropdown
    if (languageMenuItem) {
        languageMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            cycleLanguage();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Voice Input
// ========================================
function initializeVoiceInput() {
    const voiceBtnHero = document.getElementById('voiceBtnHero');
    const voiceInput = document.getElementById('voiceInput');
    
    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Speech recognition not supported');
        if (voiceBtnHero) {
            voiceBtnHero.style.display = 'none';
        }
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        console.log('🎤 Voice recognition started');
        isRecording = true;
        voiceBtnHero.classList.add('recording');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 Transcript:', transcript);
        voiceInput.value = transcript;
        
        // Show notification
        showNotification('Voice input captured!', 'success');
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        isRecording = false;
        voiceBtnHero.classList.remove('recording');
        
        if (event.error === 'not-allowed') {
            showNotification('Microphone access denied', 'error');
        }
    };
    
    recognition.onend = () => {
        console.log('🎤 Voice recognition ended');
        isRecording = false;
        voiceBtnHero.classList.remove('recording');
    };
    
    // Voice button click
    if (voiceBtnHero) {
        voiceBtnHero.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }
}

// ========================================
// Text-to-Speech Demo
// ========================================
function initializeTTS() {
    const ttsDemo = document.getElementById('ttsDemo');
    
    if (ttsDemo) {
        ttsDemo.addEventListener('click', () => {
            const text = "Welcome to Symptom2Care. Our AI-powered system analyzes your symptoms and provides personalized health recommendations including yoga poses, medicines, and lifestyle advice.";
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'es' ? 'es-ES' : 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            speechSynthesis.speak(utterance);
            
            showNotification('Playing audio demo...', 'info');
        });
    }
}

// ========================================
// Settings
// ========================================
function initializeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const languageSelect = document.getElementById('languageSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const resetPreferences = document.getElementById('resetPreferences');
    
    // Close settings
    if (closeSettings) {
        closeSettings.addEventListener('click', closeSettingsModal);
    }
    
    // Close on overlay click
    if (settingsModal) {
        settingsModal.querySelector('.modal-overlay').addEventListener('click', closeSettingsModal);
    }
    
    // Dark mode toggle
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
        });
    }
    
    // Language select
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
    
    // Font size slider
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = size + 'px';
            document.body.style.fontSize = size + 'px';
            localStorage.setItem('fontSize', size);
        });
    }
    
    // Reset preferences
    if (resetPreferences) {
        resetPreferences.addEventListener('click', () => {
            if (confirm('Reset all preferences to default?')) {
                localStorage.removeItem('darkMode');
                localStorage.removeItem('language');
                localStorage.removeItem('fontSize');
                location.reload();
            }
        });
    }
    
    // Watch demo button
    const watchDemo = document.getElementById('watchDemo');
    if (watchDemo) {
        watchDemo.addEventListener('click', () => {
            showNotification('Demo video coming soon!', 'info');
        });
    }
    
    // Initialize TTS
    initializeTTS();
}

function openSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.add('active');
        loadSettingsValues();
    }
}

function closeSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.remove('active');
    }
}

function loadSettingsValues() {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const languageSelect = document.getElementById('languageSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    
    if (darkModeSwitch) {
        darkModeSwitch.checked = localStorage.getItem('darkMode') === 'true';
    }
    
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    const fontSize = localStorage.getItem('fontSize') || '16';
    if (fontSizeSlider) {
        fontSizeSlider.value = fontSize;
    }
    if (fontSizeValue) {
        fontSizeValue.textContent = fontSize + 'px';
    }
}

// ========================================
// Dark Mode
// ========================================
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update indicator
    const indicator = document.getElementById('darkModeIndicator');
    if (indicator) {
        indicator.textContent = enabled ? 'ON' : 'OFF';
    }
}

// ========================================
// Multi-Language Support
// ========================================
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    
    // Update current language display
    const currentLang = document.getElementById('currentLang');
    if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
    }
    
    // Update voice recognition language
    if (recognition) {
        recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : 'en-US';
    }
    
    showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
}

function cycleLanguage() {
    const languages = ['en', 'hi', 'es'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    changeLanguage(languages[nextIndex]);
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Translate placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

function getLanguageName(code) {
    const names = {
        'en': 'English',
        'hi': 'हिंदी (Hindi)',
        'es': 'Español (Spanish)'
    };
    return names[code] || code;
}

// ========================================
// Scroll Effects
// ========================================
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card, .step-card, .safety-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ========================================
// Load Preferences
// ========================================
function loadPreferences() {
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Load font size
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
    }
    
    // Load language
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        currentLanguage = savedLang;
    }
}

// ========================================
// Notifications
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
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

console.log('✅ Landing page script loaded');
