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
      primary: "#36393e",
      primaryDarker: "#282b30",
      primaryDarkerer: "#1e2124",
      secondary: "#B86F52",
      secondaryDarker: "#775448",
      customRed: "#C82D44",
      customGreen: "#1B998B",
      customYellow: "#D4AC0C",
      frenchBlue: "#071d90",
      frenchRed: "#ED2939",
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/aspect-ratio")],
};
