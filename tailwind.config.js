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
        background: '#F7F7F2',
        foreground: '#171717',
        muted: '#777777',
        accent: '#B7FF65',
        silver: '#C0C0C0',
        // Dark mode colors
        dark: {
          background: '#0A0A0A',
          foreground: '#F7F7F2',
          muted: '#888888',
          accent: '#B7FF65',
          silver: '#A0A0A0',
          card: '#121212',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}