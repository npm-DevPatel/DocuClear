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

    const handleSendMessage = async (text) => {
        if (!text.trim() || chatLoading) return;

        // 1. Add user message to local state immediately (instant UI feedback)
        const userMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        };
        dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: userMessage });
        dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: true });

        // 2. Persist user message to Firestore (fire-and-forget — don't block UI)
        if (isAuthenticated && user?.uid && currentDocumentId) {
            saveChatMessage(user.uid, currentDocumentId, userMessage, activeLanguage).catch(console.error);
        }

        try {
            // 3. Build chat history for AI memory injection
            let historyForAI = chatHistory;

            if (isAuthenticated && user?.uid && currentDocumentId) {
                // For signed-in users: pull last 5 messages from Firestore for true persistence
                // This lets the user resume context after a page refresh.
                try {
                    historyForAI = await getRecentChatHistory(user.uid, currentDocumentId, 5);
                } catch (firestoreError) {
                    // Graceful degradation: fall back to in-memory history if Firestore fails
                    console.warn('[ChatPage] Firestore history fetch failed, using in-memory history:', firestoreError);
                    historyForAI = chatHistory;
                }
            }

            // 4. Call AI with history context
            const answer = await askDocumentQuestion(text, simplifiedResult, historyForAI);

            // 5. Add assistant message to local state
            const assistantMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: answer,
                timestamp: Date.now(),
            };
            dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: assistantMessage });

            // 6. Persist assistant response to Firestore
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
            if (addToast) {
                addToast({ type: 'error', message: 'Could not get an answer. Please check your connection and try again.' });
            }
        } finally {
            dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: false });
        }
    };

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-160px)] px-0 sm:px-0 md:px-0 max-w-full lg:max-w-4xl pt-0 pb-0">
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 bg-white shadow-sm z-10 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-[length:var(--font-xl)] font-bold text-neutral-900">Document Chat</h1>
                    <p className="text-[length:var(--font-sm)] text-neutral-500 truncate max-w-[250px] sm:max-w-md">
                        {currentDocument?.name || 'Discuss your document'}
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
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={chatLoading} />
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
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={chatLoading} />
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
