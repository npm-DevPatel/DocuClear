import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const STEP_COLORS = [
    { bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { bg: 'bg-blue-500',    light: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700'    },
    { bg: 'bg-purple-500',  light: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-700'  },
    { bg: 'bg-amber-500',   light: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
    { bg: 'bg-rose-500',    light: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700'    },
];

export function NextStepsCard({ steps = [] }) {
    const [showAll, setShowAll] = useState(false);

    if (!steps || steps.length === 0) return null;

    const visibleSteps = showAll ? steps : steps.slice(0, 3);
    const hasMore = steps.length > 3;

    return (
        <Card className="animate-card-enter p-6 bg-emerald-50 border border-emerald-200" style={{ '--card-index': 2 }}>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-emerald-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={22} className="text-white" />
                </div>
                <div>
                    <h2 className="text-[length:var(--font-xl)] font-bold text-emerald-900">
                        What You Need To Do
                    </h2>
                    <p className="text-[length:var(--font-sm)] text-emerald-700 font-medium">
                        Clear, actionable steps based on your document
                    </p>
                </div>
            </div>

            <ol className="space-y-4">
                {visibleSteps.map((step, index) => {
                    const color = STEP_COLORS[index % STEP_COLORS.length];
                    return (
                        <li
                            key={index}
                            className={`flex items-start gap-4 p-4 rounded-xl border ${color.light} ${color.border}`}
                        >
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-[length:var(--font-base)]`}>
                                {index + 1}
                            </span>
                            <p className={`text-[length:var(--font-lg)] font-medium leading-relaxed ${color.text} flex-1 pt-0.5`}>
                                {step}
                            </p>
                        </li>
                    );
                })}
            </ol>

            {hasMore && (
                <button
                    onClick={() => setShowAll(v => !v)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-emerald-700 font-bold text-[length:var(--font-sm)] rounded-xl hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    {showAll ? (
                        <><ChevronUp size={18} /> Show fewer steps</>
                    ) : (
                        <><ChevronDown size={18} /> Show all {steps.length} steps</>
                    )}
                </button>
            )}
        </Card>
    );
}
