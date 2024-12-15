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
        167: "1.67",
        171: "1.71",
        217: "2.17",
        200: "2.22",
      },
    },
  },
  plugins: [require("daisyui")],
};
