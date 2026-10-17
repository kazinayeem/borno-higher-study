/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B192C',
          'navy-light': '#1E3E62',
          'navy-dark': '#060E18',
          charcoal: '#0F172A',
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-dark': '#0F766E',
          'teal-subtle': '#CCFBF1',
          champagne: '#C5A059',
          'champagne-light': '#DFCA8C',
          'champagne-subtle': '#F9F6F0',
          gold: '#C5A059',
          surface: '#FFFFFF',
          'surface-subtle': '#F9F9F8',
          'surface-warm': '#F7F7F6',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Bengali"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"DM Sans"', '"Noto Sans Bengali"', 'Inter', 'system-ui', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'Inter', 'sans-serif'],
        serif: ['"DM Sans"', '"Noto Sans Bengali"', 'Inter', 'sans-serif'],
        editorial: ['"DM Sans"', '"Noto Sans Bengali"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(11, 25, 44, 0.03)',
        'subtle': '0 1px 2px 0 rgba(11, 25, 44, 0.04)',
        'card': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px -1px rgba(11, 25, 44, 0.03)',
        'card-hover': '0 4px 14px -2px rgba(11, 25, 44, 0.07), 0 2px 4px -2px rgba(11, 25, 44, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(11, 25, 44, 0.08), 0 8px 10px -6px rgba(11, 25, 44, 0.04)',
      },
      maxWidth: {
        'prose-editorial': '72ch',
      },
    },
  },
  plugins: [],
}
