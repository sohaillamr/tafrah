"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";
import TopBar from "../../components/TopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLanguage } from "../../components/LanguageProvider";
import { useAuth } from "../../components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          title: "تسجيل الدخول إلى حسابك في طفرة",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
          error: "البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.",
          submit: "دخول",
          noAccount: "ليس لديك حساب؟",
          signupUser: "إنشاء حساب كمتدرب",
          signupCompany: "إنشاء حساب كشركة",
          recovery: "نسيت كلمة المرور؟",
          logoAlt: "شعار طفرة",
          showPassword: "إظهار كلمة المرور",
          hidePassword: "إخفاء كلمة المرور",
        }
      : {
          home: "Home",
          title: "Sign in to your Tafrah account",
          email: "Email",
          password: "Password",
          error: "Email or password is incorrect. Try again.",
          submit: "Sign in",
          noAccount: "Don't have an account?",
          signupUser: "Create a trainee account",
          signupCompany: "Create a company account",
          recovery: "Forgot password?",
          logoAlt: "Tafrah logo",
          showPassword: "Show password",
          hidePassword: "Hide password",
        };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setHasError(true);
      setErrorMsg(labels.error);
      return;
    }
    setHasError(false);
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.error) {
        setHasError(true);
        setErrorMsg(result.error);
        setIsLoading(false);
        return;
      }
      
      let redirectDest = searchParams.get("redirect");
      // Clean up _next/data RSC fetches that the Next.js router struggles with
      if (redirectDest?.includes("/_next/data/")) {
        // e.g. /_next/data/buildId/assistant.json -> /assistant
        const match = redirectDest.match(/\/_next\/data\/[^/]+(.*)\.json/);
        if (match && match[1]) {
          redirectDest = match[1];
        } else {
          redirectDest = null;
        }
      }

      if (redirectDest?.startsWith("/")) {
        router.push(redirectDest);
        return;
      }

      const role = result.user?.role;
      if (role === "admin") router.push("/admin");
      else if (role === "hr") router.push("/dashboard/hr");
      else router.push("/dashboard/student");
    } catch {
      setHasError(true);
      setErrorMsg(labels.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.submit },
          ]}
        />

        <section className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/logo.png"
            alt={labels.logoAlt}
            width={140}
            height={140}
            priority
          />
          <h1 className="font-semibold">{labels.title}</h1>
        </section>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            {labels.email}
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
              aria-label={labels.email}
            />
          </label>
          <label className="flex flex-col gap-2">
            {labels.password}
            <div className="flex items-center rounded-sm border border-[#DEE2E6] bg-white px-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full bg-transparent px-2"
                aria-label={labels.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="min-h-12 px-2"
                aria-label={showPassword ? labels.hidePassword : labels.showPassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>
          {hasError ? (
            <div className="rounded-sm border border-[#FF9800] bg-[#FF9800] p-4 text-white">
              {errorMsg || labels.error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
          >
            {isLoading ? "..." : labels.submit}
          </button>
        </form>

        <section className="flex flex-col gap-3">
          <p>{labels.noAccount}</p>
          <div className="flex flex-col gap-2">
            <Link href="/auth/quiz" className="min-h-12 inline-flex items-center">
              {labels.signupUser}
            </Link>
            <Link href="/auth/hr-signup" className="min-h-12 inline-flex items-center">
              {labels.signupCompany}
            </Link>
            <Link href="/auth/recovery" className="min-h-12 inline-flex items-center">
              {labels.recovery}
            </Link>
          </div>
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
