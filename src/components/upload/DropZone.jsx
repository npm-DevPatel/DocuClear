import React, { useCallback, useState } from 'react';
import { UploadCloud, Plus, Camera } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const MAX_FILES = 3;

export function DropZone({ onFilesSelected, disabled = false, currentCount = 0, className }) {
    const [isDragging, setIsDragging] = useState(false);
    const remainingSlots = MAX_FILES - currentCount;

    const processFiles = useCallback((rawFiles) => {
        if (disabled || remainingSlots <= 0) return;
        const fileArray = Array.from(rawFiles).slice(0, remainingSlots);
        if (fileArray.length > 0) {
            onFilesSelected(fileArray);
        }
    }, [disabled, onFilesSelected, remainingSlots]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && remainingSlots > 0) setIsDragging(true);
    }, [disabled, remainingSlots]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleChange = useCallback((e) => {
        processFiles(e.target.files);
        // Reset input so same file can be re-selected after removal
        e.target.value = '';
    }, [processFiles]);

    const isFull = remainingSlots <= 0;
    const baseClasses = "relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-8 sm:p-12 text-center cursor-pointer min-h-[180px] sm:min-h-[220px] focus:outline-none focus:ring-4 focus:ring-brand-primary/20";
    const stateClasses = (disabled || isFull)
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
            onClick={() => {
                if (!disabled && !isFull) {
                    document.getElementById('file-upload-input')?.click();
                }
            }}
            role="button"
            tabIndex={(disabled || isFull) ? -1 : 0}
            aria-disabled={disabled || isFull}
            onKeyDown={(e) => {
                if (!disabled && !isFull && (e.key === 'Enter' || e.key === ' ')) {
                    document.getElementById('file-upload-input')?.click();
                }
            }}
        >
            <input
                id="file-upload-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleChange}
                disabled={disabled || isFull}
                accept="application/pdf,image/jpeg,image/png,image/webp,.docx"
            />
            {/* Mobile-only native camera input */}
            <input
                id="camera-upload-input"
                type="file"
                className="hidden"
                onChange={handleChange}
                disabled={disabled || isFull}
                accept="image/*"
                capture="environment"
            />

            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-brand-primary/20 text-brand-primary' : 'bg-neutral-100 text-neutral-500'}`}>
                {currentCount > 0
                    ? <Plus size={40} className={isDragging ? 'animate-bounce' : ''} />
                    : <UploadCloud size={40} className={isDragging ? 'animate-bounce' : ''} />
                }
            </div>

            {isFull ? (
                <>
                    <h3 className="text-[length:var(--font-xl)] font-bold text-neutral-900 mb-2">
                        Maximum files reached
                    </h3>
                    <p className="text-[length:var(--font-sm)] text-neutral-500">
                        You've added {MAX_FILES} files. Remove one to add another.
                    </p>
                </>
            ) : (
                <>
                    <h3 className="text-[length:var(--font-xl)] font-bold text-neutral-900 mb-2">
                        {isDragging ? 'Drop here!' : currentCount > 0 ? 'Add another document' : 'Tap to upload or drag files here'}
                    </h3>
                    <p className="text-[length:var(--font-sm)] text-neutral-500 max-w-sm mb-4">
                        {currentCount > 0
                            ? `${remainingSlots} more document${remainingSlots > 1 ? 's' : ''} allowed (max ${MAX_FILES})`
                            : `Up to ${MAX_FILES} documents — PDF, JPG, PNG, WEBP, or DOCX, max 10MB each`
                        }
                    </p>
                    
                    {/* Mobile Only: explicit Take Photo button */}
                    <button
                        type="button"
                        className="sm:hidden mt-2 flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the main div from triggering the standard picker
                            if (!disabled && !isFull) {
                                document.getElementById('camera-upload-input')?.click();
                            }
                        }}
                    >
                        <Camera size={20} />
                        Take Photo
                    </button>
                </>
            )}
        </div>
    );
}
