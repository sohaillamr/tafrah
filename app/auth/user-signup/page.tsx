"use client";

import { useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

export default function UserSignupPage() {
  const { language } = useLanguage();
  const { signup } = useAuth();
  const isAr = language === "ar";
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const labels = isAr
    ? {
        home: "الرئيسية",
        portal: "التسجيل",
        title: "إنشاء حساب فردي",
        intro: "بعد إنشاء الحساب ستظهر أسئلة قصيرة لفهم حالتك، ثم معالج تفضيلات لتخصيص المنصة.",
        name: "الاسم",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        submit: "إنشاء الحساب والمتابعة",
        login: "لديك حساب؟ تسجيل الدخول",
      }
    : {
        home: "Home",
        portal: "Signup",
        title: "Create an individual account",
        intro: "After signup, you will answer a short survey, then choose preferences so Tafrah can adapt to you.",
        name: "Name",
        phone: "Phone",
        email: "Email",
        password: "Password",
        submit: "Create account and continue",
        login: "Already have an account? Login",
      };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || form.password.length < 6) {
      setError(isAr ? "أكمل البيانات. كلمة المرور 6 أحرف على الأقل." : "Complete all fields. Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const result = await signup({ ...form, role: "student" });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.href = "/auth/quiz";
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.portal, href: "/auth/select" }, { label: labels.title }]} />
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
          <p className="text-[#495057]">{labels.intro}</p>
        </section>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {[
            ["name", labels.name, "text"],
            ["phone", labels.phone, "tel"],
            ["email", labels.email, "email"],
            ["password", labels.password, "password"],
          ].map(([key, label, type]) => (
            <label key={key} className="flex flex-col gap-2">
              {label}
              <input
                type={type}
                value={(form as any)[key]}
                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                required
              />
            </label>
          ))}
          {error ? <p className="rounded-sm border border-[#FF9800] bg-[#FFF3E0] p-3">{error}</p> : null}
          <button type="submit" disabled={loading} className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white disabled:opacity-60">
            {loading ? "..." : labels.submit}
          </button>
        </form>
        <Link href="/auth/login" className="min-h-12 inline-flex items-center">{labels.login}</Link>
      </main>
    </div>
  );
}
