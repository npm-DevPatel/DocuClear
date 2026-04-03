// FULL IMPLEMENTATION — AI_Implementation_Plan.md §9
// AppContext.jsx — wires setToastFunction for costGuard, adds SET_SWAHILI_LOADING action
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { setToastFunction } from '../utils/costGuard.js';

const initialState = {
    currentDocuments: [],          // Array of Files (max 3)
    extractedText: null,
    simplifiedResult: null,
    processingStage: 'idle',
    processingProgress: 0,
    processingError: null,

    activeLanguage: 'en',
    swahiliResult: null,
    swahiliLoading: false,

    chatHistory: [],
    chatLoading: false,

    toasts: [],
    isModalOpen: false,
    modalContent: null,

    documentHistory: [],

    // Accessibility Suite — for elderly/impaired users
    accessibilitySettings: {
        fontSize: 1.0,        // Multiplier: 1.0, 1.25, 1.5
        darkMode: false,      // Manual dark mode toggle
        highContrast: false,  // WCAG AAA stark colors
    },
};

export const APP_ACTIONS = {
    SET_DOCUMENTS: 'SET_DOCUMENTS',       // replaces SET_DOCUMENT
    SET_DOCUMENT: 'SET_DOCUMENT',         // kept for legacy callers
    REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',   // remove one file by index
    SET_EXTRACTED_TEXT: 'SET_EXTRACTED_TEXT',
    SET_SIMPLIFIED_RESULT: 'SET_SIMPLIFIED_RESULT',
    SET_PROCESSING_STAGE: 'SET_PROCESSING_STAGE',
    SET_PROCESSING_PROGRESS: 'SET_PROCESSING_PROGRESS',
    SET_PROCESSING_ERROR: 'SET_PROCESSING_ERROR',
    SET_ACTIVE_LANGUAGE: 'SET_ACTIVE_LANGUAGE',
    SET_SWAHILI_RESULT: 'SET_SWAHILI_RESULT',
    SET_SWAHILI_LOADING: 'SET_SWAHILI_LOADING',  // new — §6.2
    ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
    SET_CHAT_HISTORY: 'SET_CHAT_HISTORY',
    SET_CHAT_LOADING: 'SET_CHAT_LOADING',
    CLEAR_CHAT: 'CLEAR_CHAT',
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
    OPEN_MODAL: 'OPEN_MODAL',
    CLOSE_MODAL: 'CLOSE_MODAL',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    REMOVE_FROM_HISTORY: 'REMOVE_FROM_HISTORY',
    RESET_PIPELINE: 'RESET_PIPELINE',
    SET_FULL_HISTORY: 'SET_FULL_HISTORY',
    SET_ACCESSIBILITY_SETTING: 'SET_ACCESSIBILITY_SETTING',
    RESET_ACCESSIBILITY: 'RESET_ACCESSIBILITY',
};

function appReducer(state, action) {
    switch (action.type) {
        case APP_ACTIONS.SET_DOCUMENTS:
            return { ...state, currentDocuments: Array.isArray(action.payload) ? action.payload : [action.payload].filter(Boolean) };
        case APP_ACTIONS.SET_DOCUMENT:
            // Legacy: wrap single file into the array
            return { ...state, currentDocuments: action.payload ? [action.payload] : [] };
        case APP_ACTIONS.REMOVE_DOCUMENT: {
            const updated = state.currentDocuments.filter((_, i) => i !== action.payload);
            return { ...state, currentDocuments: updated };
        }
        case APP_ACTIONS.SET_EXTRACTED_TEXT:
            return { ...state, extractedText: action.payload };
        case APP_ACTIONS.SET_SIMPLIFIED_RESULT:
            return { ...state, simplifiedResult: action.payload };
        case APP_ACTIONS.SET_PROCESSING_STAGE:
            return { ...state, processingStage: action.payload };
        case APP_ACTIONS.SET_PROCESSING_PROGRESS:
            return { ...state, processingProgress: action.payload };
        case APP_ACTIONS.SET_PROCESSING_ERROR:
            return { ...state, processingError: action.payload };
        case APP_ACTIONS.SET_ACTIVE_LANGUAGE:
            return { ...state, activeLanguage: action.payload };
        case APP_ACTIONS.SET_SWAHILI_RESULT:
            return { ...state, swahiliResult: action.payload, swahiliLoading: false };
        case APP_ACTIONS.SET_SWAHILI_LOADING:
            return { ...state, swahiliLoading: action.payload };
        case APP_ACTIONS.ADD_CHAT_MESSAGE:
            return { ...state, chatHistory: [...state.chatHistory, action.payload] };
        case APP_ACTIONS.SET_CHAT_HISTORY:
            return { ...state, chatHistory: action.payload };
        case APP_ACTIONS.SET_CHAT_LOADING:
            return { ...state, chatLoading: action.payload };
        case APP_ACTIONS.CLEAR_CHAT:
            return { ...state, chatHistory: [] };
        case APP_ACTIONS.ADD_TOAST: {
            const newToasts = [...state.toasts, action.payload];
            if (newToasts.length > 3) newToasts.shift();
            return { ...state, toasts: newToasts };
        }
        case APP_ACTIONS.REMOVE_TOAST:
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        case APP_ACTIONS.OPEN_MODAL:
            return { ...state, isModalOpen: true, modalContent: action.payload };
        case APP_ACTIONS.CLOSE_MODAL:
            return { ...state, isModalOpen: false, modalContent: null };
        case APP_ACTIONS.ADD_TO_HISTORY:
            return { ...state, documentHistory: [action.payload, ...state.documentHistory] };
        case APP_ACTIONS.REMOVE_FROM_HISTORY:
            return { ...state, documentHistory: state.documentHistory.filter(d => d.id !== action.payload) };
        case APP_ACTIONS.SET_FULL_HISTORY:
            return { ...state, documentHistory: action.payload };
        case APP_ACTIONS.RESET_PIPELINE:
            sessionStorage.removeItem('dc_results_cache');
            return {
                ...state,
                currentDocuments: [],
                extractedText: null,
                simplifiedResult: null,
                processingStage: 'idle',
                processingProgress: 0,
                processingError: null,
                swahiliResult: null,
                swahiliLoading: false,
                activeLanguage: 'en',
            };
        case APP_ACTIONS.SET_ACCESSIBILITY_SETTING:
            return {
                ...state,
                accessibilitySettings: {
                    ...state.accessibilitySettings,
                    ...action.payload,
                }
            };
        case APP_ACTIONS.RESET_ACCESSIBILITY:
            return {
                ...state,
                accessibilitySettings: initialState.accessibilitySettings,
            };
        default:
            return state;
    }
}

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
        // Hydrate state from session storage to prevent loss on refresh
        try {
            const cached = sessionStorage.getItem('dc_results_cache');
            if (cached) {
                return { ...initial, ...JSON.parse(cached) };
            }
        } catch { /* ignore */ }
        return initial;
    });

    // Automatically persist both Results and Accessibility state
    useEffect(() => {
        const cacheableState = {
            activeLanguage: state.activeLanguage,
            accessibilitySettings: state.accessibilitySettings,
        };

        if (state.simplifiedResult) {
            cacheableState.simplifiedResult = state.simplifiedResult;
            cacheableState.swahiliResult = state.swahiliResult;
            cacheableState.processingStage = state.processingStage;
            cacheableState.currentDocuments = (state.currentDocuments || []).map(f => ({ name: f.name || 'Document' }));
        }

        sessionStorage.setItem('dc_results_cache', JSON.stringify(cacheableState));
    }, [
        state.simplifiedResult, 
        state.activeLanguage, 
        state.swahiliResult, 
        state.processingStage, 
        state.currentDocuments,
        state.accessibilitySettings
    ]);

    const addToast = useCallback((toast) => {
        const id = Date.now().toString();
        dispatch({ type: APP_ACTIONS.ADD_TOAST, payload: { ...toast, id } });
        setTimeout(() => {
            dispatch({ type: APP_ACTIONS.REMOVE_TOAST, payload: id });
        }, toast.duration || 5000);
    }, []);

    useEffect(() => {
        setToastFunction(addToast);
    }, [addToast]);

    return (
        <AppContext.Provider value={{ state, dispatch, addToast }}>
            {children}
        </AppContext.Provider>
    );
}
