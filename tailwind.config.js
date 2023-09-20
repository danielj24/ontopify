/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        tall: { raw: '(min-height: 181px)' },
      },
    },
  },
  plugins: [],
}
