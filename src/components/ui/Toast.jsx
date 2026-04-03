import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
    success: <CheckCircle className="text-brand-success" size={22} />,
    error:   <AlertCircle className="text-brand-danger"  size={22} />,
    warning: <AlertCircle className="text-brand-warning" size={22} />,
    info:    <Info        className="text-brand-primary" size={22} />,
};

const BG_COLORS = {
    success: 'bg-brand-successLight border-green-200',
    error:   'bg-brand-dangerLight  border-red-200',
    warning: 'bg-brand-warningLight border-amber-200',
    info:    'bg-brand-primaryLight border-blue-200',
};

// Duration each toast is visible (ms). Errors stay longer.
const DURATIONS = {
    success: 4000,
    warning: 5000,
    info:    4500,
    error:   7000,
};

export function Toast({ type = 'info', message, onClose }) {
    const [visible, setVisible] = useState(true);
    const duration = DURATIONS[type] ?? 5000;

    // Auto-dismiss after `duration` ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            // Give fade-out animation time before removing from DOM
            setTimeout(onClose, 350);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            role="alert"
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            className={`
                pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border flex shadow-lg
                transition-all duration-350 ease-in-out
                ${BG_COLORS[type]}
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
        >
            {/* Countdown progress bar at the bottom */}
            <div
                className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 rounded-full"
                style={{
                    animation: `shrink ${duration}ms linear forwards`,
                    width: '100%',
                }}
            />

            <div className="p-4 flex items-start gap-3 w-full relative">
                <div className="flex-shrink-0 mt-0.5">
                    {ICONS[type]}
                </div>
                <div className="flex-1 w-0">
                    <p className="text-[length:var(--font-sm)] sm:text-[length:var(--font-base)] font-medium text-neutral-900 leading-snug">
                        {message}
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex flex-shrink-0 rounded-md text-neutral-400 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary p-1 transition-colors"
                    onClick={() => { setVisible(false); setTimeout(onClose, 350); }}
                    aria-label="Dismiss notification"
                >
                    <X size={18} />
                </button>
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
        </div>
    );
}
