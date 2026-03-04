"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";
import { useAuth } from "../components/AuthProvider";
import { LoadingSpinner, EmptyState } from "../components/UIHelpers";
import { Briefcase } from "lucide-react";

interface JobData {
  id: number; titleAr: string; titleEn: string; descAr: string; descEn: string;
  type: string; category: string; salary: number; currency: string;
  companyName: string; status: string; requiredSkills: string;
}

export default function JobsPage() {
  const { user } = useAuth();
  const isGuest = !user;
  const [tab, setTab] = useState("task");
  const [skill, setSkill] = useState("all");
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [applyMsg, setApplyMsg] = useState("");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    setLoadingJobs(true);
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          jobs: "فرص العمل",
          guestNote: "يمكنك تصفح الفرص كزائر. يلزم تسجيل الدخول للتقديم على أي فرصة.",
          gigs: "مهام سريعة",
          fulltime: "وظائف دوام كامل",
          all: "الكل",
          loginToApply: "سجل الدخول للتقديم",
          apply: "تقديم الآن",
          applied: "تم إرسال طلبك بنجاح.",
          alreadyApplied: "لقد تقدمت بالفعل لهذه الوظيفة.",
        }
      : {
          home: "Home",
          jobs: "Jobs",
          guestNote: "You can browse as a guest. Sign in is required to apply.",
          gigs: "Quick tasks",
          fulltime: "Full-time jobs",
          all: "All",
          loginToApply: "Sign in to apply",
          apply: "Apply now",
          applied: "Your application was submitted successfully.",
          alreadyApplied: "You have already applied for this job.",
        };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.type !== tab) return false;
      if (job.status !== "open") return false;
      if (skill === "all") return true;
      return job.category === skill;
    });
  }, [tab, skill, jobs]);

  async function handleApply(jobId: number) {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    if (res.ok) {
      setAppliedId(jobId);
      setApplyMsg(labels.applied);
    } else {
      setAppliedId(jobId);
      setApplyMsg(data.error || labels.alreadyApplied);
    }
    setTimeout(() => { setAppliedId(null); setApplyMsg(""); }, 4000);
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.jobs }]} />

        {isGuest ? (
          <section className="rounded-sm border border-[#DEE2E6] bg-white p-4">
            {labels.guestNote}
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <h1 className="font-semibold">{labels.jobs}</h1>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTab("task")}
              className={`min-h-12 rounded-sm border px-4 ${
                tab === "task"
                  ? "border-[#2E5C8A] bg-[#2E5C8A] text-white"
                  : "border-[#DEE2E6] bg-white"
              }`}
            >
              {labels.gigs}
            </button>
            <button
              type="button"
              onClick={() => setTab("fulltime")}
              className={`min-h-12 rounded-sm border px-4 ${
                tab === "fulltime"
                  ? "border-[#2E5C8A] bg-[#2E5C8A] text-white"
                  : "border-[#DEE2E6] bg-white"
              }`}
            >
              {labels.fulltime}
            </button>
            <select
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
            >
              <option value="all">{labels.all}</option>
              <option value="data-entry">Data Entry</option>
              <option value="excel">Excel</option>
              <option value="qa">QA</option>
              <option value="design">Design</option>
              <option value="editing">Editing</option>
            </select>
          </div>
        </section>

        <section className="grid gap-4">
          {loadingJobs ? (
            <LoadingSpinner />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={32} />}
              title={language === "ar" ? "لا توجد فرص متاحة حالياً" : "No jobs available right now"}
              description={language === "ar" ? "تحقق لاحقاً أو جرب تصنيفاً آخر." : "Check back later or try a different filter."}
            />
          ) : (
          filteredJobs.map((job) => {
            const title = language === "ar" ? job.titleAr : job.titleEn;
            const desc = language === "ar" ? job.descAr : job.descEn;
            return (
            <div
              key={job.id}
              className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-[#6C757D]">{job.companyName}</p>
                </div>
                <div className="rounded-sm border border-[#2E5C8A] bg-[#E3EEF9] px-3 py-2 text-[#2E5C8A]">
                  {job.salary} {job.currency}
                </div>
              </div>
              {desc && <p>{desc}</p>}
              {job.requiredSkills && (
                <ul className="list-inside list-disc">
                  {job.requiredSkills.split(",").map((s) => (
                    <li key={s}>{s.trim()}</li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => !isGuest && handleApply(job.id)}
                disabled={isGuest}
                className={`min-h-12 rounded-sm px-6 ${
                  isGuest
                    ? "border border-[#DEE2E6] bg-[#F8F9FA] text-[#6C757D]"
                    : "bg-[#2E5C8A] text-white"
                }`}
              >
                {isGuest ? labels.loginToApply : labels.apply}
              </button>
              {appliedId === job.id && applyMsg ? (
                <div className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#212529]">
                  {applyMsg}
                </div>
              ) : null}
            </div>
            );
          })
          )}
        </section>
      </main>
    </div>
  );
}
