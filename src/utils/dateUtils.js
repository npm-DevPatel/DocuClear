import { format, isToday, isYesterday } from 'date-fns';

export function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return format(date, 'MMMM d, yyyy'); // March 15, 2024
}

export function formatRelativeDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
}
