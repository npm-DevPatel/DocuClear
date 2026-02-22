import React, { createContext, useState, useEffect } from 'react';

const THEME_PREFS_KEY = 'docuclear_theme_prefs';

const defaultThemeState = {
    fontScale: 1.0,
    isHighContrast: false,
    reducedMotion: false,
    colorBlindMode: 'none',
};

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const stored = localStorage.getItem(THEME_PREFS_KEY);
            if (stored) return { ...defaultThemeState, ...JSON.parse(stored) };
        } catch {
            // ignore
        }
        return defaultThemeState;
    });

    useEffect(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e) => {
            setTheme(prev => ({ ...prev, reducedMotion: e.matches }));
        };

        setTheme(prev => ({ ...prev, reducedMotion: reducedMotionQuery.matches }));

        reducedMotionQuery.addEventListener('change', handleMotionChange);
        return () => reducedMotionQuery.removeEventListener('change', handleMotionChange);
    }, []);

    useEffect(() => {
        localStorage.setItem(THEME_PREFS_KEY, JSON.stringify(theme));

        document.documentElement.style.setProperty('--font-scale', theme.fontScale);

        if (theme.isHighContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [theme]);

    const setFontScale = (scale) => setTheme(prev => ({ ...prev, fontScale: scale }));
    const toggleHighContrast = () => setTheme(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }));
    const setColorBlindMode = (mode) => setTheme(prev => ({ ...prev, colorBlindMode: mode }));

    return (
        <ThemeContext.Provider value={{ theme, setFontScale, toggleHighContrast, setColorBlindMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
