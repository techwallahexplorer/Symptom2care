# Symptom2Care - Preventive Healthcare Symptom Analysis App

Symptom2Care is a healthcare web app that extracts symptoms from user input and provides general wellness recommendations such as yoga asanas, safe OTC medicine options, precautions, and emergency red-flag warnings.

The project was published as:

**Symptom2Care: A Big Data-Driven NLP Platform for Preventive Healthcare**  
IEEE IC3ECSBHI 2026  
DOI: `10.1109/IC3ECSBHI67834.2026.11468987`

## What It Does

- Accepts symptoms in natural language.
- Uses Gemini through a server-side proxy when online.
- Falls back to local keyword-based symptom extraction when offline.
- Shows yoga, medicine, and precaution recommendations from local datasets.
- Detects emergency red flags and asks the user to seek medical help.
- Stores sessions and feedback through Firebase when configured.
- Supports PWA behavior with service-worker caching.

## Tech Stack

- HTML, CSS, JavaScript
- Progressive Web App APIs
- Service Worker
- Firebase / Firestore
- Gemini API through Vercel Edge Function
- PapaParse
- jsPDF
- Local CSV and JSON datasets

## Project Structure

```text
Symptom2care/
├── index.html
├── script.js
├── style.css
├── manifest.json
├── service-worker.js
├── api/extract-symptoms.js
├── data/
│   ├── asanas.csv
│   ├── medicines.csv
│   ├── symptom_map.csv
│   └── red_flags.json
├── firebase/firebase-config.js
└── nlp/nlp.js
```

There is also a `next-app/` rewrite that explores a Next.js version of the same idea.

## Local Setup

```bash
git clone https://github.com/techwallahexplorer/Symptom2care.git
cd Symptom2care
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Gemini Proxy

The client should not hold the raw Gemini API key. Use the server-side proxy:

```text
api/extract-symptoms.js
```

For Vercel, set:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

## Firebase

Firebase config is expected in:

```text
firebase/firebase-config.js
```

Firestore rules are included in:

```text
firestore.rules
```

The current rules restrict anonymous clients to create-only writes for sessions and feedback.

## Medical Disclaimer

This project provides general wellness information only. It is not a medical diagnosis tool and is not a substitute for a doctor, hospital, or qualified health professional.

## Current Limits

- Recommendation quality depends on the local datasets.
- Gemini output is validated, but AI extraction can still be wrong.
- Emergency red-flag logic is rule-based and should be treated as a safety prompt, not clinical triage.
- The app needs proper clinical review before any real-world healthcare use.
