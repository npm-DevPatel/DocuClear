import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, BookOpen, MessageSquare, History } from 'lucide-react';

const TOUR_STEPS = [
    {
        icon: Upload,
        color: 'bg-brand-primary',
        title: 'Upload Your Document',
        description: 'Tap "New Doc" and upload up to 3 documents — a photo from your phone, a PDF, or a Word file all work.',
        emoji: '📄',
    },
    {
        icon: BookOpen,
        color: 'bg-blue-500',
        title: 'We Simplify It For You',
        description: 'Our AI reads the document and explains it in plain, everyday language — no legal jargon, no confusion.',
        emoji: '✨',
    },
    {
        icon: MessageSquare,
        color: 'bg-emerald-500',
        title: 'Ask Follow-Up Questions',
        description: 'On the Chat page, you can ask anything like "Do I owe money?" or "What is the deadline?" — in your own words.',
        emoji: '💬',
    },
    {
        icon: History,
        color: 'bg-purple-500',
        title: 'Your Documents Are Saved',
        description: 'If you sign in, all your documents are securely saved in History so you can come back and re-read them anytime.',
        emoji: '🗂️',
    },
];

const STORAGE_KEY = 'docuclear_tour_done';

export function GuidedTour() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [tourDone, setTourDone] = useState(() => {
        try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
        catch { return false; }
    });

    const openTour = () => {
        setStep(0);
        setIsOpen(true);
    };

    const closeTour = (completed = false) => {
        setIsOpen(false);
        if (completed) {
            setTourDone(true);
            try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignore */ }
        }
    };

    const handleNext = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            closeTour(true);
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const currentStep = TOUR_STEPS[step];
    const StepIcon = currentStep.icon;
    const isLast = step === TOUR_STEPS.length - 1;

    return (
        <>
            {/* Floating help button */}
            <button
                onClick={openTour}
                className="fixed bottom-24 sm:bottom-8 right-5 z-50 w-14 h-14 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-primary/90 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-brand-primary/30"
                aria-label="Open guided tour"
                title="How to use DocuClear"
            >
                <span className="text-2xl font-bold leading-none" aria-hidden>?</span>
            </button>

            {/* Modal overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="How to use DocuClear"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                        onClick={() => closeTour(false)}
                    />

                    {/* Modal card */}
                    <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[modalIn_0.25s_ease-out_forwards]">
                        {/* Close button */}
                        <button
                            onClick={() => closeTour(false)}
                            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary z-10"
                            aria-label="Close tour"
                        >
                            <X size={20} />
                        </button>

                        {/* Step icon area */}
                        <div className={`${currentStep.color} p-10 flex flex-col items-center justify-center`}>
                            <div className="text-6xl mb-3">{currentStep.emoji}</div>
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                <StepIcon size={32} className="text-white" />
                            </div>
                        </div>

                        {/* Step content */}
                        <div className="p-6">
                            {/* Progress dots */}
                            <div className="flex items-center justify-center gap-2 mb-5">
                                {TOUR_STEPS.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setStep(i)}
                                        className={`rounded-full transition-all duration-200 focus:outline-none ${
                                            i === step
                                                ? 'w-6 h-2.5 bg-brand-primary'
                                                : 'w-2.5 h-2.5 bg-neutral-200 hover:bg-neutral-300'
                                        }`}
                                        aria-label={`Go to step ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <h2 className="text-[length:var(--font-2xl)] font-bold text-neutral-900 mb-3 text-center">
                                {currentStep.title}
                            </h2>
                            <p className="text-[length:var(--font-lg)] text-neutral-600 leading-relaxed text-center mb-6">
                                {currentStep.description}
                            </p>

                            {/* Navigation buttons */}
                            <div className="flex items-center gap-3">
                                {step > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="flex items-center gap-1 p-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
                                        aria-label="Previous step"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-primary text-white font-bold text-[length:var(--font-base)] hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
                                >
                                    {isLast ? (
                                        <span>Got it! Let's start</span>
                                    ) : (
                                        <>
                                            <span>Next</span>
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Step counter */}
                            <p className="text-center text-[length:var(--font-sm)] text-neutral-400 mt-4">
                                Step {step + 1} of {TOUR_STEPS.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.92) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);   }
                }
            `}</style>
        </>
    );
}
