// OCRProcessor.js
// Teammate 2 implementation — Tesseract.js v5 + pdfjs-dist
// Library: Tesseract.js v5 — https://github.com/naptha/tesseract.js
// Worker docs: https://github.com/naptha/tesseract.js/blob/master/docs/api.md

import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Point pdf.js worker at a CDN-hosted build — must match the installed pdfjs-dist major version.
// Using unpkg so it tracks the exact installed version at build time.
pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;


// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Reads a File into an ArrayBuffer.
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Renders a pdf.js PDFPageProxy to an off-screen canvas and returns it.
 * Scale 2.0 gives ~144 dpi from a 72 dpi PDF unit — good balance for OCR.
 * @param {import('pdfjs-dist').PDFPageProxy} page
 * @returns {Promise<HTMLCanvasElement>}
 */
async function renderPageToCanvas(page) {
    const SCALE = 2.0;
    const viewport = page.getViewport({ scale: SCALE });

    const canvas = document.createElement('canvas');
    canvas.width  = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
}

/**
 * Returns true when a pdfjs TextContent has meaningful characters.
 * Filters out whitespace-only or entirely empty content blocks.
 * @param {import('pdfjs-dist').TextContent} textContent
 * @returns {boolean}
 */
function hasEmbeddedText(textContent) {
    return textContent.items.some(
        (item) => typeof item.str === 'string' && item.str.trim().length > 0
    );
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Extracts text from an image file using Tesseract.js.
 * @param {File} imageFile - A JPEG, PNG, or WEBP image file
 * @param {function(number): void} onProgress - Callback receiving progress 0–100
 * @returns {Promise<OCRResult>}
 */
export async function extractTextFromImage(imageFile, onProgress) {
    // 1. Create a Tesseract worker with English + Swahili language packs.
    //    Tesseract v5 accepts an array of language codes directly in createWorker().
    const worker = await createWorker(['eng', 'swa'], 1, {
        // 2a. Forward Tesseract progress events to the caller.
        logger: (progress) => {
            console.log('[Tesseract]', progress.status, progress.progress);
            if (typeof onProgress === 'function' && typeof progress.progress === 'number') {
                onProgress(Math.round(progress.progress * 100));
            }
        },
    });

    try {
        // 2b. Set Tesseract parameters for document-scan accuracy.
        await worker.setParameters({
            // PSM 3 = Fully automatic page segmentation (default, good for documents)
            tessedit_pageseg_mode: '3',
            // Preserve spacing between words so layout is retained
            preserve_interword_spaces: '1',
            // Treat digits as digits (not letters)
            tessedit_char_whitelist: '',
        });

        // 3. Run recognition on the image file.
        const { data } = await worker.recognize(imageFile);

        // 4. Attempt to detect the dominant language from Tesseract heuristics.
        //    Tesseract doesn't expose a clean "detected language" field, so we
        //    infer from which script's confidence is highest when available,
        //    or fall back to 'eng'.
        const detectedLanguage = data.osd?.script_name
            ? scriptToISO(data.osd.script_name)
            : 'eng';

        return {
            text:             data.text,
            confidence:       Math.round(data.confidence),
            pageCount:        1,
            detectedLanguage,
        };
    } finally {
        // 5. Always terminate the worker to release WebAssembly memory.
        await worker.terminate();
    }
}

/**
 * Extracts text from a PDF file, using embedded text where available
 * and falling back to Tesseract OCR for scanned pages.
 * @param {File} pdfFile - A PDF file object
 * @param {function(number): void} onProgress - Progress callback 0–100
 * @returns {Promise<OCRResult>}
 */
export async function extractTextFromPDF(pdfFile, onProgress) {
    // 1. Load the PDF via pdfjs-dist.
    const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
    const pdfDoc      = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages  = pdfDoc.numPages;

    const pageTexts        = [];
    let   totalConfidence  = 0;
    let   ocrPageCount     = 0;
    let   detectedLanguage = 'eng';

    // We create one Tesseract worker and reuse it across all scanned pages.
    // Lazy-initialise so we don't pay the startup cost for text-only PDFs.
    let tesseractWorker = null;

    const getTesseractWorker = async () => {
        if (tesseractWorker) return tesseractWorker;

        tesseractWorker = await createWorker(['eng', 'swa'], 1, {
            logger: (p) => console.log('[Tesseract/PDF]', p.status, p.progress),
        });
        await tesseractWorker.setParameters({
            tessedit_pageseg_mode:      '3',
            preserve_interword_spaces:  '1',
        });
        return tesseractWorker;
    };

    try {
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page        = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();

            let pageText;

            if (hasEmbeddedText(textContent)) {
                // 3. Fast path — embedded text layer exists; no OCR needed.
                pageText = textContent.items
                    .map((item) => ('str' in item ? item.str : ''))
                    .join(' ')
                    .replace(/ {2,}/g, ' ')
                    .trim();
                totalConfidence += 100; // treat embedded text as perfect confidence
                ocrPageCount++;
            } else {
                // 4. Slow path — scanned page; render to canvas and OCR it.
                const canvas = await renderPageToCanvas(page);
                const worker = await getTesseractWorker();
                const { data } = await worker.recognize(canvas);

                pageText        = data.text;
                totalConfidence += data.confidence;
                ocrPageCount++;

                if (data.osd?.script_name) {
                    detectedLanguage = scriptToISO(data.osd.script_name);
                }
            }

            pageTexts.push(pageText);

            // 6. Report aggregate progress: proportion of pages completed.
            if (typeof onProgress === 'function') {
                onProgress(Math.round((pageNum / totalPages) * 100));
            }
        }
    } finally {
        if (tesseractWorker) {
            await tesseractWorker.terminate();
        }
    }

    // 5. Join pages with a clear visual separator.
    const fullText = pageTexts.join('\n\n--- Page Break ---\n\n');
    const avgConfidence = ocrPageCount > 0
        ? Math.round(totalConfidence / ocrPageCount)
        : 100;

    return {
        text:             fullText,
        confidence:       avgConfidence,
        pageCount:        totalPages,
        detectedLanguage,
    };
}

/**
 * Routes a File to the correct extractor based on MIME type.
 * @param {File} file - Any supported file type
 * @param {function(number): void} onProgress
 * @returns {Promise<OCRResult>}
 */
export async function processDocument(file, onProgress) {
    const mime = file.type;

    // 2. PDF
    if (mime === 'application/pdf') {
        return extractTextFromPDF(file, onProgress);
    }

    // 3. Images (JPEG, PNG, WEBP, GIF, BMP, TIFF)
    if (mime.startsWith('image/')) {
        return extractTextFromImage(file, onProgress);
    }

    // 4. DOCX / DOC — use mammoth.js for direct text extraction (no OCR needed)
    if (
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mime === 'application/msword'
    ) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const result      = await mammoth.extractRawText({ arrayBuffer });

        if (typeof onProgress === 'function') onProgress(100);

        return {
            text:             result.value,
            confidence:       100,   // Direct extraction — no OCR uncertainty
            pageCount:        1,     // mammoth doesn't expose page count
            detectedLanguage: 'eng', // mammoth doesn't detect language
        };
    }

    throw new Error(
        `Unsupported file type: "${mime}". ` +
        'Supported types: PDF, JPEG, PNG, WEBP, and DOCX.'
    );
}

// ─── Internal utilities ──────────────────────────────────────────────────────

/**
 * Maps a Tesseract OSD script name to a best-effort ISO 639-1 language code.
 * Falls back to 'eng' for unknown scripts.
 * @param {string} scriptName
 * @returns {string}
 */
function scriptToISO(scriptName) {
    const map = {
        Latin:      'eng',
        Arabic:     'ara',
        Devanagari: 'hin',
        Cyrillic:   'rus',
        Han:        'zho',
        Hangul:     'kor',
        Hebrew:     'heb',
        Japanese:   'jpn',
        Tamil:      'tam',
        Telugu:     'tel',
        Thai:       'tha',
    };
    return map[scriptName] ?? 'eng';
}

/**
 * @typedef {Object} OCRResult
 * @property {string} text             - Full extracted text
 * @property {number} confidence       - Tesseract confidence score 0–100
 * @property {number} pageCount        - Number of pages processed
 * @property {string} detectedLanguage - ISO 639-1 language code detected
 */