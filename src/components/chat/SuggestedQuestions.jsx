import React, { useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../utils/constants';

/**
 * Generates context-aware question chips from the document's red flags and next steps.
 * Falls back to generic suggested questions if no context is available.
 *
 * @param {Object|null} documentContext - The simplifiedResult from AppContext
 * @returns {string[]} Array of 3 question strings
 */
function generateContextChips(documentContext) {
    if (!documentContext) return SUGGESTED_QUESTIONS.slice(0, 3);

    const chips = [];

    // Derive chips from red flags (urgency = deadlines, money, actions)
    const flags = documentContext.redFlags || [];
    for (const flag of flags) {
        if (!flag?.title) continue;
        const title = flag.title.toLowerCase();
        if ((title.includes('deadline') || title.includes('date') || title.includes('due')) && chips.length < 3) {
            chips.push('What is the deadline I need to act by?');
        } else if ((title.includes('fine') || title.includes('pay') || title.includes('amount') || title.includes('money') || title.includes('fee')) && chips.length < 3) {
            chips.push('Do I owe any money?');
        } else if ((title.includes('sign') || title.includes('respond') || title.includes('appear') || title.includes('action')) && chips.length < 3) {
            chips.push('What do I need to sign or respond to?');
        } else if ((title.includes('evict') || title.includes('court') || title.includes('legal')) && chips.length < 3) {
            chips.push('What are the legal consequences if I do nothing?');
        }
    }

    // Derive from next steps
    const nextSteps = documentContext.nextSteps || [];
    if (nextSteps.length > 0 && chips.length < 3) {
        chips.push('What should I do first?');
    }

    // Always offer a catch-all
    if (chips.length < 3) {
        chips.push('Can you explain this document more simply?');
    }
    if (chips.length < 3) {
        chips.push('Is there anything urgent I should know?');
    }
    if (chips.length < 3) {
        chips.push('Who do I contact if I have questions?');
    }

    // Deduplicate and return first 3
    return [...new Set(chips)].slice(0, 3);
}

export function SuggestedQuestions({ onSelect, disabled, documentContext }) {
    const chips = useMemo(() => generateContextChips(documentContext), [documentContext]);

    return (
        <div className="w-full mt-4 mb-2 animate-card-enter">
            <h3 className="text-[length:var(--font-sm)] font-bold text-neutral-500 mb-3 px-2 uppercase tracking-wider">
                Tap a question to ask
            </h3>
            <div className="flex flex-wrap gap-2">
                {chips.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(q)}
                        disabled={disabled}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-primaryLight/50 hover:bg-brand-primaryLight text-brand-primaryText rounded-full text-[length:var(--font-sm)] sm:text-[length:var(--font-base)] font-medium transition-colors border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-left focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <MessageCircle size={16} className="flex-shrink-0 opacity-70" />
                        <span>{q}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
