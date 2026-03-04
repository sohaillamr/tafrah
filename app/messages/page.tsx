"use client";

import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLanguage } from "../components/LanguageProvider";
import { useAuth } from "../components/AuthProvider";

interface MessageData {
  id: number; content: string; senderId: number; receiverId: number; createdAt: string;
  sender: { id: number; name: string; role: string; };
  receiver: { id: number; name: string; role: string; };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [showTranslation, setShowTranslation] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePartnerId, setActivePartnerId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const { language } = useLanguage();

  const fetchMessages = () => {
    if (!user) return;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => { setMessages(d.messages || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          messages: "الرسائل",
          chatsTitle: "المحادثات",
          translation: "ترجمة نور",
          translationText: "التوضيح: سيتم مراجعة النتائج اليوم وسيتم الرد عليك لاحقاً.",
          placeholder: "اكتب رسالتك هنا",
          send: "إرسال",
          upload: "مشاركة ملف",
          canned: [
            "استلمت التاسك",
            "أحتاج توضيحاً للخطوة رقم ٢",
            "تم إنهاء العمل",
            "متى موعد التسليم؟",
          ],
          loading: "جارٍ التحميل...",
          loginRequired: "يجب تسجيل الدخول لعرض الرسائل",
          noMessages: "لا توجد رسائل حتى الآن",
        }
      : {
          home: "Home",
          messages: "Messages",
          chatsTitle: "Conversations",
          translation: "Nour translation",
          translationText: "Explanation: The results will be reviewed today and we will respond later.",
          placeholder: "Type your message here",
          send: "Send",
          upload: "Share file",
          canned: [
            "I received the task",
            "I need clarification for step 2",
            "The work is completed",
            "What is the deadline?",
          ],
          loading: "Loading...",
          loginRequired: "Please sign in to view messages",
          noMessages: "No messages yet",
        };

  if (!user) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-12 text-center">
          {labels.loginRequired}
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-12 text-center">
          {labels.loading}
        </main>
      </div>
    );
  }

  // Group messages by conversation partner
  const conversations = new Map<number, { partner: { id: number; name: string; role: string; }; messages: MessageData[] }>();
  messages.forEach((msg) => {
    const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    const partner = msg.senderId === user.id ? msg.receiver : msg.sender;
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, { partner, messages: [] });
    }
    conversations.get(partnerId)!.messages.push(msg);
  });

  const convList = Array.from(conversations.values());

  // Auto-select first conversation if none selected
  const activeConv =
    activePartnerId !== null
      ? conversations.get(activePartnerId)
      : convList.length > 0
        ? convList[0]
        : null;
  const currentPartnerId = activeConv?.partner.id ?? (convList.length > 0 ? convList[0].partner.id : null);

  const handleSend = async () => {
    if (!message.trim() || !currentPartnerId) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: currentPartnerId, content: message.trim() }),
      });
      if (res.ok) {
        setMessage("");
        fetchMessages();
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <Breadcrumbs
          items={[
            { label: labels.home, href: "/" },
            { label: labels.messages },
          ]}
        />

        <section className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-4">
            <h2 className="font-semibold">{labels.chatsTitle}</h2>
            <div className="mt-4 flex flex-col gap-2">
              {convList.length === 0 && (
                <p className="text-sm text-[#6C757D]">{labels.noMessages}</p>
              )}
              {convList.map((conv) => (
                <button
                  key={conv.partner.id}
                  type="button"
                  onClick={() => setActivePartnerId(conv.partner.id)}
                  className={`min-h-12 rounded-sm border px-3 text-start ${
                    currentPartnerId === conv.partner.id
                      ? "border-[#2E5C8A] bg-[#E3EEF9] font-semibold text-[#2E5C8A]"
                      : "border-[#DEE2E6] bg-white"
                  }`}
                >
                  {conv.partner.name}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-4">
            {activeConv ? (
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-[#2E5C8A]">{activeConv.partner.name}</p>
                <div className="flex flex-col gap-2">
                  {activeConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[80%] rounded-sm p-3 ${
                        msg.senderId === user.id
                          ? "bg-[#2E5C8A] text-white"
                          : "bg-[#E9ECEF]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowTranslation((prev) => !prev)}
                    className="min-h-12 w-fit rounded-sm border border-[#DEE2E6] px-3"
                  >
                    {labels.translation}
                  </button>
                  {showTranslation ? (
                    <div className="rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] p-3">
                      {labels.translationText}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="text-center text-[#6C757D]">{labels.noMessages}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {labels.canned.map((response) => (
                <button
                  key={response}
                  type="button"
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] px-4"
                  onClick={() => setMessage(response)}
                >
                  {response}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={labels.placeholder}
                className="min-h-12 flex-1 rounded-sm border border-[#DEE2E6] bg-white px-4"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !message.trim() || !currentPartnerId}
                className="min-h-12 rounded-sm bg-[#2E5C8A] px-6 text-white disabled:opacity-50"
              >
                {labels.send}
              </button>
            </div>

            <div className="mt-2">
              <label className="flex flex-col gap-2">
                {labels.upload}
                <input
                  type="file"
                  className="min-h-12 rounded-sm border border-[#DEE2E6] bg-white px-4"
                />
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
