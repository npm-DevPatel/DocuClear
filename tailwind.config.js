/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:      '#2563EB',
          primaryHover: '#1D4ED8',
          primaryLight: '#DBEAFE',
          primaryText:  '#1E3A8A',
          success:      '#10B981',
          successHover: '#059669',
          successLight: '#ECFDF5',
          successText:  '#065F46',
          warning:      '#F59E0B',
          warningHover: '#D97706',
          warningLight: '#FFFBEB',
          warningText:  '#92400E',
          danger:       '#EF4444',
          dangerHover:  '#DC2626',
          dangerLight:  '#FEF2F2',
          dangerText:   '#991B1B',
          neutral50:    '#F9FAFB',
          neutral100:   '#F3F4F6',
          neutral200:   '#E5E7EB',
          neutral300:   '#D1D5DB',
          neutral400:   '#9CA3AF',
          neutral500:   '#6B7280',
          neutral600:   '#4B5563',
          neutral700:   '#374151',
          neutral800:   '#1F2937',
          neutral900:   '#111827',
        }
      },
      minHeight: { 'touch': '56px', 'touch-lg': '64px' },
      minWidth:  { 'touch': '56px', 'touch-lg': '64px' },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  plugins: [],
}
