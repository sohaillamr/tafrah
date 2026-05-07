const fs = require('fs');

let user = fs.readFileSync('app/api/users/[id]/route.ts', 'utf8');
user = user.replace(/companyName:\s*true,/g, '');
fs.writeFileSync('app/api/users/[id]/route.ts', user);

let users = fs.readFileSync('app/api/users/route.ts', 'utf8');
users = users.replace(/companyName:\s*true,/g, '');
fs.writeFileSync('app/api/users/route.ts', users);