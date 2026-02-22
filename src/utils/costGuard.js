const DAILY_API_LIMIT_SOFT = 10;
const STORAGE_KEY = 'docuclear_api_usage';

function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

export function recordAPICall() {
    const today = getTodayKey();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    if (stored.date !== today) {
        stored.date = today;
        stored.count = 0;
    }

    stored.count = (stored.count || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    return stored.count;
}

export function checkSoftLimit(addToast) {
    const count = recordAPICall();

    if (count === DAILY_API_LIMIT_SOFT) {
        if (addToast) {
            addToast({
                type: 'info',
                message: `You've analyzed ${count} documents today. The free tier supports up to ~80 documents per day.`,
            });
        }
    }

    return count;
}
