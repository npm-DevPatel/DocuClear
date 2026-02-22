import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Spinner } from './Spinner';

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    disabled,
    className,
    children,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 tracking-wide focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-2";

    const variants = {
        primary: "bg-brand-primary text-white shadow-md hover:bg-brand-primaryHover hover:shadow-lg hover:-translate-y-[1px] active:bg-blue-800 active:translate-y-0 active:shadow-sm disabled:bg-blue-300 disabled:text-white disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70",
        secondary: "bg-white text-neutral-700 border-2 border-neutral-200 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-md active:bg-neutral-100 active:shadow-none disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
        ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
        danger: "bg-brand-danger text-white shadow-md hover:bg-brand-dangerHover hover:shadow-lg hover:-translate-y-[1px] active:bg-red-700 active:translate-y-0 disabled:bg-red-300 disabled:cursor-not-allowed",
        success: "bg-brand-success text-white shadow-md hover:bg-brand-successHover hover:shadow-lg hover:-translate-y-[1px] active:bg-green-700 active:translate-y-0"
    };

    const sizes = {
        sm: "min-h-[44px] py-2.5 px-4 text-[length:var(--font-sm)]",
        md: "min-h-[56px] py-3.5 px-6 text-[length:var(--font-base)]",
        lg: "min-h-[64px] py-4 px-8 text-[length:var(--font-lg)]",
        xl: "min-h-[72px] py-5 px-10 text-[length:var(--font-xl)] font-bold"
    };

    const widthClass = fullWidth ? "w-full" : "whitespace-nowrap";
    const isDisabled = disabled || isLoading;

    return (
        <button
            className={twMerge(clsx(baseClasses, variants[variant], sizes[size], widthClass, className))}
            disabled={isDisabled}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'currentColor' : 'white'} />
                    <span className="ml-2">Loading...</span>
                </>
            ) : children}
        </button>
    );
}
