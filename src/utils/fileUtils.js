export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileTypeLabel(mimeType) {
    if (!mimeType) return 'Document';
    if (mimeType === 'application/pdf') return 'PDF Document';
    if (mimeType.startsWith('image/')) return 'Image File';
    if (mimeType.includes('wordprocessingml')) return 'Word Document';
    return 'Document';
}

export function getFileTypeIcon(mimeType) {
    if (!mimeType) return 'File';
    if (mimeType === 'application/pdf') return 'FileText';
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.includes('wordprocessingml')) return 'FileType';
    return 'File';
}
