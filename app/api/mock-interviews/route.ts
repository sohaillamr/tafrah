import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { errorSummary, getRequestId, logEvent } from "@/lib/observability";
import { sanitizeObject } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TranscriptMessage = {
  role: "hr" | "candidate";
  text: string;
  at: string;
};

const MAX_TEXT = 1200;
const MAX_TRANSCRIPT_ITEMS = 40;

function clampText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT) : fallback;
}

function normalizeLanguage(value: unknown) {
  return value === "en" ? "en" : "ar";
}

function normalizeTranscript(value: unknown): TranscriptMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || (item.role !== "hr" && item.role !== "candidate")) return null;
      const text = clampText(item.text);
      if (!text) return null;
      return {
        role: item.role,
        text,
        at: typeof item.at === "string" ? item.at : new Date().toISOString(),
      } as TranscriptMessage;
    })
    .filter(Boolean)
    .slice(-MAX_TRANSCRIPT_ITEMS) as TranscriptMessage[];
}

function fallbackQuestion(companyName: string, jobTitle: string, language: string, count: number) {
  const ar = [
    `أهلاً بك في مقابلة ${companyName}. عرّف نفسك باختصار، ولماذا تقدمت لوظيفة ${jobTitle}؟`,
    `اذكر تجربة عمل أو تدريب مرتبطة بوظيفة ${jobTitle}. ماذا كان دورك؟`,
    "احكِ عن موقف واجهت فيه مشكلة، وما الخطوات التي اتبعتها لحلها.",
    "ما نقطة قوة واضحة لديك؟ وما نقطة تحتاج إلى تطوير؟",
    "لماذا ترى أنك مناسب لهذه الشركة؟",
  ];
  const en = [
    `Welcome to the ${companyName} interview. Briefly introduce yourself and why you applied for ${jobTitle}.`,
    `Tell me about a project or training experience related to ${jobTitle}. What was your role?`,
    "Describe a problem you faced and the steps you took to solve it.",
    "What is one clear strength you have, and one area you want to improve?",
    "Why do you think you are a good fit for this company?",
  ];
  const list = language === "en" ? en : ar;
  return list[Math.min(count, list.length - 1)];
}

function fallbackReport(transcript: TranscriptMessage[], language: string) {
  const candidateTurns = transcript.filter((item) => item.role === "candidate");
  const averageLength =
    candidateTurns.reduce((total, item) => total + item.text.split(/\s+/).length, 0) /
    Math.max(candidateTurns.length, 1);
  const score = Math.max(45, Math.min(85, Math.round(55 + candidateTurns.length * 5 + Math.min(averageLength, 35) / 2)));

  if (language === "en") {
    return {
      score,
      summary: "The interview is complete. The report is based on answer clarity, relevance, examples, and confidence.",
      strengths: ["Completed the interview flow", "Answered multiple HR questions", "Built a usable practice transcript"],
      improve: ["Use one concrete example per answer", "Mention measurable results when possible", "Keep answers structured: situation, action, result"],
      focusPlan: ["Practice a 45-second introduction", "Prepare two project stories", "Prepare one weakness with a clear improvement action"],
    };
  }

  return {
    score,
    summary: "انتهت المقابلة. التقرير مبني على وضوح الإجابات، علاقتها بالوظيفة، وجود أمثلة، والثقة في العرض.",
    strengths: ["أكملت مسار المقابلة", "أجبت عن عدة أسئلة HR", "أصبحت لديك نسخة تدريبية من الحوار"],
    improve: ["استخدم مثالاً عملياً واحداً في كل إجابة", "اذكر نتيجة أو رقم عندما يكون ذلك ممكناً", "رتب الإجابة: الموقف، الفعل، النتيجة"],
    focusPlan: ["تدرب على تعريف ذاتي في ٤٥ ثانية", "جهز قصتين عن مشاريع أو تدريب", "جهز نقطة ضعف مع خطة تحسين واضحة"],
  };
}

async function callGroq(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const apiKey = process.env.GROQ_API_KEY?.replace(/^["']|["']$/g, "") || process.env.GROQ_API_KEY_VOICE?.replace(/^["']|["']$/g, "");
  if (!apiKey) throw new Error("missing_api_key");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.45,
      max_tokens: 700,
      stream: false,
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    throw new Error((await response.text()).slice(0, 300));
  }

  const data = await response.json();
  return String(data.choices?.[0]?.message?.content || "").trim();
}

async function generateQuestion({
  companyName,
  jobTitle,
  language,
  transcript,
}: {
  companyName: string;
  jobTitle: string;
  language: string;
  transcript: TranscriptMessage[];
}) {
  const system =
    language === "en"
      ? "You are Nour acting as a calm HR employer in a mock interview. Ask exactly one interview question. Keep it concise, realistic, and accessible. Do not give feedback yet."
      : "أنت نور وتتصرف كمسؤول موارد بشرية هادئ في مقابلة تدريبية. اطرح سؤال مقابلة واحد فقط. اجعله واقعياً ومختصراً وسهل الفهم. لا تقدم تقييماً الآن.";

  const transcriptText = transcript.map((m) => `${m.role}: ${m.text}`).join("\n").slice(-5000);
  const prompt =
    language === "en"
      ? `Company: ${companyName}\nJob title: ${jobTitle}\nTranscript so far:\n${transcriptText}\n\nAsk the next best HR interview question.`
      : `الشركة: ${companyName}\nالوظيفة: ${jobTitle}\nالحوار حتى الآن:\n${transcriptText}\n\nاطرح سؤال HR التالي المناسب.`;

  try {
    return await callGroq([
      { role: "system", content: system },
      { role: "user", content: prompt },
    ]);
  } catch {
    return fallbackQuestion(companyName, jobTitle, language, transcript.filter((m) => m.role === "candidate").length);
  }
}

async function generateReport({
  companyName,
  jobTitle,
  language,
  transcript,
}: {
  companyName: string;
  jobTitle: string;
  language: string;
  transcript: TranscriptMessage[];
}) {
  const system =
    language === "en"
      ? "You are Nour, a calm HR interview coach. Return only valid JSON with keys: score number 0-100, summary string, strengths string[], improve string[], focusPlan string[]. Be specific and kind."
      : "أنت نور، مدرب مقابلات HR هادئ. أعد JSON صالح فقط بالمفاتيح: score رقم من 0 إلى 100، summary نص، strengths قائمة نصوص، improve قائمة نصوص، focusPlan قائمة نصوص. كن محدداً ولطيفاً.";
  const prompt = JSON.stringify({
    companyName,
    jobTitle,
    language,
    transcript,
  });

  try {
    const text = await callGroq([
      { role: "system", content: system },
      { role: "user", content: prompt },
    ]);
    const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    return {
      score,
      summary: clampText(parsed.summary, language === "en" ? "Interview report generated." : "تم إنشاء تقرير المقابلة."),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map((x: unknown) => clampText(x)).filter(Boolean).slice(0, 6) : [],
      improve: Array.isArray(parsed.improve) ? parsed.improve.map((x: unknown) => clampText(x)).filter(Boolean).slice(0, 6) : [],
      focusPlan: Array.isArray(parsed.focusPlan) ? parsed.focusPlan.map((x: unknown) => clampText(x)).filter(Boolean).slice(0, 6) : [],
    };
  } catch {
    return fallbackReport(transcript, language);
  }
}

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized", requestId }, { status: 401 });

  const interviews = await prisma.mockInterview.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      language: true,
      status: true,
      transcript: true,
      report: true,
      score: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ interviews, requestId });
}

export async function POST(request: Request) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized", requestId }, { status: 401 });

  const ip = getClientIp(request);
  const limit = await checkRateLimit(`mock-interview:${session.userId}:${ip}`, { maxRequests: 40, windowSeconds: 60 * 60 });
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited", requestId }, { status: 429 });

  try {
    const body = sanitizeObject((await request.json().catch(() => ({}))) as Record<string, unknown>, MAX_TEXT);
    const action = clampText(body.action);
    const language = normalizeLanguage(body.language);

    if (action === "start") {
      const companyName = clampText(body.companyName, language === "en" ? "Target company" : "الشركة") || (language === "en" ? "Target company" : "الشركة");
      const jobTitle = clampText(body.jobTitle, language === "en" ? "Candidate role" : "الوظيفة") || (language === "en" ? "Candidate role" : "الوظيفة");
      const transcript: TranscriptMessage[] = [];
      const firstQuestion = await generateQuestion({ companyName, jobTitle, language, transcript });
      const nextTranscript = [{ role: "hr" as const, text: firstQuestion, at: new Date().toISOString() }];
      const interview = await prisma.mockInterview.create({
        data: {
          userId: session.userId,
          companyName,
          jobTitle,
          language,
          transcript: nextTranscript as any,
        },
      });
      return NextResponse.json({ interview, question: firstQuestion, requestId });
    }

    const interviewId = Number(body.interviewId);
    if (!Number.isInteger(interviewId)) {
      return NextResponse.json({ error: "invalid_interview", requestId }, { status: 400 });
    }

    const interview = await prisma.mockInterview.findFirst({
      where: { id: interviewId, userId: session.userId },
    });
    if (!interview) return NextResponse.json({ error: "not_found", requestId }, { status: 404 });

    const transcript = normalizeTranscript(interview.transcript);

    if (action === "answer") {
      const answer = clampText(body.answer);
      if (!answer) return NextResponse.json({ error: "empty_answer", requestId }, { status: 400 });

      const withAnswer = [...transcript, { role: "candidate" as const, text: answer, at: new Date().toISOString() }];
      const question = await generateQuestion({
        companyName: interview.companyName,
        jobTitle: interview.jobTitle,
        language: interview.language,
        transcript: withAnswer,
      });
      const nextTranscript = [...withAnswer, { role: "hr" as const, text: question, at: new Date().toISOString() }].slice(-MAX_TRANSCRIPT_ITEMS);
      const updated = await prisma.mockInterview.update({
        where: { id: interview.id },
        data: { transcript: nextTranscript as any, status: "active" },
      });
      return NextResponse.json({ interview: updated, question, requestId });
    }

    if (action === "finish") {
      const report = await generateReport({
        companyName: interview.companyName,
        jobTitle: interview.jobTitle,
        language: interview.language,
        transcript,
      });
      const updated = await prisma.mockInterview.update({
        where: { id: interview.id },
        data: {
          status: "completed",
          report: report as any,
          score: report.score,
        },
      });
      return NextResponse.json({ interview: updated, report, requestId });
    }

    return NextResponse.json({ error: "invalid_action", requestId }, { status: 400 });
  } catch (error) {
    logEvent("error", "mock_interview_failed", {
      requestId,
      userId: session.userId,
      error: errorSummary(error),
    });
    return NextResponse.json({ error: "server_error", requestId }, { status: 500 });
  }
}
