"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const isAr = language === "ar";
  const isCenter = user?.role === "center_admin";
  const labels = isAr
    ? {
        home: "الرئيسية",
        courses: "الدورات",
        science: "منهجيتنا",
        assistant: "نور",
        login: "تسجيل الدخول",
        join: "ابدأ",
        menu: "القائمة",
        navLabel: "التنقل الرئيسي",
        logoAlt: "شعار طفرة",
        ar: "العربية",
        en: "English",
        dashboard: "لوحة التحكم",
        logoutLabel: "خروج",
      }
    : {
        home: "Home",
        courses: "Courses",
        science: "Methodology",
        assistant: "Nour",
        login: "Login",
        join: "Start",
        menu: "Menu",
        navLabel: "Main navigation",
        logoAlt: "Tafrah logo",
        ar: "Arabic",
        en: "English",
        dashboard: "Dashboard",
        logoutLabel: "Logout",
      };

  const dashboardHref = user?.role === "admin" ? "/admin" : isCenter ? "/dashboard/center" : "/dashboard";

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[#DEE2E6] bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-[#2E5C8A] md:flex-row md:items-center md:justify-between" aria-label={labels.navLabel}>
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt={labels.logoAlt} width={48} height={48} priority />
          </Link>
          <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="min-h-12 rounded-sm border border-[#DEE2E6] px-4 md:hidden" aria-expanded={isOpen} aria-controls="mobile-nav-list">
            {labels.menu}
          </button>
        </div>
        <ul id="mobile-nav-list" className={`flex flex-col gap-3 md:flex md:flex-row md:items-center md:gap-6 ${isOpen ? "flex" : "hidden"}`}>
          <li><Link href="/" className="inline-flex min-h-12 items-center">{labels.home}</Link></li>
          {!isCenter ? <li><Link href="/courses" className="inline-flex min-h-12 items-center">{labels.courses}</Link></li> : null}
          <li><Link href="/methodology" className="inline-flex min-h-12 items-center">{labels.science}</Link></li>
          {!isCenter ? <li><Link href="/assistant" className="inline-flex min-h-12 items-center">{labels.assistant}</Link></li> : null}
          {user ? (
            <>
              <li><Link href={dashboardHref} className="inline-flex min-h-12 items-center">{labels.dashboard}</Link></li>
              <li className="flex items-center gap-2">
                <span className="text-sm text-[#212529]">{user.name}</span>
                <button type="button" onClick={handleLogout} className="inline-flex min-h-12 items-center text-[#DC3545]">{labels.logoutLabel}</button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/auth/login" className="inline-flex min-h-12 items-center">{labels.login}</Link></li>
              <li><Link href="/auth/select" className="inline-flex min-h-12 items-center rounded-sm bg-[#2E5C8A] px-4 text-white">{labels.join}</Link></li>
            </>
          )}
          <li>
            <select value={language} onChange={(event) => setLanguage(event.target.value === "en" ? "en" : "ar")} className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-3">
              <option value="ar">{labels.ar}</option>
              <option value="en">{labels.en}</option>
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
}
