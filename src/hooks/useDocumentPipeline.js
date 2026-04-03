// src/hooks/useDocumentPipeline.js
// Updated: multi-file support, image auto-enhance, Firestore save after success

import { useAppContext, APP_ACTIONS } from './useAppContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { simplifyDocument } from '../services/GeminiService.js';
import { processDocument } from '../services/OCRProcessor.js';
import { saveDocumentToHistory } from '../services/FirebaseService.js';
import { enhanceImageForOCR } from '../utils/imageEnhance.js';
import { detectDocumentTypeHint } from '../utils/textUtils.js';
import { MOCK_EXTRACTED_TEXT } from '../utils/constants';

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 1 — PRE-AI OCR TEXT VALIDATION (zero API cost — pure JS guards)
// ─────────────────────────────────────────────────────────────────────────────

function validateExtractedText(text) {
  const trimmed = (text || '').trim();

  if (trimmed.length < 80) {
    return { valid: false, category: 'no_text', reason: 'We could not find any text in this file.' };
  }

  const alphanumCount = (trimmed.match(/[a-zA-Z0-9\s]/g) || []).length;
  const noiseRatio = 1 - (alphanumCount / trimmed.length);
  if (noiseRatio > 0.60) {
    return { valid: false, category: 'unreadable', reason: 'The file appears to be a photo that we could not read clearly.' };
  }

  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 1).length;
  if (wordCount < 20) {
    return { valid: false, category: 'too_short', reason: 'This file does not contain enough text to be a document.' };
  }

  const uniqueWords = new Set(trimmed.toLowerCase().split(/\s+/));
  const uniqueRatio = uniqueWords.size / wordCount;
  if (wordCount > 30 && uniqueRatio < 0.15) {
    return { valid: false, category: 'repetitive', reason: 'This file appears to contain repeated or filler text, not a real document.' };
  }

  return { valid: true, reason: null, category: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// USER-FACING ERROR MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

function getUserFacingMessage(stage, error, category) {
  if (error?.isRefusal && error?.refusalMessage) {
    return error.refusalMessage;
  }

  if (error?.isRefusal) {
    const refusalMessages = {
      not_a_document:  'This does not look like a document. Please upload a letter, form, or official paper.',
      not_actionable:  "This file doesn't contain the kind of content DocuClear can help with. Please try an official document.",
      harmful_content: "We can't process this file. Please upload a legitimate document.",
      unrecognizable:  "We weren't able to make sense of this file. Please try uploading a clearer document.",
    };
    return refusalMessages[error.refusalCategory] || refusalMessages.unrecognizable;
  }

  const validationMessages = {
    no_text:    'We could not find any text in this file. Please upload a document with readable text, or take a clearer photo.',
    unreadable: 'This photo was too blurry or unclear for us to read. Please try again with better lighting and hold the camera steady.',
    too_short:  "This file doesn't have enough content to be a document. Please upload a full letter, form, or notice.",
    repetitive: 'This file appears to contain repeated or test text. Please upload a real document.',
  };

  if (category && validationMessages[category]) {
    return validationMessages[category];
  }

  if (stage === 'ocr') {
    return 'We had trouble reading your document. Please try a clearer photo, or use a PDF if you have one.';
  }
  if (stage === 'ai') {
    const msg = error?.message || '';
    if (msg.includes('internet') || msg.includes('Network')) {
      return "We're having trouble connecting. Please check your internet and try again.";
    }
    if (msg.includes('wait a moment')) {
      return "We're getting a lot of requests right now. Please wait a moment and try again.";
    }
    if (msg.includes('configured') || msg.includes('API_KEY')) {
      return 'The AI service is not configured. Please contact the app administrator.';
    }
    return 'We had a problem reading your document. Please try again.';
  }

  return 'Something went wrong. Please try again.';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useDocumentPipeline() {
  const { state, dispatch } = useAppContext();
  const { state: authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const addToast = (toast) => {
    dispatch({
      type: APP_ACTIONS.ADD_TOAST,
      payload: { ...toast, id: crypto.randomUUID() },
    });
  };

  const handlePipelineError = (stage, error, category = null) => {
    dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'error' });
    const isRefusal = error?.isRefusal === true;
    const toastType = isRefusal ? 'warning' : 'error';
    const message = getUserFacingMessage(stage, error, category);

    console.error(`[Pipeline] Stage "${stage}" error:`, error);
    dispatch({ type: APP_ACTIONS.SET_PROCESSING_ERROR, payload: message });
    addToast({ type: toastType, message });

    setTimeout(() => {
      dispatch({ type: APP_ACTIONS.RESET_PIPELINE });
      navigate('/upload');
    }, isRefusal ? 1500 : 2000);
  };

  /**
   * Extracts text from a single file, applying image enhancement for images.
   * @param {File} file
   * @param {function(number): void} onProgress
   * @returns {Promise<string>}
   */
  async function extractTextFromFile(file, onProgress) {
    if (!(file instanceof File)) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_EXTRACTED_TEXT;
    }

    // Apply auto-enhancement for image files before OCR
    const fileToProcess = file.type.startsWith('image/')
      ? await enhanceImageForOCR(file)
      : file;

    const ocrResult = await processDocument(fileToProcess, onProgress);
    return ocrResult.text;
  }

  /**
   * Runs the full document pipeline for one or more files.
   * Multi-file: extracts text from each, concatenates, then runs one AI analysis.
   *
   * @param {File | File[]} input - Single file or array of files
   */
  const runPipeline = async (input) => {
    const files = Array.isArray(input) ? input : [input];

    try {
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'validating' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 5 });

      // ── STAGE 1: OCR EACH FILE (Parallel) ───────────────────────────────
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ocr' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 10 });

      let completedFiles = 0;
      let extractedTexts = [];

      try {
        const ocrPromises = files.map(async (file, index) => {
          const text = await extractTextFromFile(file, (ocrProgress) => {
            // Very rough progress tracking for parallel operations
            if (ocrProgress === 100 && completedFiles < files.length) {
                completedFiles++;
                const newProgress = 10 + Math.round((completedFiles / files.length) * 40);
                dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: Math.min(newProgress, 50) });
            }
          });
          return { name: file.name, text, index };
        });

        const results = await Promise.all(ocrPromises);
        // Ensure they remain in the original uploaded order after parallel resolution
        extractedTexts = results.sort((a, b) => a.index - b.index);
        
      } catch (ocrError) {
        handlePipelineError('ocr', ocrError);
        return;
      }

      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 50 });

      // ── LAYER 1 VALIDATION ───────────────────────────────────────────────
      // Concatenate all extracted text for combined validation + analysis
      const combinedText = extractedTexts
        .map(({ name, text }, idx) =>
          files.length > 1
            ? `=== DOCUMENT ${idx + 1}: ${name} ===\n\n${text}`
            : text
        )
        .join('\n\n');

      const textCheck = validateExtractedText(combinedText);
      if (!textCheck.valid) {
        handlePipelineError('validation', new Error(textCheck.reason), textCheck.category);
        return;
      }

      dispatch({ type: APP_ACTIONS.SET_EXTRACTED_TEXT, payload: combinedText });

      // ── STAGE 2: AI ANALYSIS ─────────────────────────────────────────────
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ai' });

      const hintedType = detectDocumentTypeHint(combinedText);

      let progress = 50;
      // Start a subtle progress ticker during the slow AI phase, but don't hold anything back
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 2, 95);
        dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: progress });
      }, 800);

      let result;
      try {
        result = await simplifyDocument(combinedText, hintedType, state.activeLanguage || 'en');
      } catch (aiError) {
        clearInterval(progressInterval);
        handlePipelineError('ai', aiError, null);
        return;
      }

      clearInterval(progressInterval);

      // ── STAGE 3: SAVE TO FIRESTORE (authenticated users only) ────────────
      let firestoreId = null;
      if (authState?.isAuthenticated && authState?.user?.uid) {
        try {
          const primaryName = files[0]?.name || 'Document';
          firestoreId = await saveDocumentToHistory(authState.user.uid, result, primaryName);
        } catch (saveError) {
          // Non-fatal — user still gets results even if save fails
          console.warn('[Pipeline] Firestore save failed (non-fatal):', saveError);
        }
      }

      // Attach the Firestore ID so ChatPage can use it for message persistence
      const resultWithId = { ...result, firestoreId };

      // ---- INSTANT CACHE UPDATE (Optimistic UI for HistoryPage) ----
      try {
        const cached = localStorage.getItem('dc_history_cache');
        const historyArray = cached ? JSON.parse(cached) : [];
        const newEntry = {
          id: firestoreId || `local_${Date.now()}`,
          name: files[0]?.name || 'Document',
          createdAt: Date.now(), // Local timestamp
          summary: result.summary,
          redFlags: result.redFlags,
          nextSteps: result.nextSteps,
          documentType: result.documentType || 'general',
          originalLength: result.originalLength || 0,
          simplifiedLength: result.simplifiedLength || 0,
        };
        historyArray.unshift(newEntry);
        localStorage.setItem('dc_history_cache', JSON.stringify(historyArray));
      } catch (err) {
        console.warn('[Pipeline] Could not update local history cache', err);
      }
      // -------------------------------------------------------------

      dispatch({ type: APP_ACTIONS.SET_SIMPLIFIED_RESULT, payload: resultWithId });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'complete' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 100 });
      navigate('/results'); // Jump immediately without setTimeout

    } catch (error) {
      console.error('[Pipeline] Unexpected error:', error);
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'error' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_ERROR, payload: 'Something went wrong. Please try again.' });
    }
  };

  return { runPipeline };
}
