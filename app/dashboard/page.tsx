'use client';

import { useThemeStore } from '../../lib/store/themeStore';
import { usePreferencesStore } from '../../lib/store/usePreferencesStore';
import TopBar from '../components/TopBar';
import { BookOpen, User, CalendarDays } from 'lucide-react';
import { useLanguage } from '../components/LanguageProvider';
import { useEffect, useState } from 'react';

export default function UnifiedDashboard() {
  const { profile, focusMode } = useThemeStore();
  const { preferences, category } = usePreferencesStore();
  const { language } = useLanguage();
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUserName(data.user.name);
      })
      .catch(console.error);
  }, []);

  const labels = language === 'ar' ? {
    profile: "الملف الشخصي",
    courses: "الدورات",
    schedule: "الجدول الزمني",
    welcome: `مرحبًا، ${userName}`,
    intro: "مركز التعلم المخصص الخاص بك جاهز. تم تعديل البيئة بناءً على اختبار الاكتشاف الأولي الخاص بك لتجربة سلسة وملائمة.",
    frontend: "مقدمة في تطوير واجهات الويب",
    qa: "أساسيات ضمان الجودة",
    resume: "متابعة الوحدة 2",
    start: "ابدأ الوحدة 1"
  } : {
    profile: "Profile",
    courses: "Courses",
    schedule: "Schedule",
    welcome: `Welcome, ${userName}`,
    intro: "Your personalized learning hub is ready. The environment has been adjusted based on the initial Discovery Test for a streamlined experience.",
    frontend: "Introduction to Front-End",
    qa: "Quality Assurance Basics",
    resume: "Resume Unit 2",
    start: "Start Unit 1"
  };

  return (
    <div className={`min-h-screen bg-[#F5F9FF] ${focusMode ? 'focus-mode' : ''} ${profile}`}>
      <TopBar />
      <main className={`max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8 ${preferences.dyslexicFont ? 'font-dyslexia' : ''} ${preferences.largeButtons ? 'scale-ui-105' : ''}`}>
        
        {/* Sidebar */}
        {!focusMode && (
          <aside className="md:col-span-1 hidden md:block">
            <nav className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <a href="#" className="flex gap-4 items-center font-bold text-[#2E5C8A] p-4 bg-[#E9EFF5] rounded-xl"><User /> {labels.profile}</a>
              <a href="#" className="flex gap-4 items-center text-gray-600 p-4 hover:bg-gray-50 rounded-xl"><BookOpen /> {labels.courses}</a>
              <a href="#" className="flex gap-4 items-center text-gray-600 p-4 hover:bg-gray-50 rounded-xl"><CalendarDays /> {labels.schedule}</a>
            </nav>
          </aside>
        )}

        <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${focusMode ? 'md:col-span-4' : 'md:col-span-3'} ${preferences.highContrastText ? 'contrast-125 saturate-150 bg-black text-white border-white' : ''}`}>
          <h1 className={`text-4xl font-bold mb-6 ${preferences.highContrastText ? 'text-yellow-300' : 'text-[#2E5C8A]'}`}>{labels.welcome}</h1>
          <p className={`text-xl mb-8 border-b pb-8 ${preferences.highContrastText ? 'text-white border-gray-700' : 'text-gray-600'}`}>
            {labels.intro}
            {category && category !== 'NONE' && (
              <span className="block mt-2 font-bold text-teal-600">
                {language === 'ar' ? `النمط النشط: ${category}` : `Active Mode: ${category}`}
              </span>
            )}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`border p-6 rounded-xl transition-colors cursor-[pointer] ${preferences.highContrastText ? 'border-gray-700 hover:border-yellow-300' : 'border-gray-200 hover:border-[#2E5C8A]'}`}>
              <h2 className="text-2xl font-bold mb-4">{labels.frontend}</h2>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[45%]" />
              </div>
              <p className={`mt-4 text-sm ${preferences.highContrastText ? 'text-gray-300' : 'text-gray-500'}`}>{labels.resume}</p>
            </div>

            <div className={`border p-6 rounded-xl transition-colors cursor-pointer ${preferences.highContrastText ? 'border-gray-700 hover:border-yellow-300' : 'border-gray-200 hover:border-[#2E5C8A]'}`}>
              <h2 className="text-2xl font-bold mb-4">{labels.qa}</h2>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[10%]" />
              </div>
              <p className={`mt-4 text-sm ${preferences.highContrastText ? 'text-gray-300' : 'text-gray-500'}`}>{labels.start}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}