/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ Primary - Electric Blue (Neon)
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-darker) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },

        // ✅ Secondary - Neon Purple
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
        },

        // ✅ Accent - Vibrant Pink
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        },

        // ✅ Status Colors
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          light: 'rgb(var(--color-success-light) / <alpha-value>)',
        },

        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          light: 'rgb(var(--color-warning-light) / <alpha-value>)',
        },

        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          light: 'rgb(var(--color-error-light) / <alpha-value>)',
        },

        // ✅ Neutral - Dark Theme
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },

      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        display: ['Orbitron', 'Inter', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },

      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': {
            textShadow:
              '0 0 5px rgb(var(--color-primary) / 0.5)',
          },
          '100%': {
            textShadow:
              '0 0 20px rgb(var(--color-primary) / 0.8), 0 0 30px rgb(var(--color-secondary) / 0.6)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },

      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgb(var(--color-primary) / 0.1) 0%, rgb(var(--color-secondary) / 0.05) 100%)',
        'hero-pattern':
          "url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        'gradient-radial':
          'radial-gradient(var(--tw-gradient-stops))',
      },

      boxShadow: {
        'glow': '0 0 20px rgb(var(--color-primary) / 0.4)',
        'glow-lg': '0 0 30px rgb(var(--color-primary) / 0.6)',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
    },
  },

  plugins: [],
};
