import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, footer }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // prevent bg scroll
            // Focus trap basic
            modalRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-page-enter">
            <div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col focus:outline-none"
            >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-neutral-100">
                    <h2 id="modal-title" className="text-[length:var(--font-xl)] font-bold text-neutral-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        aria-label="Close dialog"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="p-4 sm:p-6 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
