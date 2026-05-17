'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '../../../lib/store/usePreferencesStore';

export default function GlobalThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, loadPreferences, isLoaded } = usePreferencesStore();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  if (!isLoaded) {
    // Optionally return null or a loader to prevent flashes of unstyled content
    return <>{children}</>;
  }

  // Derive class names from preferences
  const containerClasses = [
    preferences.dyslexicFont ? 'font-dyslexia' : 'font-sans',
    preferences.highContrastText ? 'contrast-125 saturate-150 bg-black text-white' : '',
    preferences.largeButtons ? 'scale-ui-105' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
