/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    minWidth: {
      "1/2": "50%",
    },
    fontFamily: {
      'sans': ["Noto Sans"],
    },
    extend: {
      screens: {
        sm: { min: "640px", max: "767px" },
        // => @media (min-width: 640px and max-width: 767px) { ... }

        md: { min: "768px", max: "1023px" },
        // => @media (min-width: 768px and max-width: 1023px) { ... }

        lg: { min: "1024px", max: "1439px" },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }

        xl: { min: "1440px", max: "2559px" },
        // => @media (min-width: 1280px and max-width: 1535px) { ... }

        "2xl": { min: "2560" },
        // => @media (min-width: 1536px) { ... }
        print: { raw: "print" },
      },
      keyframes: {
        appear: {
          '0%': { width: "0%", opacity: 0 },
          '50%': { width: "25%", opacity: 0 },
          '100%': { width: "100%", opacity: 1 },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
