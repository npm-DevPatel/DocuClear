import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ContrastToggle() {
    const { theme, toggleHighContrast } = useTheme();

    return (
        <button
            onClick={toggleHighContrast}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-brand-primary"
            aria-pressed={theme.isHighContrast}
        >
            {theme.isHighContrast ? <Sun size={24} /> : <Moon size={24} />}
            <span className="text-[length:var(--font-base)] font-medium">
                {theme.isHighContrast ? 'Normal Contrast' : 'High Contrast'}
            </span>
        </button>
    );
}
