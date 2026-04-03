import React, { useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

/**
 * Invisible component that applies accessibility settings
 * to the global document object (html element).
 *
 * Classes MUST be on <html> because:
 *  - CSS uses `html.dark-mode` / `html.high-contrast` selectors
 *  - Tailwind darkMode: ['class', '[class~="dark-mode"]'] targets the html element
 */
export function AccessibilityController() {
    const { state } = useAppContext();
    const { fontSize, darkMode, highContrast } = state.accessibilitySettings;

    useEffect(() => {
        const html = document.documentElement; // <-- MUST be html, not body

        // 1. Handle Dark Mode — toggles `html.dark-mode`
        if (darkMode) {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }

        // 2. Handle High Contrast — toggles `html.high-contrast`
        if (highContrast) {
            html.classList.add('high-contrast');
        } else {
            html.classList.remove('high-contrast');
        }

        // 3. Handle Font Scaling via CSS variable
        html.style.setProperty('--font-scale', fontSize.toString());

        // Cleanup on unmount
        return () => {
            html.classList.remove('dark-mode');
            html.classList.remove('high-contrast');
            html.style.removeProperty('--font-scale');
        };
    }, [fontSize, darkMode, highContrast]);

    return null;
}
