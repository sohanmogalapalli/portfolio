/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#09090B",
          panel: "#0D0F0E",
          raised: "#111311",
        },
        term: {
          green: "#4ADE80",
          greenDim: "#22C55E",
          greenBright: "#86EFAC",
          amber: "#FBBF24",
          cyan: "#38BDF8",
          red: "#F87171",
        },
        ink: {
          primary: "#E4E4E7",
          muted: "#A1A1AA",
          faint: "#6B7280",
        },
        border: {
          glass: "rgba(255,255,255,0.08)",
          glassSoft: "rgba(255,255,255,0.05)",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(74, 222, 128, 0.25)",
        glowSoft: "0 0 12px rgba(74, 222, 128, 0.15)",
        panel: "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(74,222,128,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.05) 1px, transparent 1px)",
        "radial-fade": "radial-gradient(ellipse at center, rgba(74,222,128,0.08) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(8px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
