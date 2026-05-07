import { create } from 'zustand';

type Profile = 'default' | 'autism' | 'cp' | 'ld';

interface ThemeState {
  profile: Profile;
  focusMode: boolean;
  dyslexicFont: boolean;
  ttsEnabled: boolean;
  readingGuide: boolean;
  hasCompletedOnboarding: boolean;
  setProfile: (profile: Profile) => void;
  toggleFocusMode: () => void;
  toggleDyslexicFont: () => void;
  toggleTTS: () => void;
  toggleReadingGuide: () => void;
  setPreferences: (prefs: Partial<ThemeState>) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  profile: 'default',
  focusMode: false,
  dyslexicFont: false,
  ttsEnabled: false,
  readingGuide: false,
  hasCompletedOnboarding: false,
  setProfile: (profile) => set({ profile }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  toggleDyslexicFont: () => set((state) => ({ dyslexicFont: !state.dyslexicFont })),
  toggleTTS: () => set((state) => ({ ttsEnabled: !state.ttsEnabled })),
  toggleReadingGuide: () => set((state) => ({ readingGuide: !state.readingGuide })),
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs, hasCompletedOnboarding: true })),
}));