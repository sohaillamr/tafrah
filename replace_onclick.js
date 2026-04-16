const fs = require('fs');
let content = fs.readFileSync('app/assistant/page.tsx', 'utf8');

// The issue is that the type signature for createNewChat changed to (mode: "text" | "voice" = "text") => void,
// but it is still passed to onClick={createNewChat}, which gives it the MouseEvent object as the first argument.

content = content.replace(/onClick=\{createNewChat\}/g, 'onClick={() => createNewChat(\"text\")}');

fs.writeFileSync('app/assistant/page.tsx', content);
