'use client';

import { useThemeStore } from '../../lib/store/themeStore';
import TopBar from '../components/TopBar';
import { BookOpen, User, CalendarDays } from 'lucide-react';

export default function UnifiedDashboard() {
  const { profile, focusMode } = useThemeStore();

  return (
    <div className={`min-h-screen bg-[#F5F9FF] ${focusMode ? 'focus-mode' : ''} ${profile}`}>
      <TopBar />
      <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        {!focusMode && (
          <aside className="md:col-span-1 hidden md:block">
            <nav className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <a href="#" className="flex gap-4 items-center font-bold text-[#2E5C8A] p-4 bg-[#E9EFF5] rounded-xl"><User /> Profile</a>
              <a href="#" className="flex gap-4 items-center text-gray-600 p-4 hover:bg-gray-50 rounded-xl"><BookOpen /> Courses</a>
              <a href="#" className="flex gap-4 items-center text-gray-600 p-4 hover:bg-gray-50 rounded-xl"><CalendarDays /> Schedule</a>
            </nav>
          </aside>
        )}

        <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${focusMode ? 'md:col-span-4' : 'md:col-span-3'}`}>
          <h1 className="text-4xl font-bold mb-6 text-[#2E5C8A]">Welcome, Student</h1>
          <p className="text-xl text-gray-600 mb-8 border-b pb-8">
            Your personalized learning hub is ready. The environment has been adjusted based on the initial Discovery Test for a streamlined experience.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-6 rounded-xl hover:border-[#2E5C8A] transition-colors cursor-[pointer]">
              <h2 className="text-2xl font-bold mb-4 font-dyslexic">Introduction to Front-End</h2>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[45%]" />
              </div>
              <p className="mt-4 text-sm text-gray-500">Resume Unit 2</p>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-xl hover:border-[#2E5C8A] transition-colors cursor-pointer">
              <h2 className="text-2xl font-bold mb-4 font-dyslexic">Quality Assurance Basics</h2>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[10%]" />
              </div>
              <p className="mt-4 text-sm text-gray-500">Start Unit 1</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}