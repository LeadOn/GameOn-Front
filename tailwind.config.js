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
      primary: "#04B8E8",
      primaryDarker: "#124A7A",
      primaryDarkerer: "#11404F",
      secondary: "#A9CE2C",
      secondaryDarker: "#8AA527",
      customRed: "#C82D44",
      customGreen: "#A9CE2C",
      customYellow: "#D4AC0C",
      frenchBlue: "#071d90",
      frenchRed: "#ED2939",
    },
  },
  plugins: [require("flowbite/plugin")],
};
