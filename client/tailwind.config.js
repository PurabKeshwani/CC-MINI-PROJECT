/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        netflix: {
          // repurposed as light blue theme
          black: "#ffffff",
          darker: "#f9fafb",
          red: "#2563EB", // primary blue
          redDark: "#1D4ED8", // darker blue
          gray: {
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            500: "#6b7280",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
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
          primary: "#2563EB",
          secondary: "#1D4ED8",
          accent: "#2563EB",
          neutral: "#f3f4f6",
          "base-100": "#ffffff",
          info: "#3b82f6",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    // keep light as default; no forced dark theme
    darkTheme: null,
  },
};
