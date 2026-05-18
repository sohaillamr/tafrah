"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const labels = isAr
    ? {
        home: "الرئيسية",
        about: "عن طفرة",
        methodology: "منهجيتنا",
        privacy: "الخصوصية",
        contact: "اتصل بنا",
        note: "التوحد متاح الآن. دعم CP و LD ضمن خارطة الطريق.",
        footerText: "طفرة 2026 - منصة تعلم تكيفية للأشخاص على طيف التوحد.",
        facebook: "فيسبوك",
        instagram: "إنستجرام",
        x: "X",
        linkedin: "لينكدإن",
      }
    : {
        home: "Home",
        about: "About",
        methodology: "Methodology",
        privacy: "Privacy",
        contact: "Contact",
        note: "Autism support is live. CP and LD support are in the roadmap.",
        footerText: "Tafrah 2026 - Adaptive learning for autistic learners.",
        facebook: "Facebook",
        instagram: "Instagram",
        x: "X",
        linkedin: "LinkedIn",
      };

  return (
    <footer className="border-t border-[#D9E6F2] bg-[#F5F9FF]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-[#212529] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div>{labels.footerText}</div>
          <div className="text-sm text-[#2E5C8A]">{labels.note}</div>
        </div>
        <nav className="flex flex-wrap items-center gap-5">
          <Link href="/" className="min-h-12 inline-flex items-center">{labels.home}</Link>
          <Link href="/about" className="min-h-12 inline-flex items-center">{labels.about}</Link>
          <Link href="/methodology" className="min-h-12 inline-flex items-center">{labels.methodology}</Link>
          <Link href="/privacy" className="min-h-12 inline-flex items-center">{labels.privacy}</Link>
          <Link href="/contact" className="min-h-12 inline-flex items-center">{labels.contact}</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          {[
            ["https://facebook.com/tafrah", labels.facebook, Facebook],
            ["https://instagram.com/tafrah", labels.instagram, Instagram],
            ["https://x.com/tafrah", labels.x, Twitter],
            ["https://linkedin.com/company/tafrah", labels.linkedin, Linkedin],
          ].map(([href, label, Icon]: any) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-12 w-12 items-center justify-center">
              <Icon size={20} className="text-[#2E5C8A]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
