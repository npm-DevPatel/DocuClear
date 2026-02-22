import React from 'react';
import { clsx } from 'clsx';
import { Bot, User } from 'lucide-react';

export function ChatBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={clsx("flex w-full mb-4 animate-card-enter", isUser ? "justify-end" : "justify-start")}>
            <div className={clsx("flex max-w-[85%] gap-2 sm:gap-3", isUser ? "flex-row-reverse" : "flex-row")}>

                <div className={clsx(
                    "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mt-1",
                    isUser ? "bg-brand-primary text-white" : "bg-brand-success text-white"
                )}>
                    {isUser ? <User size={20} /> : <Bot size={20} />}
                </div>

                <div className={clsx(
                    "p-3 sm:p-4 rounded-2xl relative shadow-sm",
                    isUser
                        ? "bg-brand-primary text-white rounded-tr-sm"
                        : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm"
                )}>
                    <div className="text-[length:var(--font-base)] whitespace-pre-wrap leading-relaxed">
                        {message.content === 'loading' ? (
                            <div className="flex gap-1 items-center h-6">
                                <div className="w-2 h-2 rounded-full bg-neutral-400 typing-dot"></div>
                                <div className="w-2 h-2 rounded-full bg-neutral-400 typing-dot"></div>
                                <div className="w-2 h-2 rounded-full bg-neutral-400 typing-dot"></div>
                            </div>
                        ) : (
                            message.content
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
