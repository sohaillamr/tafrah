import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Cairo } from "next/font/google";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/LanguageProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ToastProvider } from "./components/Toast";
import ThemeRegistry from "../components/Adaptive/ThemeRegistry";
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
  const stored = cookieStore.get("tafrah_lang")?.value;
  const initialLanguage = stored === "en" || stored === "ar" ? stored : "ar";
  const htmlDir = initialLanguage === "ar" ? "rtl" : "ltr";  return (
    <html lang={initialLanguage} dir={htmlDir}>      <head>
        <script
          dangerouslySetInnerHTML={{
             __html: `
              try {
                const prefs = localStorage.getItem('uiPreferences');
                if (prefs) {
                  const p = JSON.parse(prefs);
                  if (p.theme) document.documentElement.setAttribute('data-theme', p.theme);
                  if (p.fontType) document.documentElement.setAttribute('data-font', p.fontType);
                  if (p.textDensity) document.documentElement.setAttribute('data-density', p.textDensity);
                  if (p.scale) document.documentElement.setAttribute('data-scale', p.scale);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>      <body className={cairo.className}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <AuthProvider>
            <ToastProvider>
              <ThemeRegistry>{children}</ThemeRegistry>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
