import React from 'react';
import { Type } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SCALE_STEPS, FONT_SCALE_LABELS } from '../../utils/constants';

export function FontScaleControl() {
    const { theme, setFontScale } = useTheme();

    const currentIndex = FONT_SCALE_STEPS.indexOf(theme.fontScale);
    const currentLabel = FONT_SCALE_LABELS[currentIndex] || 'Normal';

    const increase = () => {
        if (currentIndex < FONT_SCALE_STEPS.length - 1) {
            setFontScale(FONT_SCALE_STEPS[currentIndex + 1]);
        }
    };

    const decrease = () => {
        if (currentIndex > 0) {
            setFontScale(FONT_SCALE_STEPS[currentIndex - 1]);
        }
    };

    return (
        <div className="flex items-center gap-3 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200">
            <Type size={18} className="text-neutral-500" />
            <div className="flex items-center gap-2">
                <button
                    onClick={decrease}
                    disabled={currentIndex <= 0}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200 disabled:opacity-50 text-[length:var(--font-lg)] font-bold focus:ring-2 focus:ring-brand-primary"
                    aria-label="Decrease text size"
                >
                    -
                </button>
                <span className="min-w-[4rem] text-center text-[length:var(--font-sm)] font-medium" aria-live="polite">
                    {currentLabel}
                </span>
                <button
                    onClick={increase}
                    disabled={currentIndex >= FONT_SCALE_STEPS.length - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200 disabled:opacity-50 text-[length:var(--font-lg)] font-bold focus:ring-2 focus:ring-brand-primary"
                    aria-label="Increase text size"
                >
                    +
                </button>
            </div>
        </div>
    );
}
