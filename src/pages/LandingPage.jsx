import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, BrainCircuit, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GuidedTour } from '../components/onboarding/GuidedTour';
import { ROUTES } from '../utils/constants';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-16 pb-12 w-full mx-auto items-center animate-page-enter">
                {/* Hero Section */}
                <section className="w-full text-center px-4 pt-12 pb-16 lg:pt-24 hero-gradient dark:from-slate-900 dark:to-slate-800 rounded-b-[3rem] shadow-sm">
                    <h1 className="text-[length:var(--font-3xl)] md:text-5xl lg:text-6xl font-extrabold text-[color:var(--color-text-primary)] tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
                        Understand Any Document, <br className="hidden sm:block" />
                        <span className="text-brand-primary">Instantly.</span>
                    </h1>
                    <p className="text-[length:var(--font-lg)] md:text-[length:var(--font-xl)] text-[color:var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        DocuClear translates complex legal, medical, and government jargon into plain, easy-to-read language. No more confusion.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="xl" onClick={() => navigate(ROUTES.UPLOAD)} className="w-full sm:w-auto px-10 gap-3">
                            <Upload size={24} />
                            Start for Free
                        </Button>
                        <Button variant="secondary" size="xl" onClick={() => navigate(ROUTES.AUTH)} className="w-full sm:w-auto px-10">
                            Sign In to Save
                        </Button>
                    </div>
                </section>

                {/* How it works */}
                <section className="w-full px-4 max-w-5xl">
                    <h2 className="text-[length:var(--font-2xl)] font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Upload,      title: '1. Upload',     desc: 'Securely upload a PDF, photo, or Word document.' },
                            { icon: BrainCircuit, title: '2. We Analyse', desc: 'Our AI scans for key details and hidden warnings.' },
                            { icon: Zap,          title: '3. Get Clarity', desc: 'Read a simplified version in plain English or Kiswahili.' },
                        ].map((item, i) => (
                            <Card key={i} className="text-center p-8 border-none bg-brand-primaryLight/10 dark:bg-brand-primaryLight/5 shadow-none hover:bg-brand-primaryLight/20 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-[color:var(--color-card-bg)] rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-[length:var(--font-xl)] font-bold mb-3 text-[color:var(--color-text-primary)]">{item.title}</h3>
                                <p className="text-[length:var(--font-base)] text-[color:var(--color-text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full py-8 text-center text-neutral-400 mt-20 border-t border-neutral-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <ShieldCheck size={20} />
                        <span>Your privacy is protected.</span>
                    </div>
                    <p>© {new Date().getFullYear()} DocuClear. All rights reserved.</p>
                </footer>
            </div>

            {/* Floating guided tour — rendered outside the page div so it sits above everything */}
            <GuidedTour />
        </>
    );
}
