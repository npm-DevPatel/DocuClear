// Simplified, just sets active language globally
import React from 'react';
import { Languages } from 'lucide-react';
import { useAppContext, APP_ACTIONS } from '../../hooks/useAppContext';

export function TranslationToggle() {
    const { state, dispatch } = useAppContext();
    const { activeLanguage } = state;

    const toggleLang = () => {
        dispatch({
            type: APP_ACTIONS.SET_ACTIVE_LANGUAGE,
            payload: activeLanguage === 'en' ? 'sw' : 'en'
        });
    };

    return (
        <div className="flex items-center gap-3 bg-white border border-neutral-200 p-1.5 rounded-xl shadow-sm w-fit animate-card-enter" style={{ '--card-index': 2 }}>
            <div className="pl-3 pr-2 flex items-center text-neutral-500">
                <Languages size={20} />
            </div>
            <button
                onClick={() => activeLanguage !== 'en' && toggleLang()}
                className={`px-4 py-2 rounded-lg text-[length:var(--font-sm)] font-bold transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${activeLanguage === 'en' ? 'bg-brand-primary text-white shadow' : 'text-neutral-600 hover:bg-neutral-100'}`}
                aria-pressed={activeLanguage === 'en'}
            >
                English
            </button>
            <button
                onClick={() => activeLanguage !== 'sw' && toggleLang()}
                className={`px-4 py-2 rounded-lg text-[length:var(--font-sm)] font-bold transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${activeLanguage === 'sw' ? 'bg-brand-primary text-white shadow' : 'text-neutral-600 hover:bg-neutral-100'}`}
                aria-pressed={activeLanguage === 'sw'}
            >
                Kiswahili
            </button>
        </div>
    );
}
