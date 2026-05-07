const fs = require('fs');
let s = fs.readFileSync('middleware.ts', 'utf8');
s = s.replace(/payload\.role === \"admin\" \? \"\/admin\" \: payload\.role === \"hr\" \? \"\/dashboard\/hr\" \: \"\/dashboard\/student\"/, 'payload.role === "admin" ? "/admin" : "/dashboard"');
s = s.replace('if (isProtectedPage) {', 'if (isProtectedPage) {\n    if (pathname.startsWith("/dashboard") && !req.cookies.get("tafrah_onboarded")) {\n      return NextResponse.redirect(new URL("/onboarding", req.url));\n    }');
fs.writeFileSync('middleware.ts', s);
console.log('middleware updated');