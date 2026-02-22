import React from 'react';
import { AlertTriangle, Clock, Activity, ShieldAlert, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatDisplayDate } from '../../utils/dateUtils';

export function RedFlagAlert({ flags = [] }) {
    if (!flags || flags.length === 0) return null;

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
                {flags.map((flag, idx) => (
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
                        {/* Consumer could render CalendarAddButton here by passing as children to a generic row component, but for now we simply render flags. */}
                    </li>
                ))}
            </ul>
        </Card>
    );
}
