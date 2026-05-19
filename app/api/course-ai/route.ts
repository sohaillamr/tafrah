export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MODEL = "llama-3.3-70b-versatile";
const BACKUP_MODEL = "llama3-8b-8192";
const GROQ_TIMEOUT_MS = 30000;

function cleanKey(value?: string) {
  return value?.replace(/^["']|["']$/g, "");
}

function compact(value: unknown, max = 1800) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function jsonFromText(text: string) {
  const direct = text.trim();
  try {
    return JSON.parse(direct);
  } catch {
    const match = direct.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response was not JSON");
    return JSON.parse(match[0]);
  }
}

async function callGroq(messages: { role: "system" | "user"; content: string }[], maxTokens = 900) {
  const keys = [cleanKey(process.env.GROQ_COURSE_API_KEY)].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error("missing_course_ai_key");
  }

  const models = [MODEL, BACKUP_MODEL];
  let lastError = "";
  for (const apiKey of keys) {
    for (const model of models) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.35,
            max_tokens: maxTokens,
            stream: false,
          }),
          signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
        });
        if (!res.ok) {
          lastError = await res.text();
          continue;
        }
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("empty_ai_response");
        return content;
      } catch (error: any) {
        lastError = error?.message || String(error);
      }
    }
  }
  throw new Error(lastError || "course_ai_unavailable");
}

async function getActiveCourseSlug(userId: number, requested?: string) {
  if (requested) return requested;
  const activeEnrollment = await prisma.enrollment.findFirst({
    where: { userId, completed: false },
    orderBy: { enrolledAt: "asc" },
    include: { course: { select: { slug: true } } },
  });
  if (activeEnrollment?.course.slug) return activeEnrollment.course.slug;
  const recentProgress = await prisma.progress.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { courseSlug: true },
  });
  return recentProgress?.courseSlug || "active course";
}

function fallbackPractice(courseSlug: string, unitNumber: number, language: string) {
  const ar = language === "ar";
  return {
    questions: [
      {
        id: `fallback-${courseSlug}-${unitNumber}-1`,
        prompt: ar ? "ما الفكرة الأساسية في هذه الوحدة؟" : "What is the main idea in this unit?",
        options: ar
          ? ["شرحها بجملة واضحة", "تخمين الإجابة", "تخطي المراجعة", "فتح دورة أخرى"]
          : ["Explain it in one clear sentence", "Guess the answer", "Skip review", "Open another course"],
        correctIndex: 0,
        explanation: ar ? "الهدف هو تثبيت الفكرة الأساسية قبل التوسع." : "The goal is to stabilize the main idea before expanding.",
      },
      {
        id: `fallback-${courseSlug}-${unitNumber}-2`,
        prompt: ar ? "ما أفضل طريقة للمراجعة الهادئة؟" : "What is the best calm review method?",
        options: ar
          ? ["خطوة واحدة ومثال واحد", "كل شيء مرة واحدة", "بدون مصدر", "بسرعة عالية"]
          : ["One step and one example", "Everything at once", "Without a source", "Very fast"],
        correctIndex: 0,
        explanation: ar ? "الخطوة الواحدة تقلل الحمل المعرفي." : "One step reduces cognitive load.",
      },
      {
        id: `fallback-${courseSlug}-${unitNumber}-3`,
        prompt: ar ? "متى تطلب مساعدة نور؟" : "When should you ask Nour for help?",
        options: ar
          ? ["عند عدم وضوح القاعدة", "بعد التخمين فقط", "بعد ترك الدرس", "لا أطلب مساعدة أبدا"]
          : ["When the rule is unclear", "Only after guessing", "After leaving the lesson", "Never ask for help"],
        correctIndex: 0,
        explanation: ar ? "اطلب المساعدة عند أول نقطة غامضة." : "Ask for help at the first unclear point.",
      },
    ],
  };
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "center_admin") return NextResponse.json({ error: "Centers use dashboard insights only" }, { status: 403 });

  const ip = getClientIp(request);
  const rl = await checkRateLimit(`course-ai:${session.userId}:${ip}`, { maxRequests: 25, windowSeconds: 60 });
  if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const mode = body.mode;
  const language = body.language === "ar" ? "ar" : "en";

  if (mode === "awardPracticeXp") {
    const questionId = compact(body.questionId, 160);
    const correct = Boolean(body.correct);
    if (!questionId || !correct) return NextResponse.json({ awarded: false, xp: 0 });
    const existing = await prisma.activityLog.findFirst({
      where: { userId: session.userId, action: "xp_ai_practice", details: { contains: `"questionId":"${questionId}"` } },
      select: { id: true },
    });
    if (existing) return NextResponse.json({ awarded: false, xp: 0, duplicate: true });
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "xp_ai_practice",
        details: JSON.stringify({
          xp: 10,
          questionId,
          courseSlug: compact(body.courseSlug, 100),
          unitIndex: Number(body.unitNumber || 1) - 1,
        }),
      },
    });
    return NextResponse.json({ awarded: true, xp: 10 });
  }

  const courseSlug = await getActiveCourseSlug(session.userId, compact(body.courseSlug, 100));
  const unitNumber = Math.max(1, Math.min(7, Number(body.unitNumber || 1)));
  const courseTitle = compact(body.courseTitle || courseSlug, 200);
  const unitTitle = compact(body.unitTitle || `Unit ${unitNumber}`, 200);
  const chapterTitle = compact(body.chapterTitle, 220);
  const instruction = compact(body.instruction, 2200);
  const userPreferences = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { category: true, uiPreferences: true },
  });

  const system = `You are Nour inside Tafrah, an autism-first learning platform. CP and LD support are in the roadmap.
Use a calm, literal, predictable teaching style.
Do not diagnose.
Use the user's UI/preferences when relevant.
Avoid metaphors, sarcasm, pressure, surprise language, and dense paragraphs.
Give practical explanation, examples, non-examples, and a tiny check for understanding.`;

  if (mode === "explain") {
    if (!instruction) return NextResponse.json({ error: "missing_instruction" }, { status: 400 });
    const content = await callGroq([
      { role: "system", content: system },
      {
        role: "user",
        content: `Language: ${language}
Course: ${courseTitle} (${courseSlug})
Unit: ${unitTitle}
Chapter: ${chapterTitle || "Current chapter"}
Exact visible lesson text: ${instruction}
User category/preferences: ${JSON.stringify(userPreferences)}

The learner pressed "I don't understand".
Explain the exact visible content in detail, not as a summary.
Structure:
1. What this means
2. Why it matters
3. Step-by-step explanation
4. Concrete example
5. Common mistake
6. One tiny check question
Keep paragraphs short but be descriptive enough to make the learner understand.`,
      },
    ], 1200);
    return NextResponse.json({ explanation: content });
  }

  if (mode === "practice") {
    const content = await callGroq([
      { role: "system", content: `${system}\nReturn valid JSON only. No markdown.` },
      {
        role: "user",
        content: `Language: ${language}
Course: ${courseTitle} (${courseSlug})
Unit: ${unitTitle}
Recent lesson text: ${instruction || "Use the user's current course progress."}
User category/preferences: ${JSON.stringify(userPreferences)}

Generate exactly 3 multiple-choice training questions for extra XP.
They must be based on this exact course/unit context.
Return JSON:
{"questions":[{"id":"short-stable-id","prompt":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}]}
Make options clear and not trick-based. correctIndex must be 0-3.`,
      },
    ], 900).catch(() => JSON.stringify(fallbackPractice(courseSlug, unitNumber, language)));
    let parsed;
    try {
      parsed = jsonFromText(content);
    } catch {
      parsed = fallbackPractice(courseSlug, unitNumber, language);
    }
    const questions = Array.isArray(parsed?.questions) ? parsed.questions.slice(0, 3) : fallbackPractice(courseSlug, unitNumber, language).questions;
    return NextResponse.json({ questions, courseSlug, unitNumber });
  }

  return NextResponse.json({ error: "invalid_mode" }, { status: 400 });
}
