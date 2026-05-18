"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar from "../../components/TopBar";
import { useLanguage } from "../../components/LanguageProvider";

type Student = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  chapter: { name: string } | null;
  enrollments: { progress: number; completed: boolean; course: { titleEn: string; slug: string } }[];
  progress: { quizPassed: boolean; quizScore: number | null; unitIndex: number; courseSlug: string }[];
};

type Chapter = { id: number; name: string };

export default function CenterDashboard() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [students, setStudents] = useState<Student[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const labels = isAr
    ? {
        title: "لوحة المركز",
        subtitle: "إدارة الطلاب المرتبطين بالمركز. الدورات للطلاب فقط، وهذه اللوحة للمتابعة والدعم.",
        students: "الطلاب",
        active: "طلاب نشطون",
        completed: "دورات مكتملة",
        average: "متوسط التقدم",
        createStudent: "إنشاء طالب مرتبط",
        name: "اسم الطالب",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        password: "كلمة مرور مؤقتة",
        create: "إنشاء الطالب",
        created: "تم إنشاء حساب الطالب وربطه بالمركز.",
        failed: "لم نتمكن من إنشاء الطالب.",
        nour: "توصيات نور",
        addGroup: "مجموعة جديدة",
        add: "إضافة",
        chooseGroup: "اختر المجموعة",
        assign: "تعيين",
        select: "تحديد",
        student: "الطالب",
        chapter: "المجموعة",
        courses: "الدورات",
        progress: "التقدم",
        unassigned: "غير معين",
        noStudents: "لا يوجد طلاب بعد.",
      }
    : {
        title: "Center dashboard",
        subtitle: "Manage connected autistic learners. Course access belongs to students; this dashboard tracks and supports them.",
        students: "Students",
        active: "Active learners",
        completed: "Completed course",
        average: "Average progress",
        createStudent: "Create connected student",
        name: "Student name",
        phone: "Phone",
        email: "Email",
        password: "Temporary password",
        create: "Create student",
        created: "Student account created and connected to your center.",
        failed: "Could not create student.",
        nour: "Nour recommendations",
        addGroup: "New chapter/group",
        add: "Add",
        chooseGroup: "Choose chapter",
        assign: "Assign",
        select: "Select",
        student: "Student",
        chapter: "Chapter",
        courses: "Courses",
        progress: "Progress",
        unassigned: "Unassigned",
        noStudents: "No students yet.",
      };

  async function fetchData() {
    const [studentsRes, chaptersRes] = await Promise.all([fetch("/api/center/students"), fetch("/api/center/chapters")]);
    if (studentsRes.ok) setStudents(await studentsRes.json());
    if (chaptersRes.ok) setChapters(await chaptersRes.json());
  }

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((student) => student.enrollments.some((enrollment) => enrollment.progress > 0 && !enrollment.completed)).length;
    const completed = students.filter((student) => student.enrollments.some((enrollment) => enrollment.completed)).length;
    const averageProgress = total ? Math.round(students.reduce((sum, student) => sum + averageStudentProgress(student), 0) / total) : 0;
    return { total, active, completed, averageProgress };
  }, [students]);

  const recommendations = isAr
    ? [
        stats.averageProgress < 30 ? "نور يوصي بجلسات أولى قصيرة: من 10 إلى 15 دقيقة، وخطوة واحدة في كل مرة." : "نور يوصي بالاستمرار على نفس الوتيرة ومراجعة أخطاء الاختبارات أسبوعيا.",
        students.some((student) => averageStudentProgress(student) === 0) ? "بعض الطلاب لم يبدأوا بعد. اختر دورة بداية واحدة وجدول جلسة تعريف هادئة." : "كل الطلاب لديهم نشاط. استمر في متابعة انتظام الإنجاز.",
        "للمتعلمين autistic، اجعل تعليمات المركز متوقعة: نفس المكان، نفس الترتيب، ونفس اللغة في كل جلسة.",
      ]
    : [
        stats.averageProgress < 30 ? "Nour recommends shorter first sessions: 10-15 minutes, one unit step at a time." : "Nour recommends keeping the current pace and reviewing quiz mistakes weekly.",
        students.some((student) => averageStudentProgress(student) === 0) ? "Some students have not started. Assign one starter course and schedule a calm onboarding session." : "All listed students have activity. Continue monitoring completion consistency.",
        "For autistic learners, keep center instructions predictable: same place, same order, same language each session.",
      ];

  async function createStudent(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const res = await fetch("/api/center/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || labels.failed);
      return;
    }
    setStudentForm({ name: "", phone: "", email: "", password: "" });
    setMessage(labels.created);
    fetchData();
  }

  async function createChapter(event: React.FormEvent) {
    event.preventDefault();
    if (!chapterName.trim()) return;
    await fetch("/api/center/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: chapterName }),
    });
    setChapterName("");
    fetchData();
  }

  async function assignChapter() {
    if (!chapterId || selectedStudents.length === 0) return;
    await fetch("/api/center/assign-chapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds: selectedStudents, chapterId: Number(chapterId) }),
    });
    setSelectedStudents([]);
    setChapterId("");
    fetchData();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 text-[#212529]">
        <section className="text-center">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="mt-2 text-[#495057]">{labels.subtitle}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Stat label={labels.students} value={stats.total} />
          <Stat label={labels.active} value={stats.active} />
          <Stat label={labels.completed} value={stats.completed} />
          <Stat label={labels.average} value={`${stats.averageProgress}%`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={createStudent} className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-5">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.createStudent}</h2>
            {[
              ["name", labels.name, "text"],
              ["phone", labels.phone, "tel"],
              ["email", labels.email, "email"],
              ["password", labels.password, "text"],
            ].map(([key, label, type]) => (
              <label key={key} className="flex flex-col gap-1">
                {label}
                <input type={type} value={(studentForm as any)[key]} onChange={(event) => setStudentForm((prev) => ({ ...prev, [key]: event.target.value }))} className="min-h-12 rounded-sm border border-[#DEE2E6] px-3" required />
              </label>
            ))}
            <button className="min-h-12 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white">{labels.create}</button>
            {message ? <p className="rounded-sm bg-[#F5F9FF] p-3 text-sm">{message}</p> : null}
          </form>

          <div className="flex flex-col gap-4 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-5">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.nour}</h2>
            {recommendations.map((item) => (
              <p key={item} className="rounded-sm border border-[#D9E6F2] bg-white p-3 text-sm leading-relaxed">{item}</p>
            ))}
            <form onSubmit={createChapter} className="flex gap-2">
              <input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder={labels.addGroup} className="min-h-12 flex-1 rounded-sm border border-[#DEE2E6] px-3" />
              <button className="min-h-12 rounded-sm border border-[#2E5C8A] px-4 font-semibold text-[#2E5C8A]">{labels.add}</button>
            </form>
          </div>
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#D9E6F2] p-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.students}</h2>
            <div className="flex gap-2">
              <select value={chapterId} onChange={(event) => setChapterId(event.target.value)} className="min-h-12 rounded-sm border border-[#DEE2E6] px-3">
                <option value="">{labels.chooseGroup}</option>
                {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}
              </select>
              <button onClick={assignChapter} disabled={!chapterId || selectedStudents.length === 0} className="min-h-12 rounded-sm bg-[#2E5C8A] px-4 font-semibold text-white disabled:opacity-50">{labels.assign}</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F9FF]">
                <tr>
                  <th className="p-3 text-start">{labels.select}</th>
                  <th className="p-3 text-start">{labels.student}</th>
                  <th className="p-3 text-start">{labels.chapter}</th>
                  <th className="p-3 text-start">{labels.courses}</th>
                  <th className="p-3 text-start">{labels.progress}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const progress = averageStudentProgress(student);
                  return (
                    <tr key={student.id} className="border-t border-[#D9E6F2]">
                      <td className="p-3"><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => setSelectedStudents((prev) => prev.includes(student.id) ? prev.filter((id) => id !== student.id) : [...prev, student.id])} /></td>
                      <td className="p-3"><strong>{student.name}</strong><br /><span className="text-[#6C757D]">{student.email}</span></td>
                      <td className="p-3">{student.chapter?.name || labels.unassigned}</td>
                      <td className="p-3">{student.enrollments.length || 0}</td>
                      <td className="p-3">
                        <div className="h-3 rounded-full bg-[#DEE2E6]"><div className="h-3 rounded-full bg-[#2E5C8A]" style={{ width: `${progress}%` }} /></div>
                        <span className="text-xs text-[#6C757D]">{progress}%</span>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-[#6C757D]">{labels.noStudents}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function averageStudentProgress(student: Student) {
  if (student.enrollments.length > 0) {
    return Math.round(student.enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / student.enrollments.length);
  }
  if (student.progress.length > 0) {
    return Math.round((student.progress.filter((item) => item.quizPassed).length / student.progress.length) * 100);
  }
  return 0;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-[#D9E6F2] bg-white p-5">
      <p className="text-sm text-[#6C757D]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#2E5C8A]">{value}</p>
    </div>
  );
}
