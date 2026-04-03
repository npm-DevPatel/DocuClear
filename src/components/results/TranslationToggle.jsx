// src/components/results/TranslationToggle.jsx
// Antigravity Agent — §6.2 implementation
// Triggers a fresh Swahili Gemini call if swahiliResult is not already cached.

import React from 'react';
import { Languages } from 'lucide-react';
import { useAppContext, APP_ACTIONS } from '../../hooks/useAppContext';
import { translateResult } from '../../services/GeminiService.js';

export function TranslationToggle() {
    const { state, dispatch, addToast } = useAppContext();
    const { activeLanguage, swahiliResult, swahiliLoading, simplifiedResult, extractedText } = state;

    const handleLanguageSwitch = async (lang) => {
        // No-op if already on this language or a Swahili analysis is in progress
        if (lang === activeLanguage || swahiliLoading) return;

        dispatch({ type: APP_ACTIONS.SET_ACTIVE_LANGUAGE, payload: lang });

        // If switching to Swahili and we don't have a cached result yet — trigger analysis
        if (lang === 'sw' && !swahiliResult) {
            dispatch({ type: APP_ACTIONS.SET_SWAHILI_LOADING, payload: true });

            try {
                // MASSIVE TOKEN SAVINGS: Instead of throwing the massive raw OCR text back at Gemini
                // for a full re-analysis, we just pass the small English JSON and ask for a direct translation.
                if (!simplifiedResult) throw new Error('No English result to translate');
                const translated = await translateResult(simplifiedResult);
                dispatch({ type: APP_ACTIONS.SET_SWAHILI_RESULT, payload: translated });
            } catch (error) {
                console.error('[TranslationToggle] Swahili analysis failed:', error);
                // Swahili-language error toast as specified in §6.2
                if (addToast) {
                    addToast({
                        type: 'error',
                        message: 'Hatukuweza kutafsiri sasa hivi. Tafadhali jaribu tena.',
                    });
                }
                // Revert language back to English on failure
                dispatch({ type: APP_ACTIONS.SET_ACTIVE_LANGUAGE, payload: 'en' });
                dispatch({ type: APP_ACTIONS.SET_SWAHILI_LOADING, payload: false });
            }
        }
    };

    return (
        <div
            className="flex items-center gap-3 bg-white border border-neutral-200 p-1.5 rounded-xl shadow-sm w-fit animate-card-enter"
            style={{ '--card-index': 2 }}
        >
            <div className="pl-3 pr-2 flex items-center text-neutral-500">
                {swahiliLoading
                    ? <span className="animate-spin inline-block w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full" aria-label="Translating…" />
                    : <Languages size={20} />
                }
            </div>
            <button
                onClick={() => handleLanguageSwitch('en')}
                disabled={swahiliLoading}
                className={`px-4 py-2 rounded-lg text-[length:var(--font-sm)] font-bold transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-60 ${activeLanguage === 'en' ? 'bg-brand-primary text-white shadow' : 'text-neutral-600 hover:bg-neutral-100'}`}
                aria-pressed={activeLanguage === 'en'}
            >
                English
            </button>
            <button
                onClick={() => handleLanguageSwitch('sw')}
                disabled={swahiliLoading}
                className={`px-4 py-2 rounded-lg text-[length:var(--font-sm)] font-bold transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-60 ${activeLanguage === 'sw' ? 'bg-brand-primary text-white shadow' : 'text-neutral-600 hover:bg-neutral-100'}`}
                aria-pressed={activeLanguage === 'sw'}
            >
                {swahiliLoading && activeLanguage !== 'sw' ? 'Translating…' : 'Kiswahili'}
            </button>
        </div>
    );
}
