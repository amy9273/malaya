import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          canvas: '#08090C',
          card: '#111318',
          elevated: '#181B22',
          border: '#262A34',
          muted: '#8E95A5',
        },
        brand: {
          primary: '#6366F1',
          glow: '#4F46E5',
          dark: '#3730A3',
          light: '#818CF8',
        },
        status: {
          reading: '#10B981',
          complete: '#3B82F6',
          plan: '#F59E0B',
          dropped: '#EF4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
