import React from 'react';
import { formatFileSize } from '../../utils/fileUtils';
import { Card } from '../ui/Card';
import { X, FileText, Image as ImageIcon, FileType } from 'lucide-react';

function FileIcon({ mimeType }) {
    if (mimeType === 'application/pdf') return <FileText size={32} className="text-red-500" />;
    if (mimeType && mimeType.startsWith('image/')) return <ImageIcon size={32} className="text-blue-500" />;
    return <FileType size={32} className="text-brand-primary" />;
}

export function FilePreview({ files = [], onRemove }) {
    if (!files || files.length === 0) return null;

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return (
        <div className="space-y-3 animate-card-enter">
            {/* File count badge */}
            <div className="flex items-center justify-between px-1">
                <p className="text-[length:var(--font-sm)] font-bold text-neutral-500 uppercase tracking-wide">
                    {files.length} document{files.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-[length:var(--font-sm)] text-neutral-400">
                    Total: {formatFileSize(totalSize)}
                </p>
            </div>

            {/* Individual file cards */}
            {files.map((file, index) => (
                <Card
                    key={`${file.name}-${index}`}
                    className="flex items-center p-4 border-l-4 border-l-brand-primary"
                >
                    <div className="p-2 bg-neutral-100 rounded-xl mr-3 flex-shrink-0">
                        <FileIcon mimeType={file.type} />
                    </div>

                    <div className="flex-1 min-w-0 pr-3">
                        <h4 className="text-[length:var(--font-base)] font-bold text-neutral-900 truncate">
                            {file.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[length:var(--font-sm)] text-neutral-500">
                            <span>{formatFileSize(file.size || 0)}</span>
                            {file.type?.startsWith('image/') && (
                                <>
                                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                                    <span className="text-blue-500 font-medium">✨ Will be enhanced</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => onRemove(index)}
                        className="flex-shrink-0 p-2 text-neutral-400 hover:text-brand-danger hover:bg-brand-dangerLight rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-danger"
                        aria-label={`Remove ${file.name}`}
                    >
                        <X size={20} />
                    </button>
                </Card>
            ))}
        </div>
    );
}
