import React from 'react';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateICSFile, buildGoogleCalendarURL } from '../../utils/calendarUtils';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';

export function CalendarAddButton({ deadline }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { state: { isGuestMode } } = useAuth();

    if (!deadline || !deadline.date) return null;

    const title = "Document Deadline: Action Required";
    const desc = deadline.description;

    const handleDownloadICS = () => {
        generateICSFile(title, desc, new Date(deadline.date));
        setIsOpen(false);
    };

    const handleGoogleCalendar = () => {
        const url = buildGoogleCalendarURL(title, desc, new Date(deadline.date));
        window.open(url, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            <Button size="sm" variant="secondary" onClick={() => setIsOpen(true)} className="gap-2 shrink-0">
                <CalendarIcon size={16} />
                <span>Add to Calendar</span>
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add to Calendar">
                {isGuestMode && (
                    <div className="mb-4 bg-brand-warningLight p-3 rounded-lg text-brand-warningText text-[length:var(--font-sm)]">
                        Event will be downloaded. Sign in to sync directly with Google Calendar.
                    </div>
                )}
                <div className="space-y-3">
                    <Button
                        fullWidth
                        variant="secondary"
                        className="justify-start gap-3"
                        onClick={handleGoogleCalendar}
                        disabled={isGuestMode}
                    >
                        Google Calendar
                    </Button>
                    <Button fullWidth variant="secondary" className="justify-start gap-3" onClick={handleDownloadICS}>
                        <Download size={20} className="text-neutral-500" />
                        Download .ics file (Apple/Outlook)
                    </Button>
                </div>
            </Modal>
        </>
    );
}
