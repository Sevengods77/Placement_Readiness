/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(245, 58%, 51%)',
        'primary-dark': 'hsl(245, 58%, 41%)',
        'primary-light': 'hsl(245, 58%, 61%)',
      },
    },
  },
  plugins: [],
}
