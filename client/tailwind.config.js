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
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-dark': '#0F766E',
          'teal-subtle': '#CCFBF1',
          gold: '#D97706',
          'gold-light': '#F59E0B',
          'gold-subtle': '#FEF3C7',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.06), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(11, 25, 44, 0.12), 0 4px 10px -2px rgba(11, 25, 44, 0.06)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
