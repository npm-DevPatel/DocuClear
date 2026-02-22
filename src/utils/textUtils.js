export function truncate(text, length = 35) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}
