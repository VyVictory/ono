module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        talkingEffect: "talkingEffect 1.5s ease-in-out infinite",
      },
      keyframes: {
        talkingEffect: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "1",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
