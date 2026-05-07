const fs = require('fs');
let s = fs.readFileSync('app/onboarding/page.tsx', 'utf8');
s = s.replace(/router\.push\('\/dashboard'\);/g, 'document.cookie="tafrah_onboarded=true; path=/"; router.push("/dashboard");');
fs.writeFileSync('app/onboarding/page.tsx', s);