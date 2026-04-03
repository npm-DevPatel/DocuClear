import React from 'react';
import { Card } from '../ui/Card';
import { TTSButton } from '../ui/TTSButton';
import { BookOpen } from 'lucide-react';

export function SimplifiedTextCard({ summary, isLoading }) {
    if (isLoading) {
        return (
            <Card className="p-6 relative overflow-hidden bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-1/3 bg-blue-200 rounded skeleton" />
                </div>
                <div className="space-y-3">
                    <div className="h-5 w-full bg-blue-100 rounded skeleton" />
                    <div className="h-5 w-[90%] bg-blue-100 rounded skeleton" />
                    <div className="h-5 w-[95%] bg-blue-100 rounded skeleton" />
                    <div className="h-5 w-2/3 bg-blue-100 rounded skeleton" />
                </div>
            </Card>
        );
    }

    if (!summary) return null;

    return (
        <Card className="animate-card-enter p-6 bg-blue-50 border border-blue-200" style={{ '--card-index': 1 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-blue-200">
                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-[length:var(--font-xl)] font-bold text-blue-900">
                        Simple Explanation
                    </h2>
                    <p className="text-[length:var(--font-sm)] text-blue-700 font-medium">
                        Written in plain, everyday language
                    </p>
                </div>
                {/* Prominent TTS button */}
                <TTSButton text={summary} />
            </div>

            {/* Summary text — large, high contrast, generous line-height */}
            <div className="text-neutral-800 space-y-4 whitespace-pre-wrap leading-relaxed text-[length:var(--font-xl)]">
                {summary}
            </div>
        </Card>
    );
}
