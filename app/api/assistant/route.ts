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

    // We upgrade both models to llama-3.3-70b-versatile to ensure high intelligence for text and voice, 
    // falling back to an 8b model only when necessary.
    const activeModel = "llama-3.3-70b-versatile";
    const backupModel = "llama3-8b-8192";
    const messages = incoming
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant"))
      .map((m: any) => ({
        role: m.role,
        content: (m.content || m.text || "").slice(0, MAX_MESSAGE_LENGTH),
      }))
      .slice(-MAX_CONVERSATION_MESSAGES);

    if (messages.length === 0) return NextResponse.json({ error: "no_messages" }, { status: 400 });

    let currentProgress = null;
    let userPreferences = null;
    try {
      currentProgress = await prisma.progress.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });
      userPreferences = await prisma.userPreference.findUnique({
        where: { userId: session.userId }
      });
    } catch (dbError) {
      console.error("[TAFRAH] Failed to fetch progress/preferences for AI fallback:", dbError);
    }

    const settings = ObjectBody.settings || { length: "concise" };

    // Frustration Detection Logic (Phase 3)
    let isFrustrated = false;
    if (messages.length >= 2) {
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      const frustrationKeywords = ["wrong", "stop", "no", "bad", "not working", "error", "hate", "ugh"];
      if (lastMsg.length < 15 && frustrationKeywords.some(kw => lastMsg.includes(kw))) {
        isFrustrated = true;
      }
    }

    const systemPrompt = `You are Nour, an AI learning assistant for Tafrah, dedicated to supporting neurodivergent users (specifically Level 1 Autism) in mastering technical skills like programming and accounting.

Talk to the user (named: ${session.name || "Sohail Amr Anwar"}).
Their current active course focus is: ${currentProgress ? currentProgress.courseSlug : "Exploring platform"}.
User format preferences: ${userPreferences?.formattingPrefs || "None"}.
User sensory triggers: ${userPreferences?.sensoryTriggers || "None"}.

CORE Directives:
1. COMMUNICATION STYLE: Be direct, literal, and concise. Avoid metaphors, idioms, sarcasm, or excessive enthusiasm. Use clear formatting (bullet points, bold text for emphasis).
2. TASK DECONSTRUCTION: When explaining a concept or solving a problem, break it down into atomic, numbered steps. Ask the user to confirm completion of Step 1 before providing Step 2.
3. COGNITIVE LOAD REDUCTION: Never provide more than 3 paragraphs of text at once. If code is required, provide only the specific snippet needed, not the entire file context unless asked.
${isFrustrated ? `4. CALM MODE ACTIVE: The user appears frustrated. Acknowledge the difficulty neutrally, offer a simplified explanation, and suggest a short break if appropriate. "I see this is causing friction. Let's step back." Reduce response length.` : `4. EMOTIONAL SUPPORT: Acknowledge difficulties neutrally without being overly enthusiastic.`}
5. CONTEXTUAL AWARENESS: Always prioritize the user's current course module and explicit preferences stored in your context. Do not make assumptions about their prior knowledge outside of verified progress.
`;

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


