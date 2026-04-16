import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = process.env.GROQ_API_KEY_VOICE || process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "no_file_provided" }, { status: 400 });
    }

    const groqFormData = new FormData();
    groqFormData.append("file", file, "audio.webm");
    groqFormData.append("model", "whisper-large-v3");
    groqFormData.append("language", "ar");
    groqFormData.append("prompt", "تكلم باللهجة المصرية العامية. يا باشا، إزيك، عامل إيه؟");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.replace(/^["']|["']$/g, "")}`,
      },
      body: groqFormData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq STT API Error:", errorText);
      throw new Error(errorText);
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("STT Error:", err);
    return NextResponse.json({ error: "stt_error" }, { status: 500 });
  }
}
