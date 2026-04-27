const fs = require('fs');
const file = 'C:/Users/dell/Desktop/Tafrah/V4/app/courses/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix Skills
content = content.replace(
  /programming: \["كتابة أوامر بايثون[^\]]*\]/,
  'programming: ["كتابة أوامر بايثون", "فهم المتغيرات والأنواع", "استخدام الشروط والحلقات", "تعريف الدوال", "بناء برنامج متكامل"], finance: ["فهم الأصول والخصوم", "معادلة المحاسبة", "قيود اليومية", "القوائم المالية", "استخدام أنظمة ERP"]'
);
content = content.replace(
  /programming: \["Writing Python commands[^\]]*\]/,
  'programming: ["Writing Python commands", "Variables and data types", "Conditions and loops", "Defining functions", "Building a complete program"], finance: ["Understanding Assets and Liabilities", "Accounting Equation", "Journal Entries and Ledger", "Financial Statements", "Working with ERP Systems"]'
);

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

content = content.replace(/trainerName:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"([^"]*)\"\s*:\s*\"([^"]*)\"/g, 'trainerName: course?.category === "programming" ? "أستاذ محمد" : course?.category === "finance" ? "أستاذ أحمد (محاسب معتمد)" : "أستاذة سارة"');
content = content.replace(/trainerBio:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"([^"]*)\"\s*:\s*\"([^"]*)\"/g, 'trainerBio: course?.category === "programming" ? "$1" : course?.category === "finance" ? "خبير مالي ومحاسب معتمد لتدريب ذوي التوحد." : "$2"');

content = content.replace(/trainerName:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"Mr. Mohammed\"\s*:\s*\"Ms. Sara\"/g, 'trainerName: course?.category === "programming" ? "Mr. Mohammed" : course?.category === "finance" ? "Mr. Ahmed (CPA)" : "Ms. Sara"');
content = content.replace(/trainerBio:\s*course\?\.category\s*===\s*\"programming\"\s*\?\s*\"([^"]*)\"\s*:\s*\"([^"]*)\"/g, 'trainerBio: course?.category === "programming" ? "$1" : course?.category === "finance" ? "A certified financial expert and CPA training autistic learners." : "$2"');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed accurately!');
