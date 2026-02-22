import React, { createContext, useReducer, useEffect } from 'react';
import { onAuthStateChange } from '../services/AuthService';

const GUEST_SESSION_KEY = 'docuclear_guest_session';

const initialAuthState = {
    user: null,
    isAuthenticated: false,
    isGuestMode: false,
    authLoading: true,
    guestDocumentCount: 0,
    guestSessionId: null,
    plan: 'free',
};

export const AUTH_ACTIONS = {
    SET_USER: 'SET_USER',
    SET_GUEST_MODE: 'SET_GUEST_MODE',
    INCREMENT_GUEST_COUNT: 'INCREMENT_GUEST_COUNT',
    SET_AUTH_LOADING: 'SET_AUTH_LOADING',
    SIGN_OUT: 'SIGN_OUT',
};

function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                isGuestMode: false,
                authLoading: false,
            };
        case AUTH_ACTIONS.SET_GUEST_MODE: {
            let sessionId = sessionStorage.getItem(GUEST_SESSION_KEY);
            if (!sessionId) {
                sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
                sessionStorage.setItem(GUEST_SESSION_KEY, sessionId);
            }
            return {
                ...state,
                isGuestMode: action.payload,
                guestSessionId: action.payload ? sessionId : null,
            };
        }
        case AUTH_ACTIONS.INCREMENT_GUEST_COUNT:
            return {
                ...state,
                guestDocumentCount: state.guestDocumentCount + 1,
            };
        case AUTH_ACTIONS.SET_AUTH_LOADING:
            return {
                ...state,
                authLoading: action.payload,
            };
        case AUTH_ACTIONS.SIGN_OUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
