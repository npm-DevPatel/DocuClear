import { format, isToday, isYesterday } from 'date-fns';

function parseDate(input) {
    if (!input) return null;
    // Check for Firebase Timestamp object
    if (typeof input === 'object' && input !== null) {
        if (typeof input.toMillis === 'function') return new Date(input.toMillis());
        if (input.seconds) return new Date(input.seconds * 1000);
    }
    return new Date(input);
}

export function formatDisplayDate(dateInput) {
    const date = parseDate(dateInput);
    if (!date || isNaN(date.getTime())) return '';
    return format(date, 'MMMM d, yyyy'); // March 15, 2024
}

export function formatRelativeDate(dateInput) {
    const date = parseDate(dateInput);
    if (!date || isNaN(date.getTime())) return '';
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
}
