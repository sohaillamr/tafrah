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
    const secondaryKey = process.env.GROQ_API_KEY_VOICE?.replace(/^["']|["']$/g, '') || process.env.GROQ_API_KEY_SECONDARY?.replace(/^["']|["']$/g, '');
  if (!primaryKey && !secondaryKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
  }


  try {
    const ObjectBody = await request.json().catch(() => ({}));
    const incoming = Array.isArray(ObjectBody?.messages) ? ObjectBody.messages : [];
    const isVoiceMode = ObjectBody.mode === "voice";

    // Always fall back to the other key if one fails
    const keysToTry = isVoiceMode 
      ? [secondaryKey, primaryKey].filter(Boolean) 
      : [primaryKey, secondaryKey].filter(Boolean);

    if (keysToTry.length === 0) {
      return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
    }

    const activeModel = isVoiceMode ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile";
    const backupModel = "llama3-8b-8192";
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

    const fetchGroqStream = async (apiKey: string, modelToUse: string = activeModel) => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelToUse,
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

for (const key of keysToTry) {
      if (!key) continue;
      try {
        console.log("Trying key for Groq...");
        const streamResponse = await fetchGroqStream(key, activeModel);
        console.log("Stream fetched OK with active model.");
        return new Response(streamResponse.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive"
          }
        });
      } catch (err: any) {
        console.error(`Active model failed with key, trying backup model:`, err.message);
        try {
          const streamResponse = await fetchGroqStream(key, backupModel);
          console.log("Stream fetched OK with backup model.");
          return new Response(streamResponse.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              "Connection": "keep-alive"
            }
          });
        } catch (backupErr: any) {
          console.error(`Backup model also failed for this key:`, backupErr.message);
          // Loop continues to try the next key
        }
      }
    }

    return NextResponse.json(
      { message: "Service unavailable at the moment. Please try again later.", error: "All keys and models failed." },
      { status: 503 }
    );

  } catch (err) {
    console.error("Assistant Error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

