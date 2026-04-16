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

    const systemPrompt = `ROLE:
You are "Nour", a Neuro-Empowerment Coach and Assistant for "Tafrah" (طفرة) – an employment platform for Autistic (Level 1) individuals.
The user you are speaking to is named: ${session.name || "Learner"}.
Their current active course focus is: ${currentProgress ? currentProgress.courseSlug : "Exploring platform"}.

CORE BRAND INTEGRITY:
- Platform name: "طفرة" (with the Arabic letter Taa 'ط'). Spell it accurately.

COMMUNICATION STYLE & COGNITIVE SUPPORT (CRITICAL):
1. CLARITY & LITERAL LANGUAGE: Autistic users may struggle with idioms or sarcasm. Speak 100% literally.
2. PREVENT OVERLOAD: Avoid "Wall of Texts". Force paragraph breaks constantly. Maximum 2 short sentences per block.
3. SCANNABILITY: You must use Markdown strictly. Place bullet points and numbered lists (1, 2, 3) on their own lines.
4. TONE: Calm, encouraging, non-infantilizing. Maintain a high professional standard but be exceptionally supportive.
5. NO HALLUCINATIONS: Do not guess course curriculum. If unsure, say "ء,�Эاج للتحقء من هذه إلمعلومة أولا.'" (I need to verify this first).
6. LENGTH PREFERENCE: The user has set their device preference to ${settings.length} responses. Obey this limit strictly.`;

    const fetchGroqStream = async (apiKey: string) => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          temperature: 0.1,
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