import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ValidationBanner({ error }) {
    if (!error) return null;

    return (
        <div className="flex items-start gap-3 p-4 bg-brand-dangerLight border-2 border-red-300 rounded-xl animate-toastIn mb-6" role="alert">
            <AlertCircle className="text-brand-danger flex-shrink-0 mt-0.5" size={24} />
            <div>
                <h4 className="text-[length:var(--font-base)] font-bold text-brand-dangerText mb-1">
                    Hmm, we can't accept that file
                </h4>
                <p className="text-[length:var(--font-sm)] text-brand-dangerText">
                    {error}
                </p>
            </div>
        </div>
    );
}
