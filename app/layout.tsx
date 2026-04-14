import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "طفرة | Tafrah",
    template: "%s | طفرة",
  },
  description: "منصة طفرة: بيئة عمل وتدريب متخصصة لذوي التوحد. Tafrah: A specialised work & training platform for individuals with autism.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("tafrah_token")?.value;
  
  if (token) {
    const session = await getSession();
    if (!session) {
      redirect("/api/auth/logout");
    }
  }

  const stored = cookieStore.get("tafrah_lang")?.value;
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
