# 📄 DocuClear: AI-Powered Document Simplifier

> **SFE 4010: Human-Computer Interaction (HCI) — University Capstone Project**

**DocuClear** is a mobile-responsive Progressive Web App (PWA) built to empower elderly users, non-native speakers, and people with cognitive disabilities. It transforms dense legal, medical, and government jargon into plain, dignified language while maintaining strict accessibility standards.

---

## 🛠 Tech Stack (Zero-Cost Architecture)

This project is built entirely on **free-tier** services:

* **Frontend:** React 18 + Vite
* **Styling:** Tailwind CSS (Accessibility-focused)
* **AI Engine:** Google Gemini 1.5 Flash
* **OCR:** Tesseract.js (Client-side processing)
* **Backend/Auth:** Firebase Spark Plan
* **Audio:** Web Speech API

---

## 🚀 Current Project Status

The **Lead Architect** has established the base application shell and core infrastructure. The following features are currently implemented:

* **HCI-Compliant UI:** Complete design system with 56px touch targets and high-contrast support.
* **Routing & Layout:** All 6 core pages are mapped and accessible.
* **Authentication:** Firebase Auth is integrated (Email/Password) with a specialized **Guest Mode** for immediate access. Local setup and environment variables are secure.
* **State Management:** Global state for document pipelines, themes (font-scaling), and auth is live.
* **Utility Infrastructure:** Calendar logic (`.ics` generation), cost monitoring, and red-flag detection patterns are ready.

---

## 🏗 Group Work: Feature Roadmap

Technical **"Holes"** have been left for group members to implement. Team members should clone the repository and work on their assigned service files. 

### **Task 1: AI Integration (Gemini Service)**

* **Target File:** `src/services/GeminiService.js`
* **Objective:** Implement the master prompt logic to simplify text, extract key terms, and detect red flags via the Gemini API using the `import.meta.env.VITE_GEMINI_API_KEY`.
* **The Master Prompt MUST instruct the model to:**
  1. Output **ONLY** a valid JSON object matching the `SimplificationResult` typedef shape defined in the file.
  2. Use language appropriate for an 8th-grade reading level.
  3. Detect and list "red flags" (urgent deadlines, required actions, legal/financial consequences).
  4. Extract 5–10 key terms with simple definitions.
  5. If the `targetLanguage` argument is `'sw'`, seamlessly translate the output summary to Swahili.

### **Task 2: Document Processing (OCR)**

* **Target File:** `src/services/OCRProcessor.js`
* **Objective:** Implement Tesseract.js for image-to-text scanning and `pdfjs-dist` for PDF text extraction. Ensure the Tesseract web-worker is spun up and terminated correctly to avoid memory leaks!

### **Task 3: Accessibility & Audio (TTS)**

* **Target File:** `src/services/TTSService.js`
* **Objective:** Wire the Browser-native Web Speech API (`window.speechSynthesis`) to read summaries aloud in both English and Swahili.

### **Task 4: Data Management (Firebase)**

* **Target File:** `src/services/FirebaseService.js`
* **Objective:** Implement Firestore logic to save the `SimplificationResult` history and manage the 30-day auto-delete privacy feature using the existing Firebase Config.

---

## 📥 Getting Started for Team Members

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/npm-DevPatel/DocuClear.git
cd DocuClear

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 2. Environment Variables & Firebase Access

Because we are using real backend services, you need the API keys to connect your local development environment to our project. 

**Firebase Console Access:**
The Team Leader will add your email to the **Firebase Console**. You will receive an email invitation to join the "DocuClear" Firebase project. Once you accept:
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click on our "DocuClear" project.
3. Click the **Gear Icon (Project Settings)** in the top left corner.
4. Scroll down to "Your apps" and you will find our `firebaseConfig` block containing the API keys.

**Setting up your local `.env` file:**
For security reasons, API keys are never pushed to GitHub (they are ignored via `.gitignore`). You must create a local copy on your machine:

1. Look in the root folder of the project for a file named `.env.example`.
2. Duplicate that file and rename the copy to exactly `.env` (make sure it's just `.env`, not `.env.txt`).
3. Open your new `.env` file and fill in the values using the keys from the Firebase Console (and get the Gemini API key from the Team Lead). 

Your file should look exactly like this:
```env
VITE_GEMINI_API_KEY="paste_gemini_key_here"

VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

### 3. Contribution Workflow

To keep our codebase clean and prevent conflicts, **do not push directly to the `main` branch**. Follow this strict workflow:

1. **Create a Dedicated Branch:** 
   Branch off of `main` using a descriptive name for your feature.
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-name-task
   # Example: git checkout -b feature/john-tts-service
   ```
2. **Implementation:** 
   Find your assigned "Hole" in the `src/services/` directory and replace the `TODO` comments with functional logic. Commit your changes regularly with clear messages.
3. **Push to Your Branch:**
   ```bash
   git push -u origin feature/your-name-task
   ```
4. **Submit a Pull Request (PR):**
   Go to GitHub and open a Pull Request against the `main` branch. Request a review from the Team Leader. **Do not merge your own PR.**

### 4. 🚨 Critical HCI & Accessibility Rules

Because this is an HCI Capstone project, any UI you build must adhere strictly to our **Brand Guidelines**. The reviewers will check for these constraints before merging your PR:

* **Touch Targets:** Every clickable element (buttons, inputs) **MUST** have a minimum height of `56px` (`min-h-[56px]`).
* **Typography:** Use the established CSS variables (e.g., `text-[var(--font-base)]`). Do not hardcode small pixel values.
* **Component Usage:** Do not build custom `<button>` or `<input>` tags. Always import and use the established design system components from `src/components/ui/`.
* **The "Warm Minimalism" Voice:** If you write any copy or error messages, follow these two rules:
  1. **Action-First:** Tell the user what is happening (e.g., use "Reading your document..." instead of "OCR Processing...").
  2. **Never Blame the User:** If something fails, take the blame. (e.g., use "We can't read that type of file yet." instead of "Invalid file format").

---

## 📂 Current Code Structure

```text
src/
├── components/ (UI, Layout, Upload, Results, Chat, History, Auth)
├── context/    (AppContext, AuthContext, ThemeContext)
├── hooks/      (useDocumentPipeline, useFileValidation, etc.)
├── pages/      (All 6 core application views)
├── services/   (Technical Holes for group implementation)
├── styles/     (Accessibility, Animations, Tailwind)
└── utils/      (Calendar, Red-Flag Detection, CostGuard)
```
