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

content = content.split(target1).join(replace1);
content = content.split(target2).join(replace2);
fs.writeFileSync('app/assistant/page.tsx', content);
