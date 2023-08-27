/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
        comfortaa: ["Comfortaa", "cursive"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        primary: "#14b8a6",
        darkPrimary: "#134e4a",
        secondary: "#E8FFFC",
        darkGray: "#001220",
        lightGray: "#9096B2",
        lightGrayBackground: "#F4F6F8",
        backgroundGray: "#F6F6F6",
      },
    },
  },
  plugins: [],
};
