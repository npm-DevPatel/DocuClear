// src/hooks/useDocumentPipeline.js
// Antigravity Agent — Implemented per AI_Implementation_Plan.md §7, §13

import { useAppContext, APP_ACTIONS } from './useAppContext';
import { useNavigate } from 'react-router-dom';
import { simplifyDocument } from '../services/GeminiService.js';
import { processDocument } from '../services/OCRProcessor.js';
import { detectDocumentTypeHint } from '../utils/textUtils.js';
import { MOCK_EXTRACTED_TEXT } from '../utils/constants';

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 1 — PRE-AI OCR TEXT VALIDATION  (§13.2)
// Zero API cost — pure JS guards.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates OCR-extracted text for document authenticity signals.
 * Returns a validation result — does NOT throw. Caller handles the error.
 *
 * @param {string} text - Raw OCR output
 * @returns {{ valid: boolean, reason: string | null, category: string | null }}
 */
function validateExtractedText(text) {
  const trimmed = (text || '').trim();

  // Guard 1: Empty or near-empty — blank pages, solid colour images, walls
  if (trimmed.length < 80) {
    return {
      valid: false,
      category: 'no_text',
      reason: 'We could not find any text in this file.',
    };
  }

  // Guard 2: Gibberish / OCR noise ratio — blurred photos, bad angles, patterns
  // Heuristic: if more than 40% of characters are non-alphanumeric/non-space,
  // the OCR likely failed and returned noise.
  const alphanumCount = (trimmed.match(/[a-zA-Z0-9\s]/g) || []).length;
  const noiseRatio = 1 - (alphanumCount / trimmed.length);
  if (noiseRatio > 0.60) {
    return {
      valid: false,
      category: 'unreadable',
      reason: 'The file appears to be a photo that we could not read clearly.',
    };
  }

  // Guard 3: Word count minimum — logos, phone numbers, single words
  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 1).length;
  if (wordCount < 20) {
    return {
      valid: false,
      category: 'too_short',
      reason: 'This file does not contain enough text to be a document.',
    };
  }

  // Guard 4: Repetitive / filler text — lorem ipsum, keyboard mashing
  const uniqueWords = new Set(trimmed.toLowerCase().split(/\s+/));
  const uniqueRatio = uniqueWords.size / wordCount;
  if (wordCount > 30 && uniqueRatio < 0.15) {
    return {
      valid: false,
      category: 'repetitive',
      reason: 'This file appears to contain repeated or filler text, not a real document.',
    };
  }

  return { valid: true, reason: null, category: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// USER-FACING ERROR MESSAGES  (§13.5)
// ─────────────────────────────────────────────────────────────────────────────

function getUserFacingMessage(stage, error, category) {

  // AI Refusal Messages (Layer 2): use the AI's own honest message directly
  if (error?.isRefusal && error?.refusalMessage) {
    return error.refusalMessage;
  }

  // Refusal category fallbacks (if AI message is missing)
  if (error?.isRefusal) {
    const refusalMessages = {
      not_a_document:  'This does not look like a document. Please upload a letter, form, or official paper.',
      not_actionable:  "This file doesn't contain the kind of content DocuClear can help with. Please try an official document.",
      harmful_content: "We can't process this file. Please upload a legitimate document.",
      unrecognizable:  "We weren't able to make sense of this file. Please try uploading a clearer document.",
    };
    return refusalMessages[error.refusalCategory] || refusalMessages.unrecognizable;
  }

  // Layer 1 Validation Messages (pre-AI)
  const validationMessages = {
    no_text:    'We could not find any text in this file. Please upload a document with readable text, or take a clearer photo.',
    unreadable: 'This photo was too blurry or unclear for us to read. Please try again with better lighting and hold the camera steady.',
    too_short:  "This file doesn't have enough content to be a document. Please upload a full letter, form, or notice.",
    repetitive: 'This file appears to contain repeated or test text. Please upload a real document.',
  };

  if (category && validationMessages[category]) {
    return validationMessages[category];
  }

  // System / API Error Messages
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
  const navigate = useNavigate();

  // addToast helper that dispatches to AppContext
  const addToast = (toast) => {
    dispatch({
      type: APP_ACTIONS.ADD_TOAST,
      payload: { ...toast, id: crypto.randomUUID() },
    });
  };

  // handlePipelineError — centralised error handler (§13.4)
  const handlePipelineError = (stage, error, category = null) => {
    dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'error' });

    const isRefusal = error?.isRefusal === true;
    const toastType = isRefusal ? 'warning' : 'error';
    const message = getUserFacingMessage(stage, error, category);

    console.error(`[Pipeline] Stage "${stage}" error:`, error);
    dispatch({ type: APP_ACTIONS.SET_PROCESSING_ERROR, payload: message });
    addToast({ type: toastType, message });

    // Navigate back to upload after a short delay
    setTimeout(() => {
      dispatch({ type: APP_ACTIONS.RESET_PIPELINE });
      navigate('/upload');
    }, isRefusal ? 1500 : 2000);
  };

  const runPipeline = async (file) => {
    try {
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'validating' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 5 });

      // ── STAGE 2: OCR ─────────────────────────────────────────────────────────
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ocr' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 10 });

      let extractedText;
      try {
        if (file && file instanceof File) {
          // Real OCR — processDocument routes to Tesseract (image), pdfjs (PDF), or mammoth (docx)
          const ocrResult = await processDocument(file, (ocrProgress) => {
            // Map OCR's 0–100 to pipeline range 10–50
            const mapped = 10 + Math.round(ocrProgress * 0.4);
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: Math.min(mapped, 50) });
          });
          extractedText = ocrResult.text;
        } else {
          // Dev fallback: no File object (e.g. direct URL navigation)
          await new Promise(resolve => setTimeout(resolve, 800));
          extractedText = MOCK_EXTRACTED_TEXT;
        }
      } catch (ocrError) {
        handlePipelineError('ocr', ocrError);
        return;
      }

      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 50 });


      // ── LAYER 1 VALIDATION (§13.2) ──────────────────────────────────────────
      const textCheck = validateExtractedText(extractedText);
      if (!textCheck.valid) {
        handlePipelineError('validation', new Error(textCheck.reason), textCheck.category);
        return;
      }

      dispatch({ type: APP_ACTIONS.SET_EXTRACTED_TEXT, payload: extractedText });
      console.log('[Pipeline] Extracted text (first 100 chars):', extractedText.slice(0, 100) + '...');

      // ── STAGE 2: AI ANALYSIS ─────────────────────────────────────────────────
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ai' });

      // Detect document type from extracted text heuristics (hint only — AI overrides)
      const hintedType = detectDocumentTypeHint(extractedText);

      // Animate progress from 50 → 88 while waiting on Gemini (non-blocking)
      let progress = 50;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 2, 88);
        dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: progress });
      }, 500);

      let result;
      try {
        result = await simplifyDocument(extractedText, hintedType, state.activeLanguage || 'en');
      } catch (aiError) {
        clearInterval(progressInterval);
        handlePipelineError('ai', aiError, null);
        return;
      }

      clearInterval(progressInterval);

      dispatch({ type: APP_ACTIONS.SET_SIMPLIFIED_RESULT, payload: result });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'complete' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 100 });

      setTimeout(() => {
        navigate('/results');
      }, 500);

    } catch (error) {
      // Catch-all for unexpected errors not caught above
      console.error('[Pipeline] Unexpected error:', error);
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'error' });
      dispatch({ type: APP_ACTIONS.SET_PROCESSING_ERROR, payload: 'Something went wrong. Please try again.' });
    }
  };

  return { runPipeline };
}
