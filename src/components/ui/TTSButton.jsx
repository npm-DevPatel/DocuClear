import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speak, stopSpeaking, isSupported } from '../../services/TTSService';

export function TTSButton({ text, lang = 'en-GB' }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        setSupported(isSupported());
    }, []);

    // Stop speech on unmount
    useEffect(() => {
        return () => {
            if (isPlaying) stopSpeaking();
        };
    }, [isPlaying]);

    const handleToggle = async () => {
        if (isPlaying) {
            stopSpeaking();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            try {
                await speak(text, { lang });
            } catch (err) {
                console.warn('[TTSButton] TTS Error:', err);
            } finally {
                setIsPlaying(false);
            }
        }
    };

    if (!supported) return null;

    return (
        <button
            onClick={handleToggle}
            aria-label={isPlaying ? 'Stop reading aloud' : 'Read this aloud'}
            className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[length:var(--font-base)]
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200
                ${isPlaying
                    ? 'bg-red-100 text-red-700 border-2 border-red-300 focus:ring-red-500'
                    : 'bg-brand-primary text-white border-2 border-brand-primary hover:bg-brand-primary/90 focus:ring-brand-primary shadow-sm hover:shadow-md'
                }
            `}
        >
            {/* Pulsing ring while playing */}
            {isPlaying && (
                <span className="absolute inset-0 rounded-xl animate-ping bg-red-300 opacity-40 pointer-events-none" />
            )}

            {isPlaying ? (
                <>
                    <Square size={18} className="fill-current flex-shrink-0" />
                    <span>Stop</span>
                </>
            ) : (
                <>
                    <Volume2 size={18} className="flex-shrink-0" />
                    <span className="hidden sm:inline">Read Aloud</span>
                    <span className="sm:hidden">Listen</span>
                </>
            )}
        </button>
    );
}
