import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppContext } from '../hooks/useAppContext';
import { STAGE_LABELS, REASSURANCE_MESSAGES } from '../utils/constants';

export function ProcessingPage() {
    const { state } = useAppContext();
    const navigate = useNavigate();
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!state.currentDocuments || state.currentDocuments.length === 0) {
            navigate('/upload', { replace: true });
        }
    }, [state.currentDocuments, navigate]);

    useEffect(() => {
        const int = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % REASSURANCE_MESSAGES.length);
        }, 4500);
        return () => clearInterval(int);
    }, []);

    return (
        <PageContainer className="items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md text-center">
                {/* Animated illustration area */}
                <div className="relative w-32 h-32 mx-auto mb-8 bg-brand-primaryLight rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-primaryLight rounded-full animate-ping opacity-75"></div>
                    <div className="relative z-10 w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin-slow"></div>
                </div>

                <h2 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-4 transition-all duration-300">
                    {STAGE_LABELS[state.processingStage] || 'Processing...'}
                </h2>

                <p className="text-[length:var(--font-lg)] text-neutral-600 mb-10 min-h-[3rem] animate-pulse font-medium">
                    {REASSURANCE_MESSAGES[messageIndex]}
                </p>

                <ProgressBar
                    progress={state.processingProgress}
                    className="mb-4 shadow-sm"
                />

                {state.processingStage === 'error' && (
                    <div className="mt-8 text-brand-danger font-bold text-[length:var(--font-lg)] bg-brand-dangerLight p-6 rounded-xl border border-red-200">
                        {state.processingError || "An error occurred during processing."}
                        <button onClick={() => navigate('/upload')} className="block w-full underline mt-4 text-neutral-700">Go back and try again</button>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
