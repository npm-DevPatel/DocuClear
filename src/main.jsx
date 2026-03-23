import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// §1.1 — Runtime guard: warn immediately if the AI service key is missing.
// This surfaces in the browser console during development and prevents silent failures.
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn(
    '[DocuClear] ⚠ VITE_GEMINI_API_KEY is not set. ' +
    'Copy .env.example to .env.local and add your Gemini API key. ' +
    'AI features will fail until this is configured.'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
