const fs = require('fs');
let content = fs.readFileSync('app/assistant/page.tsx', 'utf8');

const regex = /<div className=\"font-medium text-lg text-\\[#6C757D\\] min-h-\\[2rem\\]\">\s*\\{isRecording \\? \\(language === \"ar\" \\? \"جاري الاستماع...\" : \"Listening...\"\\) : isLoading \\? \\(language === \"ar\" \\? \"تفكر...\" : \"Thinking...\"\\) : \\(language === \"ar\" \\? \"انقر للتحدث\" : \"Tap to Speak\"\\)\\}\s*<\\/div>/;

const replaceWith = \<div className="font-medium text-lg text-[#6C757D] min-h-[2rem]">
                {isRecording ? (language === "ar" ? "جاري الاستماع..." : "Listening...") : isLoading ? (language === "ar" ? "تفكر..." : "Thinking...") : (language === "ar" ? "انقر للتحدث" : "Tap to Speak")}
              </div>
              {activeMessages.length > 0 && (
                <div className="w-full max-w-2xl px-6 mt-8 flex flex-col items-center gap-4">
                  {activeMessages.slice(-2).map((msg, idx) => (
                    <div key={idx} className={\\\p-4 rounded-xl max-w-lg w-full font-medium \\\\\\}>
                      <span className="text-xs opacity-70 block mb-1">{msg.role === 'user' ? (language === 'ar' ? 'أنت' : 'You') : 'Nour'}</span>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  ))}
                </div>
              )}\;

content = content.replace(regex, replaceWith);

const useEffectInjection = \useEffect(() => {
    const lastMsg = activeMessages[activeMessages.length - 1];
    if (lastMsg && lastMsg.role === "assistant" && activeChat?.mode === "voice" && !isLoading) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.text);
        utterance.lang = language === "ar" ? "ar-SA" : "en-US";
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [activeMessages, activeChat?.mode, isLoading, language]);\;

const stateRegex = /const \\[isRecording, setIsRecording\\] = useState\\(false\\);/;
if (!content.includes('speechSynthesis')) {
  content = content.replace(stateRegex, \const [isRecording, setIsRecording] = useState(false);\\n  \\);
}

fs.writeFileSync('app/assistant/page.tsx', content);
console.log("Voice TTS mapped.");
