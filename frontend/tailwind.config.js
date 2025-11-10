/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6200ee',
        'dark-bg': '#121212',
        'dark-surface': '#1e1e1e',
        'light-bg': '#ffffff',
        'light-surface': '#f5f5f5',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
