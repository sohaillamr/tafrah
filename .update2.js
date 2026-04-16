const fs = require('fs');
let code = fs.readFileSync('app/courses/[id]/learn/page.tsx', 'utf8');

code = code.replace(
  'if (!scopedSteps || scopedSteps.length === 0) {\r\n        return (',
  'if (!scopedSteps || scopedSteps.length === 0) {\n        console.error(\\'DEBUG: Course found but Units are missing in DB.\\');\n        return ('
);
code = code.replace(
  'if (!scopedSteps || scopedSteps.length === 0) {\n        return (',
  'if (!scopedSteps || scopedSteps.length === 0) {\n        console.error(\\'DEBUG: Course found but Units are missing in DB.\\');\n        return ('
);

fs.writeFileSync('app/courses/[id]/learn/page.tsx', code, 'utf8');

