/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#FFFFFF',
          secondary: '#F8FAFC',
          card: '#FFFFFF',
          text: '#333333',
          'text-secondary': '#6B7280',
          border: '#E5E5E5',
          input: '#F9FAFB',
        },
        // Dark mode colors
        dark: {
          bg: '#121212',
          secondary: '#1F1F1F',
          card: '#2D2D2D',
          text: '#F5F5F5',
          'text-secondary': '#A1A1AA',
          border: '#404040',
          input: '#374151',
        }
      },
      animation: {
        'theme-transition': 'theme-fade 0.3s ease-in-out',
      },
      keyframes: {
        'theme-fade': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};