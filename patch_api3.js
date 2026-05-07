const fs = require('fs');

let me = fs.readFileSync('app/api/auth/me/route.ts', 'utf8');
me = me.replace(/companyName:\s*true,/g, '');
fs.writeFileSync('app/api/auth/me/route.ts', me);

let user = fs.readFileSync('app/api/users/[id]/route.ts', 'utf8');
user = user.replace(/applications:\s*isSelfOrAdmin/g, '');
user = user.replace(/,\s*}/g, ' }'); // clean up trailing comma issue if any
fs.writeFileSync('app/api/users/[id]/route.ts', user);

let users = fs.readFileSync('app/api/users/route.ts', 'utf8');
users = users.replace(/applications:\s*true/g, '');
users = users.replace(/,\s*}/g, ' }');
fs.writeFileSync('app/api/users/route.ts', users);
