/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B1538',
        'primary-dark': '#6B1028',
      },
      keyframes: {
        playGif: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '45%': { transform: 'scale(1.05)', filter: 'brightness(1.1)' },
          '50%': { transform: 'scale(1.05)', filter: 'brightness(1.1)' },
          '95%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' }
        }
      },
      animation: {
        'gif': 'playGif 8s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
