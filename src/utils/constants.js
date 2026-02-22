export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  PROCESSING: '/processing',
  RESULTS: '/results',
  CHAT: '/chat',
  HISTORY: '/history',
  AUTH: '/auth',
};

export const LIMITS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MIN_FILE_SIZE_BYTES: 1024,
  GUEST_MAX_DOCUMENTS: 3,
  MAX_HISTORY_ITEMS: 50,
  MAX_CHAT_HISTORY: 20,
  MAX_DOCUMENT_NAME: 40,
  TOAST_DURATION_INFO: 4000,
  TOAST_DURATION_ERROR: 8000,
  AUTO_DELETE_DEFAULT: 30,
};

export const FONT_SCALE_STEPS = [0.875, 1.0, 1.25, 1.5, 1.75];
export const FONT_SCALE_LABELS = ['Smaller', 'Normal', 'Large', 'Larger', 'Largest'];

export const DOC_TYPES = {
  legal: { label: 'Legal Document', color: 'blue', icon: 'Scale' },
  medical: { label: 'Medical Document', color: 'green', icon: 'Heart' },
  government: { label: 'Government Form', color: 'purple', icon: 'Building' },
  general: { label: 'General Document', color: 'neutral', icon: 'FileText' },
};

export const STAGE_LABELS = {
  idle: 'Ready',
  validating: 'Checking your file...',
  ocr: 'Reading your document...',
  ai: 'Understanding your document...',
  complete: 'Done!',
  error: 'Something went wrong',
};

export const REASSURANCE_MESSAGES = [
  "Taking a careful look at your document...",
  "Making sure every word is clear...",
  "Almost there — finding the key points...",
  "Checking for anything that needs your attention...",
  "We want to make sure we get this right for you...",
  "Nearly done — putting it all together...",
];

export const AUTO_DELETE_OPTIONS = [
  { days: 7, label: '7 days', note: 'Most private' },
  { days: 14, label: '14 days', note: '' },
  { days: 30, label: '30 days', note: 'Recommended' },
  { days: 60, label: '60 days', note: '' },
  { days: 90, label: '90 days', note: 'Least private' },
];

export const SUGGESTED_QUESTIONS = [
  "What do I need to do first?",
  "Are there any deadlines I should know about?",
  "Is there anything I need to sign?",
  "What does this mean for me?",
  "Who do I contact if I have questions?",
  "Can you explain that more simply?",
];

export const MOCK_EXTRACTED_TEXT = `
NOTICE OF RENT INCREASE

Dear Tenant,

This notice is to inform you that pursuant to Section 14(b) of your 
lease agreement dated January 1, 2024, your monthly rental obligation 
for the premises located at 123 Main Street, Apartment 4B, will be 
increased by 8.5% effective March 1, 2025.

Your current monthly rent of $1,200.00 will increase to $1,302.00 per month.
This increase complies with local rent stabilization ordinances.

You must notify our office in writing within 30 days of receiving this 
notice if you intend to vacate the premises. Failure to respond will 
be construed as your acceptance of these new terms.

Additionally, please note that the security deposit will be adjusted 
to reflect the new rental amount, requiring an additional deposit 
payment of $102.00 due by February 15, 2025.

For inquiries, contact our Property Management office.

Sincerely,
Harbor Properties LLC
`;

export const MOCK_SIMPLIFIED_RESULT = {
  summary: `Your landlord is raising your rent. Starting March 1, 2025, you will pay $1,302 per month instead of $1,200. That is an increase of $102 each month.\n\nYou have 30 days to tell your landlord in writing if you plan to move out. If you do not respond, your landlord will assume you are staying and agree to the new rent.\n\nYou also need to pay an extra $102 for your security deposit by February 15, 2025. This is separate from your monthly rent.`,
  oneSentenceSummary: 'Your rent is going up by $102/month starting March 1, 2025, and you have 30 days to decide if you want to stay.',
  keyTerms: [
    { term: 'Rental obligation', definition: 'The amount of money you are required to pay for your home each month.' },
    { term: 'Lease agreement', definition: 'The contract you signed when you moved in that explains the rules of renting your home.' },
    { term: 'Rent stabilization ordinances', definition: 'Local laws that limit how much a landlord can raise your rent each year.' },
    { term: 'Security deposit', definition: 'Money you paid at the beginning of your tenancy that the landlord holds. You get it back when you move out if there is no damage.' },
    { term: 'Construed as acceptance', definition: 'This means that if you do not respond, the landlord will treat your silence as agreeing to the new terms.' },
  ],
  redFlags: [
    {
      type: 'deadline',
      description: 'You have 30 days from receiving this letter to tell your landlord in writing if you plan to move out.',
      date: null,
      severity: 'high',
    },
    {
      type: 'financial',
      description: 'You need to pay an extra $102 for your security deposit by February 15, 2025.',
      date: '2025-02-15',
      severity: 'high',
    },
    {
      type: 'action_required',
      description: 'If you want to move out, you must tell your landlord IN WRITING. A phone call is not enough.',
      date: null,
      severity: 'medium',
    },
  ],
  documentType: 'legal',
  originalLength: 892,
  simplifiedLength: 487,
};
