import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)', matcha: 'var(--matcha)', cream: 'var(--cream)', wood: 'var(--wood)',
        ink: 'var(--ink)', muted: 'var(--muted)', line: 'var(--line)',
      },
      fontFamily: { display: ['Sora', 'sans-serif'], sans: ['Manrope', 'sans-serif'] },
      borderRadius: { card: '1.5rem' },
    },
  },
  plugins: [],
} satisfies Config
