import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo } from "next/font/google";
import BetaNote from "./components/BetaNote";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/LanguageProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ToastProvider } from "./components/Toast";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "طفرة",
  description: "منصة طفرة: بيئة عمل وتدريب متخصصة لذوي التوحد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stored = cookies().get("tafrah_lang")?.value;
  const initialLanguage = stored === "en" || stored === "ar" ? stored : "ar";
  const htmlDir = initialLanguage === "ar" ? "rtl" : "ltr";
  return (
    <html lang={initialLanguage} dir={htmlDir}>
      <body className={cairo.className}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <AuthProvider>
            <ToastProvider>
              <BetaNote />
              {children}
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
