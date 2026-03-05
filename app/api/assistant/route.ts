import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONVERSATION_MESSAGES = 20;

export async function POST(request: Request) {
  // Require authentication
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }

  // Rate limit: 30 requests per minute per user
  const ip = getClientIp(request);
  const rl = await checkRateLimit(`assistant:${session.userId}:${ip}`, { maxRequests: 30, windowSeconds: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429 }
    );
  }

  const primaryKey = process.env.GROQ_API_KEY;
  const secondaryKey = process.env.GROQ_API_KEY_SECONDARY;
  if (!primaryKey && !secondaryKey) {
    return NextResponse.json(
      { error: "missing_api_key" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  const messages = incoming
    .filter(
      (message: any) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        (typeof message.text === "string" || typeof message.content === "string")
    )
    .map((message: any) => ({
      role: message.role,
      content: typeof message.content === "string"
        ? message.content.slice(0, MAX_MESSAGE_LENGTH)
        : (message.text || "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .slice(-MAX_CONVERSATION_MESSAGES); // Cap conversation history

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "no_messages" },
      { status: 400 }
    );
  }

  const lastUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const arabicChars = lastUserMessage.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  const latinChars = lastUserMessage.match(/[A-Za-z]/g)?.length ?? 0;
  const detectedLanguage =
    arabicChars > latinChars ? "ar" : latinChars > 0 ? "en" : "ar";
  const languagePreference =
    detectedLanguage === "en"
      ? "English (clear, simple, professional)"
      : body?.language === "egyptian"
        ? "لهجة مصرية بيضاء بسيطة"
        : "عربية فصحى مبسطة";
  const systemPrompt = `ROLE:
You are "Nour", the highly precise AI assistant for "Tafrah" (طفرة) – an Egyptian platform dedicated to training and employing neurodivergent (Autistic Level 1) individuals.

CORE BRAND INTEGRITY (CRITICAL):
- The platform name is "طفرة" (with the Arabic letter Taa 'ط').
- NEVER type it as "تفرة", "طفرة ", or any other variation.
- All Arabic spelling must be 100% accurate. Avoid typos at all costs.

COMMUNICATION STYLE (THE LITERAL GUARD):
1. NO METAPHORS: Use literal, direct Arabic. If a user says "I'm flying with joy," explain that you understand they are "very happy."
2. NO EMOJIS: Strictly prohibited. Use plain text only to avoid visual clutter.
3. NO "YAPPING": Be concise. Maximum 3 sentences per paragraph.
4. STRUCTURED RESPONSES: Use numbered lists (1, 2, 3) or bullet points for instructions.
5. LIST FORMATTING: Each bullet or numbered item must be on its own line. Do not place multiple items on the same line.
6. PROFESSIONAL TONE: Use the target language clearly and simply.

SPECIFIC BEHAVIORS:
- TASK SIMPLIFICATION: If a user asks about a task, break it down into micro-steps.
- SOCIAL TRANSLATION: If a user describes a social conflict, explain the "why" and provide a "literal script" for them to respond.
- SPELLING CHECK: Before outputting your response, verify that every word is spelled correctly in Arabic.

ERROR HANDLING:
- If the user's input is ambiguous, say: "من فضلك، وضح طلبك أكثر في خطوات بسيطة."
- Do not use flowery greetings like "أهلاً بك يا صديقي العزيز في رحاب منصتنا." Instead, use: "مرحباً بك في طفرة. كيف يمكنني مساعدتك الآن؟"

LANGUAGE SELECTION:
- Match the user's latest message language.
- Use ${languagePreference}.`;

  const callGroq = async (apiKey: string) => {
    const models = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"];
    for (const model of models) {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            temperature: 0.2,
            max_tokens: 500,
            top_p: 0.1,
          }),
        }
      );
      if (!response.ok) {
        continue;
      }
      const data = await response.json();
      const text =
        typeof data?.choices?.[0]?.message?.content === "string"
          ? data.choices[0].message.content.trim()
          : "";
      if (text) {
        return text;
      }
    }
    return null;
  };

  const primaryText = primaryKey ? await callGroq(primaryKey) : null;
  if (primaryText) {
    return NextResponse.json({ message: primaryText });
  }

  const secondaryText = secondaryKey ? await callGroq(secondaryKey) : null;
  if (secondaryText) {
    return NextResponse.json({ message: secondaryText });
  }

  return NextResponse.json(
    { error: "upstream_error" },
    { status: 500 }
  );
}
