import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, recentChats, quizScores } = await req.json();

  const systemPrompt = `
    You are Nour, an AI career coach for neurodivergent individuals. 
    Analyze the following user data (chat history and quiz scores) and generate a strengths-based cognitive profile.
    Focus on positive framing (e.g., "High attention to detail" rather than "Slow to finish").
    
    You MUST return valid JSON in the following format:
    {
      "strengths": ["string", "string", "string"],
      "workStyle": "string description",
      "recommendedRoles": ["string", "string"]
    }
  `;

  // Groq API Call forcing JSON format
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Chats: ${recentChats}\nScores: ${quizScores}` }
      ],
      response_format: { type: "json_object" }, // Force JSON output
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  const strengthsSummary = JSON.parse(data.choices?.[0]?.message?.content || "{}");

  // Update the user's Skill Profile in the Database
  await prisma.skillProfile.upsert({
    where: { userId },
    update: { strengthsSummary },
    create: {
      userId,
      strengthsSummary,
    }
  });

  return NextResponse.json({ strengthsSummary });
}
