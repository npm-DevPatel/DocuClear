import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatRelativeDate } from '../../utils/dateUtils';
import { DOC_TYPES } from '../../utils/constants';

export function HistoryCard({ item, onClick, onDelete }) {
    const docType = DOC_TYPES[item.documentType] || DOC_TYPES.general;

    return (
        <Card
            variant="default"
            className="p-0 transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-md animate-card-enter group"
        >
            <div
                className="p-4 sm:p-5 flex items-center gap-4 cursor-pointer focus:outline-none focus:bg-neutral-50"
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            >
                <div className="w-12 h-12 rounded-full bg-brand-primaryLight text-brand-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-brand-primary/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-[length:var(--font-base)] font-bold text-neutral-900 truncate mb-1">
                        {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[length:var(--font-sm)] font-medium text-neutral-500">
                            {formatRelativeDate(item.createdAt)}
                        </span>
                        {item.redFlags?.length > 0 && (
                            <Badge variant="danger" className="text-xs py-0.5 px-2">
                                {item.redFlags.length} Flags
                            </Badge>
                        )}
                        <Badge variant="neutral" className="text-xs py-0.5 px-2">
                            {docType.label}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-2 sm:p-3 text-neutral-400 hover:text-brand-danger hover:bg-brand-dangerLight rounded-full transition-colors focus:ring-2 focus:ring-brand-danger focus:outline-none opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:flex"
                        aria-label={`Delete ${item.name}`}
                    >
                        <Trash2 size={20} />
                    </button>
                    <ChevronRight size={24} className="text-neutral-300 group-hover:text-brand-primary transition-colors" />
                </div>
            </div>
        </Card>
    );
}
