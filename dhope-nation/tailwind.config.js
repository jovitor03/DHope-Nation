/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        "2xl": "1920px", // Add a custom breakpoint for 1920px width
      },
    },
  },
  plugins: [require("daisyui")],
};
