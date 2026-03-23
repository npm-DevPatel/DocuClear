export function truncate(text, length = 35) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Performs lightweight keyword-based document type detection.
 * This is a HINT to the AI prompt — the AI will override with its own classification.
 * Do not rely on this for display. Use result.documentType from the AI response.
 *
 * @param {string} text
 * @returns {'legal'|'medical'|'government'|'general'}
 */
export function detectDocumentTypeHint(text) {
  const lower = (text || '').toLowerCase();

  const legalSignals = ['lease', 'tenancy', 'eviction', 'court', 'plaintiff', 'defendant',
    'title deed', 'succession', 'probate', 'mortgage', 'charge', 'caveat', 'legal notice',
    'auctioneer', 'land act', 'arbitration'];

  const medicalSignals = ['diagnosis', 'prescription', 'patient', 'hospital', 'nhif', 'shif',
    'discharge', 'clinical', 'dosage', 'referral', 'treatment', 'physician', 'pathology'];

  const governmentSignals = ['kra', 'nssf', 'ntsa', 'county government', 'gazette',
    'huduma', 'national government', 'ministry', 'department', 'commissioner',
    'pin certificate', 'tax compliance', 'itax'];

  const score = (signals) => signals.filter(s => lower.includes(s)).length;

  const scores = {
    legal: score(legalSignals),
    medical: score(medicalSignals),
    government: score(governmentSignals),
  };

  const maxType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return maxType[1] > 0 ? maxType[0] : 'general';
}
