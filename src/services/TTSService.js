// TTSService.js — SCAFFOLD ONLY
// Teammate 3: Implement all TODO sections below
// API: Web Speech API — window.speechSynthesis (built-in, zero cost)

/**
 * Returns true if the browser supports Web Speech API
 */
export function isSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Speaks the given text aloud using the browser's speech synthesis.
 * @param {string} text - The text to speak
 * @param {TTSOptions} options - Configuration options
 * @returns {Promise<void>} Resolves when speech ends, rejects on error
 */
export async function speak(text, options = {}) {
    if (!isSupported()) {
        throw new Error('Text-to-Speech is not supported in this browser.');
    }

    // Cancel any ongoing speech before starting new
    window.speechSynthesis.cancel();

    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.rate = options.rate ?? 0.85;
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 1.0;
        
        // Voice Selection Logic
        const targetLang = options.lang || 'en';
        const isSwahili = targetLang.startsWith('sw');
        
        // Provide standard language hints to the engine
        utterance.lang = isSwahili ? 'sw-KE' : 'en-GB';

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            let selectedVoice = null;
            
            if (isSwahili) {
                // Try to find an exact Swahili voice
                selectedVoice = voices.find(v => v.lang.startsWith('sw'));
            } else {
                // Try to find a Kenyan English voice, fallback to British, fallback to any English
                selectedVoice = voices.find(v => v.lang === 'en-KE') 
                    || voices.find(v => v.lang === 'en-GB')
                    || voices.find(v => v.lang.startsWith('en'));
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => {
            // If the user manually cancelled it, don't treat it as a crash
            if (e.error === 'canceled' || e.error === 'interrupted') {
                resolve();
            } else {
                reject(e);
            }
        };

        window.speechSynthesis.speak(utterance);
    });
}

export function stopSpeaking() {
    if (isSupported()) {
        window.speechSynthesis.cancel();
    }
}

export function isSpeaking() {
    return isSupported() ? window.speechSynthesis.speaking : false;
}

export function getAvailableVoices() {
    return isSupported() ? window.speechSynthesis.getVoices() : [];
}

/**
 * @typedef {Object} TTSOptions
 * @property {number} [rate] - Speech rate, 0.1-10. Default: 0.85
 * @property {number} [pitch] - Pitch, 0-2. Default: 1.0
 * @property {number} [volume] - Volume, 0-1. Default: 1.0
 * @property {string} [lang] - BCP47 language tag. Default: 'en-GB'
 */
