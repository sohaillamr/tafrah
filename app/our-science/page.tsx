'use client';

import { useThemeStore } from '../../lib/store/themeStore';
import TopBar from '../components/TopBar';
import { Settings, Shield, BookOpen, UserCheck, Activity } from 'lucide-react';

export default function OurScience() {
  const { profile, setProfile, toggleFocusMode, toggleDyslexicFont, toggleTTS, toggleReadingGuide } = useThemeStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopBar />
      <main className="max-w-4xl mx-auto py-12 px-6 space-y-12">
        
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[#2E5C8A] mb-4">The Science of Tafrah</h1>
          <p className="text-xl text-gray-600">Empowering neurodiversity through cognitive-aware engineering.</p>
        </section>

        {/* Section 1: The Why */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-[#2E5C8A]" size={32} />
            <h2 className="text-2xl font-bold text-gray-800">1. The Why: Cognitive Load & UI/UX</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every digital interaction consumes cognitive resources. For neurodivergent individuals, standard interfaces often overload working memory or trigger sensory sensitivities. 
            Tafrah&apos;s Adaptability Engine intercepts visual and structural data before it renders, tailoring the environment to distinct neurological profiles.
          </p>
        </section>

        {/* Section 2: Scientific Sources */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-[#2E5C8A]" size={32} />
            <h2 className="text-2xl font-bold text-gray-800">2. Scientific Sources & Standards</h2>
          </div>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <Shield className="shrink-0 text-green-600" />
              <div>
                <strong className="block text-lg">WCAG 2.1 (AA/AAA Standards)</strong>
                <span className="text-gray-600">The global benchmark for web accessibility, ensuring contrast ratios and keyboard navigability.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <UserCheck className="shrink-0 text-blue-600" />
              <div>
                <strong className="block text-lg">Universal Design for Learning (UDL)</strong>
                <span className="text-gray-600">Guidelines for flexible learning environments that offer multiple means of representation.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <Shield className="shrink-0 text-red-600" />
              <div>
                <strong className="block text-lg">Ministry of Social Solidarity (Egypt)</strong>
                <span className="text-gray-600">Alignment with the National Disability Strategy for employment and inclusion.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <BookOpen className="shrink-0 text-purple-600" />
              <div>
                <strong className="block text-lg">HCI Research</strong>
                <span className="text-gray-600">Applying recent studies on &quot;Sensory-Friendly Design for Autism&quot; and &quot;Motor-Input Filtering for CP.&quot;</span>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3: Interactive Demo */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-[#2E5C8A] border-l-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-[#2E5C8A]" size={32} />
            <h2 className="text-2xl font-bold text-gray-800">3. Interactive Sandbox Demo</h2>
          </div>
          <p className="mb-6 text-gray-600">Toggle the Adaptability Engine below to see how the UI transforms in real-time.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => setProfile('autism')}
              className={`p-4 rounded-lg font-bold border-2 transition-all ${profile === 'autism' ? 'border-[#2E5C8A] bg-blue-50 text-[#2E5C8A]' : 'border-gray-200'}`}
            >
              Autism (Sensory Mode)
            </button>
            <button 
              onClick={() => setProfile('cp')}
              className={`p-4 rounded-lg font-bold border-2 transition-all ${profile === 'cp' ? 'border-[#2E5C8A] bg-blue-50 text-[#2E5C8A]' : 'border-gray-200'}`}
            >
              Cerebral Palsy (Motor Mode)
            </button>
            <button 
              onClick={() => setProfile('ld')}
              className={`p-4 rounded-lg font-bold border-2 transition-all ${profile === 'ld' ? 'border-[#2E5C8A] bg-blue-50 text-[#2E5C8A]' : 'border-gray-200'}`}
            >
              Learning Disabilities (Cognitive Mode)
            </button>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
             <h3 className="font-bold text-lg mb-2">Granular Toggles</h3>
             <div className="flex flex-wrap gap-4">
                <button onClick={toggleFocusMode} className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">Toggle Focus Mode</button>
                <button onClick={toggleDyslexicFont} className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">Toggle OpenDyslexic Info</button>
                <button onClick={toggleTTS} className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">Toggle Text-to-Speech</button>
                <button onClick={toggleReadingGuide} className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">Toggle Reading Guide</button>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}