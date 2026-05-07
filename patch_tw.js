const fs = require('fs');
let c = fs.readFileSync('tailwind.config.js', 'utf-8');
c = c.replace('colors: {', 'colors: {\n        autism: { bg: "#E2E8F0", text: "#334155", panel: "#F1F5F9" },\n        cp: { focus: "#FFD700" },');
c = c.replace('content: [', 'content: [\n    "./components/**/*.{js,ts,jsx,tsx}",');
fs.writeFileSync('tailwind.config.js', c);
console.log('tailwind updated');