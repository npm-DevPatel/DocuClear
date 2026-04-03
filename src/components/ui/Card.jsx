import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ variant = 'default', className, children, ...props }) {
    const baseClasses = "rounded-2xl overflow-hidden";

    const paddingClass = "p-4 sm:p-6";

    const variants = {
        default: "bg-[color:var(--color-card-bg)] border border-[color:var(--color-border)] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]",
        elevated: "bg-[color:var(--color-card-bg)] border border-[color:var(--color-border)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
        bordered: "bg-[color:var(--color-card-bg)] border-2 border-[color:var(--color-border)]",
        filled: "bg-neutral-100 dark:bg-neutral-800",
        'alert-danger': "bg-brand-dangerLight dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800",
        'alert-warning': "bg-brand-warningLight dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800",
        'alert-success': "bg-brand-successLight dark:bg-emerald-950/30 border-2 border-green-300 dark:border-green-800",
    };

    return (
        <div className={twMerge(clsx(baseClasses, paddingClass, variants[variant], className))} {...props}>
            {children}
        </div>
    );
}
