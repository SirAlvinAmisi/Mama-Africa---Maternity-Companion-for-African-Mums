/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure this path includes all your source files
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#E6F0FA',
        'cards-color': '#F0F7FF',
        'blue-button': '#1E90FF',
        green: '#28A745',
        footer: '#D4E4F7',
      },
      fontFamily: {
        adamina: ['Adamina', 'serif'],
        inria: ['Inria Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

