// GeminiService.js — SCAFFOLD ONLY
// Teammate 1: Implement all TODO sections below
// API Reference: https://ai.google.dev/gemini-api/docs/quickstart
// Model: gemini-1.5-flash (free tier: 15 RPM, 1M TPM, 1500 RPD)

import { checkSoftLimit } from '../utils/costGuard.js';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Sends extracted text to Gemini API for simplification.
 * @param {string} rawText - The OCR-extracted text from the document
 * @param {'legal'|'medical'|'government'|'general'} documentType - Detected document category
 * @param {'en'|'sw'} targetLanguage - Output language code
 * @returns {Promise<SimplificationResult>} Structured simplification output
 * @throws {GeminiServiceError} On API failure, rate limit, or malformed response
 */
export async function simplifyDocument(rawText, documentType, targetLanguage = 'en') {
    checkSoftLimit(); // Call to increment usage counter

    // TODO (Teammate 1): 
    // 1. Construct the Gemini API request body with the correct JSON structure
    // 2. Write the master simplification prompt. It MUST instruct the model to:
    //    a) Output ONLY a valid JSON object matching the SimplificationResult type below
    //    b) Use language appropriate for an 8th-grade reading level
    //    c) Detect and list "red flags" (urgent deadlines, required actions, legal consequences)
    //    d) Extract 5-10 key terms with simple definitions
    //    e) If targetLanguage === 'sw', translate the output summary to Swahili
    // 3. Make the fetch() call to API_BASE_URL with the API key from import.meta.env.VITE_GEMINI_API_KEY
    // 4. Parse the response and validate it matches SimplificationResult shape
    // 5. Handle errors: network errors, 429 rate limit, malformed JSON in response

    throw new Error('TODO: GeminiService.simplifyDocument not yet implemented by Teammate 1');
}

/**
 * Sends a follow-up chat question to Gemini, with document context.
 * @param {string} userQuestion - The user's question text
 * @param {SimplificationResult} documentContext - The previously simplified document
 * @param {ChatMessage[]} chatHistory - Previous messages for multi-turn context
 * @returns {Promise<string>} The assistant's answer in plain language
 */
export async function askDocumentQuestion(userQuestion, documentContext, chatHistory) {
    checkSoftLimit();

    // TODO (Teammate 1):
    // 1. Build a multi-turn conversation request using the 'contents' array
    // 2. Prepend a system-context message that includes the simplifiedResult summary
    //    so Gemini understands the document being discussed
    // 3. The prompt must enforce: plain language, no hallucination, admit uncertainty
    // 4. Return the text content of the first candidate's first part

    throw new Error('TODO: GeminiService.askDocumentQuestion not yet implemented by Teammate 1');
}

/**
 * @typedef {Object} SimplificationResult
 * @property {string} summary - Plain-language summary (2-5 paragraphs)
 * @property {string} oneSentenceSummary - A single sentence summary for sharing
 * @property {KeyTerm[]} keyTerms - Array of defined terms
 * @property {RedFlag[]} redFlags - Array of urgent items
 * @property {'legal'|'medical'|'government'|'general'} documentType - Model's classification
 * @property {number} originalLength - Character count of input
 * @property {number} simplifiedLength - Character count of output summary
 */

/**
 * @typedef {Object} KeyTerm
 * @property {string} term - The original jargon term
 * @property {string} definition - Plain-language definition (1-2 sentences)
 */

/**
 * @typedef {Object} RedFlag
 * @property {'deadline'|'action_required'|'legal_consequence'|'financial'} type
 * @property {string} description - What the user needs to know, in plain language
 * @property {string|null} date - ISO date string if a deadline is detected, else null
 * @property {'high'|'medium'|'low'} severity
 */
