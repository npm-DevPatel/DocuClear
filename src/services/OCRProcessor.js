// OCRProcessor.js — SCAFFOLD ONLY
// Teammate 2: Implement all TODO sections below
// Library: Tesseract.js v5 — https://github.com/naptha/tesseract.js
// Worker docs: https://github.com/naptha/tesseract.js/blob/master/docs/api.md

/**
 * Extracts text from an image file using Tesseract.js
 * @param {File} imageFile - A JPEG, PNG, or WEBP image file
 * @param {function(number): void} onProgress - Callback receiving progress 0-100
 * @returns {Promise<OCRResult>} Extracted text and metadata
 */
export async function extractTextFromImage(imageFile, onProgress) {
    // TODO (Teammate 2):
    // 1. Create a Tesseract worker: await createWorker(['eng', 'swa'])
    //    Include Swahili language pack for multi-language support
    // 2. Set Tesseract parameters for optimal accuracy on document scans:
    //    tessedit_pageseg_mode, preserve_interword_spaces, etc.
    // 3. Log progress events and call onProgress(Math.round(progress.progress * 100))
    // 4. Call worker.recognize(imageFile) and capture the data
    // 5. Terminate the worker after completion to free memory
    // 6. Return an OCRResult object

    throw new Error('TODO: OCRProcessor.extractTextFromImage not yet implemented by Teammate 2');
}

/**
 * Extracts text from a PDF file using pdfjs-dist + Tesseract
 * @param {File} pdfFile - A PDF file object
 * @param {function(number): void} onProgress - Progress callback 0-100
 * @returns {Promise<OCRResult>}
 */
export async function extractTextFromPDF(pdfFile, onProgress) {
    // TODO (Teammate 2):
    // 1. Load the PDF using pdfjs-dist: pdfjsLib.getDocument({ data: arrayBuffer })
    // 2. Iterate over each page of the PDF
    // 3. For each page, attempt text extraction via page.getTextContent() first
    //    (PDFs with embedded text don't need OCR — this is faster and more accurate)
    // 4. If a page has no embedded text (scanned PDF), render it to a canvas
    //    and pass the canvas to Tesseract for OCR
    // 5. Concatenate all page texts with '\\n\\n--- Page Break ---\\n\\n' between them
    // 6. Report combined progress across all pages

    throw new Error('TODO: OCRProcessor.extractTextFromPDF not yet implemented by Teammate 2');
}

/**
 * Routes a File to the correct extractor based on MIME type
 * @param {File} file - Any supported file type
 * @param {function(number): void} onProgress
 * @returns {Promise<OCRResult>}
 */
export async function processDocument(file, onProgress) {
    // TODO (Teammate 2):
    // 1. Check file.type
    // 2. If 'application/pdf' → call extractTextFromPDF
    // 3. If image MIME type → call extractTextFromImage
    // 4. If 'application/vnd...docx' → use mammoth.js or similar to extract text directly

    throw new Error('TODO: OCRProcessor.processDocument not yet implemented by Teammate 2');
}

/**
 * @typedef {Object} OCRResult
 * @property {string} text - Full extracted text
 * @property {number} confidence - Tesseract confidence score 0-100
 * @property {number} pageCount - Number of pages processed
 * @property {string} detectedLanguage - ISO language code detected
 */
