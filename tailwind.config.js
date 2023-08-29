/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: "#424549",
      primaryDarker: "#282b30",
      primaryDarkerer: "#1a1a1c",
      secondary: "#00B9FF",
      secondaryDarker: "#003C5A",
      neonRed: "#FF3131",
      neonGreen: "#0FFF50",
      neonYellow: "#FFF01F",
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/aspect-ratio")],
};
