// src/utils/costGuard.js
// Tracks Gemini API calls in localStorage.
// Warns the user via toast when approaching the free tier soft limit.
// This does NOT block requests — it is advisory only.

const STORAGE_KEY = 'docuclear_api_usage';
const SOFT_WARN_THRESHOLD = 10;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // "2025-01-15"
}

function getUsage() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const today = getTodayKey();
    if (stored.date !== today) {
      return { date: today, count: 0 };
    }
    return stored;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function saveUsage(usage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // localStorage unavailable — non-critical, continue silently
  }
}

/**
 * Records an API call and returns the new total count for today.
 * @returns {number} Number of API calls made today.
 */
export function recordAPICall() {
  const usage = getUsage();
  usage.count = (usage.count || 0) + 1;
  saveUsage(usage);
  return usage.count;
}

/**
 * Records an API call and triggers a toast warning if the soft limit is reached.
 * Import this in GeminiService.js and call it at the top of every public function.
 * The addToast function is accessed via a module-level setter to avoid circular imports.
 */
let _toastFn = null;

export function setToastFunction(fn) {
  _toastFn = fn;
}

export function checkSoftLimit() {
  const count = recordAPICall();

  if (count === SOFT_WARN_THRESHOLD && _toastFn) {
    _toastFn({
      type: 'info',
      message: `You have analyzed ${count} documents today. The free service supports around 80 documents per day.`,
    });
  }

  return count;
}

/**
 * Returns today's API call count without recording a new one.
 * @returns {number}
 */
export function getTodayCallCount() {
  return getUsage().count || 0;
}
