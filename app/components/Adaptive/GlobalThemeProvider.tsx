'use client';

import { useEffect, useState } from 'react';
import { usePreferencesStore } from '../../../lib/store/usePreferencesStore';

export default function GlobalThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, loadPreferences, isLoaded } = usePreferencesStore();
  const [selectedText, setSelectedText] = useState('');
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const text = window.getSelection()?.toString().trim();
      if (text && text.length > 0) {
        setSelectedText(text);
        setShowPopup(true);
        // Position slightly above the mouse release
        setPopupPos({ x: e.clientX, y: e.clientY - 40 });
      } else {
        setShowPopup(false);
      }
    };

    const handleMouseDown = () => {
      if (showPopup) setShowPopup(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [showPopup]);

  const speakText = () => {
    if ('speechSynthesis' in window && selectedText) {
      window.speechSynthesis.cancel(); // stop any current speech
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
    setShowPopup(false);
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  const containerClasses = [
    preferences.dyslexicFont ? 'font-dyslexia' : 'font-sans',
    preferences.highContrastText ? 'contrast-125 saturate-150 bg-black text-white' : '',
    preferences.largeButtons ? 'scale-ui-105' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
      {showPopup && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            speakText();
          }}
          style={{ left: popupPos.x, top: popupPos.y }}
          className="fixed z-50 rounded-full bg-blue-600 px-3 py-1.5 text-sm shadow-lg text-white font-semibold transition-all hover:bg-blue-700"
        >
          🔊 استمع لل النص
        </button>
      )}
    </div>
  );
}
