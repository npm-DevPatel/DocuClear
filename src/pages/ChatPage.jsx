import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { useAppContext, APP_ACTIONS } from '../hooks/useAppContext';
import { Button } from '../components/ui/Button';

export function ChatPage() {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Basic guard: if no simplified result, we could redirect, but left for demo flexibility
    }, [state.simplifiedResult, state.chatHistory, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.chatHistory, state.chatLoading]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text, id: Date.now() };
        dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: userMsg });
        dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: true });

        // Mock API call
        setTimeout(() => {
            const botMsg = {
                role: 'model',
                content: `I understand you're asking about: "${text}". Based on the document, here is a simplified explanation that addresses your concern directly without using complex jargon.`,
                id: Date.now() + 1
            };

            dispatch({ type: APP_ACTIONS.ADD_CHAT_MESSAGE, payload: botMsg });
            dispatch({ type: APP_ACTIONS.SET_CHAT_LOADING, payload: false });
        }, 1500);
    };

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-160px)] px-0 sm:px-0 md:px-0 max-w-full lg:max-w-4xl pt-0 pb-0">
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-100 bg-white shadow-sm z-10 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-[length:var(--font-xl)] font-bold text-neutral-900">Document Chat</h1>
                    <p className="text-[length:var(--font-sm)] text-neutral-500 truncate max-w-[250px] sm:max-w-md">
                        {state.currentDocument?.name || 'Discuss your document'}
                    </p>
                </div>
                {state.chatHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => dispatch({ type: APP_ACTIONS.CLEAR_CHAT })}>
                        Clear
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[color:var(--color-page-bg)]">
                {state.chatHistory.length === 0 ? (
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
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={state.chatLoading} />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto w-full">
                        {state.chatHistory.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                        {state.chatLoading && (
                            <ChatBubble message={{ role: 'model', content: 'loading' }} />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="shrink-0 p-4 bg-[color:var(--color-page-bg)] sm:bg-white border-t border-neutral-100 pb-safe z-10">
                <ChatInput onSendMessage={handleSendMessage} disabled={state.chatLoading} />
                {state.chatHistory.length > 0 && (
                    <div className="max-w-4xl mx-auto flex overflow-x-auto mt-2 pb-2 scrollbar-hide">
                        <SuggestedQuestions onSelect={handleSendMessage} disabled={state.chatLoading} />
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
