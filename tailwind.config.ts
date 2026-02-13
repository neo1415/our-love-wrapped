import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#800020',
        'rose-gold': '#B76E79',
        cream: '#F5ECD7',
        'dark-bg': '#0D0608',
      },
      fontFamily: {
        title: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-cormorant)', 'serif'],
        ui: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
