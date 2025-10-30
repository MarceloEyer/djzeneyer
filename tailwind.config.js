/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

const withOpacityValue = (variable) => ({ opacityValue }) => {
  if (opacityValue !== undefined) {
    return `hsla(var(${variable}), ${opacityValue})`;
  }
  return `hsl(var(${variable}))`;
};

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // ✅ SISTEMA DE CORES COM SUPORTE TOTAL A OPACITY
      colors: {
        // PRIMARY - Electric Blue Neon
        primary: withOpacityValue('--color-primary'),
        'primary-dark': 'rgb(var(--color-primary-darker) / <alpha-value>)',
        'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',

        // SECONDARY - Neon Purple
        secondary: withOpacityValue('--color-secondary'),
        'secondary-light': 'rgb(var(--color-secondary-light) / <alpha-value>)',

        // ACCENT - Vibrant Pink
        accent: withOpacityValue('--color-accent'),
        'accent-light': 'rgb(var(--color-accent-light) / <alpha-value>)',

        // STATUS COLORS
        success: withOpacityValue('--color-success'),
        'success-light': 'rgb(var(--color-success-light) / <alpha-value>)',

        warning: withOpacityValue('--color-warning'),
        'warning-light': 'rgb(var(--color-warning-light) / <alpha-value>)',

        error: withOpacityValue('--color-error'),
        'error-light': 'rgb(var(--color-error-light) / <alpha-value>)',

        // NEUTRAL - Dark Theme
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-light': 'rgb(var(--color-surface) / 0.5)',
        'surface-dim': 'rgb(var(--color-surface) / 0.2)',

        // UTILITY GRAYS
        'neutral-50': '#f9fafb',
        'neutral-100': '#f3f4f6',
        'neutral-900': '#111827',
      },

      // ✅ TIPOGRAFIA MODERNA
      fontFamily: {
        sans: [
          'Inter',
          'Inter Fallback',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'Orbitron',
          'Outfit',
          'Space Grotesk',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'Fira Code',
          '"Courier New"',
          'Courier',
          'monospace',
        ],
      },

      // ✅ TAMANHOS DE FONTE CUSTOMIZADOS
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },

      // ✅ ESPAÇAMENTO EXPANDIDO
      spacing: {
        ...Object.fromEntries(
          Array.from({ length: 96 }, (_, i) => [
            i.toString(),
            `${i * 0.25}rem`,
          ])
        ),
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '36': '9rem',
        '48': '12rem',
        '64': '16rem',
        '80': '20rem',
        '96': '24rem',
      },

      // ✅ ANIMAÇÕES AVANÇADAS
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-out': 'fadeOut 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'rotate-in': 'rotateIn 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'heartbeat': 'heartbeat 1.3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },

      // ✅ KEYFRAMES ROBUSTOS
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': {
            textShadow: '0 0 5px rgb(var(--color-primary) / 0.5)',
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
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
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
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        bounceIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': { opacity: '1' },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        rotateIn: {
          '0%': {
            opacity: '0',
            transform: 'rotate(-10deg) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'rotate(0) scale(1)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': {
            boxShadow:
              '0 0 0 0 rgba(var(--color-primary), 0.7)',
          },
          '50%': {
            boxShadow:
              '0 0 0 10px rgba(var(--color-primary), 0)',
          },
          '100%': {
            boxShadow:
              '0 0 0 0 rgba(var(--color-primary), 0)',
          },
        },
      },

      // ✅ IMAGENS DE FUNDO
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgb(var(--color-primary) / 0.1) 0%, rgb(var(--color-secondary) / 0.05) 100%)',
        'hero-pattern':
          "url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        'gradient-radial':
          'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(var(--tw-gradient-stops))',
        'mesh-gradient':
          'linear-gradient(45deg, rgb(var(--color-primary) / 0.1) 0%, rgb(var(--color-secondary) / 0.05) 50%, rgb(var(--color-accent) / 0.05) 100%)',
      },

      // ✅ SOMBRAS AVANÇADAS
      boxShadow: {
        'glow': '0 0 20px rgb(var(--color-primary) / 0.4)',
        'glow-lg': '0 0 30px rgb(var(--color-primary) / 0.6)',
        'glow-xl': '0 0 60px rgb(var(--color-primary) / 0.4)',
        'neon': '0 0 20px rgb(var(--color-primary) / 0.5), 0 0 40px rgb(var(--color-secondary) / 0.3)',
        'neon-lg': '0 0 40px rgb(var(--color-primary) / 0.6), 0 0 80px rgb(var(--color-secondary) / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(var(--color-primary) / 0.2)',
        'elevation-1': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0 8px 16px rgba(0, 0, 0, 0.2)',
      },

      // ✅ ROUNDED CORNERS
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },

      // ✅ DURAÇÃO DE TRANSIÇÃO
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      // ✅ TIMING FUNCTIONS
      transitionTimingFunction: {
        'in-sine': 'cubic-bezier(0.12, 0, 0.39, 0)',
        'out-sine': 'cubic-bezier(0.61, 1, 0.88, 1)',
        'in-out-sine': 'cubic-bezier(0.37, 0, 0.63, 1)',
        'in-quad': 'cubic-bezier(0.11, 0, 0.5, 0)',
        'out-quad': 'cubic-bezier(0.5, 1, 0.89, 1)',
        'in-cubic': 'cubic-bezier(0.32, 0, 0.67, 0)',
        'out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ✅ Z-INDEX SCALE
      zIndex: {
        hide: '-1',
        auto: 'auto',
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'tooltip': '1070',
      },

      // ✅ BREAKPOINTS CUSTOMIZADOS
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },

  // ✅ PLUGINS AVANÇADOS
  plugins: [
    // Glass Morphism
    plugin(({ addComponents, matchUtilities, theme }) => {
      addComponents({
        '.glass': {
          '@apply bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl': {},
        },
        '.glass-alt': {
          '@apply bg-black/10 backdrop-blur-lg border border-white/20': {},
        },
      });

      // Text Gradient
      matchUtilities(
        {
          'bg-gradient': (value) => ({
            backgroundImage: value,
          }),
        },
        {
          values: theme('backgroundImage'),
        }
      );

      // Gradient Text
      matchUtilities(
        {
          'text-gradient': (value) => ({
            backgroundImage: value,
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }),
        },
        {
          values: {
            primary: 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-secondary)))',
            'primary-accent': 'linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-accent)))',
            'secondary-accent': 'linear-gradient(to right, rgb(var(--color-secondary)), rgb(var(--color-accent)))',
            rainbow:
              'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
          },
        }
      );
    }),
  ],
};
