import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, Clock, MessageSquare } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const NAV_ITEMS = [
    { name: 'Home',    path: ROUTES.HOME,    icon: Home          },
    { name: 'New Doc', path: ROUTES.UPLOAD,  icon: Upload        },
    { name: 'Chat',    path: ROUTES.CHAT,    icon: MessageSquare },
    { name: 'History', path: ROUTES.HISTORY, icon: Clock         },
];

// Mobile bottom bar — shown only on small screens
export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav
            className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
            aria-label="Main navigation"
        >
            <div className="flex justify-around items-center h-20 px-2">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] focus:outline-none focus:bg-neutral-50 rounded-xl transition-colors ${isActive ? 'text-brand-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={item.name}
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

// Desktop horizontal nav — shown inside TopBar on sm+ screens
export function DesktopNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-[length:var(--font-sm)] font-semibold
                            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary
                            ${isActive
                                ? 'bg-brand-primaryLight/60 text-brand-primary'
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                            }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                        {item.name}
                    </button>
                );
            })}
        </nav>
    );
}
