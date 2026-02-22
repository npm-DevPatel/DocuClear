import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(({
    label,
    error,
    helperText,
    required,
    className,
    containerClassName,
    ...props
}, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;

    const hasError = !!error;

    const inputBase = "w-full min-h-[56px] bg-white border-2 rounded-xl py-3.5 px-4 text-[length:var(--font-base)] text-neutral-900 placeholder:text-neutral-400 placeholder:not-italic focus:outline-none focus:ring-0 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed";

    let borderClass = "border-neutral-300 focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]";
    if (hasError) {
        borderClass = "border-brand-danger focus:border-brand-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]";
    }

    return (
        <div className={clsx("flex flex-col", containerClassName)}>
            {label && (
                <label htmlFor={id} className="text-[length:var(--font-sm)] font-semibold text-neutral-700 mb-1.5 flex items-center">
                    {label}
                    {required && <span className="text-brand-danger ml-1" aria-hidden="true">*</span>}
                    {required && <span className="sr-only">(required)</span>}
                </label>
            )}

            <input
                id={id}
                ref={ref}
                required={required}
                aria-invalid={hasError}
                aria-describedby={
                    clsx(hasError && `${id}-error`, helperText && `${id}-helper`) || undefined
                }
                className={twMerge(clsx(inputBase, borderClass, className))}
                {...props}
            />

            {helperText && !hasError && (
                <p id={`${id}-helper`} className="text-[length:var(--font-sm)] text-neutral-500 mt-1">
                    {helperText}
                </p>
            )}

            {hasError && (
                <p id={`${id}-error`} className="text-[length:var(--font-sm)] text-brand-danger mt-1.5 flex items-center gap-1" role="alert" aria-live="assertive">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
