// src/services/GeminiService.js
// Antigravity Agent — Implemented per AI_Implementation_Plan.md v1.0
// DO NOT import @google/generative-ai — uses raw fetch() by design.

import { checkSoftLimit } from '../utils/costGuard.js';
import { SYSTEM_INSTRUCTION } from '../utils/constants.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1/models';
const MODEL = 'gemini-1.5-flash';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `${GEMINI_API_BASE}/${MODEL}:generateContent?key=${API_KEY}`;

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the structured prompt sent to Gemini for document simplification.
 * Includes AI content classification gate (§13.3) and language override.
 * @param {string} rawText
 * @param {'legal'|'medical'|'government'|'general'} documentType
 * @param {'en'|'sw'} language
 * @returns {string}
 */
function buildSimplificationPrompt(rawText, documentType, language) {
  // The refusal schema — returned when content is not a real document
  const refusalSchema = `{
  "isDocument": false,
  "refusalCategory": "not_a_document | not_actionable | harmful_content | unrecognizable",
  "refusalMessage": "honest, warm explanation of what the file appears to be",
  "summary": null,
  "redFlags": [],
  "keyTerms": [],
  "nextSteps": [],
  "documentType": "general"
}`;

  // The normal success schema
  const successSchema = `{
  "isDocument": true,
  "refusalCategory": null,
  "refusalMessage": null,
  "summary": "2-3 plain-language sentences about what this document means for the reader",
  "redFlags": [{ "title": "short headline", "description": "plain explanation + consequence of ignoring", "urgency": "high | medium", "date": "ISO 8601 | null" }],
  "keyTerms": [{ "term": "exact word from document", "simplified": "plain Kenyan English definition" }],
  "nextSteps": ["specific actionable step 1", "step 2"],
  "documentType": "legal | medical | government | general"
}`;

  const languageNote = language === 'sw'
    ? `\n\nLANGUAGE OVERRIDE: Translate all user-facing string values to Swahili. Keep all JSON keys in English. Keep "high", "medium", refusalCategory values in English.\n`
    : '';

  const truncatedText = rawText.length > 30000
    ? rawText.slice(0, 30000) + '\n\n[Note: Document was truncated at 30,000 characters due to length. Analysis based on first section.]'
    : rawText;

  return `You are analyzing a file that a Kenyan user has uploaded to DocuClear, a document simplification tool.

FIRST — CLASSIFY THE CONTENT:
Before doing anything else, decide: is this a real document that DocuClear should help with?

REAL DOCUMENTS (proceed with full analysis):
✓ Legal documents: leases, notices, contracts, court orders, title deeds, wills
✓ Medical documents: discharge summaries, diagnosis letters, lab results, NHIF/SHIF forms
✓ Government documents: KRA notices, NSSF statements, county government letters, gazette notices, permits
✓ Financial documents: bank statements, loan notices, auctioneer letters, demand letters
✓ Official correspondence: letters from institutions, utility notices, insurance documents

NOT REAL DOCUMENTS (return the refusal schema):
✗ Photos of physical objects, walls, floors, nature, people, food
✗ Screenshots of social media, WhatsApp, SMS conversations, emails between friends
✗ Memes, artwork, illustrations, infographics
✗ Menus, recipes, product labels, shopping lists
✗ Handwritten personal notes, diaries, informal letters between private individuals
✗ Blank or near-blank files
✗ Content that appears to be a test or joke upload
✗ Content that is harmful, explicit, or abusive

IMPORTANT RULES FOR REFUSALS:
- Be honest and specific. Tell the user what the file appears to be.
- Do NOT pretend you can't tell what it is. If it's a photo of a wall, say it's a photo of a wall.
- Do NOT apologize excessively. Be warm, brief, and clear.
- Do NOT hallucinate a summary for non-document content. Return the refusal schema exactly.
- Your refusalMessage must be a complete, friendly sentence in plain English (or Swahili if language override is active).

CONTENT TO ANALYZE (document type hint: ${documentType}):
---
${truncatedText}
---

RETURN ONE OF THESE TWO JSON SCHEMAS — NO MARKDOWN, NO PREAMBLE, START WITH { END WITH }:

If this IS a real document:
${successSchema}

If this is NOT a real document:
${refusalSchema}
${languageNote}`.trim();
}

/**
 * Calls the Gemini API and returns parsed JSON.
 * @param {Array} contents - The `contents` array in Gemini's format.
 * @param {string} systemInstruction - System-level persona and rules.
 * @returns {Promise<any>} Parsed JSON from the model's response.
 */
async function callGemini(contents, systemInstruction = SYSTEM_INSTRUCTION) {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Add it to .env.local.');
  }

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.2,       // Low temperature = deterministic, factual output
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json', // Instructs Gemini to output valid JSON
    },
  };

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error('Network error: Could not reach the AI service. Please check your internet connection.');
  }

  if (response.status === 429) {
    throw new Error('We\'re getting a lot of requests right now. Please wait a moment and try again.');
  }

  if (response.status >= 500) {
    throw new Error('The AI service is temporarily unavailable. Please try again in a few minutes.');
  }

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[GeminiService] API error:', response.status, errorBody);
    throw new Error(`AI service error (${response.status}). Please try again.`);
  }

  const data = await response.json();

  // Extract text from Gemini's nested response structure
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    console.error('[GeminiService] Unexpected response shape:', JSON.stringify(data));
    throw new Error('The AI returned an unexpected response. Please try again.');
  }

  // responseMimeType: 'application/json' means rawText should be clean JSON.
  // Defensive strip in case of edge-case markdown leakage:
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('[GeminiService] JSON parse failed. Raw response:', rawText);
    throw new Error('The AI response could not be understood. Please try analyzing the document again.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} DocuClearAIResult
 * @property {string} summary
 * @property {RedFlag[]} redFlags
 * @property {KeyTerm[]} keyTerms
 * @property {string[]} nextSteps
 * @property {'legal'|'medical'|'government'|'general'} documentType
 * @property {string} oneSentenceSummary
 * @property {number} originalLength
 * @property {number} simplifiedLength
 */

/**
 * @typedef {Object} RedFlag
 * @property {string} title
 * @property {string} description
 * @property {'high'|'medium'} urgency
 * @property {string|null} date
 */

/**
 * @typedef {Object} KeyTerm
 * @property {string} term
 * @property {string} simplified
 */

/**
 * Simplifies a document using Gemini 1.5 Flash.
 * This is the primary pipeline call — invoked by useDocumentPipeline.js.
 * Includes the AI content classification gate (§13.3) to catch non-documents.
 *
 * @param {string} rawText - OCR-extracted text from OCRProcessor.processDocument()
 * @param {'legal'|'medical'|'government'|'general'} documentType
 * @param {'en'|'sw'} language
 * @returns {Promise<DocuClearAIResult>}
 */
export async function simplifyDocument(rawText, documentType = 'general', language = 'en') {
  // Track usage against free tier soft limit (costGuard.js)
  checkSoftLimit();

  const prompt = buildSimplificationPrompt(rawText, documentType, language);
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  const parsed = await callGemini(contents);

  // ── AI REFUSAL GATE ──────────────────────────────────────────────────────
  // If the AI determined this is not a real document, throw a structured error
  // so the pipeline can surface a specific, honest message to the user.
  if (parsed.isDocument === false) {
    const refusalError = new Error(parsed.refusalMessage || 'This does not appear to be a document.');
    refusalError.isRefusal = true;
    refusalError.refusalCategory = parsed.refusalCategory || 'not_a_document';
    refusalError.refusalMessage = parsed.refusalMessage;
    throw refusalError;
  }

  // Normal success path — merge computed fields (AI should not calculate these)
  return {
    summary: parsed.summary ?? 'We had trouble summarizing this document. Please try again.',
    redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
    keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
    documentType: parsed.documentType ?? documentType,
    oneSentenceSummary: (parsed.summary ?? '').split('.')[0] + '.',
    originalLength: rawText.length,
    simplifiedLength: (parsed.summary ?? '').length,
  };
}

/**
 * Answers a follow-up question about the document using conversation history.
 * Pulls the last 5 Firestore messages for authenticated users.
 *
 * @param {string} userQuestion
 * @param {DocuClearAIResult} documentContext - The simplifiedResult from AppContext
 * @param {Array<{role: string, content: string}>} chatHistory - Recent messages from Firestore or AppContext
 * @returns {Promise<string>} Plain-language answer string
 */
export async function askDocumentQuestion(userQuestion, documentContext, chatHistory = []) {
  checkSoftLimit();

  // Build the context preamble as the first turn
  const contextPreamble = `You are helping a Kenyan citizen understand a document they just had simplified. Here is what the document says in plain language:

DOCUMENT SUMMARY: ${documentContext?.summary ?? 'No summary available.'}

KEY TERMS IDENTIFIED: ${(documentContext?.keyTerms ?? []).map(k => `${k.term}: ${k.simplified}`).join(' | ')}

RED FLAGS FOUND: ${(documentContext?.redFlags ?? []).map(f => `[${(f.urgency || 'medium').toUpperCase()}] ${f.title}: ${f.description}`).join(' | ')}

The user will now ask follow-up questions. Answer in plain Kenyan English at an 8th-grade reading level. If you don't know something from the document, say so honestly — do not invent information. Keep answers under 100 words unless more detail is genuinely needed.`;

  // Build multi-turn contents array
  const contents = [
    { role: 'user', parts: [{ text: contextPreamble }] },
    { role: 'model', parts: [{ text: 'Understood. I have read the document summary and I am ready to answer questions about it clearly and honestly. Please go ahead.' }] },
    // Inject Firestore/AppContext history (last 5 messages, alternating roles)
    ...chatHistory.slice(-5).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    // The current question
    { role: 'user', parts: [{ text: userQuestion }] },
  ];

  // For chat, we want plain text response, not JSON
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not configured.');

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: {
      temperature: 0.4, // Slightly higher for conversational warmth
      maxOutputTokens: 512,
    },
  };

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  if (!response.ok) throw new Error('We had trouble answering that. Please try again.');

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) throw new Error('The AI returned an empty answer. Please try asking again.');

  return answer.trim();
}
