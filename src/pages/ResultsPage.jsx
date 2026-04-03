import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SimplifiedTextCard } from '../components/results/SimplifiedTextCard';
import { NextStepsCard } from '../components/results/NextStepsCard';
import { RedFlagAlert } from '../components/results/RedFlagAlert';
import { TranslationToggle } from '../components/results/TranslationToggle';
import { TTSButton } from '../components/ui/TTSButton';
import { ShareSheet } from '../components/results/ShareSheet';
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

    // Determine which result to display: Swahili (if toggled) or English
    const result = state.activeLanguage === 'sw' && state.swahiliResult
        ? state.swahiliResult
        : state.simplifiedResult;

    if (!result) return null;

    // Build targeted payload for Text-to-Speech (Explanation + What To Do)
    // Adding newlines explicitly for ElevenLabs to pause
    const ttsPayload = `${result.summary || ''}.\n\nWhat you need to do:\n${(result.nextSteps || []).join('.\n')}`;

    // Show primary document name (first file in multi-upload)
    const docName = state.currentDocuments?.[0]?.name || 'Document Results';

    return (
        <PageContainer>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 w-full sm:w-auto truncate md:whitespace-normal">
                    {docName}
                </h1>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <TTSButton text={ttsPayload} lang={state.activeLanguage} />
                    <TranslationToggle />
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Simple Explanation */}
                <SimplifiedTextCard summary={result.summary} isLoading={false} />

                {/* 2. Red flags (urgent attention) */}
                {result.redFlags && result.redFlags.length > 0 && (
                    <RedFlagAlert flags={result.redFlags} />
                )}

                {/* 3. What to Do (Next Steps) */}
                <NextStepsCard steps={result.nextSteps} />

                {/* Action Bar */}
                <div
                    className="flex flex-col sm:flex-row justify-between items-center bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200 mt-8 animate-card-enter gap-6"
                    style={{ '--card-index': 4 }}
                >
                    <div className="w-full sm:w-auto">
                        <ShareSheet title={docName} textToShare={result.summary} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button variant="secondary" onClick={handleChat} className="w-full sm:w-auto">
                            Ask Questions
                        </Button>
                        <Button onClick={handleStartOver} className="w-full sm:w-auto">
                            New Document
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
