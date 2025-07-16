/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'classic-pink': '#E9A7BB',
        'light-pink': '#EEC9D9',
        'pale-pink': '#F9E3EF',
        'almost-white': '#FFFEFE',
        'soft-white': '#F4F3F2',
      },
    },
  },
  plugins: [],
}

