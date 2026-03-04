"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          courses: "الدورات",
          jobs: "فرص العمل",
          assistant: "المساعد الذكي",
          login: "تسجيل الدخول",
          menu: "القائمة",
          navLabel: "التنقل الرئيسي",
          logoAlt: "شعار طفرة",
          ar: "العربية",
          en: "English",
          dashboard: "لوحة التحكم",
          logoutLabel: "تسجيل الخروج",
        }
      : {
          home: "Home",
          courses: "Courses",
          jobs: "Jobs",
          assistant: "Assistant",
          login: "Login",
          menu: "Menu",
          navLabel: "Main navigation",
          logoAlt: "Tafrah logo",
          ar: "Arabic",
          en: "English",
          dashboard: "Dashboard",
          logoutLabel: "Logout",
        };

  const dashboardHref = user?.role === "admin" ? "/admin" : user?.role === "hr" ? "/dashboard/hr" : "/dashboard/student";

  return (
    <header className="sticky top-0 z-10 border-b border-[#DEE2E6] bg-white">
      <nav
        className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-[#2E5C8A] md:flex-row md:items-center md:justify-between"
        aria-label={labels.navLabel}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt={labels.logoAlt}
              width={48}
              height={48}
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="min-h-12 rounded-sm border border-[#DEE2E6] px-4 text-[#2E5C8A] md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-list"
          >
            {labels.menu}
          </button>
        </div>
        <ul
          id="mobile-nav-list"
          className={`flex flex-col gap-3 text-[#2E5C8A] md:flex md:flex-row md:items-center md:gap-6 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <li>
            <Link href="/" className="min-h-12 inline-flex items-center">
              {labels.home}
            </Link>
          </li>
          <li>
            <Link href="/courses" className="min-h-12 inline-flex items-center">
              {labels.courses}
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="min-h-12 inline-flex items-center">
              {labels.jobs}
            </Link>
          </li>
          <li>
            <Link href="/assistant" className="min-h-12 inline-flex items-center">
              {labels.assistant}
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href={dashboardHref} className="min-h-12 inline-flex items-center">
                  {labels.dashboard}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm text-[#212529]">{user.name}</span>
                <button type="button" onClick={() => { logout(); window.location.href = "/"; }} className="min-h-12 inline-flex items-center text-[#DC3545]">
                  {labels.logoutLabel}
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/login" className="min-h-12 inline-flex items-center">
                {labels.login}
              </Link>
            </li>
          )}
          <li className="flex items-center gap-2">
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value === "en" ? "en" : "ar")
              }
              className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-3"
            >
              <option value="ar">{labels.ar}</option>
              <option value="en">{labels.en}</option>
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
}
