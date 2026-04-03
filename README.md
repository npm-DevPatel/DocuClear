# 📄 DocuClear: AI-Powered Document Simplifier

> **SFE 4010: Human-Computer Interaction (HCI) — University Capstone Project**

## 📖 What is DocuClear?
**DocuClear** is a mobile-responsive Progressive Web App (PWA) designed to transform dense legal, medical, and government jargon into plain, dignified language. By leveraging AI and OCR, it extracts key information, highlights hidden warnings, and provides easy-to-understand summaries of complex paperwork.

---

## 🎯 Who is it for?
DocuClear is built with a strict focus on accessibility and inclusive design, specifically empowering:
* **Elderly users** who may struggle with small print or confusing legal terms.
* **Non-native English speakers** who need documents translated or explained simply.
* **Individuals with cognitive or reading disabilities** who benefit from structured, plain-language summaries.
* **Anyone** feeling overwhelmed by bureaucratic, medical, or financial paperwork.

---

## 💡 How does it help them?
DocuClear removes the stress and confusion of complex paperwork by providing:

* **Jargon Translation:** Automatically rewrites dense text to an 8th-grade reading level.
* **Red Flag Detection:** Scans for and alerts users to urgent deadlines, required actions, and hidden legal or financial consequences.
* **Key Term Extraction:** Pulls out 5–10 critical terms from the document and provides simple, plain-English definitions.
* **Bilingual Support:** Seamlessly translates summaries from English into Kiswahili at the click of a button.
* **Text-to-Speech (TTS):** Uses browser-native audio to read the simplified text aloud, aiding users with visual impairments or reading fatigue.
* **Actionable Outcomes:** Generates downloadable calendar events (`.ics` files) so users never miss a deadline mentioned in their documents.

---

## 🛠 Tech Stack (Zero-Cost Architecture)
This project was architected entirely on free-tier, highly efficient services:

* **Frontend:** React 18 + Vite (Built as a fast, mobile-first PWA).
* **Styling:** Tailwind CSS + Vanilla CSS (Custom design system ensuring strict accessibility, dynamic font scaling, and theme management).
* **AI Engine:** Google Gemini 1.5 Flash (Powers the summarization, entity extraction, red-flag detection, and Kiswahili translation).
* **OCR Processing:** Tesseract.js & PDF.js (Runs client-side in web workers to extract text from images and PDFs without compromising privacy).
* **Backend & Auth:** Firebase Spark Plan (Manages secure user authentication, anonymous guest sessions, and stores document history).
* **Audio:** Web Speech API (Native browser API utilized for text-to-speech functionality).

---

## ♿ Uncompromising Accessibility
As an HCI Capstone project, the UI was built around strict accessibility guidelines conforming to WCAG standards:
* **Comprehensive Theme Suite:** Includes a fully functional Night Mode and a Stark High-Contrast (WCAG AAA) Mode for visually impaired users.
* **Dynamic Font Scaling:** Users can scale text globally (up to 1.5x) without breaking the layout.
* **Large Touch Targets:** Every interactive element has a minimum height/width of `56px` to accommodate users with limited motor control.
* **Empathic UX Copy:** Follows an "Action-First, Blame-Free" philosophy. Errors take the blame ("We couldn't read this file") to reduce user anxiety.
* **Screen Reader Optimization:** Structured semantic HTML, ARIA labels, and visually hidden skip-links.

---

## 🚀 Getting Started (Local Development)

### 1. Setup
```bash
# Clone the repository
git clone https://github.com/npm-DevPatel/DocuClear.git
cd DocuClear

# Install dependencies
npm install
```

### 2. Environment Variables
You will need API keys for Google Gemini and Firebase. 
1. Duplicate `.env.example` and rename it to `.env`.
2. Fill in your keys:
```env
VITE_GEMINI_API_KEY="your_gemini_api_key"

VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

### 3. Run the App
```bash
# Start the Vite development server
npm run dev
```

---

## 📝 License & Privacy
DocuClear processes all initial Optical Character Recognition (OCR) locally on the client's device. No raw images or PDFs are uploaded to our servers. Only the extracted text is sent to the AI service for summarization. User history is securely auto-deleted after 30 days to protect sensitive personal data.
