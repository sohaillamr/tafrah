import prisma from "@/lib/prisma";

/**
 * Background worker triggered upon 100% course completion.
 * Aggregates all completed course scores, updates the User's master quizScore, 
 * and enriches their profile (bio/jobTitle) with matching skill tags 
 * to ensure they appear as 'Qualified' to HR users immediately.
 */
export async function processCourseCompletion(userId: number) {
  try {
    // 1. Fetch all completed enrollments for the user to determine verified skills
    const completedCourses = await prisma.enrollment.findMany({
      where: { userId, completed: true },
      include: { course: true },
    });

    if (completedCourses.length === 0) return;

    // 2. Fetch all passed quizzes to calculate aggregate mastery score
    const allProgress = await prisma.progress.findMany({
      where: { userId, quizPassed: true },
    });

    const passedUnits = allProgress.length;
    const totalScore = allProgress.reduce((sum, p) => sum + (p.quizScore || 0), 0);
    const avgScoreMastery = passedUnits > 0 ? (totalScore / passedUnits) : 0;
    
    // Weighted logic: completing more courses boosts the baseline, accuracy adds the rest.
    const aggregateScore = Math.min(100, Math.round(completedCourses.length * 15 + avgScoreMastery * 0.15));

    // 3. Extract unique skill tags driven from the course categories
    const baseSkills = "Foundational Work Etiquette";
    const acquiredTags = Array.from(new Set(completedCourses.map(e => e.course.category))).join(", ");
    
    const enrichedBio = `Verified Skills: ${baseSkills}, ${acquiredTags}. Ready for opportunities matching these criteria.`;

    // 4. Update the User profile for immediate HR Match Engine visibility
    await prisma.user.update({
      where: { id: userId },
      data: { 
        quizScore: aggregateScore,
        bio: enrichedBio
      }
    });

    console.info(`[WORKER SUCCESS] User ${userId} aggregated score updated to ${aggregateScore}% with skills: ${acquiredTags}`);
  } catch (error) {
    console.error("[WORKER ERROR] Failed to process course completion:", error);
  }
}
