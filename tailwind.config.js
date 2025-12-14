module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      normal: "896px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      animation: {
        "spin-fast": "spin 0.55s ease infinite",
      },
      fontSize: {
        "2xs": ["0.7rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
