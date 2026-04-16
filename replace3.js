const fs = require('fs');
let content = fs.readFileSync('app/assistant/page.tsx', 'utf8');

content = content.replace(/onClick=\{createNewChat\}/g, 'onClick={() => createNewChat("text")}');

fs.writeFileSync('app/assistant/page.tsx', content);
console.log("Replaced onClick");
