const fs = require('fs');
let s = fs.readFileSync('app/api/auth/signup/route.ts', 'utf8');

const userCreation = `const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: safeName,
        role: ["student", "admin"].includes(role) ? role : "student",
        status: "pending",
        quizScore: typeof quizScore === "number" ? quizScore : null
      },
    });`;

s = s.replace(/const user = await prisma\.user\.create\(\{[\s\S]*?\}\);/, userCreation);

fs.writeFileSync('app/api/auth/signup/route.ts', s);