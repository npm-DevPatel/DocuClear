import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../utils/constants';

export function SuggestedQuestions({ onSelect, disabled }) {
    return (
        <div className="w-full mt-4 mb-2 animate-card-enter">
            <h3 className="text-[length:var(--font-sm)] font-bold text-neutral-500 mb-3 px-2 uppercase tracking-wider">
                Suggested Questions
            </h3>
            <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(q)}
                        disabled={disabled}
                        className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-brand-primaryLight/50 hover:bg-brand-primaryLight text-brand-primaryText rounded-full text-[length:var(--font-sm)] sm:text-[length:var(--font-base)] font-medium transition-colors border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-left focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <MessageCircle size={16} className="flex-shrink-0 opacity-70" />
                        <span>{q}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
