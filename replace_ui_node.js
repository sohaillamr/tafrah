const fs = require('fs');
let content = fs.readFileSync('app/assistant/page.tsx', 'utf8');

const target1 =             <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-4">
              <h2 className="font-semibold text-[#2E5C8A]">{labels.chats}</h2>
              <button
                type="button"
                onClick={createNewChat}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E5C8A] text-white hover:bg-[#24496E] transition-colors"
                title={labels.newChat}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>;

const replace1 =             <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-4">
              <h2 className="font-semibold text-[#2E5C8A]">{labels.chats}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => createNewChat("text")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E5C8A] text-white hover:bg-[#24496E] transition-colors"
                  title={labels.newChat}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => createNewChat("voice")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10b981] text-white hover:bg-[#059669] transition-colors"
                  title={language === "ar" ? "محادثة صوتية جديدة" : "New Voice Chat"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                </button>
              </div>
            </div>;

const target2 =                 <button
                  type="button"
                  onClick={createNewChat}
                  className="flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-colors md:hidden"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {labels.newChat}
                </button>;

const replace2 =                 <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => createNewChat("text")}
                    className="flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#495057] hover:bg-[#F5F9FF] transition-colors md:hidden"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {labels.newChat}
                  </button>
                  <button
                    type="button"
                    onClick={() => createNewChat("voice")}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10b981] text-white hover:bg-[#059669] transition-colors md:hidden"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                  </button>
                </div>;

content = content.replace(target1, replace1);
content = content.replace(target2, replace2);

const startToken = '            {/* Messages */}';
const endToken = '            </form>';
const start = content.indexOf(startToken);
const end = content.indexOf(endToken) + endToken.length;

if (start !== -1 && end > start) {
  const before = content.substring(0, start);
  const replace = content.substring(start, end);
  const after = content.substring(end);
  
  const ui =             {activeChat?.mode === "voice" ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-white space-y-8 relative">
                <motion.button
                  type="button"
                  animate={{ scale: isRecording ? [1, 1.15, 1] : 1 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  onClick={toggleRecording}
                  className={"h-48 w-48 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 " + (
                    isRecording 
                      ? "bg-red-500 shadow-red-200/50" 
                      : isLoading 
                        ? "bg-blue-400 shadow-blue-200/50 animate-pulse" 
                        : "bg-[#10b981] hover:bg-[#059669] shadow-green-200/50"
                  )}
                >
                  {isRecording ? (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="9" y="9" width="6" height="6" rx="1"></rect><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path></svg>
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                  )}
                </motion.button>
                <div className="text-[#6C757D] font-medium text-lg min-h-[2rem]">
                  {isRecording 
                    ? (language === "ar" ? "جاري الاستماع..." : "Listening...") 
                    : isLoading 
                      ? (language === "ar" ? "تفكر..." : "Thinking...") 
                      : (language === "ar" ? "انقر للتحدث" : "Tap to Speak")}
                </div>
              </div>
            ) : (
              <>
\
              </>
            )};
  
  content = before + ui + after;
}

fs.writeFileSync('app/assistant/page.tsx', content);
console.log("Replaced using Node and preserved UTF-8 encoding");
