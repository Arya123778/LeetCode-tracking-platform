export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Mono"', "monospace"],
        body: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        bg: "#0a0a0f",
        surface: "#111118",
        border: "#1e1e2e",
        accent: "#7c6aff",
        "accent-dim": "#4d3fff",
        easy: "#22c55e",
        medium: "#f59e0b",
        hard: "#ef4444",
        muted: "#4a4a6a",
        text: "#e2e2f0",
        "text-dim": "#8888aa",
      },
    },
  },
  plugins: [],
};