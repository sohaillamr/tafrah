"use client";

import { Facebook, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const labels = isAr
    ? {
        brand: "طفرة",
        tagline: "تعلم هادئ، تدريب عملي، ودعم واضح للمتعلمين ذوي الاختلافات العصبية.",
        note: "التوحد متاح الآن. دعم CP و LD ضمن خارطة الطريق.",
        home: "الرئيسية",
        courses: "الدورات",
        methodology: "منهجيتنا",
        privacy: "الخصوصية",
        contact: "اتصل بنا",
        official: "روابط مهمة",
        location: "القاهرة، مصر",
        email: "hello@tafrah.org",
        facebook: "فيسبوك",
        instagram: "إنستجرام",
        x: "X",
        linkedin: "لينكدإن",
        copyright: "طفرة 2026. منصة تعلم تكيفية.",
      }
    : {
        brand: "Tafrah",
        tagline: "Calm learning, practical training, and clear support for neurodivergent learners.",
        note: "Autism support is live. CP and LD support are in the roadmap.",
        home: "Home",
        courses: "Courses",
        methodology: "Methodology",
        privacy: "Privacy",
        contact: "Contact",
        official: "Useful links",
        location: "Cairo, Egypt",
        email: "hello@tafrah.org",
        facebook: "Facebook",
        instagram: "Instagram",
        x: "X",
        linkedin: "LinkedIn",
        copyright: "Tafrah 2026. Adaptive learning platform.",
      };

  const links = [
    ["/", labels.home],
    ["/courses", labels.courses],
    ["/methodology", labels.methodology],
    ["/privacy", labels.privacy],
    ["/contact", labels.contact],
  ];

  return (
    <footer className="border-t border-[#D9E6F2] bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 text-[#212529] md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image src="/logo.png" alt={labels.brand} width={44} height={44} className="h-11 w-11 rounded-sm bg-white/90 object-contain p-1" />
          </Link>
          <p className="max-w-md leading-relaxed text-[#495057]">{labels.tagline}</p>
          <p className="text-sm font-semibold text-[#2E5C8A]">{labels.note}</p>
        </div>

        <nav className="flex flex-col gap-2" aria-label={labels.official}>
          <h2 className="text-sm font-bold text-[#2E5C8A]">{labels.official}</h2>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="min-h-10 w-fit text-sm text-[#495057] hover:text-[#2E5C8A]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-[#495057]">
            <MapPin size={16} className="text-[#2E5C8A]" />
            {labels.location}
          </div>
          <a href={`mailto:${labels.email}`} className="flex min-h-10 w-fit items-center gap-2 text-sm text-[#495057] hover:text-[#2E5C8A]">
            <Mail size={16} className="text-[#2E5C8A]" />
            {labels.email}
          </a>
          <div className="flex flex-wrap items-center gap-2">
            {[
              ["https://facebook.com/tafrah", labels.facebook, Facebook],
              ["https://instagram.com/tafrah", labels.instagram, Instagram],
              ["https://x.com/tafrah", labels.x, Twitter],
              ["https://linkedin.com/company/tafrah", labels.linkedin, Linkedin],
            ].map(([href, label, Icon]: any) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#D9E6F2] text-[#2E5C8A] hover:bg-[#F5F9FF]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-xs text-[#6C757D]">{labels.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
