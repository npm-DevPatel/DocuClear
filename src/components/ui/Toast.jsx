import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toast({ type = 'info', message, onClose }) {
    const icons = {
        success: <CheckCircle className="text-brand-success" size={24} />,
        error: <AlertCircle className="text-brand-danger" size={24} />,
        warning: <AlertCircle className="text-brand-warning" size={24} />,
        info: <Info className="text-brand-primary" size={24} />
    };

    const bgColors = {
        success: 'bg-brand-successLight border-green-200',
        error: 'bg-brand-dangerLight border-red-200',
        warning: 'bg-brand-warningLight border-amber-200',
        info: 'bg-brand-primaryLight border-blue-200'
    };

    return (
        <div
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border flex shadow-lg ${bgColors[type]}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="p-4 flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                    {icons[type]}
                </div>
                <div className="flex-1 w-0">
                    <p className="text-[length:var(--font-base)] font-medium text-neutral-900">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex flex-shrink-0 flex-col">
                    <button
                        type="button"
                        className="inline-flex rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary p-1"
                        onClick={onClose}
                        aria-label="Close notification"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
