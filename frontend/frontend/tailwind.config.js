/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F1F3F2',
        fg: '#0E1413',
        secondary: '#59615F',
        muted: '#777D7B',
        surface: '#FFFFFF',
        border: '#D5D9D7',
        critical: '#F0481C',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Martian Mono"', 'monospace'],
      },
      gridTemplateColumns: {
        'story': 'minmax(0, 0.85fr) minmax(0, 1.35fr)',
      }
    },
  },
  plugins: [],
}