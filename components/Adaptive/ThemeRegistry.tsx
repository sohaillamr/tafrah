'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '../../lib/store/themeStore';
import { Volume2 } from 'lucide-react';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { profile, focusMode, dyslexicFont, ttsEnabled, readingGuide, setProfile } = useThemeStore();
  const [cursorY, setCursorY] = useState(0);

  // Initialize from localStorage if exists
  useEffect(() => {
    const savedPrefs = localStorage.getItem('uiPreferences');
    if (savedPrefs) {
      try {
        const p = JSON.parse(savedPrefs);
        if (p.disabilityType === 'AUTISM') setProfile('autism');
        else if (p.disabilityType === 'CP') setProfile('cp');
        else if (p.disabilityType === 'LEARNING_DIS') setProfile('ld');
      } catch (e) {}
    }
  }, [setProfile]);

  useEffect(() => {
    document.documentElement.setAttribute('data-profile', profile);
    if (dyslexicFont) {
      document.documentElement.setAttribute('data-font', 'dyslexia');
    } else {
      document.documentElement.removeAttribute('data-font');
    }
  }, [profile, dyslexicFont]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (readingGuide) setCursorY(e.clientY);
    };
    if (readingGuide) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // TTS Global Handler
  const handleTTS = () => {
    const text = window.getSelection()?.toString() || document.body.innerText;
    if (text && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text.slice(0, 200)); // limit for demo
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className={`theme-wrapper ${focusMode ? 'focus-mode' : ''} ${profile}`}>
      {readingGuide && (
        <div
          className="pointer-events-none fixed left-0 w-full h-8 bg-yellow-200 opacity-30 z-50 transition-transform duration-75"
          style={{ top: cursorY - 16 }}
        />
      )}
      
      {ttsEnabled && (
        <button
          onClick={handleTTS}
          className="fixed top-24 right-4 bg-[#2E5C8A] text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          aria-label="Read text aloud"
        >
          <Volume2 size={24} />
          <span className="sr-only">Read Aloud</span>
        </button>
      )}

      <div className={`app-container ${profile === 'autism' ? 'px-[10%]' : ''}`}>
        {children}
      </div>

      {profile === 'cp' && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-t-lg z-50 flex justify-around border-t-4 border-[#2E5C8A]">
          <button className="h-16 px-6 font-bold bg-[#E9EFF5] text-[#2E5C8A] rounded-lg">Back</button>
          <button className="h-16 px-6 font-bold bg-[#2E5C8A] text-white rounded-lg">Home</button>
          <button className="h-16 px-6 font-bold bg-[#E9EFF5] text-[#2E5C8A] rounded-lg">Up</button>
        </div>
      )}
    </div>
  );
}