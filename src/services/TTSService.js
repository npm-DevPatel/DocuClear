// TTSService.js — SCAFFOLD ONLY
// Teammate 3: Implement all TODO sections below
// API: Web Speech API — window.speechSynthesis (built-in, zero cost)

/**
 * Speaks the given text aloud using the browser's speech synthesis.
 * @param {string} text - The text to speak
 * @param {TTSOptions} options - Configuration options
 * @returns {Promise<void>} Resolves when speech ends, rejects on error
 */
export async function speak(text, options = {}) {
    // TODO (Teammate 3):
    // 1. Check if window.speechSynthesis exists; throw TTSNotSupportedError if not
    // 2. Cancel any ongoing speech: window.speechSynthesis.cancel()
    // 3. Create a new SpeechSynthesisUtterance(text)
    // 4. Configure the utterance:
    //    - utterance.rate = options.rate ?? 0.85
    //    - utterance.pitch = options.pitch ?? 1.0
    //    - utterance.volume = options.volume ?? 1.0
    //    - utterance.lang = options.lang ?? 'en-GB'
    // 5. Select the best available voice
    // 6. Set utterance.onend and utterance.onerror callbacks
    // 7. window.speechSynthesis.speak(utterance)

    throw new Error('TODO: TTSService.speak not yet implemented by Teammate 3');
}

export function stopSpeaking() {
    // window.speechSynthesis.cancel()
    throw new Error('TODO: TTSService.stopSpeaking not yet implemented');
}

export function isSpeaking() {
    // return window.speechSynthesis.speaking
    throw new Error('TODO: TTSService.isSpeaking not yet implemented');
}

export function getAvailableVoices() {
    // return window.speechSynthesis.getVoices()
    throw new Error('TODO: TTSService.getAvailableVoices not yet implemented');
}

/**
 * @typedef {Object} TTSOptions
 * @property {number} [rate] - Speech rate, 0.1-10. Default: 0.85
 * @property {number} [pitch] - Pitch, 0-2. Default: 1.0
 * @property {number} [volume] - Volume, 0-1. Default: 1.0
 * @property {string} [lang] - BCP47 language tag. Default: 'en-GB'
 */
