import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function AutoDeleteBanner({ days, onChangeClick }) {
    return (
        <div className="flex items-start sm:items-center justify-between gap-4 bg-brand-successLight border border-green-200 p-4 sm:p-5 rounded-xl mb-6 flex-col sm:flex-row shadow-sm">
            <div className="flex items-start gap-3">
                <ShieldCheck className="text-brand-success flex-shrink-0 mt-0.5" size={28} />
                <div>
                    <h4 className="text-[length:var(--font-base)] font-bold text-brand-successText mb-1">
                        Your Privacy is Protected
                    </h4>
                    <p className="text-[length:var(--font-sm)] text-brand-successText opacity-90 leading-relaxed">
                        Documents are automatically and permanently deleted after <span className="font-bold">{days} days</span>.
                    </p>
                </div>
            </div>
            <button
                onClick={onChangeClick}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-brand-successText border border-green-200 rounded-lg text-[length:var(--font-sm)] font-bold hover:bg-green-50 transition-colors focus:ring-2 focus:ring-brand-success focus:outline-none whitespace-nowrap shadow-sm"
            >
                Change Limits
            </button>
        </div>
    );
}
