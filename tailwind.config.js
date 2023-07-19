/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  mode: 'jit',
  plugins: [],
  theme: {
    extend: {
      backgroundColor: {
        default: '#e0e0e0',
      },
      colors: {
        'light-gray': '#e0e0e0',
      },
    },
  },
  variants: {
    extend: {},
  },
}
