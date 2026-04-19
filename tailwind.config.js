module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6B90B5", // Soft Blue
        secondary: "#FFD54F", // Warm Yellow
        error: "#FFB74D", // Soft Orange/Warm Yellow instead of bright red
        success: "#81C784", // Soft green
      },
      fontFamily: {
        sans: ['"Open Sans"', "ui-sans-serif", "system-ui", "sans-serif"], 
      },
      animation: {
        spin: "spin 3s linear infinite", // Reduced speed
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Reduced speed
        bounce: "bounce 2s infinite", // Reduced speed
      },
    },
  },
  plugins: [],
};
