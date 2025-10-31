/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./inc/**/*.php",
    "./*.php",
  ],
  
  darkMode: 'class', // ou 'media' para preferência do sistema
  
  theme: {
    extend: {
      colors: {
        // Cores primárias do DJ Zen Eyer (do djz-config.php)
        primary: {
          DEFAULT: '#0A0E27',
          50: '#E6E7EC',
          100: '#CDCFD9',
          200: '#9B9FB3',
          300: '#696F8D',
          400: '#373F67',
          500: '#0A0E27',
          600: '#080B20',
          700: '#060819',
          800: '#040612',
          900: '#02030B',
        },
        accent: {
          DEFAULT: '#3B82F6',
          50: '#EBF2FE',
          100: '#D7E5FD',
          200: '#AFCBFB',
          300: '#87B1F9',
          400: '#5F97F7',
          500: '#3B82F6',
          600: '#2F68C5',
          700: '#234E94',
          800: '#173463',
          900: '#0B1A32',
        },
        secondary: {
          DEFAULT: '#10B981',
          50: '#E8F9F3',
          100: '#D1F3E7',
          200: '#A3E7CF',
          300: '#75DBB7',
          400: '#47CF9F',
          500: '#10B981',
          600: '#0D9467',
          700: '#0A6F4D',
          800: '#074A33',
          900: '#03251A',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  
  plugins: [
    // Plugin para adicionar variantes úteis
    function({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('group-hocus', ['.group:hover &', '.group:focus &']);
    },
    
    // Plugin para scrollbar customizada
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-custom': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0A0E27',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3B82F6',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#2F68C5',
          },
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
  
  // Configurações de otimização
  corePlugins: {
    preflight: true,
  },
  
  // Prevenir purge acidental de classes dinâmicas
  safelist: [
    'bg-primary',
    'bg-accent',
    'bg-secondary',
    'text-primary',
    'text-accent',
    'text-secondary',
    {
      pattern: /^(bg|text|border)-(primary|accent|secondary)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
};
