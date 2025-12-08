/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#64B5F6',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
      },
    },
  },
  plugins: [],
}

