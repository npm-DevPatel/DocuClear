import React from 'react';

export function Spinner({ size = 'md', color = 'currentColor', className }) {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-3",
    };

    return (
        <div
            className={`inline-block animate-spin-slow rounded-full border-solid border-t-transparent ${sizes[size]} ${className || ''}`}
            style={{ borderColor: color, borderTopColor: 'transparent' }}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}
