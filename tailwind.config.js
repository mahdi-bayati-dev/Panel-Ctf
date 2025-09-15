/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#030408",
        colorThemeDark: {
          primary: "#101828",
          secondary: "#111D3B",
          muted: "#1D293D",
        },
        colorThemeLite: {
          green: "#023F1D",
          accent: "#05DF72",
          blue: "#204073",
        },
        gradient1: {
          start: "#007A8C",
          end: "#00D3F2",
        },
        gradient2: {
          start: "#131B38",
          mid: "#1E388E",
          end: "#131B38",
        },
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
    },
  },
  plugins: [],
};
