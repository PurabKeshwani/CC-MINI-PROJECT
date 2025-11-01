/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        netflix: {
          black: "#141414",
          darker: "#0b0b0b",
          red: "#E50914",
          redDark: "#B20710",
          gray: {
            100: "#e5e5e5",
            200: "#d4d4d4",
            300: "#a3a3a3",
            500: "#737373",
            700: "#2b2b2b",
            800: "#1f1f1f",
            900: "#141414",
          },
        },
      },
      boxShadow: {
        big: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        netflix: {
          primary: "#E50914",
          secondary: "#B20710",
          accent: "#E50914",
          neutral: "#1f1f1f",
          "base-100": "#141414",
          info: "#60a5fa",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    darkTheme: "netflix",
  },
};
