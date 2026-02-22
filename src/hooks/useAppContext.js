import { useContext } from 'react';
import { AppContext, APP_ACTIONS } from '../context/AppContext';

export { APP_ACTIONS };

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
