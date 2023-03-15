/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        inter: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.2)',
        cardhover: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.4)',
        card_dark: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(150,150,180,0.2)',
        cardhover_dark: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(150,150,180,0.4)',
        user_menu: '0 0 1px 0 rgba(189,192,207,0.06),0 0px 15px -1px rgba(0,0,0,0.2)',
        user_menu_dark: '0 0 1px 0 rgba(189,192,207,0.06),0 0px 10px 3px rgba(0,0,0,0.2)'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
};