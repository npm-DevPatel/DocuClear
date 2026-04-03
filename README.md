# 📄 DocuClear: Accessibility-First Document Simplifier

> **SFE 4010: Human-Computer Interaction (HCI) — University Capstone Project**
> **Finalized Production Version**

**DocuClear** is a high-performance, mobile-responsive web application designed to empower elderly users, non-native speakers, and people with cognitive disabilities. It transforms complex legal, medical, and government jargon into plain, dignified language while adhering to strict HCI accessibility standards.

---

## ✨ Core Features

### 🔍 Intelligence & Simplification
- **Multi-File Processing:** Analyze up to 3 PDF or image documents simultaneously.
- **AI "Plain Language" Engine:** Powered by Google Gemini 1.5 Flash to convert dense jargon into an 8th-grade reading level.
- **Automated Red Flag Detection:** Instantly identifies urgent deadlines, financial obligations, and legal risks.
- **Next Steps Roadmap:** Generates clear, numbered actionable items from any document.

### ♿ Accessibility & UX
- **Native Text-to-Speech (TTS):** Integrated Web Speech API for hands-free listening in both **English** and **Swahili**.
- **輕量化 Swahili Translation:** One-tap translation for all results, optimized for low API token consumption.
- **Mobile-Native Camera:** One-click "Take Photo" integration using native device cameras for instant document scanning.
- **"Warm Minimalism" UI:** 56px touch targets, high-contrast typography, and zero-blame error messaging.

### ⚡ Performance & Resilience
- **Instant "ChatGPT-Style" Loading:** Optimistic local caching (`localStorage` & `sessionStorage`) ensures history and chats load in under 100ms.
- **Parallel OCR Pipeline:** Multi-threaded text extraction using Tesseract.js and PDF.js for 3x faster processing.
- **Session Persistence:** Analysis results and current state survive browser refreshes and accidental tab closures.
- **Ad-Blocker Resilience:** Built-in timeout shields for Firestore operations to prevent UI hangs on restricted networks.

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite (SPA)
- **Styling:** Vanilla CSS + Tailwind (Design System)
- **AI Engine:** Google Gemini (Vertex AI / Proxy)
- **OCR:** Tesseract.js & PDF.js (Client-side)
- **Backend:** Firebase (Authentication & Firestore)
- **Storage:** Offline-first caching (Browser Persistence API)
- **Audio:** Web Speech API (Local synthesis)

---

## 🏗 System Architecture

### Document Processing Pipeline
1. **Ingestion:** Native Camera or File Upload (Validation for 3-file max).
2. **Parallel OCR:** Multi-page extraction via `Promise.all`.
3. **AI Analysis:** Structured JSON extraction via Gemini 1.5 Flash.
4. **Instant Persistence:** Document is saved to local cache *immediately* upon completion.
5. **Background Sync:** Silent sync to Firebase Firestore for cross-device access.

### Performance Optimizations
- **Token Efficiency:** Swahili translation uses a value-only mapping function, reducing LLM token costs by over 90%.
- **Zero Latency Navigation:** Artificial UI delays removed; results and chat views are prepared and rendered as the pipeline completes.

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/npm-DevPatel/DocuClear.git
cd DocuClear
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY="your_gemini_key"
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

### 3. Development
```bash
npm run dev
```

---

## 📜 HCI Implementation Guidelines
This project follows strict human-centric constraints:
- **Touch Targets:** No clickable element is smaller than 56px.
- **Typography:** Fluid font-scaling using CSS variables.
- **Cognitive Load:** Information is tiered (Summary → Warnings → Actions) to prevent overwhelm.
