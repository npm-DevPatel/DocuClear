import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { DropZone } from '../components/upload/DropZone';
import { FilePreview } from '../components/upload/FilePreview';
import { ValidationBanner } from '../components/upload/ValidationBanner';
import { Button } from '../components/ui/Button';
import { useFileValidation } from '../hooks/useFileValidation';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { useDocumentPipeline } from '../hooks/useDocumentPipeline';
import { useAuth } from '../hooks/useAuth';
import { GuestModeBanner } from '../components/auth/GuestModeBanner';
import { LIMITS } from '../utils/constants';

export function UploadPage() {
    const navigate = useNavigate();
    const { state: authState } = useAuth();
    const { state, dispatch } = useAppContext();
    const { error, validate } = useFileValidation();
    const { runPipeline } = useDocumentPipeline();

    const handleFileSelect = (file) => {
        if (validate(file).valid) {
            dispatch({ type: APP_ACTIONS.SET_DOCUMENT, payload: file });
        }
    };

    const handleClear = () => {
        dispatch({ type: APP_ACTIONS.SET_DOCUMENT, payload: null });
    };

    const handleStart = () => {
        if (state.currentDocument) {
            navigate('/processing');
            runPipeline(state.currentDocument);
        }
    };

    const isGuestBlocked = authState.isGuestMode && authState.guestDocumentCount >= LIMITS.GUEST_MAX_DOCUMENTS;

    return (
        <PageContainer>
            <div className="max-w-2xl mx-auto w-full">
                <h1 className="text-[length:var(--font-2xl)] md:text-[length:var(--font-3xl)] font-bold text-neutral-900 mb-2">
                    Upload Document
                </h1>
                <p className="text-[length:var(--font-lg)] text-neutral-600 mb-8">
                    We'll analyze it and provide a plain-language summary.
                </p>

                {authState.isGuestMode && (
                    <div className="mb-8">
                        <GuestModeBanner count={authState.guestDocumentCount} />
                    </div>
                )}

                <ValidationBanner error={error} />

                {isGuestBlocked ? (
                    <div className="bg-neutral-100 border-2 border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 font-medium">
                        You've reached your limit of {LIMITS.GUEST_MAX_DOCUMENTS} free documents. Please sign in to continue.
                    </div>
                ) : (
                    <>
                        {!state.currentDocument ? (
                            <DropZone onFileSelected={handleFileSelect} />
                        ) : (
                            <div className="space-y-6 animate-card-enter">
                                <FilePreview file={state.currentDocument} onClear={handleClear} />
                                <Button fullWidth size="lg" onClick={handleStart}>
                                    Simplify Document
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageContainer>
    );
}
