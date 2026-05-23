export type ServiceCardDisabilityType =
  | "autism"
  | "intellectual"
  | "learning"
  | "cerebral_palsy"
  | "visual"
  | "hearing"
  | "multiple"
  | "other";

export type ServiceCardDocuments = {
  nationalIdOrBirthCertificate?: boolean;
  personalPhoto?: boolean;
  medicalReports?: boolean;
  guardianId?: boolean;
  proofOfAddress?: boolean;
  previousAssessments?: boolean;
};

export type ServiceCardSupportAnswers = {
  communication: number;
  dailyLiving: number;
  mobility: number;
  learning: number;
  sensory: number;
  supervision: number;
};

export type CognitiveScreeningAnswers = {
  pattern: number;
  memory: number;
  everydayMath: number;
  comprehension: number;
  attention: number;
};

export type ServiceCardSimulationInput = {
  applicantName?: string;
  age?: number;
  governorate?: string;
  disabilityType: ServiceCardDisabilityType;
  documents: ServiceCardDocuments;
  supportAnswers: ServiceCardSupportAnswers;
  cognitiveAnswers?: CognitiveScreeningAnswers;
};

export type ServiceCardSimulationResult = {
  documentReadiness: number;
  supportNeedScore: number;
  cognitiveScore: number | null;
  readinessScore: number;
  pathway: string;
  confidenceLabel: string;
  likelyCommitteeFocus: string[];
  missingDocuments: string[];
  nextSteps: string[];
  disclaimer: string;
};

export const SERVICE_CARD_SOURCES = [
  {
    title: "Ministry of Social Solidarity service details",
    url: "https://www.moss.gov.eg/Sites/MOSA/ar-eg/Pages/sector-service-detail.aspx?sid=116",
  },
  {
    title: "MOSS integrated services card portal",
    url: "https://rdis.moss.gov.eg/EDR/OnlineRegistration/OnlineHome",
  },
  {
    title: "Ministry announcement on merged medical and functional assessment",
    url: "https://www.moss.gov.eg/ar-eg/Pages/news-details.aspx?nid=3408",
  },
  {
    title: "State Information Service report on medical committees",
    url: "https://sis.gov.eg/ar/%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%B2-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85%D9%8A/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/%D8%A7%D9%84%D8%B5%D8%AD%D8%A9-%D9%81%D8%AD%D8%B5-%D9%88%D9%85%D9%86%D8%A7%D8%B8%D8%B1%D8%A9-%D8%A3%D9%83%D8%AB%D8%B1-%D9%85%D9%86-373-%D8%A3%D9%84%D9%81-%D9%85%D9%88%D8%A7%D8%B7%D9%86-%D9%84%D9%84%D8%AD%D8%B5%D9%88%D9%84-%D8%B9%D9%84%D9%89-%D9%83%D8%A7%D8%B1%D8%AA-%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%AA%D9%83%D8%A7%D9%85%D9%84%D8%A9-%D9%81%D9%8A-2024/",
  },
];

export const SERVICE_CARD_DOCUMENT_LABELS: Record<keyof ServiceCardDocuments, string> = {
  nationalIdOrBirthCertificate: "National ID, or computerized birth certificate for a child",
  personalPhoto: "Recent personal photo",
  medicalReports: "Recent medical reports from an approved hospital or specialist",
  guardianId: "Guardian ID or guardianship paper when the applicant is a child or needs a legal guardian",
  proofOfAddress: "Address details that match the nearest rehabilitation office",
  previousAssessments: "Previous psychological, speech, hearing, vision, motor, or school assessments if available",
};

const COMMITTEE_FOCUS: Record<ServiceCardDisabilityType, string[]> = {
  autism: [
    "medical diagnosis and developmental history",
    "communication, social interaction, sensory regulation, and daily independence",
    "functional assessment at the rehabilitation office or merged committee",
  ],
  intellectual: [
    "medical and psychological documentation",
    "adaptive behavior and daily living skills",
    "cognitive testing may be requested by the specialist committee",
  ],
  learning: [
    "school reports and specialist learning assessments",
    "reading, writing, calculation, and classroom functioning",
    "functional impact on independent learning",
  ],
  cerebral_palsy: [
    "neurology or orthopedic report",
    "mobility, fine-motor use, speech, and self-care impact",
    "assistive devices and rehabilitation history",
  ],
  visual: [
    "ophthalmology report and visual acuity or field measurements",
    "functional impact on reading, movement, and daily activities",
  ],
  hearing: [
    "audiology report and hearing measurements",
    "speech-language impact and assistive hearing device history",
  ],
  multiple: [
    "reports for each disability area",
    "combined functional impact on daily living, mobility, learning, and communication",
  ],
  other: [
    "medical report that documents diagnosis and stability",
    "functional impact on daily living and participation",
  ],
};

const nextOfficialSteps = [
  "Book or follow the medical-assessment path through the Ministry of Health portal or the competent medical committee.",
  "After the medical result, follow the Ministry of Social Solidarity portal instructions and attend the rehabilitation office or merged committee for functional assessment.",
  "Keep the hotline 15044 and the official MOSS portal for follow-up, complaints, or appeals.",
];

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreDocuments(documents: ServiceCardDocuments, age?: number) {
  const required: Array<keyof ServiceCardDocuments> = [
    "nationalIdOrBirthCertificate",
    "personalPhoto",
    "medicalReports",
    "proofOfAddress",
  ];

  if (typeof age === "number" && age < 18) {
    required.push("guardianId");
  }

  const completed = required.filter((key) => documents[key]).length;
  return Math.round((completed / required.length) * 100);
}

function missingDocuments(documents: ServiceCardDocuments, age?: number) {
  const keys = Object.keys(SERVICE_CARD_DOCUMENT_LABELS) as Array<keyof ServiceCardDocuments>;
  return keys
    .filter((key) => {
      if (key === "guardianId" && !(typeof age === "number" && age < 18)) return false;
      if (key === "previousAssessments") return false;
      return !documents[key];
    })
    .map((key) => SERVICE_CARD_DOCUMENT_LABELS[key]);
}

function scoreSupportNeeds(answers: ServiceCardSupportAnswers) {
  const values = [
    answers.communication,
    answers.dailyLiving,
    answers.mobility,
    answers.learning,
    answers.sensory,
    answers.supervision,
  ].map((value) => Math.max(0, Math.min(3, Number(value) || 0)));

  return Math.round((values.reduce((total, value) => total + value, 0) / (values.length * 3)) * 100);
}

function scoreCognitiveScreening(answers?: CognitiveScreeningAnswers) {
  if (!answers) return null;
  const values = [
    answers.pattern,
    answers.memory,
    answers.everydayMath,
    answers.comprehension,
    answers.attention,
  ].map((value) => Math.max(0, Math.min(2, Number(value) || 0)));

  return Math.round((values.reduce((total, value) => total + value, 0) / (values.length * 2)) * 100);
}

export function needsCognitiveScreening(disabilityType: ServiceCardDisabilityType) {
  return disabilityType === "intellectual" || disabilityType === "autism" || disabilityType === "learning";
}

export function evaluateServiceCardSimulation(input: ServiceCardSimulationInput): ServiceCardSimulationResult {
  const documentReadiness = scoreDocuments(input.documents || {}, input.age);
  const supportNeedScore = scoreSupportNeeds(input.supportAnswers);
  const cognitiveScore = needsCognitiveScreening(input.disabilityType)
    ? scoreCognitiveScreening(input.cognitiveAnswers)
    : null;

  const cognitiveRisk =
    typeof cognitiveScore === "number" ? Math.max(0, 100 - cognitiveScore) : supportNeedScore;
  const functionalEvidence = Math.round(supportNeedScore * 0.7 + cognitiveRisk * 0.3);
  const readinessScore = clampScore(documentReadiness * 0.45 + functionalEvidence * 0.45 + (input.documents?.previousAssessments ? 10 : 0));

  const pathway =
    readinessScore >= 78
      ? "Strong preparation for official review"
      : readinessScore >= 55
        ? "Partial preparation - collect missing evidence before the appointment"
        : "Early preparation - start with medical documentation and functional notes";

  const confidenceLabel =
    readinessScore >= 78
      ? "high readiness"
      : readinessScore >= 55
        ? "medium readiness"
        : "low readiness";

  const nextSteps = [
    ...nextOfficialSteps,
    ...(missingDocuments(input.documents || {}, input.age).length
      ? ["Collect the missing documents listed in the result before attending the committee."]
      : ["Bring printed copies of the documents and keep originals available for review."]),
    "Do not use this simulation as a diagnosis, IQ score, or final eligibility decision.",
  ];

  return {
    documentReadiness,
    supportNeedScore,
    cognitiveScore,
    readinessScore,
    pathway,
    confidenceLabel,
    likelyCommitteeFocus: COMMITTEE_FOCUS[input.disabilityType] || COMMITTEE_FOCUS.other,
    missingDocuments: missingDocuments(input.documents || {}, input.age),
    nextSteps,
    disclaimer:
      "This is a Tafrah readiness simulation only. The Integrated Services Card is decided by authorized medical and functional assessment committees in Egypt.",
  };
}
