import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { DropZone } from '../components/upload/DropZone';
import { FilePreview } from '../components/upload/FilePreview';
import { ValidationBanner } from '../components/upload/ValidationBanner';
import { Button } from '../components/ui/Button';
import { validateFile } from '../hooks/useFileValidation';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { useDocumentPipeline } from '../hooks/useDocumentPipeline';
import { useAuth } from '../hooks/useAuth';
import { GuestModeBanner } from '../components/auth/GuestModeBanner';
import { LIMITS } from '../utils/constants';

const MAX_FILES = 3;

export function UploadPage() {
    const navigate = useNavigate();
    const { state: authState } = useAuth();
    const { state, dispatch, addToast } = useAppContext();
    const { runPipeline } = useDocumentPipeline();
    const [validationError, setValidationError] = React.useState(null);

    const currentFiles = state.currentDocuments || [];

    const handleFilesSelect = (newFiles) => {
        setValidationError(null);

        const remainingSlots = MAX_FILES - currentFiles.length;
        const filesToAdd = Array.from(newFiles).slice(0, remainingSlots);

        // Validate each file
        const errors = [];
        const validFiles = [];
        for (const file of filesToAdd) {
            const result = validateFile(file);
            if (!result.valid) {
                errors.push(`${file.name}: ${result.error}`);
            } else {
                validFiles.push(file);
            }
        }

        if (errors.length > 0) {
            setValidationError(errors[0]); // Show first error
        }

        if (currentFiles.length + validFiles.length > MAX_FILES) {
            addToast({ type: 'warning', message: `You can only upload up to ${MAX_FILES} documents at a time.` });
        }

        if (validFiles.length > 0) {
            dispatch({ type: APP_ACTIONS.SET_DOCUMENTS, payload: [...currentFiles, ...validFiles] });
        }
    };

    const handleRemove = (index) => {
        dispatch({ type: APP_ACTIONS.REMOVE_DOCUMENT, payload: index });
        setValidationError(null);
    };

    const handleStart = () => {
        if (currentFiles.length > 0) {
            navigate('/processing');
            runPipeline(currentFiles);
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
                    Upload up to 3 documents — we'll simplify them all for you.
                </p>

                {authState.isGuestMode && (
                    <div className="mb-8">
                        <GuestModeBanner count={authState.guestDocumentCount} />
                    </div>
                )}

                <ValidationBanner error={validationError} />

                {isGuestBlocked ? (
                    <div className="bg-neutral-100 border-2 border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 font-medium">
                        You've reached your limit of {LIMITS.GUEST_MAX_DOCUMENTS} free documents. Please sign in to continue.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File previews */}
                        {currentFiles.length > 0 && (
                            <FilePreview files={currentFiles} onRemove={handleRemove} />
                        )}

                        {/* Drop zone — always visible while under the limit */}
                        {currentFiles.length < MAX_FILES && (
                            <DropZone
                                onFilesSelected={handleFilesSelect}
                                currentCount={currentFiles.length}
                                disabled={isGuestBlocked}
                            />
                        )}

                        {/* Start button — only shown once at least one file is selected */}
                        {currentFiles.length > 0 && (
                            <Button fullWidth size="lg" onClick={handleStart}>
                                Simplify {currentFiles.length} Document{currentFiles.length > 1 ? 's' : ''}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
