/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Chillax-Regular", ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: "#282b30",
      bgDark: "#282b30",
      bgDarker: "#0a0a0a",
      secondary: "#73c3e9",
      customRed: "#C82D44",
      customGreen: "#1B998B",
      customYellow: "#D4AC0C",
      frenchBlue: "#071d90",
      frenchRed: "#ED2939",
    },
  },
  darkMode: "class",
  plugins: [require("flowbite/plugin")],
};
