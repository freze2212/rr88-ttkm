module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",  
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'), 
  ],
}
