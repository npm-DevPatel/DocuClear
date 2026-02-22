import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth, AUTH_ACTIONS } from '../hooks/useAuth';
import { signInWithEmail, createAccount } from '../services/AuthService';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            await signInWithEmail(data.email, data.password);
            // State is handled by onAuthStateChange in AuthContext automatically
            navigate('/upload');
        } catch (err) {
            console.error(err);
            setError('Failed to sign in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            await createAccount(data.email, data.password, data.name);
            navigate('/upload');
        } catch (err) {
            console.error(err);
            setError('Failed to create account. Email might already be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuest = () => {
        dispatch({ type: AUTH_ACTIONS.SET_GUEST_MODE, payload: true });
        navigate('/upload');
    };

    return (
        <PageContainer className="items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-primary rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-md">
                        D
                    </div>
                    <h1 className="text-[length:var(--font-3xl)] font-extrabold text-neutral-900 mb-2 tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create Account'}
                    </h1>
                    <p className="text-[length:var(--font-lg)] text-neutral-600 font-medium">
                        {isLogin ? 'Sign in to access your saved documents.' : 'Securely save and manage your documents.'}
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {isLogin ? (
                        <LoginForm onSubmit={handleLogin} isLoading={isLoading} onToggleMode={() => { setIsLogin(false); setError(''); }} />
                    ) : (
                        <SignupForm onSubmit={handleSignup} isLoading={isLoading} onToggleMode={() => { setIsLogin(true); setError(''); }} />
                    )}

                    <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                        <button
                            onClick={handleGuest}
                            className="text-[length:var(--font-base)] font-bold text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200 rounded px-4 py-2"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
