const fs = require('fs');
let s = fs.readFileSync('app/components/TopBar.tsx', 'utf8');

// remove dashboardHr logic
s = s.replace(/const dashboardHref = user\?\.role === \"admin\" \? \"\/admin\" \: user\?\.role === \"hr\" \? \"\/dashboard\/hr\" \: \"\/dashboard\/student\";/g, 'const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";');

// remove jobs label
s = s.replace(/jobs: \"ÙØ±Øµ Ø§Ù„Ø¹Ù…Ù„\",\r?\n/, '');
s = s.replace(/jobs: \"Jobs\",\r?\n/, '');

// remove jobs link
s = s.replace(/<li >\s*<Link href=\"\/jobs\" className=\"min-h-12 inline-flex items-center\">\s*\{labels\.jobs\}\s*<\/Link>\s*<\/li>\s*/g, '');
s = s.replace(/<li>\n            <Link href="\/jobs" className="min-h-12 inline-flex items-center">\n              {labels\.jobs}\n            <\/Link>\n          <\/li>\n/g, '');

fs.writeFileSync('app/components/TopBar.tsx', s);
console.log('topbar fixed');
