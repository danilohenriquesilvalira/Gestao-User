// tailwind.config.js - Padrão EDP Real
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
        // Verde EDP (cor principal - botões e ações)
        'edp-green': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Verde principal
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // **NOVA COR ADICIONADA** - Verde Neon
        'edp-neon': '#55FD5B',
        // Azul EDP (fundos escuros)
        'edp-blue': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Fundo escuro EDP
          900: '#0f172a',
          950: '#020617',
        },
        // Roxo EDP (cards específicos)
        'edp-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea', // Roxo EDP
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Ciano EDP (elementos secundários)
        'edp-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Ciano EDP
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Cinza EDP (textos e elementos neutros)
        'edp-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Primary (mapeamento para verde EDP)
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Secondary (mapeamento para azul EDP)
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc', 
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Tech colors (mapeamento para ciano EDP)
        tech: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc', 
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Dark (mapeamento para azul escuro EDP)
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