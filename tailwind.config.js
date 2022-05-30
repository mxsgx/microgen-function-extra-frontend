const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  important: true,
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Inconsolata", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
