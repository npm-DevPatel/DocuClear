import React, { useState } from 'react';
import { AlertTriangle, Clock, Activity, ShieldAlert, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatDisplayDate } from '../../utils/dateUtils';

export function RedFlagAlert({ flags = [] }) {
    const [showAll, setShowAll] = useState(false);

    if (!flags || flags.length === 0) return null;

    const visibleFlags = showAll ? flags : flags.slice(0, 2);
    const hasMore = flags.length > 2;

    const getIcon = (type) => {
        switch (type) {
            case 'deadline': return <Clock size={20} className="mt-0.5" />;
            case 'action_required': return <Activity size={20} className="mt-0.5" />;
            case 'legal_consequence': return <ShieldAlert size={20} className="mt-0.5" />;
            case 'financial': return <DollarSign size={20} className="mt-0.5" />;
            default: return <AlertTriangle size={20} className="mt-0.5" />;
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'high': return 'text-brand-danger bg-brand-dangerLight/50 p-3 rounded-lg flex items-start gap-3';
            case 'medium': return 'text-brand-warningText bg-brand-warningLight p-3 rounded-lg flex items-start gap-3';
            case 'low': return 'text-brand-primaryText bg-brand-primaryLight p-3 rounded-lg flex items-start gap-3';
            default: return 'text-neutral-700 bg-neutral-100 p-3 rounded-lg flex items-start gap-3';
        }
    };

    return (
        <Card variant="alert-warning" className="animate-card-enter border-x-4 border-x-brand-warning">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={24} className="text-brand-warning" />
                <h3 className="text-[length:var(--font-lg)] font-bold text-neutral-900">
                    Important Items to Note
                </h3>
            </div>

            <ul className="space-y-3">
                {visibleFlags.map((flag, idx) => (
                    <li key={idx} className={getSeverityStyle(flag.severity)}>
                        <span className="flex-shrink-0">{getIcon(flag.type)}</span>
                        <div className="flex-1">
                            <p className="text-[length:var(--font-base)] font-medium">
                                {flag.description}
                            </p>
                            {flag.date && (
                                <p className="text-[length:var(--font-sm)] font-bold mt-1 opacity-90">
                                    Due: {formatDisplayDate(flag.date)}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {hasMore && (
                <button
                    onClick={() => setShowAll(v => !v)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-brand-warningText font-bold text-[length:var(--font-sm)] rounded-xl hover:bg-brand-warningLight transition-colors focus:outline-none focus:ring-2 focus:ring-brand-warning focus:ring-opacity-50"
                >
                    {showAll ? (
                        <><ChevronUp size={18} /> Show fewer items</>
                    ) : (
                        <><ChevronDown size={18} /> Show all {flags.length} items</>
                    )}
                </button>
            )}
        </Card>
    );
}
