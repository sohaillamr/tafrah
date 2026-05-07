const fs = require('fs');
let s = fs.readFileSync('app/api/auth/signup/route.ts', 'utf8');

s = s.replace('        companyName: safeCompany,\n        commercialReg: commercialReg ||', '');
s = s.replace('const safeCompany = companyName ? sanitize(clamp(companyName, 200)) : null;', '');
s = s.replace(/        quizScore: typeof quizScore === "number" \? quizScore :\n/g, '        quizScore: typeof quizScore === "number" ? quizScore : null\n');

fs.writeFileSync('app/api/auth/signup/route.ts', s);
