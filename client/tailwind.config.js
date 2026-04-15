/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09090b",
          900: "#111114",
          800: "#16161c"
        },
        copper: {
          300: "#ddb08f",
          400: "#c47b49",
          500: "#a75d2d"
        }
      },
      fontFamily: {
        display: ["'Instrument Serif'", "serif"],
        sans: ["Sora", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(196, 123, 73, 0.18)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(196,123,73,0.2), transparent 32%), radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 24%)"
      }
    }
  },
  plugins: []
};
