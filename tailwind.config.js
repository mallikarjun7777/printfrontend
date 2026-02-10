/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1C1F2A",
        secondary: "#00FF88",
        accent: "#14B8A6",
        light: "#F9FAFB",
        dark: "#111827",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #00FF88 0%, #14B8A6 100%)',
      }
    },
  },
  plugins: [],
};
