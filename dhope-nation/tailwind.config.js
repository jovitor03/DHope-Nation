/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        "2xl": "1920px",
      },
      scale: {
        90: ".9",
      },
    },
  },
  plugins: [require("daisyui")],
};
