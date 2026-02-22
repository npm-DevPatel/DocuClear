import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ variant = 'default', className, children, ...props }) {
    const baseClasses = "rounded-2xl overflow-hidden";

    const paddingClass = "p-4 sm:p-6";

    const variants = {
        default: "bg-white border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]",
        elevated: "bg-white border border-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
        bordered: "bg-white border-2 border-neutral-200",
        filled: "bg-neutral-100",
        'alert-danger': "bg-brand-dangerLight border-2 border-red-300",
        'alert-warning': "bg-brand-warningLight border-2 border-amber-300",
        'alert-success': "bg-brand-successLight border-2 border-green-300",
    };

    return (
        <div className={twMerge(clsx(baseClasses, paddingClass, variants[variant], className))} {...props}>
            {children}
        </div>
    );
}
