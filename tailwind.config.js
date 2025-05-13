/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          dark: 'rgb(var(--color-primary) / 0.8)',
          light: 'rgb(var(--color-primary) / 1.2)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
          dark: 'rgb(var(--color-secondary) / 0.8)',
          light: 'rgb(var(--color-secondary) / 1.2)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
          dark: 'rgb(var(--color-accent) / 0.8)',
          light: 'rgb(var(--color-accent) / 1.2)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success))',
          dark: 'rgb(var(--color-success) / 0.8)',
          light: 'rgb(var(--color-success) / 1.2)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning))',
          dark: 'rgb(var(--color-warning) / 0.8)',
          light: 'rgb(var(--color-warning) / 1.2)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error))',
          dark: 'rgb(var(--color-error) / 0.8)',
          light: 'rgb(var(--color-error) / 1.2)',
        },
        background: 'rgb(var(--color-background))',
        surface: 'rgb(var(--color-surface))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(var(--color-primary) / 0.5)' },
          '100%': { boxShadow: '0 0 20px rgb(var(--color-primary) / 0.8), 0 0 30px rgb(var(--color-secondary) / 0.6)' },
        },
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};