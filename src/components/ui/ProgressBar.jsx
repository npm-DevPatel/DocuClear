import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ProgressBar({ progress, label, colorClass = "bg-brand-primary", className }) {
    const clamped = Math.max(0, Math.min(100, progress));

    return (
        <div className={twMerge(clsx("w-full", className))} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
            <div className="flex justify-between mb-2">
                {label && <span className="text-[length:var(--font-sm)] font-medium text-neutral-700">{label}</span>}
                <span className="text-[length:var(--font-sm)] font-medium text-neutral-700">{clamped}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <div
                    className={clsx("h-3 rounded-full transition-all duration-300 ease-out", colorClass)}
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
