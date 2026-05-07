const fs = require('fs');

function replaceFile(path, replacements) {
    let s = fs.readFileSync(path, 'utf8');
    for (let r of replacements) {
        s = s.replace(new RegExp(r.target, 'g'), r.with);
    }
    fs.writeFileSync(path, s);
}

replaceFile('app/api/auth/me/route.ts', [{target: '        companyName: true,\\n', with: ''}]);
replaceFile('app/api/auth/signup/route.ts', [
    {target: 'companyName, commercialReg, ', with: ''},
    {target: 'const safeCompany = companyName \\? sanitize\\(clamp\\(companyName, 200\\)\\) : null;\\n', with: ''},
    {target: '        companyName: safeCompany,\\n', with: ''},
    {target: '        commercialReg: commercialReg \\|\\| null,\\n', with: ''}
]);
replaceFile('app/api/users/route.ts', [{target: '          companyName: true,\\n', with: ''}]);
replaceFile('app/api/users/[id]/route.ts', [{target: '        companyName: true,\\n', with: ''}]);

console.log('API references removed');
