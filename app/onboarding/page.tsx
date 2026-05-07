'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../lib/store/themeStore';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { profile, setProfile, toggleFocusMode, toggleReadingGuide, toggleTTS } = useThemeStore();
  const [answers, setAnswers] = useState({ interaction: '', visual: '', reading: '' });

  const handleNext = () => {
    if (step === 2) {
      if (answers.reading === 'yes') setProfile('ld');
      else if (answers.interaction === 'buttons') setProfile('cp');
      else setProfile('autism');
    }
    if (step < 3) setStep(s => s + 1);
    else saveAndRedirect();
  };

  const saveAndRedirect = async () => {
    // Ideally this would save to the DB, but we update store and persist to local storage for now.
    document.cookie="tafrah_onboarded=true; path=/"; router.push("/dashboard");
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4`}>
      <div className="bg-white p-8 max-w-2xl w-full rounded-2xl shadow-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-3xl font-bold mb-6">Welcome. Let&apos;s get started.</h2>
              <div className="space-y-4">
                <input type="email" placeholder="Email or Student ID" className="w-full p-4 border rounded-xl" />
                <input type="password" placeholder="Password" className="w-full p-4 border rounded-xl" />
                <button onClick={handleNext} className="w-full py-4 bg-[#2E5C8A] text-white rounded-xl font-bold mt-4">Continue to Setup</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-3xl font-bold mb-6">Discovery Assessment</h2>
              <div className="space-y-6">
                <div>
                  <p className="font-semibold mb-2">How do you prefer to interact with the screen?</p>
                  <select className="w-full p-4 border rounded-xl" onChange={e => setAnswers({...answers, interaction: e.target.value})}>
                    <option value="">Select preference</option>
                    <option value="keyboard">Keyboard shortcuts</option>
                    <option value="buttons">Large touch targets / buttons</option>
                  </select>
                </div>
                <div>
                  <p className="font-semibold mb-2">Which visual style is most comfortable for your eyes?</p>
                  <select className="w-full p-4 border rounded-xl" onChange={e => setAnswers({...answers, visual: e.target.value})}>
                    <option value="">Select visual style</option>
                    <option value="standard">Standard</option>
                    <option value="muted">Muted / Less Bright Colors</option>
                    <option value="contrast">High Contrast</option>
                  </select>
                </div>
                <div>
                  <p className="font-semibold mb-2">Do you find reading long blocks of text challenging?</p>
                  <select className="w-full p-4 border rounded-xl" onChange={e => setAnswers({...answers, reading: e.target.value})}>
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <button onClick={handleNext} className="w-full py-4 bg-[#2E5C8A] text-white rounded-xl font-bold">Show My Recommendation</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-3xl font-bold mb-4">Adaptability Wizard</h2>
              <p className="mb-6 text-gray-600">Based on your choices, we recommend the <strong>{profile.toUpperCase()}</strong> mode.</p>
              
              <div className="p-6 border rounded-xl bg-gray-50 mb-6">
                <h3 className="font-bold mb-2">Sample Course Preview</h3>
                <p>This is how text will look. Hover over here and try the tools below to tailor your workspace.</p>
              </div>

              <div className="space-y-4 mb-8">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" onChange={toggleFocusMode} />
                  <span>Toggle Focus Mode (Reduces clutter)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" onChange={toggleReadingGuide} />
                  <span>Toggle Reading Assist (Highlight Bar)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" onChange={toggleTTS} />
                  <span>Enable Text-to-Speech</span>
                </label>
              </div>

              <button onClick={handleNext} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-xl">Save My Workspace</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}