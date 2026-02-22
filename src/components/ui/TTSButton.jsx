import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speak, stopSpeaking } from '../../services/TTSService';
import { Button } from './Button';

export function TTSButton({ text, lang = 'en-GB' }) {
    const [isPlaying, setIsPlaying] = useState(false);

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
                console.error('TTS Error:', err);
            } finally {
                setIsPlaying(false);
            }
        }
    };

    return (
        <Button
            variant={isPlaying ? "danger" : "secondary"}
            onClick={handleToggle}
            className="gap-2"
            aria-label={isPlaying ? "Stop reading aloud" : "Read aloud"}
        >
            {isPlaying ? (
                <>
                    <Square size={20} className="fill-current" />
                    <span>Stop</span>
                </>
            ) : (
                <>
                    <Volume2 size={20} />
                    <span>Read Aloud</span>
                </>
            )}
        </Button>
    );
}
