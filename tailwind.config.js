/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D8C',
          light: '#E8F4F6',
          dark: '#1E5A66',
        },
        accent: '#E67E2E',
        success: {
          DEFAULT: '#3A7D44',
          light: '#EAF5EC',
        },
        warm: '#F7F5F0',
      },
      fontFamily: {
        hebrew: ['Rubik', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'btn': ['22px', { lineHeight: '1.2', fontWeight: '700' }],
        'title': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'hero': ['34px', { lineHeight: '1.2', fontWeight: '800' }],
      },
      minHeight: {
        'btn': '72px',
        'btn-lg': '88px',
      },
      borderRadius: {
        'xl2': '20px',
      }
    },
  },
  plugins: [],
}
