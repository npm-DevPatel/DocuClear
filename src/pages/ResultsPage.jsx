import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SimplifiedTextCard } from '../components/results/SimplifiedTextCard';
import { RedFlagAlert } from '../components/results/RedFlagAlert';
import { KeyTermsGlossary } from '../components/results/KeyTermsGlossary';
import { TranslationToggle } from '../components/results/TranslationToggle';
import { ShareSheet } from '../components/results/ShareSheet';
import { CalendarAddButton } from '../components/results/CalendarAddButton';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { Button } from '../components/ui/Button';

export function ResultsPage() {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.simplifiedResult && state.processingStage !== 'complete') {
            navigate('/upload', { replace: true });
        }
    }, [state.simplifiedResult, state.processingStage, navigate]);

    const handleStartOver = () => {
        dispatch({ type: APP_ACTIONS.RESET_PIPELINE });
        navigate('/upload');
    };

    const handleChat = () => {
        navigate('/chat');
    };

    const result = state.simplifiedResult;
    if (!result) return null;

    return (
        <PageContainer>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 truncate w-full sm:w-auto">
                    {state.currentDocument?.name || 'Document Results'}
                </h1>
                <TranslationToggle />
            </div>

            <div className="space-y-6">
                {result.redFlags && result.redFlags.length > 0 && (
                    <RedFlagAlert flags={result.redFlags} />
                )}

                <SimplifiedTextCard summary={result.summary} isLoading={false} />

                {result.keyTerms && result.keyTerms.length > 0 && (
                    <KeyTermsGlossary terms={result.keyTerms} />
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200 mt-8 animate-card-enter gap-6" style={{ '--card-index': 3 }}>
                    <div className="w-full sm:w-auto">
                        <ShareSheet title={state.currentDocument?.name} textToShare={result.summary} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button variant="secondary" onClick={handleChat} className="w-full sm:w-auto">Ask Questions</Button>
                        <Button onClick={handleStartOver} className="w-full sm:w-auto">New Document</Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
