import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07142b",
        cyber: "#0ea5e9",
        trust: "#155e75",
        risk: {
          low: "#16a34a",
          medium: "#ca8a04",
          high: "#ea580c",
          critical: "#dc2626"
        }
      },
      boxShadow: {
        glow: "0 20px 80px rgba(14,165,233,0.18)"
      }
    }
  },
  plugins: []
};

export default config;
