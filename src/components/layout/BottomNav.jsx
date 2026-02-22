import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, Clock, MessageSquare } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: ROUTES.HOME, icon: Home },
        { name: 'New Doc', path: ROUTES.UPLOAD, icon: Upload },
        { name: 'Chat', path: ROUTES.CHAT, icon: MessageSquare },
        { name: 'History', path: ROUTES.HISTORY, icon: Clock },
    ];

    return (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-20 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] focus:outline-none focus:bg-neutral-50 rounded-xl transition-colors ${isActive ? 'text-brand-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div className={`p-1.5 rounded-full ${isActive ? 'bg-brand-primaryLight/50' : ''}`}>
                                <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                            </div>
                            <span className={`text-xs mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
