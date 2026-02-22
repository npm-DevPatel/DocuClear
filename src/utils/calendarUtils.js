import { addDays } from 'date-fns';

function formatDateToICS(date) {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 15) + 'Z';
}

export function generateICSFile(title, description, dueDate) {
    const startDate = dueDate || new Date();

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DocuClear//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateToICS(startDate)}`,
        `DTEND:${formatDateToICS(addDays(startDate, 1))}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
}

export function buildGoogleCalendarURL(title, description, date) {
    const formatGCal = (d) => {
        return d.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 15) + 'Z';
    };

    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(9, 0, 0, 0); // Default to 9 AM
    const endDate = new Date(startDate);
    endDate.setHours(9, 30, 0, 0); // 30-minute event

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${formatGCal(startDate)}/${formatGCal(endDate)}`,
        details: description,
        trp: 'false',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
