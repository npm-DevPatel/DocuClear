import React from 'react';
import { Card } from '../ui/Card';
import { TTSButton } from '../ui/TTSButton';
import { FileText } from 'lucide-react';

export function SimplifiedTextCard({ summary, isLoading }) {
    if (isLoading) {
        return (
            <Card className="p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-1/3 bg-neutral-200 rounded skeleton"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 w-full bg-neutral-100 rounded skeleton"></div>
                    <div className="h-4 w-[90%] bg-neutral-100 rounded skeleton"></div>
                    <div className="h-4 w-[95%] bg-neutral-100 rounded skeleton"></div>
                    <div className="h-4 w-2/3 bg-neutral-100 rounded skeleton"></div>
                </div>
            </Card>
        );
    }

    if (!summary) return null;

    return (
        <Card className="animate-card-enter p-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-100">
                <h2 className="text-[length:var(--font-xl)] font-bold text-neutral-900 flex items-center gap-2">
                    <FileText size={24} className="text-brand-primary" />
                    Simplified Version
                </h2>
                <TTSButton text={summary} />
            </div>
            <div className="prose prose-neutral max-w-none prose-p:text-[length:var(--font-lg)] prose-p:leading-relaxed text-neutral-800 space-y-4 whitespace-pre-wrap">
                {summary}
            </div>
        </Card>
    );
}
