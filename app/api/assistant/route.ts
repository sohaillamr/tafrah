import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorSummary, getRequestId, logEvent } from "@/lib/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONVERSATION_MESSAGES = 15;
const GROQ_TIMEOUT_MS = 25000;

export async function POST(request: Request) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized", requestId }, { status: 401 });
  if (session.role === "center_admin") {
    return NextResponse.json({ error: "center_accounts_use_dashboard_insights", requestId }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = await checkRateLimit(`assistant:${session.userId}:${ip}`, { maxRequests: 30, windowSeconds: 60 });
  
  if (!rl?.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please slow down.", requestId },
      { status: 429 }
    );
  }

  const primaryKey = process.env.GROQ_API_KEY?.replace(/^["']|["']$/g, '');
    const secondaryKey = process.env.GROQ_API_KEY_VOICE?.replace(/^["']|["']$/g, '') || process.env.GROQ_API_KEY_SECONDARY?.replace(/^["']|["']$/g, '');
  if (!primaryKey && !secondaryKey) {
    logEvent("error", "assistant_missing_api_key", { requestId, userId: session.userId });
    return NextResponse.json({ error: "missing_api_key", requestId }, { status: 500 });
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
      logEvent("error", "assistant_missing_api_key", { requestId, userId: session.userId });
      return NextResponse.json({ error: "missing_api_key", requestId }, { status: 500 });
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

    if (messages.length === 0) return NextResponse.json({ error: "no_messages", requestId }, { status: 400 });

    let currentProgress = null;
    let userPreferences = null;
    let userDbRecord = null;
    try {
      userDbRecord = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { category: true, uiPreferences: true }
      });
      currentProgress = await prisma.progress.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });
      userPreferences = await prisma.userPreference.findUnique({
        where: { userId: session.userId }
      });
    } catch (dbError) {
      logEvent("warn", "assistant_context_lookup_failed", {
        requestId,
        userId: session.userId,
        error: errorSummary(dbError),
      });
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

    const userCategory = userDbRecord?.category || "GENERAL";
    const userUiPreferences = userDbRecord?.uiPreferences || {};

    const systemPrompt = `You are Nour, an AI learning assistant for Tafrah. Tafrah is autism-first now, with CP and LD support in the pipeline.

Talk to the user (named: ${session.name || "Student"}).
Their current active course focus is: ${currentProgress ? currentProgress.courseSlug : "Exploring platform"}.

User Profile Category: ${userCategory}
${userCategory === "AUTISM" ? "- COMMUNICATION STYLE: Be direct, literal, and concise. Avoid metaphors, idioms, sarcasm, or excessive enthusiasm. Use clear formatting (bullet points, bold text for emphasis).\n- TASK DECONSTRUCTION: When explaining a concept or solving a problem, break it down into atomic, numbered steps." : ""}
${userCategory === "LEARNING_HARDENING" ? "- COMMUNICATION STYLE: Keep sentences short and vocabulary simple. If explaining complex terms, provide clear, easy-to-understand definitions immediately.\n- COGNITIVE LOAD REDUCTION: Never provide more than 2 paragraphs of text at once. Prioritize step-by-step guidance over theoretical deep-dives." : ""}
${userCategory === "CP" ? "- COMMUNICATION STYLE: Assume the user may be using assistive tools. Keep your answers brief to minimize the need for the user to type large responses." : ""}

User UI Preferences (Session Settings): ${JSON.stringify(userUiPreferences)}
Saved Data - Formatting Prefs: ${userPreferences?.formattingPrefs || "None"}.
Saved Data - Sensory Triggers: ${userPreferences?.sensoryTriggers || "None"}.

CORE Directives:
1. AUTISM-COMPATIBLE STYLE: Be calm, literal, predictable, and respectful. Avoid sarcasm, idioms, vague reassurance, pressure, and surprise tone shifts.
2. TASK DECONSTRUCTION: Give one clear next step first. For multi-step tasks, number steps and ask before continuing when the answer would be long.
3. COGNITIVE LOAD REDUCTION: Keep answers short, use clear spacing, and avoid dense paragraphs. Never provide more than 3 short paragraphs at once.
${isFrustrated ? `4. CALM MODE ACTIVE: The user appears frustrated. Acknowledge the difficulty neutrally, offer a simplified explanation, and suggest a short break if appropriate. "I see this is causing friction. Let's step back." Reduce response length.` : `4. EMOTIONAL SUPPORT: Acknowledge difficulties neutrally without being overly enthusiastic.`}
5. ACCESSIBILITY: If text may be hard to process, offer to simplify, summarize, or read it aloud. Use the user's sensory/UI preferences when choosing wording and formatting.
6. CONTEXTUAL AWARENESS: Prioritize the user's current course module and explicit preferences stored in your context. Do not make assumptions about prior knowledge outside verified progress.
7. IDENTITY SAFETY: Do not claim the user is currently inside a specific course unless the latest message says so. Do not greet with the user's name unless it is natural and necessary.
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
        logEvent("warn", "assistant_provider_error", {
          requestId,
          userId: session.userId,
          status: res.status,
          model: modelToUse,
          body: errorText.slice(0, 500),
        });
        throw new Error("assistant_provider_error");
      }
      return res;
    };

    for (const key of keysToTry) {
      if (!key) continue;
      try {
        const streamResponse = await fetchGroqStream(key, activeModel);
        return new Response(streamResponse.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Request-Id": requestId,
          }
        });
      } catch (err: any) {
        logEvent("warn", "assistant_active_model_failed", {
          requestId,
          userId: session.userId,
          error: errorSummary(err),
        });
        try {
          const streamResponse = await fetchGroqStream(key, backupModel);
          return new Response(streamResponse.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              "Connection": "keep-alive",
              "X-Request-Id": requestId,
            }
          });
        } catch (backupErr: any) {
          logEvent("warn", "assistant_backup_model_failed", {
            requestId,
            userId: session.userId,
            error: errorSummary(backupErr),
          });
          // Loop continues to try the next key
        }
      }
    }

    return NextResponse.json(
      { message: "Service unavailable at the moment. Please try again later.", error: "All keys and models failed.", requestId },
      { status: 503 }
    );

  } catch (err) {
    logEvent("error", "assistant_unhandled_error", {
      requestId,
      userId: session.userId,
      error: errorSummary(err),
    });
    return NextResponse.json({ error: "server error", requestId }, { status: 500 });
  }
}


