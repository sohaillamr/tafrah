'use client';

import { useEffect, useState } from 'react';
import { usePreferencesStore } from '../../lib/store/usePreferencesStore';
import { Volume2 } from 'lucide-react';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { preferences, category, isLoaded, loadPreferences } = usePreferencesStore();
  const [cursorY, setCursorY] = useState(0);

  // Initialize from API when wrapping the app
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-profile', category);
      if (preferences?.dyslexicFont) {
        document.documentElement.setAttribute('data-font', 'dyslexia');
      } else {
        document.documentElement.removeAttribute('data-font');
      }
    }
  }, [category, preferences, isLoaded]);

  // Derive class names from preferences mapping globally to the children wrapper
  const containerClasses = [
    'theme-wrapper',
    preferences?.dyslexicFont ? 'font-dyslexia' : '',
    preferences?.highContrastText ? 'contrast-125 saturate-150' : '',
    preferences?.simplifiedText ? 'simplified-mode' : '', // Might target specific text blocks later
  ].filter(Boolean).join(' ');

  const appContainerClasses = [
    'app-container min-h-screen',
    category === 'AUTISM' ? 'px-[5%]' : '', // Slightly constrain width to avoid overwhelming visuals
    preferences?.largeButtons ? 'scale-ui-105' : '' // Global scaling logic mapping to a tailwind or css custom hook later
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={appContainerClasses}>
        {children}
      </div>

      {preferences?.soundNotifications && (
        <button
          onClick={() => {
            const text = window.getSelection()?.toString() || document.body.innerText;
            if (text && 'speechSynthesis' in window) {
              const msg = new SpeechSynthesisUtterance(text.slice(0, 200));
              window.speechSynthesis.speak(msg);
            }
          }}
          className="fixed top-24 right-4 bg-[#2E5C8A] text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2 scale-125"
          aria-label="Read text aloud"
        >
          <Volume2 size={24} />
        </button>
      )}

      {category === 'CP' && preferences?.largeButtons && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-top z-50 flex justify-around border-t-4 border-[#2E5C8A]">
          <button className="h-20 w-32 font-bold bg-[#E9EFF5] text-[#2E5C8A] rounded-xl text-xl hover:bg-gray-200" onClick={() => window.history.back()}>Back</button>
          <button className="h-20 w-32 font-bold bg-[#2E5C8A] text-white rounded-xl text-xl hover:bg-[#1a3d5e]" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top</button>
        </div>
      )}
    </div>
  );
}
