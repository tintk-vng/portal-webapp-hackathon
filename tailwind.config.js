/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'white-500': '#FFFFFF',
        'green-500': '#00CF6A',
        'green-700': '#007C40',
        'red-50': '#FCE8EC',
        'red-200': '#F4A2B1',
        'red-400': '#E94563',
        'red-500': '#E3173C',
        'red-700': '#880E24',
        'orange-25': '#FFFBEC',
        'orange-50': '#FFF6D3',
        'orange-100': '#FFEAA5',
        'orange-500': '#FF8D00',
        'orange-800': '#663800',
        'blue-25': '#E7F6FF',
        'blue-50': '#D3EEFF',
        'blue-100': '#B0DDFF',
        'blue-300': '#4F9BFF',
        'blue-500': '#0033C9',
        'dark-25': '#F2F4F5',
        'dark-50': '#E6E9EC',
        'dark-100': '#CCD2D8',
        'dark-200': '#99A5B2',
        'dark-300': '#66798B',
        'dark-400': '#334C65',
        'dark-500': '#001F3E',
        'dark-700': '#001325',
        'other-background': '#F5F9FF',
        'other-stroke': '#F2F6F7',
        'other-overlay': 'rgba(0, 31, 62, 0.8)',
        'orange-550': 'rgb(255, 131, 2)',
      },
      fontSize: {
        'heading-sm': [
          '1rem',
          {
            lineHeight: '1.5rem',
            fontWeight: 'bold',
          },
        ],
        'heading-md': [
          '1.125rem',
          {
            lineHeight: '1.75rem',
            fontWeight: 'bold',
          },
        ],
        'heading-lg': [
          '1.5rem',
          {
            lineHeight: '2.25rem',
            fontWeight: 'bold',
          },
        ],
        'paragraph-md': ['10px', '.75rem'],
        'paragraph-lg': ['1rem', '1.5rem'],
        'label-xs': ['10px', '12px'],
        'label-sm': ['0.75rem', '1rem'],
        'label-md': ['0.875rem', '18px'],
        'label-lg': ['1rem', '1.25rem'],
      },
      keyframes: {
        'appearance-in': {
          '0%': {
            opacity: '0',
            transform: 'translateZ(0) scale(0.95)',
          },
          '60%': {
            opacity: '0.75',
            /* Avoid blurriness */
            backfaceVisibility: 'hidden',
            webkitFontSmoothing: 'antialiased',
            transform: 'translateZ(0) scale(1.05)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateZ(0) scale(1)',
          },
        },
        'appearance-out': {
          '0%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.85)',
          },
        },
      },
      animation: {
        'appearance-in': 'appearance-in 300ms ease-out normal both',
        'appearance-out': 'appearance-out 80ms ease-in normal both',
      },
      backgroundImage: {
        skeleton: 'linear-gradient(90deg, #f2f7ff 0%, #e6f0ff 50%, #f2f7ff 80%, #f2f7ff 100%)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      })
    }),
    require('@tailwindcss/container-queries'),
  ],
}
