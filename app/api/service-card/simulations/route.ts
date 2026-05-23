import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { errorSummary, getRequestId, logEvent } from "@/lib/observability";
import { sanitizeObject } from "@/lib/sanitize";
import {
  evaluateServiceCardSimulation,
  ServiceCardDisabilityType,
  ServiceCardSimulationInput,
} from "@/lib/service-card";

const VALID_DISABILITY_TYPES: ServiceCardDisabilityType[] = [
  "autism",
  "intellectual",
  "learning",
  "cerebral_palsy",
  "visual",
  "hearing",
  "multiple",
  "other",
];

function numberBetween(value: unknown, min: number, max: number, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function booleanValue(value: unknown) {
  return value === true;
}

function normalizeInput(raw: Record<string, unknown>): ServiceCardSimulationInput {
  const disabilityType = VALID_DISABILITY_TYPES.includes(raw.disabilityType as ServiceCardDisabilityType)
    ? (raw.disabilityType as ServiceCardDisabilityType)
    : "other";

  const documents = (raw.documents || {}) as Record<string, unknown>;
  const supportAnswers = (raw.supportAnswers || {}) as Record<string, unknown>;
  const cognitiveAnswers = (raw.cognitiveAnswers || {}) as Record<string, unknown>;
  const age = typeof raw.age === "number" || typeof raw.age === "string"
    ? numberBetween(raw.age, 0, 120, 0)
    : undefined;

  return {
    applicantName: typeof raw.applicantName === "string" ? raw.applicantName.slice(0, 120) : undefined,
    age: age || undefined,
    governorate: typeof raw.governorate === "string" ? raw.governorate.slice(0, 80) : undefined,
    disabilityType,
    documents: {
      nationalIdOrBirthCertificate: booleanValue(documents.nationalIdOrBirthCertificate),
      personalPhoto: booleanValue(documents.personalPhoto),
      medicalReports: booleanValue(documents.medicalReports),
      guardianId: booleanValue(documents.guardianId),
      proofOfAddress: booleanValue(documents.proofOfAddress),
      previousAssessments: booleanValue(documents.previousAssessments),
    },
    supportAnswers: {
      communication: numberBetween(supportAnswers.communication, 0, 3),
      dailyLiving: numberBetween(supportAnswers.dailyLiving, 0, 3),
      mobility: numberBetween(supportAnswers.mobility, 0, 3),
      learning: numberBetween(supportAnswers.learning, 0, 3),
      sensory: numberBetween(supportAnswers.sensory, 0, 3),
      supervision: numberBetween(supportAnswers.supervision, 0, 3),
    },
    cognitiveAnswers: {
      pattern: numberBetween(cognitiveAnswers.pattern, 0, 2),
      memory: numberBetween(cognitiveAnswers.memory, 0, 2),
      everydayMath: numberBetween(cognitiveAnswers.everydayMath, 0, 2),
      comprehension: numberBetween(cognitiveAnswers.comprehension, 0, 2),
      attention: numberBetween(cognitiveAnswers.attention, 0, 2),
    },
  };
}

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized", requestId }, { status: 401 });
    }

    const simulations = await prisma.serviceCardSimulation.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        disabilityType: true,
        readinessScore: true,
        pathway: true,
        documentReadiness: true,
        supportNeedScore: true,
        cognitiveScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ simulations, requestId });
  } catch (error) {
    logEvent("error", "service_card_simulation_list_failed", {
      requestId,
      error: errorSummary(error),
    });
    return NextResponse.json({ error: "Failed to load simulations", requestId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request.headers);

  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`service-card:${ip}`, {
      maxRequests: 30,
      windowSeconds: 60 * 60,
    });

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many simulations. Please try again later.", requestId }, { status: 429 });
    }

    const raw = sanitizeObject((await request.json()) as Record<string, unknown>, 1200);
    const input = normalizeInput(raw);
    const result = evaluateServiceCardSimulation(input);
    const session = await getSession();

    let savedId: number | null = null;
    if (session) {
      const saved = await prisma.serviceCardSimulation.create({
        data: {
          userId: session.userId,
          applicantName: input.applicantName,
          age: input.age,
          governorate: input.governorate,
          disabilityType: input.disabilityType,
          documentReadiness: result.documentReadiness,
          supportNeedScore: result.supportNeedScore,
          cognitiveScore: result.cognitiveScore,
          readinessScore: result.readinessScore,
          pathway: result.pathway,
          answers: {
            supportAnswers: input.supportAnswers,
            cognitiveAnswers: input.cognitiveAnswers,
          } as any,
          documents: input.documents as any,
          recommendations: {
            confidenceLabel: result.confidenceLabel,
            likelyCommitteeFocus: result.likelyCommitteeFocus,
            missingDocuments: result.missingDocuments,
            nextSteps: result.nextSteps,
            disclaimer: result.disclaimer,
          } as any,
        },
        select: { id: true },
      });
      savedId = saved.id;
    }

    logEvent("info", "service_card_simulation_completed", {
      requestId,
      userId: session?.userId || null,
      readinessScore: result.readinessScore,
      disabilityType: input.disabilityType,
    });

    return NextResponse.json({ result, savedId, requestId });
  } catch (error) {
    logEvent("error", "service_card_simulation_failed", {
      requestId,
      error: errorSummary(error),
    });
    return NextResponse.json({ error: "Failed to run service card simulation", requestId }, { status: 500 });
  }
}
