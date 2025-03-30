import aspectRatio, { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/react-toastify/**/.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        ...defaultTheme.screens,
        'xsm': '325px',
        '3xl': '1600px',
        '4xl': '1920px'
      },
      colors: {
        primary: {
          '400': '#f17a28',
          '500': '#ff6500',
          '600': '#e35214',
        },
        secondary: {
          '500': '#131313',
          '600': '#131313',
          '800': '#131313'
        },
        black: '#1a1919',
        background: '#fff',
      },
      fontFamily: {
        sans: ['var(--font-roboto)'],
        mono: ['var(--font-roboto)']
      },
    },
  },
  variants: {
    fluidType: ['responsive']
  },
  plugins: [
    aspectRatio,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-fluid-type')({
      settings: {
        prefix: 'fluid-',
      },
      values: {
        'lg': [0.1, {
          lineHeight: 1.3
        }]
      }
    }),
  ],
} satisfies Config
