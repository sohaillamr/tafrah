const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf-8');
layout = layout.replace('import { ToastProvider } from "./components/Toast";', 
  'import { ToastProvider } from "./components/Toast";\nimport ThemeRegistry from "../components/Adaptive/ThemeRegistry";');
layout = layout.replace('{children}', '<ThemeRegistry>{children}</ThemeRegistry>');
fs.writeFileSync('app/layout.tsx', layout);
console.log('Layout patched');