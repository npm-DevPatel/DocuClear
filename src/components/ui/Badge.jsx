import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ variant = 'default', className, children, ...props }) {
    const baseClasses = "inline-flex items-center gap-1 rounded-full text-[length:var(--font-xs)] font-semibold py-1 px-2.5";

    const variants = {
        default: "bg-neutral-100 text-neutral-700",
        primary: "bg-brand-primaryLight text-brand-primaryText",
        success: "bg-brand-successLight text-brand-successText",
        warning: "bg-brand-warningLight text-brand-warningText",
        danger: "bg-brand-dangerLight text-brand-dangerText",
        neutral: "bg-neutral-50 border border-neutral-200 text-neutral-600"
    };

    return (
        <span className={twMerge(clsx(baseClasses, variants[variant], className))} {...props}>
            {children}
        </span>
    );
}
