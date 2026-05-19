const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Tafrah autism-first demo data...");

  await prisma.activityLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.skillProfile.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.center.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@tafrah.com",
      phone: "+201000000001",
      passwordHash,
      name: "Tafrah Admin",
      role: "admin",
      status: "verified",
    },
  });

  const center = await prisma.center.create({
    data: {
      name: "Tafrah Autism Learning Center",
      location: "Cairo",
      licenseKey: "TAFRAH-DEMO-CENTER",
    },
  });

  const centerAdmin = await prisma.user.create({
    data: {
      email: "center@tafrah.com",
      phone: "+201000000002",
      passwordHash,
      name: "Center Coordinator",
      role: "center_admin",
      status: "verified",
      centerId: center.id,
    },
  });

  const chapter = await prisma.chapter.create({
    data: {
      name: "Starter Group",
      centerId: center.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@tafrah.com",
      phone: "+201000000003",
      passwordHash,
      name: "Demo Student",
      role: "student",
      status: "verified",
      category: "AUTISM",
      centerId: center.id,
      chapterId: chapter.id,
      uiPreferences: {
        mutedColors: true,
        reduceMotion: true,
        reduceSound: true,
        focusMode: true,
        ttsEnabled: true,
        simplifiedText: true,
      },
    },
  });

  await prisma.userPreference.create({
    data: {
      userId: student.id,
      theme: "muted",
      reduceMotion: true,
      nourTone: "calm",
      learningStyle: "step-by-step",
      formattingPrefs: "Short steps, calm wording, optional read-aloud",
      sensoryTriggers: "Bright colors, sudden animation, loud feedback",
      uiSettings: {
        mutedColors: true,
        reduceMotion: true,
        reduceSound: true,
        focusMode: true,
        ttsEnabled: true,
        simplifiedText: true,
      },
    },
  });

  await prisma.skillProfile.create({
    data: {
      userId: student.id,
      logicFlow: 18,
      attentionToDetail: 20,
      syntaxAccuracy: 14,
      patternRecognition: 19,
      problemDecomposition: 16,
      careerReadiness: 20,
      strengthsSummary: {
        notes: ["Strong detail detection", "Benefits from predictable steps"],
      },
    },
  });

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        slug: "data-entry-1",
        titleAr: "أساسيات إدخال البيانات",
        titleEn: "Data Entry Basics",
        descAr: "خطوات قصيرة وواضحة للتعامل مع الجداول والبيانات.",
        descEn: "Short, clear steps for working with tables and data.",
        category: "data-entry",
        difficulty: "beginner",
        hours: 2,
        modules: 7,
        available: true,
      },
    }),
    prisma.course.create({
      data: {
        slug: "programming-1",
        titleAr: "أساسيات بايثون",
        titleEn: "Python Basics",
        descAr: "تعلم البرمجة بأسلوب منظم ومناسب للتعلم خطوة بخطوة.",
        descEn: "Learn programming through a structured, step-by-step flow.",
        category: "programming",
        difficulty: "beginner",
        hours: 5,
        modules: 7,
        available: true,
      },
    }),
    prisma.course.create({
      data: {
        slug: "finance-1",
        titleAr: "أساسيات المالية والمحاسبة",
        titleEn: "Finance and Accounting Fundamentals",
        descAr: "مبادئ مالية مبسطة بتدرج واضح.",
        descEn: "Simple finance fundamentals with a clear progression.",
        category: "finance",
        difficulty: "beginner",
        hours: 6,
        modules: 7,
        available: true,
      },
    }),
  ]);

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courses[0].id,
      progress: 28,
    },
  });

  await prisma.progress.createMany({
    data: [
      { userId: student.id, courseSlug: "data-entry-1", unitIndex: 0, stepIndex: 5, quizPassed: true, quizScore: 85 },
      { userId: student.id, courseSlug: "data-entry-1", unitIndex: 1, stepIndex: 2, quizPassed: false, quizScore: null },
    ],
  });

  await prisma.ticket.create({
    data: {
      userId: student.id,
      subject: "Need help with a lesson step",
      message: "The student needs a calmer explanation for the current task.",
      email: student.email,
      status: "new",
      priority: "normal",
    },
  });

  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: "seed_admin", details: "Created demo admin" },
      { userId: centerAdmin.id, action: "seed_center", details: "Created demo center account" },
      { userId: student.id, action: "seed_student", details: "Created demo autistic learner" },
    ],
  });

  console.log("Seed complete.");
  console.log("Demo accounts were created. See prisma/seed.js for local-only credentials.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
