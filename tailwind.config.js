/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#39FF88',
          dim: '#2BD46E',
          bright: '#5CFFA3',
        },
        base: {
          bg: '#0A0B0D',
          panel: '#111316',
          panel2: '#16181C',
          border: '#232629',
          text: '#E7E9EA',
          muted: '#8B9096',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(57,255,136,0.35), 0 0 24px rgba(57,255,136,0.15)',
        'neon-sm': '0 0 0 1px rgba(57,255,136,0.25), 0 0 12px rgba(57,255,136,0.12)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        fadeIn: 'fadeIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
