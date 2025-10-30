/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--color-primary-darker) / <alpha-value>)',
        'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-light': 'rgb(var(--color-secondary-light) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-light': 'rgb(var(--color-accent-light) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        'success-light': 'rgb(var(--color-success-light) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        'warning-light': 'rgb(var(--color-warning-light) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        'error-light': 'rgb(var(--color-error-light) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      ringOffsetColor: {
        background: 'rgb(var(--color-background))',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgb(var(--color-primary) / 0.5), 0 0 40px rgb(var(--color-secondary) / 0.3)',
        'neon-lg': '0 0 40px rgb(var(--color-primary) / 0.6), 0 0 80px rgb(var(--color-secondary) / 0.4)',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 20px rgb(var(--color-primary) / 0.5)' },
          to: { boxShadow: '0 0 30px rgb(var(--color-primary) / 0.8), 0 0 60px rgb(var(--color-primary) / 0.5)' },
        },
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};