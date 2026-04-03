// src/utils/imageEnhance.js
// Lightweight canvas-based image enhancement for scanned/photographed documents.
// Applied BEFORE Tesseract OCR to improve text legibility for:
//   - Blurry mobile photos of documents
//   - Poorly-lit, low-contrast images
//   - Documents photographed at an angle (basic normalisation only)
//
// Zero external dependencies — pure browser Canvas API.

/**
 * Reads a File into a data URL.
 * @param {File} file
 * @returns {Promise<string>} data URL
 */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read image: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads a data URL into an HTMLImageElement.
 * @param {string} dataURL
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(dataURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for enhancement'));
    img.src = dataURL;
  });
}

/**
 * Applies a contrast + brightness boost to a canvas context using pixel manipulation.
 * Contrast formula: pixel = (pixel - 128) * factor + 128
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} contrastFactor - Values > 1 increase contrast (1.3 = 30% boost)
 * @param {number} brightnessOffset - Added to each channel (positive = brighter)
 */
function applyContrastBrightness(ctx, width, height, contrastFactor = 1.3, brightnessOffset = 10) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast and brightness to R, G, B channels (skip alpha at i+3)
    for (let c = 0; c < 3; c++) {
      let value = data[i + c];
      value = (value - 128) * contrastFactor + 128 + brightnessOffset;
      data[i + c] = Math.max(0, Math.min(255, value));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Enhances an image file for better OCR accuracy.
 * Returns an enhanced Blob in JPEG format, or the original file if enhancement fails.
 *
 * Steps:
 *   1. Load into Canvas at 2× scale (improves Tesseract accuracy on low-res images)
 *   2. Apply contrast boost (factor: 1.35)
 *   3. Apply slight brightness lift (+8) to expose shadowed text
 *   4. Export as JPEG at high quality (0.95)
 *
 * @param {File} imageFile - The original image file (JPEG, PNG, WEBP)
 * @returns {Promise<File>} Enhanced File object (same name, JPEG mime), or original on failure
 */
export async function enhanceImageForOCR(imageFile) {
  // Only enhance raster images — skip PDFs and DOCX
  if (!imageFile.type.startsWith('image/')) {
    return imageFile;
  }

  try {
    const dataURL = await fileToDataURL(imageFile);
    const img = await loadImage(dataURL);

    // Scale up to 2× for better Tesseract accuracy on low-res document photos
    const SCALE = 2;
    const width = img.naturalWidth * SCALE;
    const height = img.naturalHeight * SCALE;

    // Guard against unreasonably large images (>8000px in any dimension)
    const effectiveScale = (width > 8000 || height > 8000) ? 1 : SCALE;
    const finalWidth = img.naturalWidth * effectiveScale;
    const finalHeight = img.naturalHeight * effectiveScale;

    const canvas = document.createElement('canvas');
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    // Apply contrast + brightness enhancement
    applyContrastBrightness(ctx, finalWidth, finalHeight, 1.35, 8);

    // Convert back to a File blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.95);
    });

    if (!blob) {
      console.warn('[imageEnhance] Canvas toBlob returned null — using original file');
      return imageFile;
    }

    // Return a new File with the same name but enhanced contents
    return new File([blob], imageFile.name, { type: 'image/jpeg' });

  } catch (err) {
    // Enhancement is best-effort — never block the pipeline on a canvas error
    console.warn('[imageEnhance] Enhancement failed, using original file:', err.message);
    return imageFile;
  }
}
