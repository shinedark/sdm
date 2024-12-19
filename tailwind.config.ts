import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderStyle: {
        outset: 'outset',
      },
      boxShadow: {
        custom: '-1px -1px 0px 3px rgba(0, 0, 0, 1)',
      },
      keyframes: {
        rotateLeft: {
          '0%': { transform: 'rotate(0deg)' },
          '33%': { transform: 'rotate(-180deg)' },
          '67%': { transform: 'rotate(-270deg)' },
          '100%': { transform: 'rotate(-360deg)' }, // Rotate left
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-90%)' },
      },
        rotateRight: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(150deg)' }, // Rotate right
        },
      },
      animation: {
        rotateLeft: 'rotateLeft 3s ease-in-out',
        rotateRight: 'rotateRight 0.5s ease-in-out',
        scroll: 'scroll 9s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
