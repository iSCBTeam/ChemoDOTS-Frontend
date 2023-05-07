/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    minWidth: {
      "1/2": "50%",
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
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
