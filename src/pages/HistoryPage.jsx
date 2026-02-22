import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { HistoryCard } from '../components/history/HistoryCard';
import { AutoDeleteBanner } from '../components/history/AutoDeleteBanner';
import { useAuth } from '../hooks/useAuth';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { Button } from '../components/ui/Button';

export function HistoryPage() {
    const { state: authState } = useAuth();
    const { state: appState, dispatch } = useAppContext();
    const navigate = useNavigate();

    const [autoDeleteDays, setAutoDeleteDays] = useState(30);

    const mockHistory = [
        {
            id: '1',
            name: 'Lease Agreement 2024.pdf',
            createdAt: new Date().toISOString(),
            documentType: 'legal',
            redFlags: [{ severity: 'high' }, { severity: 'medium' }]
        },
        {
            id: '2',
            name: 'Blood Test Results.jpg',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            documentType: 'medical',
            redFlags: []
        }
    ];

    const items = appState.documentHistory.length > 0 ? appState.documentHistory : mockHistory;

    if (authState.isGuestMode) {
        return (
            <PageContainer className="items-center justify-center text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-3">
                    Sign in to save history
                </h1>
                <p className="text-[length:var(--font-lg)] text-neutral-600 mb-8 max-w-md">
                    Create a free account to securely save your processed documents and revisit them later.
                </p>
                <Button size="lg" onClick={() => navigate('/auth')}>
                    Sign In / Create Account
                </Button>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-1">
                        My Documents
                    </h1>
                    <p className="text-[length:var(--font-base)] text-neutral-500 font-medium">
                        {items.length} saved documents
                    </p>
                </div>
            </div>

            <AutoDeleteBanner
                days={autoDeleteDays}
                onChangeClick={() => {
                    setAutoDeleteDays(autoDeleteDays === 30 ? 7 : 30);
                }}
            />

            {items.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                    <p className="text-[length:var(--font-lg)] text-neutral-500 font-medium">No documents saved yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map((item, idx) => (
                        <HistoryCard
                            key={item.id}
                            item={item}
                            onClick={() => navigate(`/results?id=${item.id}`)}
                            onDelete={() => {
                                dispatch({ type: APP_ACTIONS.REMOVE_FROM_HISTORY, payload: item.id });
                            }}
                        />
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
