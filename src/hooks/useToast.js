import { useAppContext, APP_ACTIONS } from './useAppContext';
import { useCallback } from 'react';
import { LIMITS } from '../utils/constants';

let toastIdCounter = 0;

export function useToast() {
    const { dispatch } = useAppContext();

    const addToast = useCallback(({ type, message }) => {
        const id = ++toastIdCounter;
        dispatch({ type: APP_ACTIONS.ADD_TOAST, payload: { id, type, message } });

        let duration = LIMITS.TOAST_DURATION_INFO;
        if (type === 'warning') duration = 6000;
        if (type === 'error') duration = LIMITS.TOAST_DURATION_ERROR;

        setTimeout(() => {
            dispatch({ type: APP_ACTIONS.REMOVE_TOAST, payload: id });
        }, duration);
    }, [dispatch]);

    const removeToast = useCallback((id) => {
        dispatch({ type: APP_ACTIONS.REMOVE_TOAST, payload: id });
    }, [dispatch]);

    return { addToast, removeToast };
}
