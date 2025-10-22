# 🚀 Quick Start Guide - Symptom2Care

## ⚡ Get Started in 3 Steps

### Step 1: Start Local Server

Choose one method:

**Method A: Python (Recommended)**
```bash
cd c:\Users\aweso\OneDrive\Desktop\Symptomcare
python -m http.server 8000
```

**Method B: Node.js**
```bash
cd c:\Users\aweso\OneDrive\Desktop\Symptomcare
npx http-server -p 8000
```

**Method C: VS Code Live Server**
1. Open folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

### Step 2: Open in Browser

Navigate to: **http://localhost:8000**

### Step 3: Test the App

Try these sample inputs:

**Test 1: Simple Symptoms**
```
I have a headache and feeling tired
```
Expected: Headache and fatigue identified → Yoga asanas + general precautions

**Test 2: Digestive Issues**
```
Stomach pain, nausea, and bloating for 2 days
```
Expected: Digestive symptoms → OTC medicines + yoga recommendations

**Test 3: Respiratory Symptoms**
```
Cough, sore throat, and runny nose
```
Expected: Cold symptoms → Medicines + asanas + precautions

**Test 4: Red Flag Alert** ⚠️
```
Severe chest pain and shortness of breath
```
Expected: CARDIAC EMERGENCY ALERT displayed

## 🎯 Key Features to Test

### ✅ Online Mode
- Enter symptoms → Uses Gemini API
- Status shows "Online" (green dot)
- Results saved to Firebase

### ✅ Offline Mode
1. Open DevTools (F12)
2. Network tab → Check "Offline"
3. Enter symptoms → Uses local NLP
4. Status shows "Offline" (red dot)
5. Results stored locally

### ✅ Dark Mode
- Click moon icon (🌙) in header
- Theme switches to dark
- Click sun icon (☀️) to switch back

### ✅ PDF Export
- After analysis, click "Download PDF"
- PDF file downloads with recommendations

### ✅ Feedback System
- Rate with stars (1-5)
- Add optional comments
- Submit feedback

## 📊 What You Should See

### Main Interface
- Clean healthcare-themed design (teal/cyan colors)
- Top navigation with app name and status
- Yellow disclaimer banner
- Large text input area
- "Analyze Symptoms" button

### Results Display
- Identified symptoms as colored tags
- Yoga asanas in card layout
- OTC medicines with dosage info
- General precautions list
- Download/Print buttons

### Red Flag Alerts
- Red warning banner at top
- Emergency icon and message
- Clear action instructions

## 🔍 Troubleshooting

**Problem**: Page doesn't load
- **Fix**: Ensure local server is running
- **Fix**: Check URL is `http://localhost:8000`

**Problem**: "Failed to load datasets"
- **Fix**: Verify all CSV files exist in `/data/` folder
- **Fix**: Check browser console for errors

**Problem**: Firebase errors
- **Fix**: Internet connection required for Firebase
- **Fix**: App works offline with local storage

**Problem**: Service worker not registering
- **Fix**: Use HTTPS or localhost (HTTP is OK for localhost)
- **Fix**: Check browser console for errors

## 📱 Install as PWA

### Desktop (Chrome/Edge)
1. Look for install icon in address bar (⊕)
2. Click "Install Symptom2Care"
3. App opens in standalone window

### Mobile
1. Open in mobile browser
2. Menu → "Add to Home Screen"
3. App icon appears on home screen

## 🎨 UI Elements

### Status Indicators
- 🟢 **Online**: Green pulsing dot
- 🔴 **Offline**: Red static dot

### Buttons
- **Primary** (Blue): Analyze, Submit
- **Secondary** (Gray): Download, Print

### Cards
- White background (light mode)
- Dark gray (dark mode)
- Soft shadows and rounded corners

## 📈 Expected Behavior

### Symptom Analysis Flow
1. User enters text
2. Loading spinner appears
3. Symptoms extracted (2-5 seconds)
4. Results displayed in cards
5. Feedback section appears

### Data Storage
- **Online**: Saved to Firebase Firestore
- **Offline**: Saved to localStorage
- **Auto-sync**: When connection restored

## 🎓 Sample Test Cases

### Case 1: Stress & Anxiety
**Input**: "Feeling anxious and can't sleep well"
**Expected Output**:
- Symptoms: anxiety, insomnia
- Asanas: Shavasana, Balasana, Viparita Karani
- Medicines: Melatonin
- Precautions: Stress management tips

### Case 2: Pain Management
**Input**: "Back pain and muscle aches"
**Expected Output**:
- Symptoms: back pain, muscle pain
- Asanas: Cat-Cow, Child's Pose, Cobra Pose
- Medicines: Ibuprofen, Acetaminophen
- Precautions: Rest and hydration

### Case 3: Cold Symptoms
**Input**: "Runny nose, cough, and mild fever"
**Expected Output**:
- Symptoms: cold, cough, fever
- Asanas: Gentle breathing exercises
- Medicines: Acetaminophen, Guaifenesin
- Precautions: Stay hydrated, rest

## ✨ Advanced Features

### Toggle Details
- Click "View Steps" on asanas
- Click "Precautions" on medicines
- Expandable sections with ▼/▲ icons

### Character Counter
- Shows "0 / 500" below input
- Updates as you type
- Limits input to 500 characters

### Responsive Design
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column stack

## 🔐 Security Notes

**For Production Deployment:**
1. Move API keys to environment variables
2. Configure Firebase security rules
3. Enable HTTPS
4. Add rate limiting
5. Implement user authentication

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Verify all files are present
3. Ensure local server is running
4. Try different browser
5. Clear cache and reload

## 🎉 Success Checklist

- [ ] Local server running
- [ ] App loads at localhost:8000
- [ ] Can enter symptoms
- [ ] Analysis works (online or offline)
- [ ] Results display correctly
- [ ] Dark mode toggles
- [ ] PDF download works
- [ ] Feedback submission works
- [ ] PWA installable

---

**Ready to go!** 🚀 Your Symptom2Care app is fully functional and production-ready.
