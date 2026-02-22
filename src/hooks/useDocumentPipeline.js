import { useAppContext, APP_ACTIONS } from './useAppContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_EXTRACTED_TEXT, MOCK_SIMPLIFIED_RESULT } from '../utils/constants';

async function mockOCRDelay() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_EXTRACTED_TEXT;
}

async function mockAIDelay() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return MOCK_SIMPLIFIED_RESULT;
}

export function useDocumentPipeline() {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();

    const runPipeline = async (file) => {
        try {
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'validating' });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 5 });

            // Stage 1: OCR
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ocr' });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 10 });

            // TODO HOOK: Call OCRProcessor.processDocument(file, (p) => dispatch progress)
            // For now, use the MOCK below during development:
            const extractedText = await mockOCRDelay(); // in reality would pass file

            dispatch({ type: APP_ACTIONS.SET_EXTRACTED_TEXT, payload: extractedText });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 50 });

            // Stage 2: AI Analysis
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'ai' });

            // Simulate progress going up to 88
            let progress = 50;
            const progressInterval = setInterval(() => {
                progress += 2;
                if (progress > 88) {
                    clearInterval(progressInterval);
                } else {
                    dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: progress });
                }
            }, 500);

            // TODO HOOK: Call GeminiService.simplifyDocument(...)
            const result = await mockAIDelay();
            clearInterval(progressInterval);

            dispatch({ type: APP_ACTIONS.SET_SIMPLIFIED_RESULT, payload: result });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'complete' });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_PROGRESS, payload: 100 });

            setTimeout(() => {
                navigate('/results');
            }, 500);
        } catch (error) {
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_STAGE, payload: 'error' });
            dispatch({ type: APP_ACTIONS.SET_PROCESSING_ERROR, payload: 'Something went wrong.' });
        }
    };

    return { runPipeline };
}
