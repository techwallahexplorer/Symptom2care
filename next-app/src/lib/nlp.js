/**
 * Offline NLP Engine for Symptom Extraction
 * Uses keyword-based matching and rule-based extraction
 */

// Symptom keywords database
const symptomKeywords = {
    // Pain-related
    "pain": ["pain", "ache", "aching", "sore", "soreness", "hurt", "hurting", "painful"],
    "headache": ["headache", "head pain", "migraine", "head ache"],
    "stomachache": ["stomachache", "stomach pain", "abdominal pain", "belly pain", "tummy ache"],
    "backache": ["backache", "back pain", "lower back pain"],
    "toothache": ["toothache", "tooth pain", "dental pain"],
    "chest pain": ["chest pain", "chest discomfort", "chest pressure"],
    
    // Respiratory
    "cough": ["cough", "coughing", "hacking"],
    "cold": ["cold", "common cold", "head cold"],
    "fever": ["fever", "temperature", "feverish", "hot", "burning up"],
    "sore throat": ["sore throat", "throat pain", "scratchy throat"],
    "runny nose": ["runny nose", "nasal discharge", "stuffy nose", "congestion", "blocked nose"],
    "shortness of breath": ["shortness of breath", "difficulty breathing", "breathless", "can't breathe"],
    "wheezing": ["wheezing", "whistling breath"],
    
    // Digestive
    "nausea": ["nausea", "nauseous", "queasy", "sick to stomach"],
    "vomiting": ["vomiting", "throwing up", "vomit", "puking"],
    "diarrhea": ["diarrhea", "loose stools", "watery stools"],
    "constipation": ["constipation", "constipated", "can't go"],
    "bloating": ["bloating", "bloated", "gassy", "gas"],
    "indigestion": ["indigestion", "heartburn", "acid reflux"],
    
    // General symptoms
    "fatigue": ["fatigue", "tired", "exhausted", "exhaustion", "weakness", "weak", "lethargy"],
    "dizziness": ["dizziness", "dizzy", "lightheaded", "vertigo"],
    "chills": ["chills", "shivering", "shaking"],
    "sweating": ["sweating", "perspiring", "night sweats"],
    "insomnia": ["insomnia", "can't sleep", "sleepless", "trouble sleeping"],
    "anxiety": ["anxiety", "anxious", "worried", "nervous", "panic"],
    "depression": ["depression", "depressed", "sad", "down", "hopeless"],
    
    // Skin-related
    "rash": ["rash", "skin rash", "hives", "breakout"],
    "itching": ["itching", "itchy", "itch"],
    "swelling": ["swelling", "swollen", "inflammation"],
    
    // Muscular/Joint
    "muscle pain": ["muscle pain", "muscle ache", "myalgia"],
    "joint pain": ["joint pain", "arthritis", "stiff joints"],
    "stiffness": ["stiffness", "stiff", "rigid"],
    
    // Neurological
    "numbness": ["numbness", "numb", "tingling", "pins and needles"],
    "confusion": ["confusion", "confused", "disoriented"],
    "memory loss": ["memory loss", "forgetful", "can't remember"],
    
    // Ear/Eye/Nose/Throat
    "earache": ["earache", "ear pain"],
    "eye pain": ["eye pain", "eye strain"],
    "blurred vision": ["blurred vision", "blurry vision", "vision problems"],
    "ringing in ears": ["ringing in ears", "tinnitus"],
    
    // Urinary
    "frequent urination": ["frequent urination", "urinating often", "peeing a lot"],
    "painful urination": ["painful urination", "burning urination"],
    
    // Other
    "loss of appetite": ["loss of appetite", "no appetite", "not hungry"],
    "weight loss": ["weight loss", "losing weight"],
    "weight gain": ["weight gain", "gaining weight"],
    "dehydration": ["dehydration", "dehydrated", "dry mouth"]
};

// Intensity modifiers
const intensityModifiers = {
    high: ["severe", "extreme", "intense", "unbearable", "excruciating", "terrible", "awful"],
    medium: ["moderate", "significant", "considerable", "noticeable"],
    low: ["mild", "slight", "minor", "little", "small"]
};

// Duration patterns
const durationPatterns = [
    /for (\d+) (day|days|week|weeks|month|months|hour|hours)/i,
    /since (yesterday|last week|last month)/i,
    /past (\d+) (day|days|week|weeks)/i
];

/**
 * Extract symptoms from text using offline NLP
 * @param {string} text - Input text describing symptoms
 * @returns {Array} - Array of extracted symptom names
 */
export function extractSymptomsOffline(text) {
    const normalizedText = text.toLowerCase();
    const extractedSymptoms = new Set();
    
    // Match against symptom keywords
    for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
        for (const keyword of keywords) {
            if (normalizedText.includes(keyword)) {
                extractedSymptoms.add(symptom);
                break;
            }
        }
    }
    
    // If no symptoms found, try to extract common words
    if (extractedSymptoms.size === 0) {
        const commonSymptomWords = ['pain', 'ache', 'fever', 'cough', 'tired', 'dizzy', 'nausea'];
        commonSymptomWords.forEach(word => {
            if (normalizedText.includes(word)) {
                extractedSymptoms.add(word);
            }
        });
    }
    
    console.log(`📝 Extracted ${extractedSymptoms.size} symptoms offline:`, Array.from(extractedSymptoms));
    
    return Array.from(extractedSymptoms);
}

/**
 * Analyze symptom intensity from text
 * @param {string} text - Input text
 * @returns {string} - Intensity level (low/medium/high)
 */
export function analyzeIntensity(text) {
    const normalizedText = text.toLowerCase();
    
    for (const [level, modifiers] of Object.entries(intensityModifiers)) {
        for (const modifier of modifiers) {
            if (normalizedText.includes(modifier)) {
                return level;
            }
        }
    }
    
    return 'medium'; // Default
}

/**
 * Extract duration information from text
 * @param {string} text - Input text
 * @returns {string|null} - Duration string or null
 */
export function extractDuration(text) {
    for (const pattern of durationPatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }
    
    return null;
}

/**
 * Get symptom category
 * @param {string} symptom - Symptom name
 * @returns {string} - Category name
 */
export function getSymptomCategory(symptom) {
    const categories = {
        'respiratory': ['cough', 'cold', 'fever', 'sore throat', 'runny nose', 'shortness of breath', 'wheezing'],
        'digestive': ['nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating', 'indigestion', 'stomachache'],
        'pain': ['headache', 'backache', 'toothache', 'chest pain', 'muscle pain', 'joint pain'],
        'neurological': ['dizziness', 'numbness', 'confusion', 'memory loss'],
        'psychological': ['anxiety', 'depression', 'insomnia'],
        'dermatological': ['rash', 'itching', 'swelling']
    };
    
    for (const [category, symptoms] of Object.entries(categories)) {
        if (symptoms.includes(symptom)) {
            return category;
        }
    }
    
    return 'general';
}

/**
 * Enhanced symptom extraction with context
 * @param {string} text - Input text
 * @returns {Object} - Detailed symptom analysis
 */
export function extractSymptomsWithContext(text) {
    const symptoms = extractSymptomsOffline(text);
    const intensity = analyzeIntensity(text);
    const duration = extractDuration(text);
    
    return {
        symptoms: symptoms,
        intensity: intensity,
        duration: duration,
        categories: symptoms.map(s => getSymptomCategory(s)),
        rawText: text
    };
}

// Export symptom keywords for external use
export { symptomKeywords };
