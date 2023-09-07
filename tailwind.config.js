/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js"



  ],
  theme: {
    extend: {
      colors: {
        // transparentBg: 'rgba(23,133,130, 0.9)',
        coolBlack: "rgb(66,66,66)",
        transparentBg: "rgba(10,24,40, 0.9)",
        primaryTransparent: "rgba(10,24,40, 0.9)",
        backgroundSlate: "rgba(250,249,247)",
        xgray: "#dfe3ee",
      },
    },
  },
  plugins: [require('flowbite/plugin'),
  require("tw-elements/dist/plugin.cjs")],
};

// primary: '#4C3A51',
// secondary: '#774360',
// tertiary: '#B25068',
// quartiary: '#E7AB79',
