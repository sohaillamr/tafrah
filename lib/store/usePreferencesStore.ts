import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SensoryPreferences {
  motionEnabled: boolean;
  highContrast: boolean;
  lineSpacing: 'standard' | 'wide';
  saturationLevel: 'standard' | 'muted' | 'grayscale';
  isFocusMode: boolean;
  setMotion: (val: boolean) => void;
  setContrast: (val: boolean) => void;
  setLineSpacing: (val: 'standard' | 'wide') => void;
  setSaturation: (val: 'standard' | 'muted' | 'grayscale') => void;
  toggleFocusMode: () => void;
}

export const usePreferencesStore = create<SensoryPreferences>()(
  persist(
    (set) => ({
      motionEnabled: true,
      highContrast: false,
      lineSpacing: 'standard',
      saturationLevel: 'standard',
      isFocusMode: false,
      setMotion: (val) => set({ motionEnabled: val }),
      setContrast: (val) => set({ highContrast: val }),
      setLineSpacing: (val) => set({ lineSpacing: val }),
      setSaturation: (val) => set({ saturationLevel: val }),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
    }),
    { name: 'tafrah-sensory-prefs' }
  )
);
