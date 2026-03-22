/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0C10',
          base: '#1F2833',
          light: '#C5C6C7',
          accent: '#66FCF1',
          accentDark: '#45A29E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
