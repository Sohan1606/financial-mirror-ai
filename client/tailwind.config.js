/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system'],
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
        },
        slate: {
          900: '#0a0d14',
          950: '#020617',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      borderRadius: {
        '3xl': '24px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}


