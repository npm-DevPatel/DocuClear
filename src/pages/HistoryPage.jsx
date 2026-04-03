import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { HistoryCard } from '../components/history/HistoryCard';
import { AutoDeleteBanner } from '../components/history/AutoDeleteBanner';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { getDocumentHistory, deleteDocument } from '../services/FirebaseService';
import { Loader2, FolderOpen } from 'lucide-react';

export function HistoryPage() {
    const { state: authState } = useContext(AuthContext);
    const navigate = useNavigate();

    const [history, setHistory] = useState(() => {
        try {
            const cached = localStorage.getItem('dc_history_cache');
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    // Only show full-page loading if we have absolutely nothing in the cache
    const [loading, setLoading] = useState(history.length === 0);
    const [error, setError] = useState(null);
    const [autoDeleteDays, setAutoDeleteDays] = useState(30);

    const { isAuthenticated, user } = authState;

    useEffect(() => {
        if (!isAuthenticated || !user?.uid) return;

        let cancelled = false;
        
        // Only set loading to true if we don't have cached data (instant UI otherwise)
        if (history.length === 0) {
            setLoading(true);
        }
        setError(null);

        // Fetch from Firebase (silently if cache exists)
        getDocumentHistory(user.uid)
            .then((docs) => {
                if (!cancelled) {
                    setHistory(prev => {
                        const merged = [...docs];
                        // Preserve any local-only cache items that Firebase might have missed (e.g. ad-blocker issues)
                        prev.forEach(localItem => {
                            if (!merged.find(d => d.id === localItem.id)) {
                                merged.push(localItem);
                            }
                        });
                        // Sort newest first
                        merged.sort((a, b) => {
                            const timeA = typeof a.createdAt === 'object' && a.createdAt.toMillis ? a.createdAt.toMillis() : a.createdAt;
                            const timeB = typeof b.createdAt === 'object' && b.createdAt.toMillis ? b.createdAt.toMillis() : b.createdAt;
                            return (timeB || 0) - (timeA || 0);
                        });
                        
                        localStorage.setItem('dc_history_cache', JSON.stringify(merged));
                        return merged;
                    });
                }
            })
            .catch((err) => {
                console.error('[HistoryPage] Failed to load history:', err);
                if (!cancelled && history.length === 0) {
                    // Only show error if we also have no cached data to show
                    setError('Could not load your documents. Please try again.');
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [isAuthenticated, user?.uid]); // Intentionally not depending on 'history' so it only fires on mount

    const handleDelete = async (itemId) => {
        if (!user?.uid) return;
        try {
            await deleteDocument(user.uid, itemId);
            const newHistory = history.filter(d => d.id !== itemId);
            setHistory(newHistory);
            localStorage.setItem('dc_history_cache', JSON.stringify(newHistory));
        } catch (err) {
            console.error('[HistoryPage] Delete failed:', err);
            setError('Could not delete this document. Please try again.');
        }
    };

    // Guest: prompt to sign in
    if (!isAuthenticated || authState.isGuestMode) {
        return (
            <PageContainer className="items-center justify-center text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <FolderOpen size={32} className="text-neutral-400" />
                </div>
                <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-3">
                    Sign in to save history
                </h1>
                <p className="text-[length:var(--font-lg)] text-neutral-600 mb-8 max-w-md">
                    Create a free account to securely save your processed documents and revisit them later.
                </p>
                <Button size="lg" onClick={() => navigate('/auth')}>
                    Sign In / Create Account
                </Button>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-1">
                        My Documents
                    </h1>
                    {!loading && (
                        <p className="text-[length:var(--font-base)] text-neutral-500 font-medium">
                            {history.length} saved document{history.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            <AutoDeleteBanner
                days={autoDeleteDays}
                onChangeClick={() => setAutoDeleteDays(autoDeleteDays === 30 ? 7 : 30)}
            />

            {/* Loading skeleton */}
            {loading && (
                <div className="flex items-center justify-center py-20 text-neutral-500 gap-3">
                    <Loader2 size={24} className="animate-spin text-brand-primary" />
                    <span className="text-[length:var(--font-lg)] font-medium">Loading your documents…</span>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center font-medium">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && history.length === 0 && (
                <div className="text-center py-16 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                    <FolderOpen size={48} className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-[length:var(--font-lg)] text-neutral-500 font-medium">No documents saved yet.</p>
                    <p className="text-[length:var(--font-base)] text-neutral-400 mt-1">Upload a document to get started.</p>
                    <Button className="mt-6" onClick={() => navigate('/upload')}>Upload a Document</Button>
                </div>
            )}

            {/* Document list */}
            {!loading && !error && history.length > 0 && (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <HistoryCard
                            key={item.id}
                            item={item}
                            onClick={() => navigate(`/results?id=${item.id}`)}
                            onDelete={() => handleDelete(item.id)}
                        />
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
