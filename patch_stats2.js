const fs = require('fs');
let s = fs.readFileSync('app/api/admin/stats/route.ts', 'utf8');

s = s.replace(/      totalJobs,\n      openJobs,\n      totalApplications,\n/, '');
s = s.replace(/      prisma.job.count\(\),\n      prisma.job.count\(\{ where: \{ status: "open" \} \}\),\n      prisma.application.count\(\),\n/, '');

s = s.replace(/      totalHr,\n/, '');
s = s.replace(/      prisma.user.count\(\{ where: \{ role: "hr" \} \}\),\n/, '');

s = s.replace(/        totalHr,\n/, '');
s = s.replace(/        totalJobs,\n        openJobs,\n        totalApplications,\n/, '');
fs.writeFileSync('app/api/admin/stats/route.ts', s);