import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { APP_ACTIONS } from '../../context/AppContext';
import { Toast } from './Toast';

export function ToastContainer() {
    const { state, dispatch } = useAppContext();
    const { toasts } = state;

    if (toasts.length === 0) return null;

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100] mt-16 sm:mt-0"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <div key={toast.id} className="animate-[toastIn_0.3s_ease-out_forwards]">
                        <Toast
                            type={toast.type}
                            message={toast.message}
                            onClose={() => dispatch({ type: APP_ACTIONS.REMOVE_TOAST, payload: toast.id })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
