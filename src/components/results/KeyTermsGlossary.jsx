import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/Card';

export function KeyTermsGlossary({ terms = [] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!terms || terms.length === 0) return null;

    return (
        <Card className="animate-card-enter p-0" style={{ '--card-index': 1 }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 sm:p-6 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-brand-primary"
                aria-expanded={isExpanded}
                aria-controls="glossary-content"
            >
                <div className="flex items-center gap-2 text-neutral-900">
                    <BookOpen size={24} className="text-brand-primary" />
                    <h3 className="text-[length:var(--font-lg)] font-bold">Key Terms Explained</h3>
                    <span className="bg-neutral-100 text-neutral-600 text-[length:var(--font-xs)] py-0.5 px-2 rounded-full font-medium ml-2">
                        {terms.length}
                    </span>
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-neutral-500" /> : <ChevronDown size={20} className="text-neutral-500" />}
            </button>

            {isExpanded && (
                <div id="glossary-content" className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-neutral-100">
                    <dl className="space-y-4 mt-4">
                        {terms.map((item, idx) => (
                            <div key={idx} className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                <dt className="text-[length:var(--font-base)] font-bold text-neutral-900 mb-1">{item.term}</dt>
                                <dd className="text-[length:var(--font-sm)] text-neutral-700 leading-relaxed">{item.definition}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </Card>
    );
}
