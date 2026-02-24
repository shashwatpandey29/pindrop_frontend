// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'gradient-slow': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
}