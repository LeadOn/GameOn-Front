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
      primaryDarkerer: "#111111",
      secondary: "#00B9FF",
      secondaryDarker: "#003C5A",
      csharp: "#4e1268",
      azure: "#0082cb",
      agile: "#e6c00f",
    },
  },
  plugins: [require("flowbite/plugin")],
};
