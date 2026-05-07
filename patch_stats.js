const fs = require('fs');
let s = fs.readFileSync('app/api/admin/stats/route.ts', 'utf8');

// remove job/application from promise array
s = s.replace(/      totalJobs,\n      openJobs,\n      totalApplications,\n/, '');
s = s.replace(/      prisma\.job\.count\(\),\n      prisma\.job\.count\(\{ where: \{ status: "open" \} \}\),\n      prisma\.application\.count\(\),\n/, '');

// remove hr from promise array
s = s.replace(/      totalHr,\n/, '');
s = s.replace(/      prisma\.user\.count\(\{ where: \{ role: "hr" \} \}\),\n/, '');

// remove return payload fields
s = s.replace(/        totalHr,\n/, '');
s = s.replace(/        totalJobs,\n        openJobs,\n        totalApplications,\n/, '');

fs.writeFileSync('app/api/admin/stats/route.ts', s);
