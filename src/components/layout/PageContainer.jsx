import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PageContainer({ className, children, ...props }) {
    return (
        <div
            className={twMerge(clsx("flex-1 flex flex-col w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 animate-page-enter max-w-prose mx-auto lg:max-w-4xl", className))}
            {...props}
        >
            {children}
        </div>
    );
}
