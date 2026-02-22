import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, LIMITS } from '../../utils/constants';

export function GuestModeBanner({ count }) {
    const navigate = useNavigate();
    const remaining = Math.max(0, LIMITS.GUEST_MAX_DOCUMENTS - count);

    return (
        <div className="bg-neutral-800 text-white px-4 py-3 pb-4 sm:pb-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-page-enter relative z-20 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="p-1 rounded bg-brand-warning/20">
                    <AlertCircle size={20} className="text-brand-warning" />
                </div>
                <p className="text-[length:var(--font-sm)] sm:text-[length:var(--font-base)] font-medium">
                    Guest Mode: <span className="font-bold text-brand-warning">{remaining}</span> {remaining === 1 ? 'document' : 'documents'} remaining
                </p>
            </div>
            <button
                onClick={() => navigate(ROUTES.AUTH)}
                className="w-full sm:w-auto px-5 py-2 bg-white text-neutral-900 rounded-lg text-[length:var(--font-base)] font-bold hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white outline-none"
            >
                Sign In to Save
            </button>
        </div>
    );
}
