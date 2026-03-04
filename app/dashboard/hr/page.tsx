"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";
import { Briefcase, Users, Clock, CheckCircle, XCircle, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface JobData {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  type: string;
  category: string;
  salary: number;
  currency: string;
  companyName: string;
  requiredSkills: string;
  status: string;
  createdAt: string;
  _count: { applications: number };
}

interface AppData {
  id: number;
  status: string;
  coverNote: string;
  appliedAt: string;
  user: { id: number; name: string; email: string; jobTitle?: string; quizScore?: number };
  job: { id: number; titleAr: string; titleEn: string };
}

type TabId = "overview" | "jobs" | "applications" | "post";

export default function HrDashboardPage() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [applications, setApplications] = useState<AppData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  // Post job form
  const [formTitleAr, setFormTitleAr] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formDescAr, setFormDescAr] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formType, setFormType] = useState("task");
  const [formCategory, setFormCategory] = useState("data-entry");
  const [formSalary, setFormSalary] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  const fetchData = useCallback(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([
      fetch(`/api/jobs?postedById=${user.id}&all=1`).then((r) => r.json()),
      fetch("/api/applications").then((r) => r.json()),
    ])
      .then(([jobsData, appsData]) => {
        setJobs(jobsData.jobs || []);
        setApplications(appsData.applications || []);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          dashboard: "لوحة الشركات",
          title: "لوحة تحكم الشركات",
          tabOverview: "نظرة عامة",
          tabJobs: "وظائفي",
          tabApplications: "طلبات التقديم",
          tabPost: "نشر وظيفة",
          totalJobs: "إجمالي الوظائف",
          openJobs: "وظائف مفتوحة",
          totalApps: "طلبات التقديم",
          pendingApps: "قيد المراجعة",
          recentApps: "أحدث الطلبات",
          noJobs: "لم تنشر أي وظائف بعد.",
          noApps: "لا توجد طلبات تقديم حتى الآن.",
          jobTitle: "العنوان",
          applicants: "المتقدمون",
          status: "الحالة",
          actions: "الإجراءات",
          open: "مفتوحة",
          closed: "مغلقة",
          filled: "مكتملة",
          closeJob: "إغلاق",
          reopenJob: "إعادة فتح",
          markFilled: "مكتملة",
          applicantName: "اسم المتقدم",
          email: "البريد",
          jobCol: "الوظيفة",
          coverNote: "ملاحظة",
          quizScore: "نتيجة الاختبار",
          accept: "قبول",
          reject: "رفض",
          accepted: "مقبول",
          rejected: "مرفوض",
          pending: "قيد المراجعة",
          viewProfile: "الملف الشخصي",
          startChat: "محادثة",
          postJob: "نشر الوظيفة",
          posting: "جاري النشر...",
          titleAr: "العنوان (عربي)",
          titleEn: "العنوان (إنجليزي)",
          descAr: "الوصف (عربي)",
          descEn: "الوصف (إنجليزي)",
          type: "النوع",
          task: "مهمة",
          fulltime: "دوام كامل",
          category: "التصنيف",
          salary: "الراتب / الأجر (ج.م)",
          skills: "المهارات المطلوبة",
          skillsHint: "افصل بين المهارات بفاصلة",
          loginRequired: "يرجى تسجيل الدخول للوصول.",
          posted: "تم نشر الوظيفة بنجاح.",
          date: "التاريخ",
          salary_label: "الراتب",
        }
      : {
          home: "Home",
          dashboard: "Company Dashboard",
          title: "Company Dashboard",
          tabOverview: "Overview",
          tabJobs: "My Jobs",
          tabApplications: "Applications",
          tabPost: "Post Job",
          totalJobs: "Total Jobs",
          openJobs: "Open Jobs",
          totalApps: "Applications",
          pendingApps: "Pending Review",
          recentApps: "Recent Applications",
          noJobs: "You haven't posted any jobs yet.",
          noApps: "No applications yet.",
          jobTitle: "Title",
          applicants: "Applicants",
          status: "Status",
          actions: "Actions",
          open: "Open",
          closed: "Closed",
          filled: "Filled",
          closeJob: "Close",
          reopenJob: "Reopen",
          markFilled: "Filled",
          applicantName: "Applicant",
          email: "Email",
          jobCol: "Job",
          coverNote: "Cover Note",
          quizScore: "Quiz Score",
          accept: "Accept",
          reject: "Reject",
          accepted: "Accepted",
          rejected: "Rejected",
          pending: "Pending",
          viewProfile: "Profile",
          startChat: "Chat",
          postJob: "Post Job",
          posting: "Posting...",
          titleAr: "Title (Arabic)",
          titleEn: "Title (English)",
          descAr: "Description (Arabic)",
          descEn: "Description (English)",
          type: "Type",
          task: "Task",
          fulltime: "Full-time",
          category: "Category",
          salary: "Salary / Pay (EGP)",
          skills: "Required Skills",
          skillsHint: "Separate skills with commas",
          loginRequired: "Please log in to access this page.",
          posted: "Job posted successfully.",
          date: "Date",
          salary_label: "Salary",
        };

  const statusLabel = (s: string) => {
    if (s === "open") return labels.open;
    if (s === "closed") return labels.closed;
    if (s === "filled") return labels.filled;
    return s;
  };

  const appStatusLabel = (s: string) => {
    if (s === "accepted") return labels.accepted;
    if (s === "rejected") return labels.rejected;
    if (s === "pending") return labels.pending;
    return s;
  };

  const statusColor = (s: string) => {
    if (s === "accepted") return "bg-[#E8F5E9] text-[#28A745]";
    if (s === "rejected") return "bg-[#FFEBEE] text-[#DC3545]";
    return "bg-[#FFF3E0] text-[#FF9800]";
  };

  const handleJobStatus = async (jobId: number, newStatus: string) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch {
      // silent
    }
  };

  const handleAppStatus = async (appId: number, newStatus: string) => {
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });
      fetchData();
    } catch {
      // silent
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleAr || !formTitleEn) return;
    setFormSubmitting(true);
    setFormSuccess("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr: formTitleAr,
          titleEn: formTitleEn,
          descAr: formDescAr,
          descEn: formDescEn,
          type: formType,
          category: formCategory,
          salary: parseInt(formSalary) || 0,
          requiredSkills: formSkills,
          companyName: user?.companyName || user?.name || "",
        }),
      });
      if (res.ok) {
        setFormSuccess(labels.posted);
        setFormTitleAr("");
        setFormTitleEn("");
        setFormDescAr("");
        setFormDescEn("");
        setFormSalary("");
        setFormSkills("");
        fetchData();
      }
    } catch {
      // silent
    } finally {
      setFormSubmitting(false);
    }
  };

  const openCount = jobs.filter((j) => j.status === "open").length;
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-24 text-center text-[#6C757D]">...</main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-[#212529]">
          <p>{labels.loginRequired}</p>
          <Link href="/auth/login" className="min-h-12 inline-flex items-center rounded-sm bg-[#2E5C8A] px-6 text-white">
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </main>
      </div>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: labels.tabOverview },
    { id: "jobs", label: labels.tabJobs },
    { id: "applications", label: labels.tabApplications },
    { id: "post", label: labels.tabPost },
  ];

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.dashboard },
          ]}
        />

        <section className="flex flex-col gap-4">
          <h1 className="font-semibold">{labels.title}</h1>
          {user.companyName && (
            <p className="text-[#6C757D]">{user.companyName}</p>
          )}
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#DEE2E6] pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-12 rounded-t-sm px-5 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-[#2E5C8A] bg-white text-[#2E5C8A]"
                  : "text-[#6C757D]"
              }`}
            >
              {tab.label}
              {tab.id === "applications" && pendingCount > 0 && (
                <span className="ms-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF9800] px-1.5 text-xs font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-4 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#2E5C8A] text-white">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">{labels.totalJobs}</p>
                  <p className="text-xl font-semibold">{jobs.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#28A745] text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">{labels.openJobs}</p>
                  <p className="text-xl font-semibold">{openCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#6C757D] text-white">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">{labels.totalApps}</p>
                  <p className="text-xl font-semibold">{applications.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#FF9800] text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">{labels.pendingApps}</p>
                  <p className="text-xl font-semibold">{pendingCount}</p>
                </div>
              </div>
            </div>

            {/* Recent applications */}
            <div className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-4">
              <h2 className="font-semibold">{labels.recentApps}</h2>
              {applications.length === 0 ? (
                <p className="text-[#6C757D]">{labels.noApps}</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-3">
                      <div>
                        <p className="font-semibold">{app.user.name}</p>
                        <p className="text-sm text-[#6C757D]">
                          {language === "ar" ? app.job.titleAr : app.job.titleEn}
                        </p>
                      </div>
                      <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${statusColor(app.status)}`}>
                        {appStatusLabel(app.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="flex flex-col gap-4">
            {loadingData ? (
              <p className="text-center text-[#6C757D]">...</p>
            ) : jobs.length === 0 ? (
              <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-6 text-center">
                <p className="mb-3">{labels.noJobs}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("post")}
                  className="min-h-12 inline-flex items-center gap-2 rounded-sm bg-[#2E5C8A] px-6 text-white"
                >
                  <Plus size={16} /> {labels.tabPost}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {jobs.map((job) => {
                  const isExpanded = expandedJob === job.id;
                  const jobApps = applications.filter((a) => a.job.id === job.id);
                  return (
                    <div key={job.id} className="rounded-sm border border-[#DEE2E6] bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                            className="min-h-10 text-[#2E5C8A]"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div>
                            <p className="font-semibold">
                              {language === "ar" ? job.titleAr : job.titleEn}
                            </p>
                            <p className="text-sm text-[#6C757D]">
                              {job.type === "task" ? labels.task : labels.fulltime} | {labels.salary_label}: {job.salary} {job.currency}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${
                            job.status === "open" ? "bg-[#E8F5E9] text-[#28A745]" : job.status === "filled" ? "bg-[#E3EEF9] text-[#2E5C8A]" : "bg-[#F8F9FA] text-[#6C757D]"
                          }`}>
                            {statusLabel(job.status)}
                          </span>
                          <span className="text-sm text-[#6C757D]">
                            {job._count.applications} {labels.applicants}
                          </span>
                          {job.status === "open" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleJobStatus(job.id, "closed")}
                                className="min-h-10 rounded-sm border border-[#DEE2E6] px-3 text-sm"
                              >
                                {labels.closeJob}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleJobStatus(job.id, "filled")}
                                className="min-h-10 rounded-sm border border-[#DEE2E6] px-3 text-sm"
                              >
                                {labels.markFilled}
                              </button>
                            </>
                          )}
                          {job.status === "closed" && (
                            <button
                              type="button"
                              onClick={() => handleJobStatus(job.id, "open")}
                              className="min-h-10 rounded-sm border border-[#DEE2E6] px-3 text-sm"
                            >
                              {labels.reopenJob}
                            </button>
                          )}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-[#DEE2E6] p-4">
                          <p className="mb-3 text-sm text-[#495057]">
                            {language === "ar" ? job.descAr : job.descEn}
                          </p>
                          {job.requiredSkills && (
                            <div className="mb-4 flex flex-wrap gap-1">
                              {job.requiredSkills.split(",").map((skill) => (
                                <span key={skill} className="rounded-sm bg-[#E3EEF9] px-2 py-1 text-xs text-[#2E5C8A]">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {jobApps.length === 0 ? (
                            <p className="text-sm text-[#6C757D]">{labels.noApps}</p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <h3 className="font-semibold text-sm">{labels.tabApplications} ({jobApps.length})</h3>
                              {jobApps.map((app) => (
                                <div key={app.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-3">
                                  <div>
                                    <p className="font-semibold">{app.user.name}</p>
                                    <p className="text-sm text-[#6C757D]">{app.user.email}</p>
                                    {app.user.quizScore !== undefined && app.user.quizScore !== null && (
                                      <p className="text-sm text-[#6C757D]">{labels.quizScore}: {app.user.quizScore}</p>
                                    )}
                                    {app.coverNote && <p className="text-sm mt-1">{app.coverNote}</p>}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${statusColor(app.status)}`}>
                                      {appStatusLabel(app.status)}
                                    </span>
                                    {app.status === "pending" && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleAppStatus(app.id, "accepted")}
                                          className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#28A745] px-3 text-sm text-white"
                                        >
                                          <CheckCircle size={14} /> {labels.accept}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleAppStatus(app.id, "rejected")}
                                          className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#DC3545] px-3 text-sm text-white"
                                        >
                                          <XCircle size={14} /> {labels.reject}
                                        </button>
                                      </>
                                    )}
                                    <Link
                                      href={`/profile/${app.user.id}`}
                                      className="min-h-10 inline-flex items-center rounded-sm border border-[#DEE2E6] px-3 text-sm"
                                    >
                                      {labels.viewProfile}
                                    </Link>
                                    <Link
                                      href="/messages"
                                      className="min-h-10 inline-flex items-center rounded-sm bg-[#2E5C8A] px-3 text-sm text-white"
                                    >
                                      {labels.startChat}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="flex flex-col gap-4">
            {loadingData ? (
              <p className="text-center text-[#6C757D]">...</p>
            ) : applications.length === 0 ? (
              <p className="text-center text-[#6C757D]">{labels.noApps}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-start">{labels.applicantName}</th>
                      <th className="px-4 py-3 text-start">{labels.email}</th>
                      <th className="px-4 py-3 text-start">{labels.jobCol}</th>
                      <th className="px-4 py-3 text-start">{labels.quizScore}</th>
                      <th className="px-4 py-3 text-start">{labels.status}</th>
                      <th className="px-4 py-3 text-start">{labels.date}</th>
                      <th className="px-4 py-3 text-start">{labels.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-[#DEE2E6]">
                        <td className="px-4 py-3 font-semibold">{app.user.name}</td>
                        <td className="px-4 py-3 text-[#6C757D]">{app.user.email}</td>
                        <td className="px-4 py-3">{language === "ar" ? app.job.titleAr : app.job.titleEn}</td>
                        <td className="px-4 py-3">{app.user.quizScore ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${statusColor(app.status)}`}>
                            {appStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6C757D]">
                          {new Date(app.appliedAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {app.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAppStatus(app.id, "accepted")}
                                  className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#28A745] px-2 text-xs text-white"
                                >
                                  <CheckCircle size={12} /> {labels.accept}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAppStatus(app.id, "rejected")}
                                  className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#DC3545] px-2 text-xs text-white"
                                >
                                  <XCircle size={12} /> {labels.reject}
                                </button>
                              </>
                            )}
                            <Link
                              href={`/profile/${app.user.id}`}
                              className="min-h-10 inline-flex items-center rounded-sm border border-[#DEE2E6] px-2 text-xs"
                            >
                              {labels.viewProfile}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Post Job Tab */}
        {activeTab === "post" && (
          <div className="flex flex-col gap-4">
            <form onSubmit={handlePostJob} className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
              <h2 className="font-semibold">{labels.tabPost}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  {labels.titleAr}
                  <input
                    type="text"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    required
                    className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                    dir="rtl"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  {labels.titleEn}
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    required
                    className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                    dir="ltr"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  {labels.descAr}
                  <textarea
                    value={formDescAr}
                    onChange={(e) => setFormDescAr(e.target.value)}
                    rows={3}
                    className="rounded-sm border border-[#DEE2E6] bg-white px-4 py-2"
                    dir="rtl"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  {labels.descEn}
                  <textarea
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    rows={3}
                    className="rounded-sm border border-[#DEE2E6] bg-white px-4 py-2"
                    dir="ltr"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2">
                  {labels.type}
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                  >
                    <option value="task">{labels.task}</option>
                    <option value="fulltime">{labels.fulltime}</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  {labels.category}
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                  >
                    <option value="data-entry">{language === "ar" ? "إدخال بيانات" : "Data Entry"}</option>
                    <option value="excel">Excel</option>
                    <option value="qa">{language === "ar" ? "اختبار البرمجيات" : "Software Testing"}</option>
                    <option value="design">{language === "ar" ? "تصميم" : "Design"}</option>
                    <option value="programming">{language === "ar" ? "برمجة" : "Programming"}</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  {labels.salary}
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                {labels.skills}
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  placeholder={labels.skillsHint}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
              </label>
              {formSuccess && (
                <div className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#28A745]">
                  {formSuccess}
                </div>
              )}
              <button
                type="submit"
                disabled={formSubmitting}
                className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
              >
                {formSubmitting ? labels.posting : labels.postJob}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
