const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.application.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.job.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("123456", 10);

  // --- USERS ---
  const admin = await prisma.user.create({
    data: {
      email: "admin@tafrah.com",
      passwordHash: hash,
      name: "مدير المنصة",
      role: "admin",
      status: "verified",
      jobTitle: "Platform Administrator",
      bio: "مسؤول إدارة منصة طفرة",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "ahmed@example.com",
      passwordHash: hash,
      name: "أحمد محمد",
      role: "student",
      status: "verified",
      jobTitle: "Junior Data Entry Specialist",
      bio: "أركز على تنفيذ المهام بخطوات واضحة وأحرص على الدقة في إدخال البيانات.",
      quizScore: 30,
      available: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "nour@example.com",
      passwordHash: hash,
      name: "نور أحمد",
      role: "student",
      status: "verified",
      jobTitle: "Data Entry Specialist",
      bio: "متخصصة في إدخال البيانات والتحقق من الجودة.",
      quizScore: 28,
      available: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "salma@example.com",
      passwordHash: hash,
      name: "سلمى علي",
      role: "student",
      status: "pending",
      jobTitle: "QA Tester",
      quizScore: 26,
      available: true,
    },
  });

  const student4 = await prisma.user.create({
    data: {
      email: "omar@example.com",
      passwordHash: hash,
      name: "عمر حسن",
      role: "student",
      status: "verified",
      quizScore: 32,
      available: false,
    },
  });

  const hr1 = await prisma.user.create({
    data: {
      email: "hr@alnour.com",
      passwordHash: hash,
      name: "شركة النور",
      role: "hr",
      status: "verified",
      companyName: "شركة النور للتقنية",
      commercialReg: "CR-12345",
    },
  });

  const hr2 = await prisma.user.create({
    data: {
      email: "hr@techco.com",
      passwordHash: hash,
      name: "TechCo Solutions",
      role: "hr",
      status: "pending",
      companyName: "TechCo Solutions",
      commercialReg: "CR-67890",
    },
  });

  // --- COURSES ---
  const course1 = await prisma.course.create({
    data: {
      slug: "data-entry-1",
      titleAr: "أساسيات إدخال البيانات",
      titleEn: "Data Entry Basics",
      descAr: "تعلّم أساسيات إدخال البيانات باستخدام أدوات بسيطة وفعّالة.",
      descEn: "Learn the basics of data entry using simple and effective tools.",
      category: "data-entry",
      difficulty: "beginner",
      hours: 2,
      modules: 7,
      available: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      slug: "design-1",
      titleAr: "أساسيات التصميم البصري",
      titleEn: "Visual Design Basics",
      descAr: "مقدمة في مبادئ التصميم البصري والألوان والتكوين.",
      descEn: "Introduction to visual design principles, colors, and composition.",
      category: "design",
      difficulty: "beginner",
      hours: 3,
      modules: 5,
      available: false,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      slug: "qa-1",
      titleAr: "اختبار البرمجيات اليدوي",
      titleEn: "Manual Software Testing",
      descAr: "تعلم كيفية اختبار البرمجيات يدويا والإبلاغ عن الأخطاء.",
      descEn: "Learn how to test software manually and report bugs.",
      category: "qa",
      difficulty: "intermediate",
      hours: 4,
      modules: 6,
      available: false,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      slug: "programming-1",
      titleAr: "أساسيات بايثون للمبتدئين",
      titleEn: "Python Basics for Beginners",
      descAr: "تعلّم أساسيات البرمجة بلغة بايثون من الصفر: المتغيرات، الشروط، الحلقات، والدوال.",
      descEn: "Learn Python programming basics from scratch: variables, conditions, loops, and functions.",
      category: "programming",
      difficulty: "beginner",
      hours: 5,
      modules: 7,
      available: true,
    },
  });

  // --- ENROLLMENTS ---
  await prisma.enrollment.create({
    data: { userId: student1.id, courseId: course1.id, progress: 60 },
  });
  await prisma.enrollment.create({
    data: { userId: student2.id, courseId: course1.id, progress: 100, completed: true, completedAt: new Date() },
  });
  await prisma.enrollment.create({
    data: { userId: student4.id, courseId: course1.id, progress: 30 },
  });

  // --- PROGRESS ---
  for (let i = 0; i < 4; i++) {
    await prisma.progress.create({
      data: {
        userId: student1.id,
        courseSlug: "data-entry-1",
        unitIndex: i,
        stepIndex: 10,
        quizPassed: true,
        quizScore: 80 + Math.floor(Math.random() * 20),
      },
    });
  }

  // --- JOBS ---
  const job1 = await prisma.job.create({
    data: {
      titleAr: "إدخال بيانات فواتير",
      titleEn: "Invoice Data Entry",
      descAr: "إدخال بيانات 200 فاتورة في جدول Excel بدقة عالية.",
      descEn: "Enter data from 200 invoices into an Excel spreadsheet with high accuracy.",
      type: "task",
      category: "excel",
      salary: 500,
      companyName: "شركة النور للتقنية",
      requiredSkills: "Excel,Typing,Accuracy",
      postedById: hr1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      titleAr: "اختبار برمجيات يدوي",
      titleEn: "Manual Software Testing",
      descAr: "اختبار تطبيق ويب والإبلاغ عن الأخطاء.",
      descEn: "Test a web application and report bugs.",
      type: "fulltime",
      category: "qa",
      salary: 6000,
      companyName: "TechCo Solutions",
      requiredSkills: "QA,Bug Reporting,Attention to Detail",
      postedById: hr2.id,
    },
  });

  await prisma.job.create({
    data: {
      titleAr: "تنظيف بيانات عملاء",
      titleEn: "Customer Data Cleaning",
      descAr: "مراجعة وتنظيف قاعدة بيانات عملاء تحتوي على 5000 سجل.",
      descEn: "Review and clean a customer database with 5000 records.",
      type: "task",
      category: "data-entry",
      salary: 800,
      companyName: "شركة النور للتقنية",
      requiredSkills: "Excel,Data Cleaning,Accuracy",
      postedById: hr1.id,
    },
  });

  // --- APPLICATIONS ---
  await prisma.application.create({
    data: { userId: student1.id, jobId: job1.id, status: "accepted" },
  });
  await prisma.application.create({
    data: { userId: student2.id, jobId: job1.id, status: "pending" },
  });
  await prisma.application.create({
    data: { userId: student2.id, jobId: job2.id, status: "pending" },
  });

  // --- TICKETS ---
  await prisma.ticket.create({
    data: {
      userId: student1.id,
      subject: "طلب دعم مباشر",
      message: "أحتاج مساعدة في الوحدة الرابعة من دورة إدخال البيانات.",
      email: "ahmed@example.com",
      status: "new",
      priority: "normal",
    },
  });
  await prisma.ticket.create({
    data: {
      userId: student3.id,
      subject: "استفسار عن دورة",
      message: "متى ستتوفر دورة التصميم البصري؟",
      email: "salma@example.com",
      status: "in-progress",
      priority: "low",
    },
  });
  await prisma.ticket.create({
    data: {
      subject: "مشكلة في التسجيل",
      message: "لا أستطيع إكمال الاختبار التقييمي.",
      email: "visitor@example.com",
      status: "new",
      priority: "high",
    },
  });

  // --- MESSAGES ---
  await prisma.message.create({
    data: {
      senderId: hr1.id,
      receiverId: student1.id,
      content: "مرحباً أحمد، نود تكليفك بمهمة إدخال بيانات جديدة.",
    },
  });
  await prisma.message.create({
    data: {
      senderId: student1.id,
      receiverId: hr1.id,
      content: "شكراً لكم، أنا جاهز للبدء.",
    },
  });

  // --- ACTIVITY LOGS ---
  const actions = [
    { userId: student1.id, action: "login", details: "student logged in" },
    { userId: student1.id, action: "enroll", details: "Enrolled in Data Entry Basics" },
    { userId: student2.id, action: "signup", details: "New student account created" },
    { userId: student2.id, action: "complete_unit", details: "Completed Unit 7 of Data Entry Basics" },
    { userId: hr1.id, action: "login", details: "hr logged in" },
    { userId: hr1.id, action: "create_job", details: "Posted job: Invoice Data Entry" },
    { userId: student1.id, action: "apply_job", details: "Applied for Invoice Data Entry" },
    { userId: admin.id, action: "admin_update_user", details: "Verified user ahmed@example.com" },
    { userId: student3.id, action: "signup", details: "New student account created" },
    { userId: hr2.id, action: "signup", details: "New hr account created" },
  ];

  for (const log of actions) {
    await prisma.activityLog.create({ data: log });
  }

  console.log("Seed complete!");
  console.log("---");
  console.log("Admin login: admin@tafrah.com / 123456");
  console.log("Student login: ahmed@example.com / 123456");
  console.log("HR login: hr@alnour.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
