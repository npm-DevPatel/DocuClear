import React from 'react';
import { getFileTypeIcon, getFileTypeLabel, formatFileSize } from '../../utils/fileUtils';
import { Card } from '../ui/Card';
import { X, FileText, Image as ImageIcon, FileType } from 'lucide-react';

export function FilePreview({ file, onClear }) {
    if (!file) return null;

    const getIcon = (mimeType) => {
        if (mimeType === 'application/pdf') return <FileText size={40} className="text-red-500" />;
        if (mimeType.startsWith('image/')) return <ImageIcon size={40} className="text-blue-500" />;
        return <FileType size={40} className="text-brand-primary" />;
    };

    return (
        <Card className="flex items-center p-4 border-l-4 border-l-brand-primary animate-card-enter">
            <div className="p-3 bg-neutral-100 rounded-xl mr-4 flex-shrink-0">
                {getIcon(file.type)}
            </div>

            <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-[length:var(--font-base)] font-bold text-neutral-900 truncate">
                    {file.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[length:var(--font-sm)] text-neutral-500">
                    <span>{getFileTypeLabel(file.type)}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>{formatFileSize(file.size)}</span>
                </div>
            </div>

            <button
                onClick={onClear}
                className="p-2 text-neutral-400 hover:text-brand-danger hover:bg-brand-dangerLight rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-danger"
                aria-label="Remove selected file"
            >
                <X size={24} />
            </button>
        </Card>
    );
}
