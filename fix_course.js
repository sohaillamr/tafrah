const fs = require('fs');
const file = 'C:/Users/dell/Desktop/Tafrah/V4/app/courses/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const additionalSyllabus = `
const financeSyllabusArabic = [
  { title: 'الوحدة ١: لغة المال', lessons: ['ما هي المحاسبة؟', 'الأصول', 'الخصوم', 'معادلة الميزان', 'شجرة الحسابات'], quiz: true },
  { title: 'الوحدة ٢: قصة معاملة', lessons: ['قيود اليومية', 'المدين والدائن', 'دفتر الأستاذ', 'ميزان المراجعة'], quiz: true },
  { title: 'الوحدة ٣: الصورة الكبرى', lessons: ['قائمة الدخل', 'الأرباح المحتجزة', 'الميزانية العمومية', 'التدفقات النقدية'], quiz: true },
  { title: 'الوحدة ٤: المحاسبة التقنية', lessons: ['البرامج المحاسبية', 'نظام ERP', 'Dynamics 365', 'Excel'], quiz: true }
];

const financeSyllabusEnglish = [
  { title: 'Module 1: Language of Money', lessons: ['What is Accounting?', 'Assets', 'Liabilities', 'The Equation', 'Chart of Accounts'], quiz: true },
  { title: 'Module 2: Story of a Transaction', lessons: ['Journal Entries', 'Debit and Credit', 'The Ledger', 'Trial Balance'], quiz: true },
  { title: 'Module 3: The Big Picture', lessons: ['Income Statement', 'Retained Earnings', 'Balance Sheet', 'Cash Flows'], quiz: true },
  { title: 'Module 4: Tech Accounting', lessons: ['Accounting Software', 'ERP Systems', 'Dynamics 365', 'Excel'], quiz: true }
];
`;

content = content.replace('const pythonSyllabusEnglish = [', additionalSyllabus + '\nconst pythonSyllabusEnglish = [');

content = content.replace(/syllabusData: course\?\.category === \"programming\" \? pythonSyllabusArabic : syllabusArabic/g, 'syllabusData: course?.slug === \"programming-1\" || course?.category === \"programming\" ? pythonSyllabusArabic : course?.category === \"finance\" ? financeSyllabusArabic : syllabusArabic');
content = content.replace(/syllabusData: course\?\.category === \"programming\" \? pythonSyllabusEnglish : syllabusEnglish/g, 'syllabusData: course?.slug === \"programming-1\" || course?.category === \"programming\" ? pythonSyllabusEnglish : course?.category === \"finance\" ? financeSyllabusEnglish : syllabusEnglish');

content = content.replace(/trainerName:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"أستاذ محمد\"\s*:\s*\"أستاذة سارة\"/g, 'trainerName: course?.category === \"programming\" ? \"أستاذ محمد\" : course?.category === \"finance\" ? \"أستاذ أحمد (محاسب معتمد)\" : \"أستاذة سارة\"');
content = content.replace(/trainerBio:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"([^"]*)\"\s*:\s*\"([^"]*)\"/g, 'trainerBio: course?.category === "programming" ? "$1" : course?.category === "finance" ? "خبير مالي ومحاسب معتمد لتدريب ذوي التوحد." : "$2"');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Syllabus');
