/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-dimmer': 'var(--text-dimmer)',
        accent: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
          bg: 'var(--accent-bg)',
          foreground: 'var(--accent-foreground)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          dim: 'var(--danger-dim)',
          bg: 'var(--danger-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
        },
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '11': ['11px', { lineHeight: '1.4' }],
        '12': ['12px', { lineHeight: '1.4' }],
        '13': ['13px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};