import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function DropZone({ onFileSelected, disabled = false, className }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFileSelected(files[0]);
        }
    }, [disabled, onFileSelected]);

    const handleChange = useCallback((e) => {
        if (disabled) return;
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelected(files[0]);
        }
    }, [disabled, onFileSelected]);

    const baseClasses = "relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-8 sm:p-12 text-center cursor-pointer min-h-[200px] sm:min-h-[240px] focus:outline-none focus:ring-4 focus:ring-brand-primary/20";
    const stateClasses = disabled
        ? "border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed"
        : isDragging
            ? "border-brand-primary bg-brand-primaryLight/30 scale-[1.02]"
            : "border-neutral-300 hover:border-brand-primary hover:bg-neutral-50";

    return (
        <div
            className={twMerge(clsx(baseClasses, stateClasses, className))}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    document.getElementById('file-upload-input')?.click();
                }
            }}
        >
            <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
                accept="application/pdf,image/jpeg,image/png,image/webp,.docx"
            />

            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-brand-primary/20 text-brand-primary' : 'bg-neutral-100 text-neutral-500'}`}>
                <UploadCloud size={40} className={isDragging ? 'animate-bounce' : ''} />
            </div>

            <h3 className="text-[length:var(--font-xl)] font-bold text-neutral-900 mb-2">
                {isDragging ? 'Drop it here!' : 'Tap to upload or drag file here'}
            </h3>
            <p className="text-[length:var(--font-sm)] text-neutral-500 max-w-sm">
                Supports PDF, JPG, PNG, WEBP, and DOCX up to 10MB.
            </p>
        </div>
    );
}
