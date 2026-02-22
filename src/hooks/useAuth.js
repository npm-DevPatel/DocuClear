import { useContext } from 'react';
import { AuthContext, AUTH_ACTIONS } from '../context/AuthContext';

export { AUTH_ACTIONS };

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
