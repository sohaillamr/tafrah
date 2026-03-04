"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { UserRound } from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

const RechartsBar = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } = mod;
    const ChartWrapper = ({ data, language }: { data: { skill: string; value: number }[]; language: string }) => (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="skill" width={language === "ar" ? 100 : 120} />
          <Bar dataKey="value" fill="#2E5C8A" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    );
    ChartWrapper.displayName = "ChartWrapper";
    return ChartWrapper;
  }),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-[#6C757D]">Loading chart...</div> }
);

interface UserProfile {
  id: number; name: string; email: string; role: string; status: string;
  bio?: string; jobTitle?: string; available: boolean; companyName?: string;
  createdAt: string; _count: { enrollments: number; applications: number; };
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfMessage, setPdfMessage] = useState("");
  const [openProof, setOpenProof] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", jobTitle: "", available: false });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const { language } = useLanguage();

  const userId = params?.id === "me" ? currentUser?.id : parseInt(params?.id as string);
  const isOwner = currentUser?.id === userId;

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((d) => { setUserData(d.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const labels =
    language === "ar"
      ? {
          breadHome: "الرئيسية",
          breadProfile: "الملف الشخصي",
          available: "متاح للعمل",
          notAvailable: "غير متاح حالياً",
          edit: "تعديل الملف",
          settings: "الإعدادات",
          portfolio: "معرض الأعمال",
          viewProof: "عرض الإثبات",
          proofPreview: "معاينة ثابتة لملف العمل.",
          skills: "المهارات",
          exportCv: "تصدير السيرة الذاتية",
          downloadCv: "تحميل السيرة الذاتية (PDF)",
          pdfMsg: "سيتم تجهيز ملف السيرة الذاتية بصيغة PDF.",
          breadcrumbAria: "مسار التنقل",
          loading: "جارٍ التحميل...",
          notFound: "المستخدم غير موجود",
          coursesLabel: "الدورات المكتملة",
          appsLabel: "التقديمات المقدمة",
          editName: "الاسم",
          editBio: "نبذة تعريفية",
          editJobTitle: "المسمى الوظيفي",
          editAvailable: "متاح للعمل",
          save: "حفظ",
          cancel: "إلغاء",
          saving: "جارٍ الحفظ...",
          saved: "تم الحفظ بنجاح",
        }
      : {
          breadHome: "Home",
          breadProfile: "Profile",
          available: "Available for Work",
          notAvailable: "Not Available",
          edit: "Edit Profile",
          settings: "Settings",
          portfolio: "Portfolio",
          viewProof: "View Proof",
          proofPreview: "Static preview of work file.",
          skills: "Skills",
          exportCv: "Export CV",
          downloadCv: "Download CV (PDF)",
          pdfMsg: "Your CV file will be prepared in PDF format.",
          breadcrumbAria: "Breadcrumb",
          loading: "Loading...",
          notFound: "User not found",
          coursesLabel: "Courses Completed",
          appsLabel: "Applications Submitted",
          editName: "Name",
          editBio: "Bio",
          editJobTitle: "Job Title",
          editAvailable: "Available for Work",
          save: "Save",
          cancel: "Cancel",
          saving: "Saving...",
          saved: "Saved successfully",
        };

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-12 text-center">
          {labels.loading}
        </main>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-12 text-center">
          {labels.notFound}
        </main>
      </div>
    );
  }

  const stats = [
    { label: labels.coursesLabel, value: String(userData._count.enrollments) },
    { label: labels.appsLabel, value: String(userData._count.applications) },
  ];

  function startEditing() {
    setEditForm({
      name: userData?.name || "",
      bio: userData?.bio || "",
      jobTitle: userData?.jobTitle || "",
      available: userData?.available || false,
    });
    setEditError("");
    setEditSuccess("");
    setEditing(true);
  }

  async function saveEdit() {
    if (!editForm.name.trim()) {
      setEditError(language === "ar" ? "الاسم مطلوب" : "Name is required");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Error");
      } else {
        setUserData(data.user);
        setEditing(false);
        setEditSuccess(labels.saved);
        setTimeout(() => setEditSuccess(""), 3000);
      }
    } catch {
      setEditError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const projects =
    language === "ar"
      ? [
          { id: "p1", title: "مشروع جدول بيانات Excel رقم 1" },
          { id: "p2", title: "مشروع قائمة فحص الجودة رقم 2" },
          { id: "p3", title: "مشروع تنظيف البيانات رقم 3" },
        ]
      : [
          { id: "p1", title: "Excel Sheet Project #1" },
          { id: "p2", title: "QA Checklist Project #2" },
          { id: "p3", title: "Data Cleaning Project #3" },
        ];

  const skillsData =
    language === "ar"
      ? [
          { skill: "سرعة الكتابة", value: 90 },
          { skill: "دقة Excel", value: 95 },
          { skill: "تقارير الأخطاء", value: 85 },
        ]
      : [
          { skill: "Typing Speed", value: 90 },
          { skill: "Excel Accuracy", value: 95 },
          { skill: "Bug Reporting", value: 85 },
        ];

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.breadHome, href: "/" },
            { label: labels.breadProfile },
          ]}
          ariaLabel={labels.breadcrumbAria}
        />

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] text-[#2E5C8A]">
                <UserRound size={32} />
              </div>
              <div>
                <h1 className="font-semibold">{userData.name}</h1>
                <p>{userData.jobTitle || userData.email}</p>
                {userData.companyName && <p className="text-sm text-[#6C757D]">{userData.companyName}</p>}
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${userData.available ? "bg-[#28A745]" : "bg-[#6C757D]"}`} />
                  <span>{userData.available ? labels.available : labels.notAvailable}</span>
                </div>
              </div>
            </div>
            {isOwner && !editing ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="min-h-12 rounded-sm border border-[#DEE2E6] px-4"
                  onClick={startEditing}
                >
                  {labels.edit}
                </button>
              </div>
            ) : null}
          </div>
          {userData.bio && !editing && <p>{userData.bio}</p>}
          {editSuccess && (
            <p className="rounded-sm border border-[#28A745] bg-[#E8F5E9] p-3 text-[#212529]">{editSuccess}</p>
          )}
          {editing && (
            <div className="flex flex-col gap-4 border-t border-[#DEE2E6] pt-4">
              <label className="flex flex-col gap-1">
                {labels.editName}
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                  aria-label={labels.editName}
                />
              </label>
              <label className="flex flex-col gap-1">
                {labels.editJobTitle}
                <input
                  type="text"
                  value={editForm.jobTitle}
                  onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                  aria-label={labels.editJobTitle}
                />
              </label>
              <label className="flex flex-col gap-1">
                {labels.editBio}
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="min-h-24 rounded-sm border border-[#DEE2E6] bg-white px-4 py-2"
                  aria-label={labels.editBio}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.available}
                  onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })}
                  className="h-5 w-5"
                  aria-label={labels.editAvailable}
                />
                {labels.editAvailable}
              </label>
              {editError && (
                <p className="rounded-sm border border-[#DC3545] bg-[#FFEBEE] p-3 text-[#DC3545]">{editError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={saving}
                  className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
                >
                  {saving ? labels.saving : labels.save}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] px-6"
                >
                  {labels.cancel}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4"
            >
              <p className="font-semibold">{stat.label}</p>
              <p>{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.portfolio}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4"
              >
                <p className="font-semibold">{project.title}</p>
                <button
                  type="button"
                  className="min-h-12 rounded-sm border border-[#DEE2E6] px-4"
                  onClick={() =>
                    setOpenProof((current) =>
                      current === project.id ? "" : project.id
                    )
                  }
                >
                  {labels.viewProof}
                </button>
                {openProof === project.id ? (
                  <div className="rounded-sm border border-[#DEE2E6] bg-white p-3">
                    {labels.proofPreview}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.skills}</h2>
          <div className="mt-4 h-64">
            <RechartsBar data={skillsData} language={language} />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
          <h2 className="font-semibold">{labels.exportCv}</h2>
          <button
            type="button"
            onClick={() => setPdfMessage(labels.pdfMsg)}
            className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white"
          >
            {labels.downloadCv}
          </button>
          {pdfMessage ? <p>{pdfMessage}</p> : null}
        </section>
      </main>
    </div>
  );
}
