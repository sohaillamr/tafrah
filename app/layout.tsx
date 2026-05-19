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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tafrah-project.vercel.app"),
  title: {
    default: "طفرة | Tafrah",
    template: "%s | طفرة",
  },
  description:
    "منصة طفرة: بيئة تعلم وتدريب تكيفية للأشخاص على طيف التوحد. Tafrah: an adaptive learning platform for autistic learners.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "طفرة | Tafrah",
    description: "Calm adaptive learning and practical training for neurodivergent learners.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Tafrah" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const stored = cookieStore.get("tafrah_lang")?.value;
  const initialLanguage = stored === "en" || stored === "ar" ? stored : "ar";
  const htmlDir = initialLanguage === "ar" ? "rtl" : "ltr";

  return (
    <html lang={initialLanguage} dir={htmlDir}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const prefs = localStorage.getItem('uiPreferences');
                if (prefs) {
                  const p = JSON.parse(prefs);
                  const highContrast = Boolean(p.highContrastText || p.highContrast);
                  const attrs = p.computedAttrs || {
                    'data-profile': 'autism',
                    'data-theme': highContrast ? 'high-contrast' : p.mutedColors ? 'muted' : 'pastel',
                    'data-density': (p.simplifiedText || p.extraSpacing || p.density === 'spaced') ? 'spaced' : 'normal',
                    'data-scale': (p.largeText || p.scale === 'large' || p.scale === 'giant') ? 'large' : 'normal',
                    'data-focus-mode': p.focusMode ? 'true' : 'false',
                    'data-reduce-sound': p.reduceSound ? 'true' : 'false',
                    'data-reduce-motion': p.reduceMotion ? 'true' : 'false',
                    'data-font': p.dyslexicFont ? 'dyslexia' : 'default',
                    'data-large-targets': p.largeTargets ? 'true' : 'false'
                  };
                  Object.keys(attrs).forEach((key) => document.documentElement.setAttribute(key, attrs[key]));
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={cairo.className}>
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
