/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#f5f5f5',
        'card-bg': '#ffffff',
        'border': '#000000',
        'text-primary': '#000000',
        'text-secondary': '#666666',
        'text-tertiary': '#999999',
      },
      fontFamily: {
        'tiny5': ['Tiny5', 'monospace'],
      },
      borderWidth: {
        '2': '2px',
      },
    },
  },
  plugins: [],
}
