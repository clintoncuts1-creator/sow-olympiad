import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        "ink-navy": "#14213D",
        "graph-paper": "#F5F7FB",
        "marigold": "#F4A73B",
        "coral-flare": "#FF6B5B",
        "leaf-green": "#4CAF7D",
        "deep-violet": "#6C4EE3",
        // Section tier colors
        "sprout-green": "#4CAF7D",
        "explorer-teal": "#3FA79A",
        "calculator-blue": "#3E8FC4",
        "problem-violet": "#6C4EE3",
        "algebra-magenta": "#C2478C",
        "master-gold": "#F4A73B",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "mono": ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
