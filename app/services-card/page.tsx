"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  HeartHandshake,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  evaluateServiceCardSimulation,
  needsCognitiveScreening,
  SERVICE_CARD_DOCUMENT_LABELS,
  SERVICE_CARD_SOURCES,
  ServiceCardDisabilityType,
  ServiceCardDocuments,
  ServiceCardSimulationResult,
  ServiceCardSupportAnswers,
  CognitiveScreeningAnswers,
} from "@/lib/service-card";

const disabilityOptions: Array<{ value: ServiceCardDisabilityType; label: string }> = [
  { value: "autism", label: "Autism spectrum" },
  { value: "intellectual", label: "Intellectual or developmental disability" },
  { value: "learning", label: "Learning disability" },
  { value: "cerebral_palsy", label: "Cerebral palsy or motor disability" },
  { value: "visual", label: "Visual disability" },
  { value: "hearing", label: "Hearing disability" },
  { value: "multiple", label: "Multiple disabilities" },
  { value: "other", label: "Other disability" },
];

const supportQuestions: Array<{ key: keyof ServiceCardSupportAnswers; label: string }> = [
  { key: "communication", label: "Communication with unfamiliar people" },
  { key: "dailyLiving", label: "Eating, dressing, hygiene, and daily routine" },
  { key: "mobility", label: "Movement, transport, stairs, or hand use" },
  { key: "learning", label: "Learning, reading, writing, numbers, or following instructions" },
  { key: "sensory", label: "Noise, light, crowds, transitions, or overload" },
  { key: "supervision", label: "Need for adult supervision to stay safe" },
];

const cognitiveQuestions: Array<{
  key: keyof CognitiveScreeningAnswers;
  label: string;
  prompt: string;
}> = [
  {
    key: "pattern",
    label: "Pattern",
    prompt: "Can the learner complete a simple pattern such as 2, 4, 6, __?",
  },
  {
    key: "memory",
    label: "Memory",
    prompt: "After hearing three words, can the learner remember them after one minute?",
  },
  {
    key: "everydayMath",
    label: "Everyday math",
    prompt: "Can the learner choose the correct money amount for a simple purchase?",
  },
  {
    key: "comprehension",
    label: "Comprehension",
    prompt: "Can the learner explain one short instruction in their own way?",
  },
  {
    key: "attention",
    label: "Attention",
    prompt: "Can the learner stay with a calm task for five minutes with limited help?",
  },
];

const initialDocuments: ServiceCardDocuments = {
  nationalIdOrBirthCertificate: false,
  personalPhoto: false,
  medicalReports: false,
  guardianId: false,
  proofOfAddress: false,
  previousAssessments: false,
};

const initialSupport: ServiceCardSupportAnswers = {
  communication: 1,
  dailyLiving: 1,
  mobility: 0,
  learning: 1,
  sensory: 1,
  supervision: 1,
};

const initialCognitive: CognitiveScreeningAnswers = {
  pattern: 1,
  memory: 1,
  everydayMath: 1,
  comprehension: 1,
  attention: 1,
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-[#212529]">{label}</span>
        <span className="font-bold text-[#2E5C8A]">{value}%</span>
      </div>
      <div className="h-3 rounded-sm bg-[#E9EEF5]">
        <div className="h-3 rounded-sm bg-[#2E5C8A]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ServicesCardPage() {
  const [applicantName, setApplicantName] = useState("");
  const [age, setAge] = useState("12");
  const [governorate, setGovernorate] = useState("Cairo");
  const [disabilityType, setDisabilityType] = useState<ServiceCardDisabilityType>("autism");
  const [documents, setDocuments] = useState<ServiceCardDocuments>(initialDocuments);
  const [supportAnswers, setSupportAnswers] = useState<ServiceCardSupportAnswers>(initialSupport);
  const [cognitiveAnswers, setCognitiveAnswers] = useState<CognitiveScreeningAnswers>(initialCognitive);
  const [result, setResult] = useState<ServiceCardSimulationResult | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "local">("idle");
  const [error, setError] = useState("");

  const showCognitive = needsCognitiveScreening(disabilityType);
  const preview = useMemo(
    () =>
      evaluateServiceCardSimulation({
        applicantName,
        age: Number(age) || undefined,
        governorate,
        disabilityType,
        documents,
        supportAnswers,
        cognitiveAnswers,
      }),
    [applicantName, age, governorate, disabilityType, documents, supportAnswers, cognitiveAnswers]
  );

  async function runSimulation() {
    setStatus("loading");
    setError("");
    setSavedId(null);

    const payload = {
      applicantName,
      age: Number(age) || undefined,
      governorate,
      disabilityType,
      documents,
      supportAnswers,
      cognitiveAnswers,
    };

    try {
      const response = await fetch("/api/service-card/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "The service card simulation could not be saved.");
      }
      setResult(data.result);
      setSavedId(data.savedId || null);
      setStatus(data.savedId ? "saved" : "local");
    } catch (err) {
      setResult(evaluateServiceCardSimulation(payload));
      setStatus("local");
      setError(err instanceof Error ? err.message : "Saved copy failed, but the local simulation is shown.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <TopBar />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 text-[#212529] md:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Integrated Services Card" },
          ]}
        />

        <section className="grid gap-6 rounded-sm border border-[#D9E6F2] bg-white p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#E8F5E9] px-3 py-2 text-sm font-semibold text-[#1B5E20]">
              <ShieldCheck size={18} />
              Egypt service card readiness
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-[#2E5C8A] md:text-4xl">
              Integrated Services Card guide and preparation simulation
            </h1>
            <p className="max-w-4xl text-lg leading-relaxed text-[#495057]">
              This page helps families prepare for Egypt&apos;s Integrated Services Card process. It summarizes the official
              path, checks document readiness, and gives a calm practice screen for functional and cognitive evidence.
            </p>
            <div className="rounded-sm border border-[#F4C7C3] bg-[#FFF8F7] p-4 text-sm leading-relaxed text-[#7A271A]">
              <strong>Important:</strong> Tafrah does not issue the card, diagnose disability, or calculate an official
              IQ. The official decision belongs to the authorized medical and functional assessment committees.
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["1", "Register or follow up through the official medical/social process."],
              ["2", "Attend medical assessment by the competent medical committee."],
              ["3", "Complete functional assessment through MOSS rehabilitation office or merged committee."],
              ["4", "Follow printing, delivery, complaint, or appeal status through official channels."],
            ].map(([step, text]) => (
              <div key={step} className="flex gap-3 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#2E5C8A] font-semibold text-white">
                  {step}
                </span>
                <p className="leading-relaxed text-[#495057]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-5">
            <FileText className="mb-3 text-[#2E5C8A]" />
            <h2 className="text-xl font-semibold text-[#2E5C8A]">What the official process checks</h2>
            <p className="mt-2 leading-relaxed text-[#495057]">
              Official sources describe proof of disability through medical assessment and functional assessment. Recent
              ministry updates also describe combining both assessments in one committee in some workflows to reduce waiting.
            </p>
          </article>
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-5">
            <Brain className="mb-3 text-[#2E5C8A]" />
            <h2 className="text-xl font-semibold text-[#2E5C8A]">About IQ and cognitive tests</h2>
            <p className="mt-2 leading-relaxed text-[#495057]">
              For intellectual, developmental, autism, or learning cases, specialists may look at cognitive ability,
              adaptive behavior, communication, and daily independence. This simulator uses a gentle screening practice,
              not an IQ test.
            </p>
          </article>
          <article className="rounded-sm border border-[#D9E6F2] bg-white p-5">
            <HeartHandshake className="mb-3 text-[#2E5C8A]" />
            <h2 className="text-xl font-semibold text-[#2E5C8A]">What Tafrah can do safely</h2>
            <p className="mt-2 leading-relaxed text-[#495057]">
              Tafrah can help a family organize evidence, list support needs, print notes, and reduce anxiety before the
              appointment. It cannot predict acceptance with certainty.
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-[#2E5C8A]">Official links and verified notes</h2>
              <div className="grid gap-3">
                {SERVICE_CARD_SOURCES.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-between gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3 font-semibold text-[#2E5C8A]"
                  >
                    <span>{source.title}</span>
                    <ExternalLink size={18} />
                  </a>
                ))}
                <a
                  href="http://pod.mohp.gov.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3 font-semibold text-[#2E5C8A]"
                >
                  <span>Ministry of Health medical assessment portal</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            </article>

            <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-[#2E5C8A]">Document readiness</h2>
              <div className="grid gap-3">
                {(Object.keys(SERVICE_CARD_DOCUMENT_LABELS) as Array<keyof ServiceCardDocuments>).map((key) => (
                  <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={Boolean(documents[key])}
                      onChange={(event) => setDocuments((current) => ({ ...current, [key]: event.target.checked }))}
                      className="h-5 w-5"
                    />
                    <span className="text-sm leading-relaxed text-[#495057]">{SERVICE_CARD_DOCUMENT_LABELS[key]}</span>
                  </label>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <div className="mb-5 flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-[#2E5C8A]">Run the simulation</h2>
              <p className="text-sm leading-relaxed text-[#6C757D]">
                Answer slowly. The score means preparation readiness, not eligibility.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">Applicant name</span>
                <input
                  value={applicantName}
                  onChange={(event) => setApplicantName(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                  placeholder="Optional"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">Age</span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#212529]">Governorate</span>
                <input
                  value={governorate}
                  onChange={(event) => setGovernorate(event.target.value)}
                  className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-sm font-semibold text-[#212529]">Main disability area</span>
              <select
                value={disabilityType}
                onChange={(event) => setDisabilityType(event.target.value as ServiceCardDisabilityType)}
                className="min-h-12 rounded-sm border border-[#B8CBDD] bg-white px-3"
              >
                {disabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-[#2E5C8A]">Functional support needs</h3>
              <div className="grid gap-3">
                {supportQuestions.map((question) => (
                  <label key={question.key} className="grid gap-2 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4 md:grid-cols-[1fr_180px] md:items-center">
                    <span className="text-sm font-semibold text-[#212529]">{question.label}</span>
                    <select
                      value={supportAnswers[question.key]}
                      onChange={(event) =>
                        setSupportAnswers((current) => ({ ...current, [question.key]: Number(event.target.value) }))
                      }
                      className="min-h-11 rounded-sm border border-[#B8CBDD] bg-white px-3"
                    >
                      <option value={0}>No support</option>
                      <option value={1}>Some support</option>
                      <option value={2}>Frequent support</option>
                      <option value={3}>Full support</option>
                    </select>
                  </label>
                ))}
              </div>
            </div>

            {showCognitive ? (
              <div className="mt-6 rounded-sm border border-[#CFE5F8] bg-[#F5F9FF] p-4">
                <div className="mb-3 flex items-start gap-3">
                  <AlertCircle className="mt-1 shrink-0 text-[#2E5C8A]" size={20} />
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E5C8A]">Gentle cognitive screening practice</h3>
                    <p className="text-sm leading-relaxed text-[#495057]">
                      This is only a practice checklist for evidence planning. A licensed specialist must perform any real IQ,
                      adaptive behavior, or diagnostic assessment.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {cognitiveQuestions.map((question) => (
                    <label key={question.key} className="grid gap-2 rounded-sm border border-[#D9E6F2] bg-white p-4 md:grid-cols-[1fr_180px] md:items-center">
                      <span>
                        <span className="block text-sm font-semibold text-[#212529]">{question.label}</span>
                        <span className="block text-sm leading-relaxed text-[#6C757D]">{question.prompt}</span>
                      </span>
                      <select
                        value={cognitiveAnswers[question.key]}
                        onChange={(event) =>
                          setCognitiveAnswers((current) => ({ ...current, [question.key]: Number(event.target.value) }))
                        }
                        className="min-h-11 rounded-sm border border-[#B8CBDD] bg-white px-3"
                      >
                        <option value={2}>Usually</option>
                        <option value={1}>Sometimes</option>
                        <option value={0}>Not yet</option>
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
              <ScoreBar label="Live readiness preview" value={preview.readinessScore} />
              <button
                type="button"
                onClick={runSimulation}
                disabled={status === "loading"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white disabled:opacity-70"
              >
                {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <ClipboardCheck size={18} />}
                Run simulation
              </button>
              {error ? <p className="text-sm text-[#9A3412]">{error}</p> : null}
            </div>
          </article>
        </section>

        {result ? (
          <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#2E5C8A]">Simulation result</h2>
                <p className="mt-1 text-[#495057]">{result.pathway}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#E8F5E9] px-3 py-2 text-sm font-semibold text-[#1B5E20]">
                <CheckCircle2 size={18} />
                {status === "saved" ? `Saved #${savedId}` : "Local result"}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ScoreBar label="Total readiness" value={result.readinessScore} />
              <ScoreBar label="Document readiness" value={result.documentReadiness} />
              <ScoreBar label="Functional support evidence" value={result.supportNeedScore} />
            </div>

            {typeof result.cognitiveScore === "number" ? (
              <div className="mt-4 rounded-sm border border-[#F4C7C3] bg-[#FFF8F7] p-4">
                <ScoreBar label="Practice cognitive independence score, not IQ" value={result.cognitiveScore} />
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">Committee may focus on</h3>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                  {result.likelyCommitteeFocus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">Missing documents</h3>
                {result.missingDocuments.length ? (
                  <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                    {result.missingDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[#495057]">No required item is missing from this simulation.</p>
                )}
              </div>
              <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4">
                <h3 className="font-semibold text-[#2E5C8A]">Next steps</h3>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
                  {result.nextSteps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 rounded-sm border border-[#D9E6F2] bg-[#F8FAFC] p-4 text-sm leading-relaxed text-[#495057]">
              {result.disclaimer}
            </p>
          </section>
        ) : null}

        <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#2E5C8A]">Family preparation note</h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-[#495057]">
            Before the appointment, write one page that explains what the learner can do independently, what requires help,
            what causes overload, and what support works. Bring reports, school notes, therapy notes, and any previous
            assessment. The official committee can ask for additional documents or re-assessment.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm border border-[#2E5C8A] bg-white px-5 font-semibold text-[#2E5C8A]"
          >
            Ask Tafrah for preparation help
          </Link>
        </section>
      </main>
    </div>
  );
}
