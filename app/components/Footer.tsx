"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          about: "عن طفرة",
          privacy: "سياسة الخصوصية",
          contact: "اتصل بنا",
          note: "نسخة تجريبية - هذا هو الإصدار الخامس",
          footerText: "طفرة ٢٠٢٦ - صنع في مصر لدعم عقول استثنائية.",
          facebook: "فيسبوك",
          instagram: "إنستجرام",
          x: "X",
          linkedin: "لينكدإن",
        }
      : {
          home: "Home",
          about: "About Tafrah",
          privacy: "Privacy Policy",
          contact: "Contact Us",
          note: "Beta - this is the 5th version",
          footerText: "Tafrah 2026 - Made in Egypt to support exceptional minds.",
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
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="min-h-12 inline-flex items-center">
            {labels.home}
          </Link>
          <Link href="/about" className="min-h-12 inline-flex items-center">
            {labels.about}
          </Link>
          <Link href="/privacy" className="min-h-12 inline-flex items-center">
            {labels.privacy}
          </Link>
          <Link href="/contact" className="min-h-12 inline-flex items-center">
            {labels.contact}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://facebook.com/tafrah"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.facebook}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <Facebook size={20} className="text-[#2E5C8A]" />
          </a>
          <a
            href="https://instagram.com/tafrah"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.instagram}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <Instagram size={20} className="text-[#2E5C8A]" />
          </a>
          <a
            href="https://x.com/tafrah"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.x}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <Twitter size={20} className="text-[#2E5C8A]" />
          </a>
          <a
            href="https://linkedin.com/company/tafrah"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.linkedin}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <Linkedin size={20} className="text-[#2E5C8A]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
