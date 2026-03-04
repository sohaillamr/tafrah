"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";
import { useAuth } from "../components/AuthProvider";
import {
  Users, BookOpen, Briefcase, TicketCheck, BarChart3,
  Activity, ShieldCheck, Ban, Trash2, Plus, Search,
  ChevronLeft, ChevronRight, Eye, RefreshCw, AlertTriangle,
  CheckCircle, Clock, XCircle, UserPlus, FileText
} from "lucide-react";

// Dynamically import recharts to reduce initial bundle size
const RechartsCharts = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } = mod;
    const Charts = {
      BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend
    };
    const Wrapper = ({ children }: { children: (c: typeof Charts) => React.ReactNode }) => <>{children(Charts)}</>;
    Wrapper.displayName = "RechartsWrapper";
    return Wrapper;
  }),
  { ssr: false, loading: () => <div className="flex h-64 items-center justify-center text-[#6C757D]">Loading charts...</div> }
);

type Tab = "overview" | "users" | "courses" | "jobs" | "applications" | "tickets" | "logs";

interface StatsData {
  overview: {
    totalUsers: number; totalStudents: number; totalHr: number;
    pendingUsers: number; bannedUsers: number; totalCourses: number;
    availableCourses: number; totalEnrollments: number; completedEnrollments: number;
    completionRate: number; totalJobs: number; openJobs: number;
    totalApplications: number; totalTickets: number; openTickets: number;
  };
  recentUsers: Array<{ id: number; name: string; role: string; status: string; createdAt: string }>;
  recentLogs: Array<{ id: number; action: string; details: string; createdAt: string; user: { name: string; role: string } | null }>;
}

interface UserRow {
  id: number; email: string; name: string; role: string; status: string;
  companyName: string | null; createdAt: string; available: boolean;
  _count: { enrollments: number; applications: number };
}

interface CourseRow {
  id: number; slug: string; titleAr: string; titleEn: string; descAr: string; descEn: string;
  category: string; difficulty: string; hours: number; modules: number;
  available: boolean; createdAt: string;
  _count: { enrollments: number };
}

interface JobRow {
  id: number; titleAr: string; titleEn: string; type: string; category: string;
  salary: number; currency: string; companyName: string; status: string; createdAt: string;
  _count: { applications: number };
}

interface TicketRow {
  id: number; subject: string; message: string; email: string; status: string;
  priority: string; createdAt: string;
  user: { name: string; email: string } | null;
}

interface ApplicationRow {
  id: number; status: string; coverNote: string; appliedAt: string;
  user: { id: number; name: string; email: string; quizScore?: number };
  job: { id: number; titleAr: string; titleEn: string; companyName: string };
}

const COLORS = ["#2E5C8A", "#28A745", "#FF9800", "#DC3545", "#6C757D"];

export default function AdminPage() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [appsList, setAppsList] = useState<ApplicationRow[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionMsg, setActionMsg] = useState("");

  const isAr = language === "ar";

  const L = isAr ? {
    breadHome: "الرئيسية", breadAdmin: "لوحة الأدمن", title: "لوحة الأدمن",
    overview: "نظرة عامة", usersTab: "المستخدمون", coursesTab: "الدورات",
    jobsTab: "الوظائف", ticketsTab: "تذاكر الدعم", logsTab: "سجل الأنشطة",
    totalUsers: "إجمالي المستخدمين", students: "متدربون", companies: "شركات",
    pending: "قيد المراجعة", banned: "محظورون",
    totalCourses: "الدورات", availableCourses: "متاحة", enrollments: "تسجيلات",
    completionRate: "نسبة الإكمال", totalJobs: "الوظائف", openJobs: "مفتوحة",
    applications: "طلبات التقديم", totalTickets: "التذاكر", openTickets: "مفتوحة",
    recentUsers: "أحدث المستخدمين", recentActivity: "آخر الأنشطة",
    userDistribution: "توزيع المستخدمين", name: "الاسم", email: "البريد",
    role: "الدور", status: "الحالة", actions: "إجراءات", search: "بحث...",
    allRoles: "كل الأدوار", student: "متدرب", hr: "شركة", admin: "أدمن",
    verify: "توثيق", ban: "حظر", unban: "إلغاء الحظر", delete: "حذف",
    prev: "السابق", next: "التالي", courseTitle: "عنوان الدورة",
    category: "الفئة", difficulty: "المستوى", hours: "ساعات", modules: "وحدات",
    available: "متاح", notAvailable: "غير متاح", enrollmentsCount: "تسجيلات",
    addCourse: "إضافة دورة", editCourse: "تعديل", deleteCourse: "حذف",
    toggleAvail: "تبديل التوفر", titleAr: "العنوان بالعربي", titleEn: "العنوان بالإنجليزي",
    descAr: "الوصف بالعربي", descEn: "الوصف بالإنجليزي", slug: "الرابط",
    save: "حفظ", cancel: "إلغاء", jobTitle: "عنوان الوظيفة", type: "النوع",
    salary: "الراتب", company: "الشركة", task: "مهمة", fulltime: "دوام كامل",
    open: "مفتوح", closed: "مغلق", filled: "مشغول", addJob: "إضافة وظيفة",
    closeJob: "إغلاق", subject: "الموضوع", priority: "الأولوية", date: "التاريخ",
    newTicket: "جديد", inProgress: "قيد المتابعة", resolved: "تم الحل",
    closedTicket: "مغلق", low: "منخفض", normal: "عادي", high: "مرتفع",
    markProgress: "قيد المتابعة", markResolved: "تم الحل", markClosed: "إغلاق",
    action: "الإجراء", details: "التفاصيل", user: "المستخدم",
    notAuthorized: "غير مصرح لك بالدخول", loginAsAdmin: "تسجيل الدخول كأدمن",
    refresh: "تحديث", applicationsCount: "طلبات",
    beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم",
    requiredSkills: "المهارات المطلوبة", quickStats: "إحصائيات سريعة",
    applicationsTab: "طلبات التوظيف", applicant: "المتقدم", appliedFor: "الوظيفة",
    acceptApp: "قبول", rejectApp: "رفض", accepted: "مقبول", rejected: "مرفوض",
    noApps: "لا توجد طلبات", viewProfile: "الملف الشخصي", quizScore: "نتيجة الاختبار",
  } : {
    breadHome: "Home", breadAdmin: "Admin Panel", title: "Admin Panel",
    overview: "Overview", usersTab: "Users", coursesTab: "Courses",
    jobsTab: "Jobs", ticketsTab: "Tickets", logsTab: "Activity Log",
    totalUsers: "Total Users", students: "Students", companies: "Companies",
    pending: "Pending", banned: "Banned",
    totalCourses: "Courses", availableCourses: "Available", enrollments: "Enrollments",
    completionRate: "Completion Rate", totalJobs: "Jobs", openJobs: "Open",
    applications: "Applications", totalTickets: "Tickets", openTickets: "Open",
    recentUsers: "Recent Users", recentActivity: "Recent Activity",
    userDistribution: "User Distribution", name: "Name", email: "Email",
    role: "Role", status: "Status", actions: "Actions", search: "Search...",
    allRoles: "All Roles", student: "Student", hr: "Company", admin: "Admin",
    verify: "Verify", ban: "Ban", unban: "Unban", delete: "Delete",
    prev: "Previous", next: "Next", courseTitle: "Course Title",
    category: "Category", difficulty: "Difficulty", hours: "Hours", modules: "Modules",
    available: "Available", notAvailable: "Not Available", enrollmentsCount: "Enrollments",
    addCourse: "Add Course", editCourse: "Edit", deleteCourse: "Delete",
    toggleAvail: "Toggle Availability", titleAr: "Title (Arabic)", titleEn: "Title (English)",
    descAr: "Description (Arabic)", descEn: "Description (English)", slug: "Slug",
    save: "Save", cancel: "Cancel", jobTitle: "Job Title", type: "Type",
    salary: "Salary", company: "Company", task: "Task", fulltime: "Full-time",
    open: "Open", closed: "Closed", filled: "Filled", addJob: "Add Job",
    closeJob: "Close", subject: "Subject", priority: "Priority", date: "Date",
    newTicket: "New", inProgress: "In Progress", resolved: "Resolved",
    closedTicket: "Closed", low: "Low", normal: "Normal", high: "High",
    markProgress: "In Progress", markResolved: "Resolve", markClosed: "Close",
    action: "Action", details: "Details", user: "User",
    notAuthorized: "You are not authorized to access this page", loginAsAdmin: "Login as Admin",
    refresh: "Refresh", applicationsCount: "Applications",
    beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
    requiredSkills: "Required Skills", quickStats: "Quick Stats",
    applicationsTab: "Applications", applicant: "Applicant", appliedFor: "Applied For",
    acceptApp: "Accept", rejectApp: "Reject", accepted: "Accepted", rejected: "Rejected",
    noApps: "No applications", viewProfile: "Profile", quizScore: "Quiz Score",
  };

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) { const data = await res.json(); setStats(data); }
  }, []);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams({ page: String(usersPage), limit: "10" });
    if (userRoleFilter) params.set("role", userRoleFilter);
    if (userSearch) params.set("search", userSearch);
    const res = await fetch(`/api/users?${params}`);
    if (res.ok) { const data = await res.json(); setUsers(data.users); setUsersTotal(data.total); }
  }, [usersPage, userRoleFilter, userSearch]);

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses");
    if (res.ok) { const data = await res.json(); setCourses(data.courses); }
  }, []);

  const fetchJobs = useCallback(async () => {
    const res = await fetch("/api/jobs?all=1");
    if (res.ok) { const data = await res.json(); setJobs(data.jobs); }
  }, []);

  const fetchTickets = useCallback(async () => {
    const res = await fetch("/api/tickets");
    if (res.ok) { const data = await res.json(); setTickets(data.tickets); }
  }, []);

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/applications");
    if (res.ok) { const data = await res.json(); setAppsList(data.applications || []); }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchStats();
  }, [user, fetchStats, refreshKey]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    if (tab === "users") fetchUsers();
    else if (tab === "courses") fetchCourses();
    else if (tab === "jobs") fetchJobs();
    else if (tab === "tickets") fetchTickets();
    else if (tab === "applications") fetchApplications();
  }, [user, tab, fetchUsers, fetchCourses, fetchJobs, fetchTickets, fetchApplications, refreshKey]);

  async function updateUser(id: number, data: Record<string, unknown>) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setRefreshKey((k) => k + 1); setActionMsg(isAr ? "تم التحديث" : "Updated"); setTimeout(() => setActionMsg(""), 3000); }
  }

  async function deleteUser(id: number) {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) { setRefreshKey((k) => k + 1); setActionMsg(isAr ? "تم الحذف" : "Deleted"); setTimeout(() => setActionMsg(""), 3000); }
  }

  async function toggleCourseAvail(id: number, current: boolean) {
    await fetch(`/api/courses/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !current }),
    });
    setRefreshKey((k) => k + 1);
  }

  async function deleteCourse(id: number) {
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  }

  async function updateTicket(id: number, status: string) {
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRefreshKey((k) => k + 1);
  }

  async function deleteTicket(id: number) {
    await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  }

  async function updateJobStatus(id: number, status: string) {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRefreshKey((k) => k + 1);
  }

  async function deleteJob(id: number) {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  }

  async function updateAppStatus(appId: number, status: string) {
    await fetch("/api/applications", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: appId, status }),
    });
    setRefreshKey((k) => k + 1);
  }

  const [cf, setCf] = useState({ slug: "", titleAr: "", titleEn: "", descAr: "", descEn: "", category: "data-entry", difficulty: "beginner", hours: 1, modules: 1 });

  async function saveCourse() {
    await fetch("/api/courses", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cf),
    });
    setCf({ slug: "", titleAr: "", titleEn: "", descAr: "", descEn: "", category: "data-entry", difficulty: "beginner", hours: 1, modules: 1 });
    setShowCourseForm(false);
    setRefreshKey((k) => k + 1);
  }

  const [jf, setJf] = useState({ titleAr: "", titleEn: "", descAr: "", descEn: "", type: "task", category: "data-entry", salary: 0, companyName: "", requiredSkills: "" });

  async function saveJob() {
    await fetch("/api/jobs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jf),
    });
    setJf({ titleAr: "", titleEn: "", descAr: "", descEn: "", type: "task", category: "data-entry", salary: 0, companyName: "", requiredSkills: "" });
    setShowJobForm(false);
    setRefreshKey((k) => k + 1);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen"><TopBar />
        <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-[#212529]">
          <RefreshCw size={24} className="animate-spin text-[#2E5C8A]" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen"><TopBar />
        <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-[#212529]">
          <AlertTriangle size={32} className="text-[#FF9800]" />
          <p className="font-semibold">{L.notAuthorized}</p>
          <Link href="/auth/login" className="min-h-12 inline-flex items-center rounded-sm bg-[#2E5C8A] px-6 text-white">{L.loginAsAdmin}</Link>
        </main>
      </div>
    );
  }

  const o = stats?.overview;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: L.overview, icon: <BarChart3 size={18} /> },
    { id: "users", label: L.usersTab, icon: <Users size={18} /> },
    { id: "courses", label: L.coursesTab, icon: <BookOpen size={18} /> },
    { id: "jobs", label: L.jobsTab, icon: <Briefcase size={18} /> },
    { id: "applications", label: L.applicationsTab, icon: <FileText size={18} /> },
    { id: "tickets", label: L.ticketsTab, icon: <TicketCheck size={18} /> },
    { id: "logs", label: L.logsTab, icon: <Activity size={18} /> },
  ];

  const userDistData = o ? [
    { name: L.students, value: o.totalStudents },
    { name: L.companies, value: o.totalHr },
    { name: L.admin, value: o.totalUsers - o.totalStudents - o.totalHr },
  ] : [];

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      verified: "bg-[#E8F5E9] text-[#28A745]", pending: "bg-[#FFF3E0] text-[#FF9800]",
      banned: "bg-[#FFEBEE] text-[#DC3545]", new: "bg-[#E3F2FD] text-[#2E5C8A]",
      "in-progress": "bg-[#FFF3E0] text-[#FF9800]", resolved: "bg-[#E8F5E9] text-[#28A745]",
      closed: "bg-[#F5F5F5] text-[#6C757D]", open: "bg-[#E8F5E9] text-[#28A745]",
      filled: "bg-[#E3F2FD] text-[#2E5C8A]", accepted: "bg-[#E8F5E9] text-[#28A745]",
      rejected: "bg-[#FFEBEE] text-[#DC3545]",
    };
    return `inline-block rounded-sm px-2 py-1 text-xs font-semibold ${map[s] || "bg-[#F5F5F5] text-[#6C757D]"}`;
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-[#212529] sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrumbs items={[{ label: L.breadHome, href: "/" }, { label: L.breadAdmin }]} ariaLabel={isAr ? "مسار التنقل" : "Breadcrumb"} />
          <div className="flex items-center gap-2">
            {actionMsg && <span className="rounded-sm bg-[#E8F5E9] px-3 py-1 text-sm text-[#28A745]">{actionMsg}</span>}
            <button type="button" onClick={() => setRefreshKey((k) => k + 1)} className="min-h-12 inline-flex items-center gap-2 rounded-sm border border-[#DEE2E6] px-4"><RefreshCw size={16} /> {L.refresh}</button>
          </div>
        </div>

        <h1 className="font-semibold">{L.title}</h1>

        <nav className="flex flex-wrap gap-1 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-1">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`min-h-12 inline-flex items-center gap-2 rounded-sm px-4 text-sm ${tab === t.id ? "bg-[#2E5C8A] text-white" : "text-[#212529]"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        {tab === "overview" && o && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={<Users size={20} />} label={L.totalUsers} value={o.totalUsers} sub={`${o.pendingUsers} ${L.pending}`} />
              <StatCard icon={<BookOpen size={20} />} label={L.enrollments} value={o.totalEnrollments} sub={`${o.completionRate}% ${L.completionRate}`} />
              <StatCard icon={<Briefcase size={20} />} label={L.totalJobs} value={o.totalJobs} sub={`${o.openJobs} ${L.openJobs}`} />
              <StatCard icon={<TicketCheck size={20} />} label={L.totalTickets} value={o.totalTickets} sub={`${o.openTickets} ${L.openTickets}`} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <h2 className="mb-4 font-semibold">{L.userDistribution}</h2>
                <div className="h-64">
                  <RechartsCharts>
                    {(c) => (
                      <c.ResponsiveContainer width="100%" height="100%">
                        <c.PieChart>
                          <c.Pie data={userDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`} isAnimationActive={false}>
                            {userDistData.map((_, i) => <c.Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </c.Pie>
                          <c.Legend />
                        </c.PieChart>
                      </c.ResponsiveContainer>
                    )}
                  </RechartsCharts>
                </div>
              </div>
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <h2 className="mb-4 font-semibold">{L.quickStats}</h2>
                <div className="h-64">
                  <RechartsCharts>
                    {(c) => (
                      <c.ResponsiveContainer width="100%" height="100%">
                        <c.BarChart data={[
                          { name: L.students, value: o.totalStudents },
                          { name: L.companies, value: o.totalHr },
                          { name: L.enrollments, value: o.totalEnrollments },
                          { name: L.totalJobs, value: o.totalJobs },
                          { name: L.applications, value: o.totalApplications },
                        ]}>
                          <c.XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <c.YAxis />
                          <c.Tooltip />
                          <c.Bar dataKey="value" fill="#2E5C8A" isAnimationActive={false} />
                        </c.BarChart>
                      </c.ResponsiveContainer>
                    )}
                  </RechartsCharts>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <h2 className="mb-3 font-semibold">{L.recentUsers}</h2>
                <div className="flex flex-col gap-2">
                  {stats.recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-2 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-3">
                      <div className="flex items-center gap-2">
                        <UserPlus size={16} className="text-[#2E5C8A]" />
                        <span className="font-semibold">{u.name}</span>
                        <span className={statusBadge(u.status)}>{u.status}</span>
                      </div>
                      <span className="text-xs text-[#6C757D]">{u.role} - {fmtDate(u.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <h2 className="mb-3 font-semibold">{L.recentActivity}</h2>
                <div className="flex flex-col gap-2">
                  {stats.recentLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-2 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-3">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-[#6C757D]" />
                        <span className="text-sm">{log.user?.name || "System"}</span>
                        <span className="text-xs text-[#6C757D]">{log.action}</span>
                      </div>
                      <span className="text-xs text-[#6C757D]">{fmtDate(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-h-12 items-center gap-2 rounded-sm border border-[#DEE2E6] bg-white px-3">
                <Search size={16} className="text-[#6C757D]" />
                <input type="text" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUsersPage(1); }}
                  placeholder={L.search} className="border-none bg-transparent outline-none" />
              </div>
              <select value={userRoleFilter} onChange={(e) => { setUserRoleFilter(e.target.value); setUsersPage(1); }}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-3">
                <option value="">{L.allRoles}</option>
                <option value="student">{L.student}</option>
                <option value="hr">{L.hr}</option>
                <option value="admin">{L.admin}</option>
              </select>
            </div>

            <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                    <th className="px-4 py-3 text-start">{L.name}</th>
                    <th className="px-4 py-3 text-start">{L.email}</th>
                    <th className="px-4 py-3 text-start">{L.role}</th>
                    <th className="px-4 py-3 text-start">{L.status}</th>
                    <th className="px-4 py-3 text-start">{L.enrollmentsCount}</th>
                    <th className="px-4 py-3 text-start">{L.date}</th>
                    <th className="px-4 py-3 text-start">{L.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#DEE2E6]">
                      <td className="px-4 py-3 font-semibold">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3"><span className={statusBadge(u.status)}>{u.status}</span></td>
                      <td className="px-4 py-3">{u._count.enrollments}</td>
                      <td className="px-4 py-3 text-xs">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.status !== "verified" && (
                            <button type="button" onClick={() => updateUser(u.id, { status: "verified" })}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DEE2E6] px-2 text-xs">
                              <ShieldCheck size={14} /> {L.verify}
                            </button>
                          )}
                          {u.status !== "banned" ? (
                            <button type="button" onClick={() => updateUser(u.id, { status: "banned" })}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#FF9800] px-2 text-xs text-[#FF9800]">
                              <Ban size={14} /> {L.ban}
                            </button>
                          ) : (
                            <button type="button" onClick={() => updateUser(u.id, { status: "pending" })}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#28A745] px-2 text-xs text-[#28A745]">
                              <CheckCircle size={14} /> {L.unban}
                            </button>
                          )}
                          <button type="button" onClick={() => deleteUser(u.id)}
                            className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DC3545] px-2 text-xs text-[#DC3545]">
                            <Trash2 size={14} /> {L.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6C757D]">{usersTotal} {L.totalUsers}</span>
              <div className="flex gap-2">
                <button type="button" disabled={usersPage <= 1} onClick={() => setUsersPage((p) => p - 1)}
                  className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DEE2E6] px-3 disabled:opacity-40">
                  <ChevronLeft size={16} /> {L.prev}
                </button>
                <button type="button" disabled={usersPage * 10 >= usersTotal} onClick={() => setUsersPage((p) => p + 1)}
                  className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DEE2E6] px-3 disabled:opacity-40">
                  {L.next} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowCourseForm(!showCourseForm)}
                className="min-h-12 inline-flex items-center gap-2 rounded-sm bg-[#2E5C8A] px-4 text-white">
                <Plus size={16} /> {L.addCourse}
              </button>
            </div>

            {showCourseForm && (
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm">{L.slug}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.slug} onChange={(e) => setCf({ ...cf, slug: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.titleAr}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.titleAr} onChange={(e) => setCf({ ...cf, titleAr: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.titleEn}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.titleEn} onChange={(e) => setCf({ ...cf, titleEn: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.category}
                    <select className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.category} onChange={(e) => setCf({ ...cf, category: e.target.value })}>
                      <option value="data-entry">Data Entry</option><option value="design">Design</option>
                      <option value="qa">QA</option><option value="programming">Programming</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">{L.difficulty}
                    <select className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.difficulty} onChange={(e) => setCf({ ...cf, difficulty: e.target.value })}>
                      <option value="beginner">{L.beginner}</option><option value="intermediate">{L.intermediate}</option><option value="advanced">{L.advanced}</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">{L.hours}<input type="number" className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.hours} onChange={(e) => setCf({ ...cf, hours: parseInt(e.target.value) || 1 })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.modules}<input type="number" className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.modules} onChange={(e) => setCf({ ...cf, modules: parseInt(e.target.value) || 1 })} /></label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">{L.descAr}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.descAr} onChange={(e) => setCf({ ...cf, descAr: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">{L.descEn}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={cf.descEn} onChange={(e) => setCf({ ...cf, descEn: e.target.value })} /></label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={saveCourse} className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white">{L.save}</button>
                  <button type="button" onClick={() => setShowCourseForm(false)} className="min-h-12 rounded-sm border border-[#DEE2E6] px-6">{L.cancel}</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                    <th className="px-4 py-3 text-start">{L.courseTitle}</th>
                    <th className="px-4 py-3 text-start">{L.category}</th>
                    <th className="px-4 py-3 text-start">{L.difficulty}</th>
                    <th className="px-4 py-3 text-start">{L.hours}</th>
                    <th className="px-4 py-3 text-start">{L.status}</th>
                    <th className="px-4 py-3 text-start">{L.enrollmentsCount}</th>
                    <th className="px-4 py-3 text-start">{L.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b border-[#DEE2E6]">
                      <td className="px-4 py-3 font-semibold">{isAr ? c.titleAr : c.titleEn}</td>
                      <td className="px-4 py-3">{c.category}</td>
                      <td className="px-4 py-3">{c.difficulty}</td>
                      <td className="px-4 py-3">{c.hours}h</td>
                      <td className="px-4 py-3"><span className={statusBadge(c.available ? "open" : "closed")}>{c.available ? L.available : L.notAvailable}</span></td>
                      <td className="px-4 py-3">{c._count.enrollments}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <button type="button" onClick={() => toggleCourseAvail(c.id, c.available)}
                            className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DEE2E6] px-2 text-xs">
                            <Eye size={14} /> {L.toggleAvail}
                          </button>
                          <button type="button" onClick={() => deleteCourse(c.id)}
                            className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DC3545] px-2 text-xs text-[#DC3545]">
                            <Trash2 size={14} /> {L.deleteCourse}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "jobs" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowJobForm(!showJobForm)}
                className="min-h-12 inline-flex items-center gap-2 rounded-sm bg-[#2E5C8A] px-4 text-white">
                <Plus size={16} /> {L.addJob}
              </button>
            </div>

            {showJobForm && (
              <div className="rounded-sm border border-[#DEE2E6] bg-white p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm">{L.titleAr}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.titleAr} onChange={(e) => setJf({ ...jf, titleAr: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.titleEn}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.titleEn} onChange={(e) => setJf({ ...jf, titleEn: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.type}
                    <select className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.type} onChange={(e) => setJf({ ...jf, type: e.target.value })}>
                      <option value="task">{L.task}</option><option value="fulltime">{L.fulltime}</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">{L.category}
                    <select className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.category} onChange={(e) => setJf({ ...jf, category: e.target.value })}>
                      <option value="data-entry">Data Entry</option><option value="excel">Excel</option>
                      <option value="qa">QA</option><option value="editing">Editing</option><option value="design">Design</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">{L.salary}<input type="number" className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.salary} onChange={(e) => setJf({ ...jf, salary: parseFloat(e.target.value) || 0 })} /></label>
                  <label className="flex flex-col gap-1 text-sm">{L.company}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.companyName} onChange={(e) => setJf({ ...jf, companyName: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">{L.requiredSkills}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" placeholder="Excel,Typing" value={jf.requiredSkills} onChange={(e) => setJf({ ...jf, requiredSkills: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">{L.descAr}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.descAr} onChange={(e) => setJf({ ...jf, descAr: e.target.value })} /></label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">{L.descEn}<input className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" value={jf.descEn} onChange={(e) => setJf({ ...jf, descEn: e.target.value })} /></label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={saveJob} className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white">{L.save}</button>
                  <button type="button" onClick={() => setShowJobForm(false)} className="min-h-12 rounded-sm border border-[#DEE2E6] px-6">{L.cancel}</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                    <th className="px-4 py-3 text-start">{L.jobTitle}</th>
                    <th className="px-4 py-3 text-start">{L.type}</th>
                    <th className="px-4 py-3 text-start">{L.company}</th>
                    <th className="px-4 py-3 text-start">{L.salary}</th>
                    <th className="px-4 py-3 text-start">{L.status}</th>
                    <th className="px-4 py-3 text-start">{L.applicationsCount}</th>
                    <th className="px-4 py-3 text-start">{L.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} className="border-b border-[#DEE2E6]">
                      <td className="px-4 py-3 font-semibold">{isAr ? j.titleAr : j.titleEn}</td>
                      <td className="px-4 py-3">{j.type === "task" ? L.task : L.fulltime}</td>
                      <td className="px-4 py-3">{j.companyName}</td>
                      <td className="px-4 py-3">{j.salary} {j.currency}</td>
                      <td className="px-4 py-3"><span className={statusBadge(j.status)}>{j.status === "open" ? L.open : j.status === "closed" ? L.closed : L.filled}</span></td>
                      <td className="px-4 py-3">{j._count.applications}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {j.status === "open" && (
                            <button type="button" onClick={() => updateJobStatus(j.id, "closed")}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#FF9800] px-2 text-xs text-[#FF9800]">
                              <XCircle size={14} /> {L.closeJob}
                            </button>
                          )}
                          {j.status === "closed" && (
                            <button type="button" onClick={() => updateJobStatus(j.id, "open")}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#28A745] px-2 text-xs text-[#28A745]">
                              <CheckCircle size={14} /> {L.open}
                            </button>
                          )}
                          <button type="button" onClick={() => deleteJob(j.id)}
                            className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DC3545] px-2 text-xs text-[#DC3545]">
                            <Trash2 size={14} /> {L.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div className="flex flex-col gap-4">
            {appsList.length === 0 ? (
              <p className="text-center text-[#6C757D]">{L.noApps}</p>
            ) : (
              <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-start">ID</th>
                      <th className="px-4 py-3 text-start">{L.applicant}</th>
                      <th className="px-4 py-3 text-start">{L.email}</th>
                      <th className="px-4 py-3 text-start">{L.appliedFor}</th>
                      <th className="px-4 py-3 text-start">{L.company}</th>
                      <th className="px-4 py-3 text-start">{L.quizScore}</th>
                      <th className="px-4 py-3 text-start">{L.status}</th>
                      <th className="px-4 py-3 text-start">{L.date}</th>
                      <th className="px-4 py-3 text-start">{L.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appsList.map((a) => (
                      <tr key={a.id} className="border-b border-[#DEE2E6]">
                        <td className="px-4 py-3 font-semibold">A-{a.id}</td>
                        <td className="px-4 py-3 font-semibold">{a.user.name}</td>
                        <td className="px-4 py-3">{a.user.email}</td>
                        <td className="px-4 py-3">{isAr ? a.job.titleAr : a.job.titleEn}</td>
                        <td className="px-4 py-3">{a.job.companyName}</td>
                        <td className="px-4 py-3">{a.user.quizScore ?? "-"}</td>
                        <td className="px-4 py-3"><span className={statusBadge(a.status)}>{a.status === "accepted" ? L.accepted : a.status === "rejected" ? L.rejected : L.pending}</span></td>
                        <td className="px-4 py-3 text-xs">{fmtDate(a.appliedAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {a.status === "pending" && (
                              <>
                                <button type="button" onClick={() => updateAppStatus(a.id, "accepted")}
                                  className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#28A745] px-2 text-xs text-white">
                                  <CheckCircle size={14} /> {L.acceptApp}
                                </button>
                                <button type="button" onClick={() => updateAppStatus(a.id, "rejected")}
                                  className="min-h-10 inline-flex items-center gap-1 rounded-sm bg-[#DC3545] px-2 text-xs text-white">
                                  <XCircle size={14} /> {L.rejectApp}
                                </button>
                              </>
                            )}
                            <Link href={`/profile/${a.user.id}`}
                              className="min-h-10 inline-flex items-center rounded-sm border border-[#DEE2E6] px-2 text-xs">
                              {L.viewProfile}
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

        {tab === "tickets" && (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                    <th className="px-4 py-3 text-start">ID</th>
                    <th className="px-4 py-3 text-start">{L.subject}</th>
                    <th className="px-4 py-3 text-start">{L.user}</th>
                    <th className="px-4 py-3 text-start">{L.priority}</th>
                    <th className="px-4 py-3 text-start">{L.status}</th>
                    <th className="px-4 py-3 text-start">{L.date}</th>
                    <th className="px-4 py-3 text-start">{L.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-[#DEE2E6]">
                      <td className="px-4 py-3 font-semibold">T-{t.id}</td>
                      <td className="px-4 py-3">
                        <div>{t.subject}</div>
                        <div className="text-xs text-[#6C757D]">{t.message.slice(0, 80)}</div>
                      </td>
                      <td className="px-4 py-3">{t.user?.name || t.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${t.priority === "high" ? "bg-[#FFEBEE] text-[#DC3545]" : t.priority === "normal" ? "bg-[#FFF3E0] text-[#FF9800]" : "bg-[#F5F5F5] text-[#6C757D]"}`}>
                          {t.priority === "high" ? L.high : t.priority === "normal" ? L.normal : L.low}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className={statusBadge(t.status)}>{t.status === "new" ? L.newTicket : t.status === "in-progress" ? L.inProgress : t.status === "resolved" ? L.resolved : L.closedTicket}</span></td>
                      <td className="px-4 py-3 text-xs">{fmtDate(t.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {t.status === "new" && (
                            <button type="button" onClick={() => updateTicket(t.id, "in-progress")}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#FF9800] px-2 text-xs text-[#FF9800]">
                              <Clock size={14} /> {L.markProgress}
                            </button>
                          )}
                          {(t.status === "new" || t.status === "in-progress") && (
                            <button type="button" onClick={() => updateTicket(t.id, "resolved")}
                              className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#28A745] px-2 text-xs text-[#28A745]">
                              <CheckCircle size={14} /> {L.markResolved}
                            </button>
                          )}
                          <button type="button" onClick={() => deleteTicket(t.id)}
                            className="min-h-10 inline-flex items-center gap-1 rounded-sm border border-[#DC3545] px-2 text-xs text-[#DC3545]">
                            <Trash2 size={14} /> {L.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "logs" && stats && (
          <div className="overflow-x-auto rounded-sm border border-[#DEE2E6] bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#DEE2E6] bg-[#F8F9FA]">
                  <th className="px-4 py-3 text-start">{L.date}</th>
                  <th className="px-4 py-3 text-start">{L.user}</th>
                  <th className="px-4 py-3 text-start">{L.action}</th>
                  <th className="px-4 py-3 text-start">{L.details}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#DEE2E6]">
                    <td className="px-4 py-3 text-xs">{fmtDate(log.createdAt)}</td>
                    <td className="px-4 py-3">{log.user?.name || "System"} <span className="text-xs text-[#6C757D]">({log.user?.role || "-"})</span></td>
                    <td className="px-4 py-3"><span className={statusBadge(log.action === "login" ? "open" : log.action.includes("delete") ? "banned" : "pending")}>{log.action}</span></td>
                    <td className="px-4 py-3 text-xs text-[#6C757D]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub: string }) {
  return (
    <div className="flex items-start gap-3 rounded-sm border border-[#DEE2E6] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#E3F2FD] text-[#2E5C8A]">{icon}</div>
      <div>
        <p className="text-sm text-[#6C757D]">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-[#6C757D]">{sub}</p>
      </div>
    </div>
  );
}