import { useState, useCallback } from 'react';
import { formatFileSize } from '../utils/fileUtils';

const ACCEPTED_MIME_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MIN_FILE_SIZE_BYTES = 1024;              // 1KB

export function validateFile(file) {
    if (!file) {
        return { valid: false, error: 'No file was selected. Please choose a file to continue.' };
    }

    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
        return {
            valid: false,
            error: `We can't read that type of file yet. Please use a PDF, photo (JPG or PNG), or Word document.`,
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `This file is a bit too big (${formatFileSize(file.size)}). Please use a file under 10MB.`,
        };
    }

    if (file.size < MIN_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `This file appears to be empty. Please check the file and try again.`,
        };
    }

    return { valid: true, error: null };
}

export function useFileValidation() {
    const [error, setError] = useState(null);

    const validate = useCallback((file) => {
        const result = validateFile(file);
        if (!result.valid) {
            setError(result.error);
        } else {
            setError(null);
        }
        return result;
    }, []);

    return { error, setError, validate };
}
