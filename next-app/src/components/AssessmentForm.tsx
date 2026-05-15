"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, Activity, Heart, Thermometer, Coffee, Calendar, Mic } from "lucide-react";

type FormData = {
  basicInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    bloodType: string;
  };
  medicalHistory: {
    chronicDiseases: string[];
    medications: string;
    allergies: string;
  };
  symptoms: {
    mainComplaint: string;
    duration: string;
    severity: number;
  };
  lifestyle: {
    sleep: string;
    exercise: string;
    diet: string;
    stress: string;
  };
  schedule: {
    dailyRoutine: string;
    foodIntake: string;
  };
};

const INITIAL_DATA: FormData = {
  basicInfo: { name: "", age: "", gender: "", height: "", weight: "", bloodType: "" },
  medicalHistory: { chronicDiseases: [], medications: "", allergies: "" },
  symptoms: { mainComplaint: "", duration: "", severity: 5 },
  lifestyle: { sleep: "", exercise: "", diet: "", stress: "" },
  schedule: { dailyRoutine: "", foodIntake: "" },
};

const CHRONIC_DISEASES = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "asthma", label: "Asthma" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "thyroid", label: "Thyroid Issues" },
  { id: "arthritis", label: "Arthritis" }
];

export interface Yoga {
  name: string;
  benefits: string;
  conditions: string[];
}

export interface Medicine {
  name: string;
  use: string;
  conditions: string[];
}

export interface Lifestyle {
  title: string;
  tip: string;
}

export interface ResultsData {
  score: number;
  riskLevel?: string;
  aiAnalysis?: string;
  aiRecommendation?: string;
  possibleConditions?: string[];
  yoga: Yoga[];
  medicines: Medicine[];
  lifestyle: Lifestyle[];
  isAI?: boolean;
}

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  
  // For voice input mock
  const [isRecording, setIsRecording] = useState(false);

  const totalSteps = 5;

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateFormData = (category: keyof FormData, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleToggleDisease = (diseaseId: string) => {
    setFormData(prev => {
      const diseases = prev.medicalHistory.chronicDiseases;
      const newDiseases = diseases.includes(diseaseId) 
        ? diseases.filter(id => id !== diseaseId)
        : [...diseases, diseaseId];
      return {
        ...prev,
        medicalHistory: { ...prev.medicalHistory, chronicDiseases: newDiseases }
      };
    });
  };

  const calculateRiskScore = (data: FormData) => {
    let score = 0;
    const age = parseInt(data.basicInfo.age) || 0;
    const weight = parseInt(data.basicInfo.weight) || 0;
    const height = parseInt(data.basicInfo.height) || 0;

    if (age > 60) score += 20;
    else if (age > 40) score += 10;

    if (height > 0) {
      const bmi = weight / Math.pow(height / 100, 2);
      if (bmi > 30 || bmi < 18.5) score += 15;
      else if (bmi > 25 || bmi < 20) score += 8;
    }

    score += data.medicalHistory.chronicDiseases.length * 10;
    score += data.symptoms.severity * 3;

    if (data.lifestyle.sleep === '<4' || data.lifestyle.sleep === '4-6') score += 10;
    if (data.lifestyle.exercise === 'none') score += 10;
    if (data.lifestyle.stress === 'high' || data.lifestyle.stress === 'very-high') score += 15;

    return Math.min(Math.round(score), 100);
  };

  const generateRecommendations = (data: FormData, score: number) => {
    // Ported from original HTML logic
    const symptoms = data.symptoms.mainComplaint.toLowerCase();
    
    const yogaAsanas = [
      { name: 'Shavasana (Corpse Pose)', benefits: 'Reduces stress, calms mind, lowers blood pressure', conditions: ['stress', 'anxiety', 'headache', 'fatigue'] },
      { name: 'Balasana (Child\'s Pose)', benefits: 'Relieves back pain, reduces stress and anxiety', conditions: ['back pain', 'stress', 'fatigue', 'anxiety'] },
      { name: 'Paschimottanasana (Seated Forward Bend)', benefits: 'Improves digestion, reduces anxiety', conditions: ['digestive', 'stress', 'anxiety', 'insomnia'] }
    ];

    const medicines = [
      { name: 'Paracetamol (500mg)', use: 'For fever and mild to moderate pain', conditions: ['fever', 'headache', 'pain', 'cold'] },
      { name: 'Ibuprofen (400mg)', use: 'For inflammation and pain relief', conditions: ['pain', 'inflammation', 'arthritis', 'headache'] },
      { name: 'Vitamin D3', use: 'For bone health and immunity', conditions: ['fatigue', 'weakness', 'bone', 'immunity'] }
    ];

    let recommendedYoga = yogaAsanas.filter(a => a.conditions.some(c => symptoms.includes(c))).slice(0, 3);
    if (recommendedYoga.length === 0) recommendedYoga = [yogaAsanas[0], yogaAsanas[1]];

    let recommendedMed = medicines.filter(m => m.conditions.some(c => symptoms.includes(c))).slice(0, 3);
    if (recommendedMed.length === 0) recommendedMed = [medicines[2]];

    const lifestyleTips = [];
    if (data.lifestyle.sleep === '<4' || data.lifestyle.sleep === '4-6') {
      lifestyleTips.push({ title: 'Improve Sleep', tip: 'Aim for 7-8 hours of quality sleep.' });
    }
    if (data.lifestyle.exercise === 'none') {
      lifestyleTips.push({ title: 'Start Exercising', tip: 'Begin with 20-30 mins of walking daily.' });
    }
    lifestyleTips.push({ title: 'Stay Hydrated', tip: 'Drink at least 8-10 glasses of water daily.' });

    if (score > 50) {
      lifestyleTips.push({ title: 'Consult Doctor', tip: 'Schedule a check-up with your healthcare provider.' });
    }

    return {
      score,
      yoga: recommendedYoga,
      medicines: recommendedMed,
      lifestyle: lifestyleTips
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: [formData.symptoms.mainComplaint],
          duration: formData.symptoms.duration,
          intensity: formData.symptoms.severity.toString(),
          age: formData.basicInfo.age,
          gender: formData.basicInfo.gender,
          medicalHistory: `Chronic: ${formData.medicalHistory.chronicDiseases.join(', ')}. Meds: ${formData.medicalHistory.medications}. Allergies: ${formData.medicalHistory.allergies}`
        }),
      });

      if (!response.ok) {
        throw new Error("API response not ok");
      }

      const data = await response.json();
      
      // Adapt Gemini response to the expected UI format
      setResults({
        score: data.score || 50,
        riskLevel: data.riskLevel,
        aiAnalysis: data.analysis,
        aiRecommendation: data.recommendation,
        possibleConditions: data.possibleConditions || [],
        // Fallback for UI components that expect these
        yoga: generateRecommendations(formData, data.score || 50).yoga,
        medicines: generateRecommendations(formData, data.score || 50).medicines,
        lifestyle: generateRecommendations(formData, data.score || 50).lifestyle,
        isAI: true
      });
    } catch (err) {
      console.error("Gemini API failed, falling back to offline analysis:", err);
      // Fallback to offline logic
      const score = calculateRiskScore(formData);
      const recs = generateRecommendations(formData, score);
      setResults({ ...recs, isAI: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        updateFormData('symptoms', 'mainComplaint', formData.symptoms.mainComplaint + " I have a mild headache.");
        setIsRecording(false);
      }, 2000);
    }
  };

  if (results) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
            results.score < 30 ? 'bg-emerald-100 text-emerald-600' :
            results.score < 60 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
          }`}>
            <span className="text-5xl font-extrabold">{results.score}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Health Risk Score</h2>
          <p className={`text-xl font-medium ${
            results.score < 30 ? 'text-emerald-600' :
            results.score < 60 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {results.score < 30 ? 'Low Risk - You\'re doing great!' :
             results.score < 60 ? 'Moderate Risk - Consider lifestyle changes' :
             'High Risk - Please consult a doctor'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-cyan-700 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" /> Yoga Asanas
            </h3>
            <ul className="space-y-4">
              {results.yoga.map((y: Yoga, i: number) => (
                <li key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="font-semibold text-slate-800">{y.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{y.benefits}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-cyan-700 flex items-center gap-2 mb-4">
              <Thermometer className="w-5 h-5" /> Medicine Suggestions
            </h3>
            <ul className="space-y-4">
              {results.medicines.map((m: Medicine, i: number) => (
                <li key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="font-semibold text-slate-800">{m.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{m.use}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-cyan-700 flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5" /> Lifestyle Tips
            </h3>
            <ul className="space-y-4">
              {results.lifestyle.map((l: Lifestyle, i: number) => (
                <li key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="font-semibold text-slate-800">{l.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{l.tip}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {results.isAI && (
          <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-1 text-xs font-bold text-cyan-600 bg-white px-2 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                AI ANALYZED
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> AI Medical Analysis
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Analysis</h4>
                <p className="text-slate-700 leading-relaxed">{results.aiAnalysis}</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Recommendation</h4>
                <p className="text-slate-700 leading-relaxed font-medium">{results.aiRecommendation}</p>
                
                {results.possibleConditions && results.possibleConditions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Possible Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.possibleConditions.map((condition: string, i: number) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <button 
            onClick={() => {setResults(null); setCurrentStep(1); setFormData(INITIAL_DATA);}}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium transition-all"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
        <div 
          className="h-full bg-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col">
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">👤</span>
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all" placeholder="John Doe" value={formData.basicInfo.name} onChange={e => updateFormData('basicInfo', 'name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                <input required type="number" min="1" max="120" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all" placeholder="25" value={formData.basicInfo.age} onChange={e => updateFormData('basicInfo', 'age', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.basicInfo.gender} onChange={e => updateFormData('basicInfo', 'gender', e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Height (cm)</label>
                <input required type="number" min="50" max="250" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all" placeholder="170" value={formData.basicInfo.height} onChange={e => updateFormData('basicInfo', 'height', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
                <input required type="number" min="20" max="300" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all" placeholder="70" value={formData.basicInfo.weight} onChange={e => updateFormData('basicInfo', 'weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.basicInfo.bloodType} onChange={e => updateFormData('basicInfo', 'bloodType', e.target.value)}>
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">🏥</span>
              Medical History
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Chronic Diseases</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CHRONIC_DISEASES.map(disease => (
                  <button
                    type="button"
                    key={disease.id}
                    onClick={() => handleToggleDisease(disease.id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between
                      ${formData.medicalHistory.chronicDiseases.includes(disease.id) 
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {disease.label}
                    {formData.medicalHistory.chronicDiseases.includes(disease.id) && <CheckCircle2 className="w-4 h-4 text-cyan-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none h-32" placeholder="List medications..." value={formData.medicalHistory.medications} onChange={e => updateFormData('medicalHistory', 'medications', e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none h-32" placeholder="List allergies..." value={formData.medicalHistory.allergies} onChange={e => updateFormData('medicalHistory', 'allergies', e.target.value)}></textarea>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">🩺</span>
              Current Symptoms
            </h2>
            
            <div className="mb-6 relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Main Complaint * (Use voice input or type)</label>
              <div className="relative">
                <textarea required className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none h-32 pr-16" placeholder="Describe your symptoms in detail..." value={formData.symptoms.mainComplaint} onChange={e => updateFormData('symptoms', 'mainComplaint', e.target.value)}></textarea>
                <button 
                  type="button" 
                  onClick={toggleVoiceInput}
                  className={`absolute right-4 top-4 p-3 rounded-full transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.symptoms.duration} onChange={e => updateFormData('symptoms', 'duration', e.target.value)}>
                  <option value="">Select Duration</option>
                  <option value="1-day">1 day</option>
                  <option value="1-week">1 week</option>
                  <option value="1-month">1 month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Severity: {formData.symptoms.severity}/10</label>
                <input required type="range" min="1" max="10" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 mt-3" value={formData.symptoms.severity} onChange={e => updateFormData('symptoms', 'severity', parseInt(e.target.value))} />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">🏃</span>
              Lifestyle Factors
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sleep Hours per Night *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.lifestyle.sleep} onChange={e => updateFormData('lifestyle', 'sleep', e.target.value)}>
                  <option value="">Select Hours</option>
                  <option value="<4">Less than 4 hours</option>
                  <option value="4-6">4-6 hours</option>
                  <option value="6-8">6-8 hours</option>
                  <option value="8+">More than 8 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Exercise Frequency *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.lifestyle.exercise} onChange={e => updateFormData('lifestyle', 'exercise', e.target.value)}>
                  <option value="">Select Frequency</option>
                  <option value="none">None</option>
                  <option value="1-2">1-2 times/week</option>
                  <option value="3-4">3-4 times/week</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Diet Type *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.lifestyle.diet} onChange={e => updateFormData('lifestyle', 'diet', e.target.value)}>
                  <option value="">Select Diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stress Level *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white" value={formData.lifestyle.stress} onChange={e => updateFormData('lifestyle', 'stress', e.target.value)}>
                  <option value="">Select Level</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">📅</span>
              Daily Schedule & Diet
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400"/> Daily Schedule</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none h-32" placeholder="Describe your typical daily routine..." value={formData.schedule.dailyRoutine} onChange={e => updateFormData('schedule', 'dailyRoutine', e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Coffee className="w-4 h-4 text-slate-400"/> Food Intake Details</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none h-32" placeholder="What do you typically eat? Breakfast, lunch, dinner, snacks..." value={formData.schedule.foodIntake} onChange={e => updateFormData('schedule', 'foodIntake', e.target.value)}></textarea>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button 
            type="button" 
            onClick={handlePrev}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          {currentStep < totalSteps ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-cyan-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing...
                </span>
              ) : (
                <>Analyze & Get Recommendations <CheckCircle2 className="w-5 h-5" /></>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
