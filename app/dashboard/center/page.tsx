"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, ClipboardList, Lightbulb, Plus, UsersRound } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import TopBar from "../../components/TopBar";
import { useLanguage } from "../../components/LanguageProvider";

type Student = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  chapter: { name: string } | null;
  enrollments: {
    progress: number;
    completed: boolean;
    enrolledAt: string;
    course: { titleAr: string; titleEn: string; slug: string; modules: number };
  }[];
  progress: {
    quizPassed: boolean;
    quizScore: number | null;
    unitIndex: number;
    courseSlug: string;
    updatedAt: string;
  }[];
  activityLogs: {
    action: string;
    createdAt: string;
  }[];
};

type Chapter = { id: number; name: string };

const decodeMojibake = (value: string) => {
  if (!value || !/[ØÙÃ]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const courseName = (student: Student, slug: string, isAr: boolean) => {
  const enrollment = student.enrollments.find((item) => item.course.slug === slug);
  if (!enrollment) return slug;
  return decodeMojibake(isAr ? enrollment.course.titleAr : enrollment.course.titleEn);
};

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
  const [loading, setLoading] = useState(true);
  const [savingStudent, setSavingStudent] = useState(false);

  const labels = isAr
    ? {
        title: "لوحة المركز",
        subtitle: "إدارة الطلاب المرتبطين بالمركز. الطالب هو من يدخل الدورات، والمركز يراقب التقدم ويستخدم توصيات نور.",
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
        creating: "جاري الإنشاء...",
        created: "تم إنشاء حساب الطالب وربطه بالمركز.",
        failed: "لم نتمكن من إنشاء الطالب.",
        nour: "توصيات نور للمركز",
        addGroup: "مجموعة جديدة",
        add: "إضافة",
        chooseGroup: "اختر المجموعة",
        assign: "تعيين المجموعة",
        select: "تحديد",
        chapter: "المجموعة",
        courses: "الدورات",
        progress: "التقدم",
        lastActivity: "آخر نشاط",
        unassigned: "غير معين",
        noStudents: "لا يوجد طلاب بعد.",
        noCourses: "لم يبدأ دورة بعد",
        noActivity: "لا يوجد نشاط بعد",
        quiz: "اختبار",
        courseAccess: "حساب المركز لا يفتح الدورات. استخدم هذه اللوحة للمتابعة فقط.",
        required: "أدخل الاسم والهاتف والبريد وكلمة مرور من 6 أحرف على الأقل.",
        invalidEmail: "تحقق من صيغة البريد الإلكتروني.",
      }
    : {
        title: "Center Dashboard",
        subtitle: "Manage connected autistic learners. Students take courses; the center monitors progress and uses Nour recommendations.",
        students: "Students",
        active: "Active learners",
        completed: "Completed courses",
        average: "Average progress",
        createStudent: "Create connected student",
        name: "Student name",
        phone: "Phone",
        email: "Email",
        password: "Temporary password",
        create: "Create student",
        creating: "Creating...",
        created: "Student account created and connected to your center.",
        failed: "Could not create student.",
        nour: "Nour recommendations",
        addGroup: "New group",
        add: "Add",
        chooseGroup: "Choose group",
        assign: "Assign group",
        select: "Select",
        chapter: "Group",
        courses: "Courses",
        progress: "Progress",
        lastActivity: "Last activity",
        unassigned: "Unassigned",
        noStudents: "No students yet.",
        noCourses: "No course started yet",
        noActivity: "No activity yet",
        quiz: "Quiz",
        courseAccess: "Center accounts do not open courses. Use this dashboard for monitoring only.",
        required: "Enter name, phone, email, and a password of at least 6 characters.",
        invalidEmail: "Check the email format.",
      };

  const analyticsLabels = useMemo(
    () => isAr
      ? {
        insights: "تحليلات المركز",
        progressByCourse: "التقدم حسب الدورة",
        activityTrend: "نشاط آخر ٧ أيام",
        accuracyChart: "دقة الأسئلة والاختبارات",
        riskView: "احتياج الدعم",
        activeTime: "وقت النشاط المقدر",
        quizAccuracy: "دقة الاختبارات",
        unitsDone: "وحدات مكتملة",
        attempts: "محاولات",
        minutes: "دقيقة",
        activeDays: "أيام نشطة",
        highSupport: "دعم مرتفع",
        steady: "مستقر",
        review: "مراجعة",
        noChartData: "لا توجد بيانات كافية بعد.",
      }
      : {
        insights: "Center insights",
        progressByCourse: "Progress by course",
        activityTrend: "Last 7 days activity",
        accuracyChart: "Question and quiz accuracy",
        riskView: "Support needs",
        activeTime: "Estimated active time",
        quizAccuracy: "Quiz accuracy",
        unitsDone: "Completed units",
        attempts: "Attempts",
        minutes: "min",
        activeDays: "active days",
        highSupport: "High support",
        steady: "Steady",
        review: "Review",
        noChartData: "Not enough data yet.",
      },
    [isAr]
  );

  async function fetchData() {
    setLoading(true);
    const [studentsRes, chaptersRes] = await Promise.all([fetch("/api/center/students"), fetch("/api/center/chapters")]);
    if (studentsRes.ok) setStudents(await studentsRes.json());
    if (chaptersRes.ok) setChapters(await chaptersRes.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchData().catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((student) => student.progress.some((item) => item.quizPassed) || student.enrollments.some((item) => item.progress > 0)).length;
    const completed = students.reduce((sum, student) => sum + student.enrollments.filter((item) => item.completed).length, 0);
    const averageProgress = total ? Math.round(students.reduce((sum, student) => sum + averageStudentProgress(student), 0) / total) : 0;
    return { total, active, completed, averageProgress };
  }, [students]);

  const recommendations = useMemo(() => {
    const idleCount = students.filter((student) => averageStudentProgress(student) === 0).length;
    const lowQuizCount = students.filter((student) => student.progress.some((item) => item.quizScore !== null && item.quizScore < 3)).length;
    return isAr
      ? [
          stats.averageProgress < 30
            ? "نور يوصي بجلسات أولى قصيرة: 10 إلى 15 دقيقة، وخطوة واحدة في كل مرة."
            : "نور يوصي بالحفاظ على نفس الإيقاع ومراجعة أخطاء الاختبارات أسبوعيا.",
          idleCount > 0
            ? `${idleCount} طالب لم يبدأوا بعد. اختر دورة بداية واحدة وحدد جلسة تعريف هادئة ومتوقعة.`
            : "كل الطلاب لديهم نشاط. استمر في متابعة انتظام الإنجاز لا السرعة فقط.",
          lowQuizCount > 0
            ? "بعض درجات الاختبارات منخفضة. استخدم مراجعة قصيرة بمثال واحد ومثال عكسي واحد قبل إعادة المحاولة."
            : "لا توجد إشارات اختبار مقلقة حاليا. حافظ على التعليمات بنفس المكان والترتيب واللغة.",
        ]
      : [
          stats.averageProgress < 30
            ? "Nour recommends shorter first sessions: 10-15 minutes, one unit step at a time."
            : "Nour recommends keeping the current pace and reviewing quiz mistakes weekly.",
          idleCount > 0
            ? `${idleCount} student(s) have not started. Assign one starter course and schedule a calm predictable onboarding session.`
            : "All listed students have activity. Keep monitoring consistency, not speed only.",
          lowQuizCount > 0
            ? "Some quiz scores are low. Use a short review with one example and one non-example before retry."
            : "No concerning quiz signal right now. Keep instructions in the same place, order, and language.",
        ];
  }, [students, stats.averageProgress, isAr]);

  const analytics = useMemo(() => buildCenterAnalytics(students, analyticsLabels, isAr), [students, analyticsLabels, isAr]);

  async function createStudent(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!studentForm.name.trim() || !studentForm.phone.trim() || !studentForm.email.trim() || studentForm.password.length < 6) {
      setMessage(labels.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email)) {
      setMessage(labels.invalidEmail);
      return;
    }
    setSavingStudent(true);
    const res = await fetch("/api/center/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentForm),
    });
    const data = await res.json();
    setSavingStudent(false);
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
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-[#212529] sm:px-6 lg:py-10">
        <section className="rounded-sm border border-[#D9E6F2] bg-white p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#2E5C8A] sm:text-3xl">{labels.title}</h1>
              <p className="mt-2 max-w-3xl text-[#495057]">{labels.subtitle}</p>
            </div>
            <p className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-3 text-sm text-[#2E5C8A]">
              {labels.courseAccess}
            </p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<UsersRound size={18} />} label={labels.students} value={stats.total} />
          <Stat icon={<BarChart3 size={18} />} label={labels.active} value={stats.active} />
          <Stat icon={<CheckCircle2 size={18} />} label={labels.completed} value={stats.completed} />
          <Stat icon={<ClipboardList size={18} />} label={labels.average} value={`${stats.averageProgress}%`} />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<BarChart3 size={18} />} label={analyticsLabels.activeTime} value={`${analytics.activeMinutes} ${analyticsLabels.minutes}`} />
          <Stat icon={<CheckCircle2 size={18} />} label={analyticsLabels.quizAccuracy} value={`${analytics.quizAccuracy}%`} />
          <Stat icon={<ClipboardList size={18} />} label={analyticsLabels.unitsDone} value={analytics.completedUnits} />
          <Stat icon={<UsersRound size={18} />} label={analyticsLabels.activeDays} value={analytics.activeDays} />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <ChartPanel title={analyticsLabels.progressByCourse} empty={!analytics.courseProgress.length} emptyText={analyticsLabels.noChartData}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.courseProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="progress" fill="#2E5C8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title={analyticsLabels.activityTrend} empty={!analytics.activityTrend.some((item) => item.events > 0)} emptyText={analyticsLabels.noChartData}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="events" stroke="#2E5C8A" fill="#D9E6F2" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title={analyticsLabels.accuracyChart} empty={!analytics.accuracyData.length} emptyText={analyticsLabels.noChartData}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title={analyticsLabels.riskView} empty={!analytics.supportNeeds.some((item) => item.value > 0)} emptyText={analyticsLabels.noChartData}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={analytics.supportNeeds} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {analytics.supportNeeds.map((entry, index) => (
                    <Cell key={entry.name} fill={["#2E5C8A", "#FF9800", "#2E7D32"][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form onSubmit={createStudent} className="flex flex-col gap-3 rounded-sm border border-[#D9E6F2] bg-white p-5">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.createStudent}</h2>
            {[
              ["name", labels.name, "text"],
              ["phone", labels.phone, "tel"],
              ["email", labels.email, "email"],
              ["password", labels.password, "password"],
            ].map(([key, label, type]) => (
              <label key={key} className="flex flex-col gap-1 text-sm font-semibold text-[#495057]">
                {label}
                <input
                  type={type}
                  value={(studentForm as Record<string, string>)[key]}
                  onChange={(event) => setStudentForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-[#F5F9FF] px-3 text-base font-normal text-[#212529]"
                  required
                />
              </label>
            ))}
            <button disabled={savingStudent} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white disabled:opacity-60">
              <Plus size={18} /> {savingStudent ? labels.creating : labels.create}
            </button>
            {message ? <p className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-3 text-sm">{message}</p> : null}
          </form>

          <div className="flex flex-col gap-4 rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-5">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.nour}</h2>
            {recommendations.map((item) => (
              <p key={item} className="rounded-sm border border-[#D9E6F2] bg-white p-3 text-sm leading-relaxed">
                <Lightbulb size={16} className="me-2 inline text-[#2E5C8A]" />
                {item}
              </p>
            ))}
            <form onSubmit={createChapter} className="flex flex-col gap-2 sm:flex-row">
              <input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder={labels.addGroup} className="min-h-12 flex-1 rounded-sm border border-[#DEE2E6] bg-white px-3" />
              <button className="min-h-12 rounded-sm border border-[#2E5C8A] px-4 font-semibold text-[#2E5C8A]">{labels.add}</button>
            </form>
          </div>
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#D9E6F2] p-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-[#2E5C8A]">{labels.students}</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select value={chapterId} onChange={(event) => setChapterId(event.target.value)} className="min-h-12 rounded-sm border border-[#DEE2E6] bg-[#F5F9FF] px-3">
                <option value="">{labels.chooseGroup}</option>
                {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}
              </select>
              <button onClick={assignChapter} disabled={!chapterId || selectedStudents.length === 0} className="min-h-12 rounded-sm bg-[#2E5C8A] px-4 font-semibold text-white disabled:opacity-50">{labels.assign}</button>
            </div>
          </div>

          {loading ? <p className="p-6 text-[#6C757D]">{isAr ? "جاري التحميل..." : "Loading..."}</p> : null}
          {!loading && students.length === 0 ? <p className="p-8 text-center text-[#6C757D]">{labels.noStudents}</p> : null}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F9FF]">
                <tr>
                  <th className="p-3 text-start">{labels.select}</th>
                  <th className="p-3 text-start">{labels.students}</th>
                  <th className="p-3 text-start">{labels.chapter}</th>
                  <th className="p-3 text-start">{labels.courses}</th>
                  <th className="p-3 text-start">{labels.progress}</th>
                  <th className="p-3 text-start">{labels.lastActivity}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => <StudentRow key={student.id} student={student} labels={labels} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} isAr={isAr} />)}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-3 lg:hidden">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} labels={labels} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} isAr={isAr} />
            ))}
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

function buildCenterAnalytics(students: Student[], labels: Record<string, string>, isAr: boolean) {
  const allProgress = students.flatMap((student) => student.progress);
  const allActivity = students.flatMap((student) => student.activityLogs || []);
  const completedUnits = allProgress.filter((item) => item.quizPassed).length;
  const attempts = allProgress.length;
  const quizAccuracy = attempts ? Math.round((completedUnits / attempts) * 100) : 0;
  const activeDaysSet = new Set<string>();
  [...allProgress.map((item) => item.updatedAt), ...allActivity.map((item) => item.createdAt)].forEach((date) => {
    if (date) activeDaysSet.add(new Date(date).toDateString());
  });
  const activeMinutes = Math.max(0, allActivity.length * 8 + allProgress.length * 12);

  const courseMap = new Map<string, { name: string; sum: number; count: number }>();
  students.forEach((student) => {
    student.enrollments.forEach((enrollment) => {
      const existing = courseMap.get(enrollment.course.slug) || {
        name: decodeMojibake(isAr ? enrollment.course.titleAr : enrollment.course.titleEn),
        sum: 0,
        count: 0,
      };
      existing.sum += Number(enrollment.progress || 0);
      existing.count += 1;
      courseMap.set(enrollment.course.slug, existing);
    });
  });

  const courseProgress = Array.from(courseMap.values()).map((item) => ({
    name: item.name,
    progress: item.count ? Math.round(item.sum / item.count) : 0,
  }));

  const now = new Date();
  const activityTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const key = date.toDateString();
    const events =
      allActivity.filter((item) => new Date(item.createdAt).toDateString() === key).length +
      allProgress.filter((item) => new Date(item.updatedAt).toDateString() === key).length;
    return { day: date.toLocaleDateString(undefined, { weekday: "short" }), events };
  });

  const accuracyData = students
    .map((student) => {
      const attempts = student.progress.length;
      const passed = student.progress.filter((item) => item.quizPassed).length;
      return {
        name: student.name.split(" ")[0] || student.name,
        accuracy: attempts ? Math.round((passed / attempts) * 100) : 0,
      };
    })
    .filter((item) => item.accuracy > 0);

  const highSupport = students.filter((student) => averageStudentProgress(student) < 25).length;
  const review = students.filter((student) => student.progress.some((item) => item.quizScore !== null && item.quizScore < 3)).length;
  const steady = Math.max(0, students.length - highSupport - review);
  const supportNeeds = [
    { name: labels.highSupport, value: highSupport },
    { name: labels.review, value: review },
    { name: labels.steady, value: steady },
  ];

  return {
    activeMinutes,
    quizAccuracy,
    completedUnits,
    activeDays: activeDaysSet.size,
    courseProgress,
    activityTrend,
    accuracyData,
    supportNeeds,
  };
}

function ChartPanel({ title, empty, emptyText, children }: { title: string; empty: boolean; emptyText: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-[#D9E6F2] bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold text-[#2E5C8A]">{title}</h2>
      {empty ? <p className="flex h-[260px] items-center justify-center text-center text-[#6C757D]">{emptyText}</p> : children}
    </section>
  );
}

function lastActivity(student: Student, fallback: string) {
  const latest = student.progress
    .map((item) => new Date(item.updatedAt).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];
  return latest ? new Date(latest).toLocaleDateString() : fallback;
}

function completedUnitText(student: Student, isAr: boolean) {
  const passed = student.progress.filter((item) => item.quizPassed);
  if (passed.length === 0) return isAr ? "لا توجد وحدات مكتملة بعد" : "No completed units yet";
  const latest = passed[passed.length - 1];
  return `${courseName(student, latest.courseSlug, isAr)} · ${isAr ? "وحدة" : "Unit"} ${latest.unitIndex + 1}`;
}

function StudentRow({
  student,
  labels,
  selectedStudents,
  setSelectedStudents,
  isAr,
}: {
  student: Student;
  labels: Record<string, string>;
  selectedStudents: number[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<number[]>>;
  isAr: boolean;
}) {
  const progress = averageStudentProgress(student);
  return (
    <tr className="border-t border-[#D9E6F2]">
      <td className="p-3">
        <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudent(student.id, setSelectedStudents)} aria-label={`${labels.select} ${student.name}`} />
      </td>
      <td className="p-3">
        <strong>{student.name}</strong>
        <br />
        <span className="text-[#6C757D]">{student.email}</span>
      </td>
      <td className="p-3">{student.chapter?.name || labels.unassigned}</td>
      <td className="p-3">{student.enrollments.length ? student.enrollments.map((item) => courseName(student, item.course.slug, isAr)).join(", ") : labels.noCourses}</td>
      <td className="p-3">
        <ProgressBar value={progress} />
        <span className="text-xs text-[#6C757D]">{progress}% · {completedUnitText(student, isAr)}</span>
      </td>
      <td className="p-3">{lastActivity(student, labels.noActivity)}</td>
    </tr>
  );
}

function StudentCard({
  student,
  labels,
  selectedStudents,
  setSelectedStudents,
  isAr,
}: {
  student: Student;
  labels: Record<string, string>;
  selectedStudents: number[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<number[]>>;
  isAr: boolean;
}) {
  const progress = averageStudentProgress(student);
  return (
    <article className="rounded-sm border border-[#D9E6F2] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#2E5C8A]">{student.name}</h3>
          <p className="text-sm text-[#6C757D]">{student.email}</p>
        </div>
        <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudent(student.id, setSelectedStudents)} aria-label={`${labels.select} ${student.name}`} />
      </div>
      <div className="mt-3 grid gap-2 text-sm">
        <InfoLine label={labels.chapter} value={student.chapter?.name || labels.unassigned} />
        <InfoLine label={labels.courses} value={student.enrollments.length ? student.enrollments.map((item) => courseName(student, item.course.slug, isAr)).join(", ") : labels.noCourses} />
        <InfoLine label={labels.lastActivity} value={lastActivity(student, labels.noActivity)} />
      </div>
      <div className="mt-3">
        <ProgressBar value={progress} />
        <p className="mt-1 text-xs text-[#6C757D]">{progress}% · {completedUnitText(student, isAr)}</p>
      </div>
    </article>
  );
}

function toggleStudent(id: number, setSelectedStudents: React.Dispatch<React.SetStateAction<number[]>>) {
  setSelectedStudents((prev) => prev.includes(id) ? prev.filter((studentId) => studentId !== id) : [...prev, id]);
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-[#F5F9FF] px-3 py-2">
      <span className="font-semibold text-[#2E5C8A]">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-[#DEE2E6]">
      <div className="h-3 rounded-full bg-[#2E5C8A]" style={{ width: `${value}%` }} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-[#D9E6F2] bg-white p-4">
      <div className="flex items-center gap-2 text-[#2E5C8A]">{icon}<span className="text-sm font-semibold">{label}</span></div>
      <p className="mt-2 text-2xl font-semibold text-[#212529]">{value}</p>
    </div>
  );
}
