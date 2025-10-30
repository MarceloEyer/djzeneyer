/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}',
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
        'background': 'rgb(var(--color-background))',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      boxShadow: {
        neon: '0 0 20px rgb(var(--color-primary) / 0.5), 0 0 40px rgb(var(--color-secondary) / 0.3)',
        'neon-lg': '0 0 40px rgb(var(--color-primary) / 0.6), 0 0 80px rgb(var(--color-secondary) / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(var(--color-primary) / 0.2)',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        heartbeat: 'heartbeat 1.3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 20px rgb(var(--color-primary) / 0.5)' },
          to: { boxShadow: '0 0 30px rgb(var(--color-primary) / 0.8), 0 0 60px rgb(var(--color-primary) / 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgb(var(--color-primary) / 0.1) 0%, rgb(var(--color-secondary) / 0.05) 100%)',
        'mesh-gradient': 'linear-gradient(45deg, rgb(var(--color-primary) / 0.1) 0%, rgb(var(--color-secondary) / 0.05) 50%, rgb(var(--color-accent) / 0.05) 100%)',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};