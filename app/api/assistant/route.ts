import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONVERSATION_MESSAGES = 15;
const GROQ_TIMEOUT_MS = 25000;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ip = getClientIp(request);
  const rl = await checkRateLimit(`assistant:${session.userId}:${ip}`, { maxRequests: 30, windowSeconds: 60 });
  
  if (!rl?.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const primaryKey = process.env.GROQ_API_KEY?.replace(/^["']|["']$/g, '');
  const secondaryKey = process.env.GROQ_API_KEY_SECONDARY?.replace(/^["']|["']$/g, '');
  if (!primaryKey && !secondaryKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
  }


  try {
    const ObjectBody = await request.json().catch(() => ({}));
    const incoming = Array.isArray(ObjectBody?.messages) ? ObjectBody.messages : [];

    const messages = incoming
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant"))
      .map((m: any) => ({
        role: m.role,
        content: (m.content || m.text || "").slice(0, MAX_MESSAGE_LENGTH),
      }))
      .slice(-MAX_CONVERSATION_MESSAGES);

    if (messages.length === 0) return NextResponse.json({ error: "no_messages" }, { status: 400 });

    let currentProgress = null;
    try {
      currentProgress = await prisma.progress.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });
    } catch (dbError) {
      console.error("[TAFRAH] Failed to fetch progress for AI fallback:", dbError);
    }

    const settings = ObjectBody.settings || { length: "concise" };

    const systemPrompt = `ROLE:\nYou are "Nour", a world-class Neuro-Inclusion coach and Assistant for "Tafrah" (طفرة) – an employment platform for Autistic (Level 1) individuals.\nTalk to the user (named: ${session.name || "Sohail Amr Anwar"}) as a partner in success.\nTheir current active course focus is: ${currentProgress ? currentProgress.courseSlug : "Exploring platform"}.\n\nSTRICT RULE (NO REPETITION):\n- NEVER start responses with "I understand you" or "أفهمك تماماً...". If you do, the system will fail. Be dynamic.\n\nCHARACTER ENCODING & LANGUAGE (CRITICAL):\n- You MUST use only standard Arabic (UTF-8) and standard Latin characters.\n- Never use Cyrillic (e.g. курc), Greek, or mathematical symbols for regular words.\n- When mentioning course names, use the English name as-is or the proper Arabic translation (e.g., 'إدخال البيانات' for Data Entry). Do not attempt to transliterate or hybridize the spelling.\n\nCOMMUNICATION STYLE & COGNITIVE SUPPORT:\n1. VALIDATION: Be dynamic. Start responses by acknowledging their question positively (e.g., "سؤال ممتاز..." or a direct answer).\n2. CLARITY & LITERAL LANGUAGE: Speak 100% literally. Avoid complex metaphors, idioms, or sarcasm.\n3. PREVENT OVERLOAD: Avoid "Wall of Texts". Force paragraph breaks frequently. Maximum 2 short sentences per block. Use concise, short sentences and bullet points.\n4. SCANNABILITY: Use Markdown strictly. Place bullet points and numbered lists (1, 2, 3) on their own lines.\n5. TONE: Calm, encouraging, patient, empathetic, and non-infantilizing. Maintain a high professional standard but be exceptionally supportive.\n6. SMART FALLBACK: Do not guess course curriculum or technical fixes. If you don't know the answer to a technical glitch, strictly say: "يبدو أن هناك مشكلة تقنية، سأقوم بإبلاغ الفريق فوراً لمساعدتك."\n7. LENGTH PREFERENCE: The user has set their device preference to ${settings.length} responses. Obey this limit strictly.`;

    const fetchGroqStream = async (apiKey: string) => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          temperature: 0.5,
          max_tokens: 500,
          stream: true,
        }),
        signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Groq API Error details:", res.status, errorText);
        throw new Error("Groq API Error: " + errorText);
      }
      return res;
    };

    try {
      if (primaryKey) {
        console.log("Trying primary key for Groq.");
        const streamResponse = await fetchGroqStream(primaryKey);
        console.log("Stream fetched OK.");
        return new Response(streamResponse.body, { 
          headers: { 
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive"
          } 
        });
      }
    } catch (primError: any) {
      console.error("Groq primary request failed:", primError.message);
      if (secondaryKey) {
        try {
          const streamFallback = await fetchGroqStream(secondaryKey);
          return new Response(streamFallback.body, { 
            headers: { 
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              "Connection": "keep-alive"
            } 
          });
        } catch (secErr: any) {
          console.error("Groq fallback request failed:", secErr.message);
          return NextResponse.json(
            { message: "Service unavailable at the moment. Please try again later.", sys_error: secErr.message },
            { status: 503 }
          );
        }
      }
      return NextResponse.json(
        { message: "Service unavailable at the moment. Please try again later.", sys_error: primError.message },
        { status: 503 }
      );
    }

  } catch (err) {
    console.error("Assistant Error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

