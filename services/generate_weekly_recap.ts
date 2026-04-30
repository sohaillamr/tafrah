import prisma from "../lib/prisma";
import { exec } from "child_process";

export async function generateWeeklyRecaps() {
  console.log("Starting Weekly Recap Pipeline...");
  const users = await prisma.user.findMany({
    include: { skillProfile: true, progress: true }
  });

  for (const user of users) {
    const recapData = {
      name: user.name,
      milestones: user.progress.length,
      readiness: user.skillProfile?.careerReadiness || 0,
      badges: user.skillProfile?.badges || [],
    };
    
    console.log(`Generating video for ${user.email} with data:`, recapData);
  }
  console.log("Recap Pipeline Complete.");
}
