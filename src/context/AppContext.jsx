// FULL IMPLEMENTATION REQUIRED BY AGENT
import React, { createContext, useReducer } from 'react';

const initialState = {
    currentDocument: null,
    extractedText: null,
    simplifiedResult: null,
    processingStage: 'idle',
    processingProgress: 0,
    processingError: null,

    activeLanguage: 'en',
    swahiliResult: null,

    chatHistory: [],
    chatLoading: false,

    toasts: [],
    isModalOpen: false,
    modalContent: null,

    documentHistory: [],
};

export const APP_ACTIONS = {
    SET_DOCUMENT: 'SET_DOCUMENT',
    SET_EXTRACTED_TEXT: 'SET_EXTRACTED_TEXT',
    SET_SIMPLIFIED_RESULT: 'SET_SIMPLIFIED_RESULT',
    SET_PROCESSING_STAGE: 'SET_PROCESSING_STAGE',
    SET_PROCESSING_PROGRESS: 'SET_PROCESSING_PROGRESS',
    SET_PROCESSING_ERROR: 'SET_PROCESSING_ERROR',
    SET_ACTIVE_LANGUAGE: 'SET_ACTIVE_LANGUAGE',
    SET_SWAHILI_RESULT: 'SET_SWAHILI_RESULT',
    ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
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
};

function appReducer(state, action) {
    switch (action.type) {
        case APP_ACTIONS.SET_DOCUMENT:
            return { ...state, currentDocument: action.payload };
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
            return { ...state, swahiliResult: action.payload };
        case APP_ACTIONS.ADD_CHAT_MESSAGE:
            return { ...state, chatHistory: [...state.chatHistory, action.payload] };
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
            return {
                ...state,
                currentDocument: null,
                extractedText: null,
                simplifiedResult: null,
                processingStage: 'idle',
                processingProgress: 0,
                processingError: null,
                activeLanguage: 'en',
                swahiliResult: null,
                chatHistory: [],
            };
        default:
            return state;
    }
}

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}
