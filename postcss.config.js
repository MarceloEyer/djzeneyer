/**
 * postcss.config.js
 * DJ Zen Eyer v12.2.0
 * 
 * PostCSS Configuration for Tailwind CSS + Autoprefixer
 * With performance optimizations & AI-friendly settings
 */

export default {
  plugins: {
    // =========================================
    // 1️⃣ TAILWIND CSS - Core styling engine
    // =========================================
    tailwindcss: {
      // Content paths for purging unused CSS
      content: [
        './src/**/*.{tsx,ts,jsx,js}',
        './src/components/**/*.{tsx,ts}',
        './src/hooks/**/*.{tsx,ts}',
        './src/pages/**/*.{tsx,ts}',
        './**/*.html',
        './inc/**/*.php',
        './*.php',
      ],
      
      // Custom Tailwind configuration
      theme: {
        extend: {
          // Custom colors (matches djz-config.php)
          colors: {
            primary: '#0A0E27',
            secondary: '#1F2937',
            accent: '#3B82F6',
          },
          
          // Custom typography
          fontFamily: {
            sans: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
            ],
            mono: ['"Courier New"', 'Courier', 'monospace'],
          },
          
          // Custom spacing
          spacing: {
            xs: '0.5rem',   // 8px
            sm: '1rem',     // 16px
            md: '1.5rem',   // 24px
            lg: '2rem',     // 32px
            xl: '3rem',     // 48px
          },
          
          // Z-index scale
          zIndex: {
            dropdown: '100',
            sticky: '500',
            fixed: '1000',
            modal: '1500',
          },
        },
      },
      
      // Safelist classes (won't be purged)
      safelist: [
        {
          pattern: /^(bg|text|border)-(primary|secondary|accent)/,
          variants: ['hover', 'focus', 'lg', 'dark'],
        },
      ],
    },

    // =========================================
    // 2️⃣ AUTOPREFIXER - Browser compatibility
    // =========================================
    autoprefixer: {
      // Target browsers (based on browserlist config)
      overrideBrowserslist: [
        '> 1%',           // Support browsers with >1% market share
        'last 2 versions', // Last 2 versions of each browser
        'not dead',        // Not discontinued browsers
        'Chrome >= 90',    // Minimum Chrome version
        'Firefox >= 88',   // Minimum Firefox version
        'Safari >= 14',    // Minimum Safari version
        'iOS >= 14',       // Minimum iOS version
      ],
      
      // Grid layout support
      grid: true,
      
      // Flexbox support
      flexbox: true,
    },

    // =========================================
    // 3️⃣ CSS-NANO (Production minification)
    // =========================================
    ...(process.env.NODE_ENV === 'production' && {
      'cssnano': {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            // Preserve @media queries order
            normalizeDeclarations: true,
            // Merge identical keyframes
            normalizeKeyframes: true,
            // Reduce calc() expressions
            reduceCalc: true,
            // Remove duplicate rules
            normalizeUnicode: true,
            // Minimize animations
            minifyAnimations: true,
            // Reduce color values
            normalizeColors: {
              strictMode: false,
            },
          },
        ],
      },
    }),
  },
};
