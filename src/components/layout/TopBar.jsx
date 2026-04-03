import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, User, LogOut, Settings, Home } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuth, AUTH_ACTIONS } from '../../hooks/useAuth';
import { DesktopNav } from './BottomNav';

export function TopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { state: authState, dispatch } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHome = location.pathname === ROUTES.HOME;

    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.SIGN_OUT });
        setIsMenuOpen(false);
        navigate(ROUTES.HOME);
    };

    return (
        <>
            <header className="fixed top-0 inset-x-0 h-16 sm:h-20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-slate-700 z-40 flex items-center px-4 sm:px-6" style={{transition:'background-color 0.25s ease,border-color 0.25s ease'}}>
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        {!isHome && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={24} className="text-neutral-700 dark:text-slate-300" />
                            </button>
                        )}

                        {/* Logo or App Name */}
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate(ROUTES.HOME)}>
                            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-xl group-hover:bg-brand-primary/90 transition-colors">
                                D
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-blue-800 hidden xs:block">
                                DocuClear
                            </span>
                        </div>
                    </div>

                    {/* Desktop navigation — visible sm+ */}
                    <DesktopNav />

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {authState.isAuthenticated && authState.user ? (
                            <div
                                className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm cursor-pointer border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
                                onClick={() => setIsMenuOpen(true)}
                                title={authState.user.email}
                            >
                                {authState.user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        ) : null}

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu size={24} className="text-neutral-700 dark:text-slate-300" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex justify-end transition-opacity">
                    <div className="w-64 sm:w-80 h-full bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right flex flex-col">
                        <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-slate-700">
                            <span className="font-bold text-lg text-neutral-900 dark:text-slate-100">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none transition-colors"
                            >
                                <X size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col gap-2">
                            {authState.isAuthenticated ? (
                                <>
                                    <div className="mb-4 px-3 py-3 bg-neutral-50 dark:bg-slate-800 rounded-xl border border-neutral-100 dark:border-slate-700">
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 font-medium mb-1">Signed in as</p>
                                        <p className="font-semibold text-neutral-900 dark:text-slate-100 truncate" title={authState.user?.email}>
                                            {authState.user?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); navigate(ROUTES.HOME); }}
                                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800 font-medium text-neutral-700 dark:text-slate-300 transition-colors text-left"
                                    >
                                        <Home size={20} className="text-neutral-400 dark:text-slate-500" />
                                        Home
                                    </button>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); navigate('/settings'); }}
                                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800 font-medium text-neutral-700 dark:text-slate-300 transition-colors text-left"
                                    >
                                        <Settings size={20} className="text-neutral-400 dark:text-slate-500" />
                                        Settings
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsMenuOpen(false); navigate('/auth'); }}
                                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800 font-medium text-neutral-700 dark:text-slate-300 transition-colors text-left"
                                >
                                    <User size={20} className="text-neutral-400 dark:text-slate-500" />
                                    Sign In / Register
                                </button>
                            )}
                        </div>

                        {authState.isAuthenticated && (
                            <div className="p-4 border-t border-neutral-100 dark:border-slate-700">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
