module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '380px',
      sm: '640px',
      md: '768px',
      normal: '896px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        '2xs': ['0.7rem', { lineHeight: '1rem' }]
      },
      animation: {
        'spin-fast': 'spin 0.55s ease infinite'
      }
    },
  },
  plugins: [],
}