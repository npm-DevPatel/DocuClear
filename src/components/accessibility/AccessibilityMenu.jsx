import React, { useState } from 'react';
import { Settings2, Sun, Moon, Type, ShieldAlert, RotateCcw, X } from 'lucide-react';
import { useAppContext, APP_ACTIONS } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';

export function AccessibilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { state, dispatch } = useAppContext();
    const { fontSize, darkMode, highContrast } = state.accessibilitySettings;

    const toggleSetting = (key, value) => {
        dispatch({
            type: APP_ACTIONS.SET_ACCESSIBILITY_SETTING,
            payload: { [key]: value }
        });
    };

    const handleReset = () => {
        dispatch({ type: APP_ACTIONS.RESET_ACCESSIBILITY });
    };

    return (
        <div className="fixed bottom-24 sm:bottom-8 left-5 z-50">
            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 rounded-full sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transition-all duration-300
                    ${isOpen 
                        ? 'bg-neutral-800 text-white rotate-90 scale-90' 
                        : 'bg-[color:var(--color-card-bg)] text-neutral-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-800'
                    }
                    border-2 border-brand-primary/10 hover:border-brand-primary/30
                `}
                aria-label="Accessibility settings"
                title="Ease of Use Settings (Font, Contrast, Dark Mode)"
            >
                {isOpen ? <X size={24} /> : <Settings2 size={24} className="text-brand-primary" />}
            </button>

            {/* Panel */}
            {isOpen && (
                <>
                    {/* Dark backdrop for mobile */}
                    <div 
                        className="fixed inset-0 bg-black/5 sm:hidden z-[-1]" 
                        onClick={() => setIsOpen(false)} 
                    />
                    
                    <Card 
                        className="absolute bottom-16 left-0 w-[280px] sm:w-[320px] p-6 shadow-2xl animate-[slideUp_0.2s_ease-out] border border-neutral-100 dark:border-neutral-700"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[length:var(--font-lg)] font-bold text-neutral-900 dark:text-white">
                                Ease of Use
                            </h2>
                            <button 
                                onClick={handleReset}
                                className="p-2 text-neutral-400 hover:text-brand-primary hover:bg-brand-primaryLight rounded-lg transition-colors"
                                title="Reset all settings"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Font Size Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[length:var(--font-sm)] font-bold uppercase tracking-wider">
                                    <Type size={16} />
                                    <span>Text Size</span>
                                </div>
                                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl gap-1">
                                    {[1.0, 1.25, 1.5].map((scale) => (
                                        <button
                                            key={scale}
                                            onClick={() => toggleSetting('fontSize', scale)}
                                            className={`
                                                flex-1 py-2 text-[length:var(--font-sm)] font-bold rounded-lg transition-all
                                                ${fontSize === scale 
                                                    ? 'bg-white dark:bg-neutral-700 text-brand-primary shadow-sm' 
                                                    : 'text-neutral-500 hover:bg-white/50'
                                                }
                                            `}
                                        >
                                            {scale === 1.0 ? 'Default' : scale === 1.25 ? 'Large' : 'Huge'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contrast Setting */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[length:var(--font-sm)] font-bold uppercase tracking-wider">
                                    <ShieldAlert size={16} />
                                    <span>Visual Support</span>
                                </div>
                                <button
                                    onClick={() => toggleSetting('highContrast', !highContrast)}
                                    className={`
                                        w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all
                                        ${highContrast 
                                            ? 'bg-yellow-100 border-yellow-400 text-yellow-900' 
                                            : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }
                                    `}
                                >
                                    <span className="font-bold text-[length:var(--font-sm)]">Stark Contrast (AAA)</span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-yellow-500' : 'bg-neutral-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${highContrast ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </button>
                            </div>

                            {/* Dark Mode */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[length:var(--font-sm)] font-bold uppercase tracking-wider">
                                    {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                                    <span>Appearance</span>
                                </div>
                                <button
                                    onClick={() => toggleSetting('darkMode', !darkMode)}
                                    className={`
                                        w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all
                                        ${darkMode 
                                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                                            : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }
                                    `}
                                >
                                    <span className="font-bold text-[length:var(--font-sm)]">Night Mode</span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-brand-primary' : 'bg-neutral-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </Card>
                </>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
