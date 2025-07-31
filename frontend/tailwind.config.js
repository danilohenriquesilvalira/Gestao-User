// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '375px',
      'md': '425px',
      'lg': '768px',
      'xl': '1024px',
      '2xl': '1280px',
      '3xl': '1440px',
      '4xl': '1920px',
      '5xl': '2560px',
      '6xl': '3840px',
    },
    extend: {
      colors: {
        // Cores primárias do sistema
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Pretos personalizados
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Tech colors
        tech: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        'tech': ['Inter', 'system-ui', 'sans-serif'],
        'mono-tech': ['JetBrains Mono', 'Consolas', 'monospace'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'tech-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'tech-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'tech-base': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'tech-lg': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'tech-xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0.005em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          xs: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
          '3xl': '5rem',
          '4xl': '6rem',
          '5xl': '8rem',
          '6xl': '10rem',
        },
        screens: {
          xs: '320px',
          sm: '375px',
          md: '425px',
          lg: '768px',
          xl: '1024px',
          '2xl': '1280px',
          '3xl': '1440px',
          '4xl': '1920px',
          '5xl': '2560px',
          '6xl': '3840px',
        }
      }
    },
  },
  plugins: [],
}