import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { Button } from '../components/ui/Button';
import { askDocumentQuestion } from '../services/GeminiService.js';
import { saveChatMessage, getRecentChatHistory } from '../services/FirebaseService.js';
import { AuthContext } from '../context/AuthContext';

export function ChatPage() {
    const { state, dispatch, addToast } = useAppContext();
    const { state: authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const { isAuthenticated, user } = authState;
    const {
        simplifiedResult,
        chatHistory,
        chatLoading,
        activeLanguage,
        currentDocument,
    } = state;

    // The Firestore documentId mirrors the document name slug or the Firestore-saved doc id.
    // For authenticated sessions it is stored in simplifiedResult.firestoreId (if saved).
    const currentDocumentId = simplifiedResult?.firestoreId || null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, chatLoading]);

    useEffect(() => {
        let cancelled = false;

        const loadHistory = async () => {
            if (!currentDocumentId) return;

            let mergedHistory = [];

            // 1. Optimistic Cache Load
            try {
                const cached = sessionStorage.getItem(`dc_chat_${currentDocumentId}`);
                if (cached) {
                    mergedHistory = JSON.parse(cached);
                    dispatch({ type: APP_ACTIONS.SET_CHAT_HISTORY, payload: mergedHistory });
                }
            } catch { /* ignore */ }

            if (!isAuthenticated || !user?.uid) return;

            // 2. Background Sync with Firebase
            if (mergedHistory.length <= 1) dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: true });

            try {
                const pastMessages = await getRecentChatHistory(user.uid, currentDocumentId, 20);
                if (!cancelled && pastMessages.length > 0) {
                    const formatted = pastMessages.map(m => ({
                        id: crypto.randomUUID(),
                        role: m.role,
                        content: m.content,
                        timestamp: Date.now()
                    }));

                    const finalHistory = [
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content: `Hi! I've read your document. What would you like to know about it?`,
                            timestamp: Date.now() - 10000,
                        },
                        ...formatted
                    ];

                    // Merge logically (for simple UI just preferring latest Firebase dump)
                    dispatch({ type: APP_ACTIONS.SET_CHAT_HISTORY, payload: finalHistory });
                    sessionStorage.setItem(`dc_chat_${currentDocumentId}`, JSON.stringify(finalHistory));
                }
            } catch (err) {
                console.warn('[ChatPage] Failed to fetch history:', err);
            } finally {
                if (!cancelled) dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: false });
            }
        };

        loadHistory();
        return () => { cancelled = true; };
    }, [isAuthenticated, user?.uid, currentDocumentId]);

    const handleSendMessage = async (text) => {
        if (!text.trim() || chatLoading) return;

        // 1. Add user message
        const userMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        };
        dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: userMessage });
        
        let localSnapshot = [...chatHistory, userMessage];
        if (currentDocumentId) sessionStorage.setItem(`dc_chat_${currentDocumentId}`, JSON.stringify(localSnapshot));

        dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: true });

        // 2. Persist user message to Firebase
        if (isAuthenticated && user?.uid && currentDocumentId) {
            saveChatMessage(user.uid, currentDocumentId, userMessage, activeLanguage).catch(console.error);
        }

        try {
            // Context injection length is last 5 messages, excluding the welcome message
            const historyForAI = localSnapshot.slice(-5);
            const answer = await askDocumentQuestion(text, simplifiedResult, historyForAI);

            const assistantMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: answer,
                timestamp: Date.now(),
            };
            
            dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: assistantMessage });
            
            localSnapshot = [...localSnapshot, assistantMessage];
            if (currentDocumentId) sessionStorage.setItem(`dc_chat_${currentDocumentId}`, JSON.stringify(localSnapshot));

            if (isAuthenticated && user?.uid && currentDocumentId) {
                saveChatMessage(user.uid, currentDocumentId, assistantMessage, activeLanguage).catch(console.error);
            }

        } catch (error) {
            console.error('[ChatPage] askDocumentQuestion failed:', error);
            const errorMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "I'm sorry, I had trouble with that. Please try asking again.",
                timestamp: Date.now(),
            };
            dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: errorMessage });
            
            localSnapshot = [...localSnapshot, errorMessage];
            if (currentDocumentId) sessionStorage.setItem(`dc_chat_${currentDocumentId}`, JSON.stringify(localSnapshot));

            if (addToast) {
                addToast({ type: 'error', message: 'Could not get an answer. Please check your connection and try again.' });
            }
        } finally {
            dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: false });
        }
    };

    const [pastDocuments, setPastDocuments] = React.useState(() => {
        try {
            const cached = localStorage.getItem('dc_history_cache');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });

    const handleSelectPastDoc = (item) => {
        dispatch({
            type: APP_ACTIONS.SET_SIMPLIFIED_RESULT,
            payload: {
                ...item,
                firestoreId: item.id?.startsWith('local_') ? null : item.id
            }
        });
        // Scroll to top
        window.scrollTo(0, 0);
    };

    if (!simplifiedResult) {
        return (
            <PageContainer className="h-[calc(100vh-80px)]">
                <div className="max-w-4xl mx-auto space-y-8 py-8 animate-page-enter">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-[length:var(--font-2xl)] font-bold text-neutral-900">
                            Start a Conversation
                        </h1>
                        <p className="text-[length:var(--font-base)] text-neutral-600">
                            Pick a past document to discuss, or upload a new one.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Option 1: Upload New */}
                        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-primaryLight rounded-2xl flex items-center justify-center mb-6 text-brand-primary">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <h3 className="text-[length:var(--font-lg)] font-bold text-neutral-900 mb-2">New Analysis</h3>
                            <p className="text-[length:var(--font-sm)] text-neutral-500 mb-6">Scan a new letter or hospital record to start fresh.</p>
                            <Button onClick={() => navigate('/upload')} className="w-full">Upload Document</Button>
                        </div>

                        {/* Option 2: Pick from History */}
                        <div className="space-y-4">
                            <h3 className="text-[length:var(--font-base)] font-bold text-neutral-900 px-1">Recent Documents</h3>
                            {pastDocuments.length > 0 ? (
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {pastDocuments.slice(0, 5).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelectPastDoc(item)}
                                            className="w-full text-left p-4 rounded-2xl bg-white border border-neutral-100 hover:border-brand-primary hover:shadow-md transition-all group flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primaryLight group-hover:text-brand-primary transition-colors">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[length:var(--font-base)] font-bold text-neutral-900 truncate">{item.name}</p>
                                                <p className="text-[length:var(--font-sm)] text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-neutral-300 group-hover:text-brand-primary">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                            </div>
                                        </button>
                                    ))}
                                    {pastDocuments.length > 5 && (
                                        <button 
                                            onClick={() => navigate('/history')}
                                            className="w-full py-2 text-center text-brand-primary font-bold text-[length:var(--font-sm)] hover:underline"
                                        >
                                            View all {pastDocuments.length} documents
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                                    <p className="text-[length:var(--font-sm)] text-neutral-400">History is empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-160px)] px-0 sm:px-0 md:px-0 max-w-full lg:max-w-4xl pt-0 pb-0">
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 bg-white shadow-sm z-10 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-[length:var(--font-xl)] font-bold text-neutral-900">Document Chat</h1>
                    <p className="text-[length:var(--font-sm)] text-neutral-500 truncate max-w-[250px] sm:max-w-md">
                        {currentDocument?.name || state.currentDocuments?.[0]?.name || 'Discuss your document'}
                    </p>
                </div>
                {chatHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => dispatch({ type: APP_ACTIONS.CLEAR_CHAT })}>
                        Clear
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[color:var(--color-page-bg)]">
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-page-enter">
                        <div className="w-16 h-16 bg-brand-primaryLight rounded-full flex items-center justify-center mb-4">
                            <span className="text-brand-primary text-2xl font-bold">?</span>
                        </div>
                        <h2 className="text-[length:var(--font-xl)] font-bold text-neutral-900 mb-2">
                            Have questions?
                        </h2>
                        <p className="text-[length:var(--font-base)] text-neutral-600 mb-8">
                            Ask anything about your document, or try one of these common questions:
                        </p>
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={chatLoading} documentContext={simplifiedResult} />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto w-full">
                        {chatHistory.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                        {chatLoading && (
                            <ChatBubble message={{ role: 'model', content: 'loading' }} />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="shrink-0 p-4 bg-[color:var(--color-page-bg)] sm:bg-white border-t border-neutral-100 pb-safe z-10">
                <ChatInput onSendMessage={handleSendMessage} disabled={chatLoading} />
                {chatHistory.length > 0 && (
                    <div className="max-w-4xl mx-auto flex overflow-x-auto mt-2 pb-2 scrollbar-hide">
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={chatLoading} documentContext={simplifiedResult} />
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
