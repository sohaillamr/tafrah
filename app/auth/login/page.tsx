"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const labels = isAr
    ? {
        home: "الرئيسية",
        title: "تسجيل الدخول إلى طفرة",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        submit: "دخول",
        error: "البريد أو كلمة المرور غير صحيحة.",
        noAccount: "ليس لديك حساب؟",
        signupUser: "إنشاء حساب فردي",
        signupCenter: "إنشاء حساب مركز",
        recovery: "نسيت كلمة المرور؟",
        logoAlt: "شعار طفرة",
        showPassword: "إظهار كلمة المرور",
        hidePassword: "إخفاء كلمة المرور",
      }
    : {
        home: "Home",
        title: "Sign in to Tafrah",
        email: "Email",
        password: "Password",
        submit: "Sign in",
        error: "Email or password is incorrect.",
        noAccount: "Don't have an account?",
        signupUser: "Create an individual account",
        signupCenter: "Create a center account",
        recovery: "Forgot password?",
        logoAlt: "Tafrah logo",
        showPassword: "Show password",
        hidePassword: "Hide password",
      };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error || !result.user) {
      setError(result.error || labels.error);
      return;
    }
    const redirect = searchParams.get("redirect");
    if (redirect?.startsWith("/") && !redirect.includes("/_next/data/")) {
      window.location.href = redirect;
      return;
    }
    if (result.user.role === "admin") window.location.href = "/admin";
    else if (result.user.role === "center_admin") window.location.href = "/dashboard/center";
    else window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.submit }]} />
        <section className="flex flex-col items-center gap-4 text-center">
          <Image src="/logo.png" alt={labels.logoAlt} width={140} height={140} priority />
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">{labels.title}</h1>
        </section>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            {labels.email}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4" />
          </label>
          <label className="flex flex-col gap-2">
            {labels.password}
            <div className="flex items-center rounded-sm border border-[#DEE2E6] bg-white px-2">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full bg-transparent px-2" />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="min-h-12 px-2" aria-label={showPassword ? labels.hidePassword : labels.showPassword}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>
          {error ? <p className="rounded-sm border border-[#FF9800] bg-[#FFF3E0] p-3">{error}</p> : null}
          <button type="submit" disabled={loading} className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white disabled:opacity-50">
            {loading ? "..." : labels.submit}
          </button>
        </form>
        <section className="flex flex-col gap-2">
          <p>{labels.noAccount}</p>
          <Link href="/auth/user-signup" className="min-h-12 inline-flex items-center">{labels.signupUser}</Link>
          <Link href="/auth/center-signup" className="min-h-12 inline-flex items-center">{labels.signupCenter}</Link>
          <Link href="/auth/recovery" className="min-h-12 inline-flex items-center">{labels.recovery}</Link>
        </section>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-12">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
