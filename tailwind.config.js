/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#F6F3EF',
        fg:       '#0B3D3D',
        accent:   '#0A7F7F',
        secondary:'#3D6060',
        muted:    '#6B8A8A',
        surface:  '#FFFFFF',
        border:   '#D4DDD9',
        critical: '#F0481C',
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans:  ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"IBM Plex Mono"', 'monospace'],
      },
      gridTemplateColumns: {
        'story': 'minmax(0, 0.85fr) minmax(0, 1.35fr)',
      }
    },
  },
  plugins: [],
}