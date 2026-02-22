import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatInput({ onSendMessage, disabled }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !disabled) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full mx-auto items-end bg-white p-2 sm:p-3 rounded-2xl border-2 border-neutral-200 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/20 transition-all shadow-sm">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                disabled={disabled}
                placeholder="Ask a question about your document..."
                className="w-full bg-transparent resize-none border-0 focus:ring-0 p-2 text-[length:var(--font-base)] max-h-32 min-h-[44px] sm:min-h-[52px]"
                rows={1}
                aria-label="Chat input"
            />
            <button
                type="submit"
                disabled={disabled || !text.trim()}
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                aria-label="Send message"
            >
                <Send size={24} className="ml-1" />
            </button>
        </form>
    );
}
