import { useState, useRef } from 'react';

export function useNourVoice(onTranscribedText: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const speakWithNourStyle = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Remove markdown symbols: *, #, _, ~, `, [, ]
    const cleanText = text.replace(/[*#_~\`\[\]]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-EG';
    // Deep calibration for "Soft Girl" persona
    utterance.pitch = 1.3;
    utterance.rate = 1.2;
    utterance.volume = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      let femaleVoice = voices.find(v => v.lang.includes('ar') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('muna') || v.name.toLowerCase().includes('hoda')));
      if (!femaleVoice) femaleVoice = voices.find(v => v.lang.includes('ar'));
      if (femaleVoice) utterance.voice = femaleVoice;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
  };

  const stopNour = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = async () => {
    stopNour(); // Interrupt Logic
    
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        setIsThinking(true);
        try {
          const res = await fetch('/api/assistant/stt', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
             onTranscribedText(data.text);
          }
        } catch (err) {
          console.error('STT Error:', err);
        } finally {
          setIsThinking(false);
        }
      };

      mediaRecorder.start(200);
      setIsListening(true);
    } catch (err) {
      console.error('Mic error:', err);
    }
  };

  return {
    isListening,
    isThinking,
    setIsThinking, 
    isSpeaking,
    toggleListening,
    speakWithNourStyle,
    stopNour
  };
}