const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf8');

// remove Job model and Application model
s = s.replace(/model Job \{[\s\S]*?\}/, '');
s = s.replace(/model Application \{[\s\S]*?\}/, '');

// from User model remove: role, companyName, commercialReg, jobsPosted, applications 
s = s.replace(/  companyName   String\?\r?\n/g, '');
s = s.replace(/  commercialReg String\?\r?\n/g, '');
s = s.replace(/  applications     Application\[\]\r?\n/g, '');
s = s.replace(/  jobsPosted       Job\[\]         @relation\("JobPoster"\)\r?\n/g, '');

// add center relation
s = s.replace(/  skillProfile     SkillProfile\?\r?\n/, '  skillProfile     SkillProfile?\n  centerId         Int?\n  center           Center?       @relation(fields: [centerId], references: [id])\n');

// add center model
const centerModel = `
model Center {
  id        Int      @id @default(autoincrement())
  name      String
  code      String   @unique
  location  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  students  User[]
}
`;
s += centerModel;

fs.writeFileSync('prisma/schema.prisma', s);
console.log('schema updated');