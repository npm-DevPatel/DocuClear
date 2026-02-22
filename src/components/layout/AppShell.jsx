import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../ui/ToastContainer';

export function AppShell() {
    return (
        <div className="flex flex-col min-h-screen bg-[color:var(--color-page-bg)] text-[color:var(--color-text-primary)] relative pb-20 sm:pb-0">
            <TopBar />

            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col pt-16 sm:pt-20">
                <Outlet />
            </main>

            <BottomNav />
            <ToastContainer />
        </div>
    );
}
