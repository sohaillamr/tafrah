"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import { useLanguage } from "../components/LanguageProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  mode?: "text" | "voice";
};

type Language = "ar" | "en";

const getInitialMessages = (language: Language): Message[] => [
  {
    role: "assistant",
    text:
      language === "ar"
        ? "مرحباً بك في طفرة. أنا نور، مساعدك الذكي.\nكيف يمكنني مساعدتك؟"
        : "Welcome to Tafrah. I'm Nour, your AI assistant.\nHow can I help you?",
  },
];

const createChat = (language: Language, mode: "text" | "voice" = "text"): Chat => ({
  id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  title: language === "ar" ? "محادثة جديدة" : "New chat",
  messages: getInitialMessages(language),
  updatedAt: Date.now(),
  mode,
});

const normalizeMessages = (items: any[]): Message[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const role = item?.role;
      if (role !== "user" && role !== "assistant") return null;
      const text = typeof item?.text === "string" ? item.text : "";
      if (!text) return null;
      return { role, text } as Message;
    })
    .filter(Boolean) as Message[];
};

const normalizeChats = (items: any[], language: Language): Chat[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const messages = normalizeMessages(item?.messages || []);
      if (messages.length === 0) return null;
      return {
        id: typeof item?.id === "string" ? item.id : `${Date.now()}-${Math.random()}`,
        title:
          typeof item?.title === "string"
            ? item.title
            : language === "ar"
              ? "محادثة جديدة"
              : "New chat",
        messages,
        updatedAt: typeof item?.updatedAt === "number" ? item.updatedAt : Date.now(),
      } as Chat;
    })
    .filter(Boolean) as Chat[];
};

export default function AssistantPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { language } = useLanguage();
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatsKey = "tafrah_assistant_chats";
  const activeKey = "tafrah_assistant_active_chat";

  const labels =
    language === "ar"
      ? {
          title: "نور",
          subtitle: "مساعدك الذكي في طفرة",
          placeholder: "اكتب رسالتك هنا...",
          send: "إرسال",
          newChat: "محادثة جديدة",
          chats: "المحادثات",
          noChats: "لا توجد محادثات سابقة",
          loading: "نور يكتب...",
          missingKey: "المساعد غير مفعل. تواصل مع الدعم الفني.",
          error: "حدث خطأ. حاول مرة أخرى.",
          noReply: "لا يوجد رد.",
          deleteChat: "حذف",
          suggestion1: "ما هي الدورات المتاحة؟",
          suggestion2: "اشرح لي مهمة بشكل أبسط",
          suggestion3: "كيف أبدأ التدريب؟",
        }
      : {
          title: "Nour",
          subtitle: "Your AI assistant at Tafrah",
          placeholder: "Type your message here...",
          send: "Send",
          newChat: "New chat",
          chats: "Chats",
          noChats: "No previous chats",
          loading: "Nour is typing...",
          missingKey: "Assistant is not enabled. Contact support.",
          error: "Something went wrong. Try again.",
          noReply: "No reply available.",
          deleteChat: "Delete",
          suggestion1: "What courses are available?",
          suggestion2: "Explain a task more simply",
          suggestion3: "How do I start training?",
        };

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  const activeMessages: Message[] = activeChat?.messages ?? getInitialMessages(language);
  const isNewChat = activeMessages.length <= 1;

  useEffect(() => {
    const lastMsg = activeMessages[activeMessages.length - 1];
    if (lastMsg && lastMsg.role === "assistant" && activeChat?.mode === "voice" && !isLoading) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.text);
        utterance.lang = language === "ar" ? "ar-EG" : "en-US";
        utterance.rate = 1.25;
        utterance.pitch = 1.1;
        const voices = window.speechSynthesis.getVoices();
        let femaleVoice = voices.find(v => v.lang.includes('ar') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('muna')));
        if (!femaleVoice) femaleVoice = voices.find(v => v.lang.includes('ar'));
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [activeMessages, activeChat?.mode, isLoading, language]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(chatsKey) : null;
    const storedActive = typeof window !== "undefined" ? localStorage.getItem(activeKey) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeChats(parsed, language);
        if (normalized.length > 0) {
          setChats(normalized);
          setActiveChatId(storedActive || normalized[0]?.id || "");
          return;
        }
      } catch {
        setChats([]);
      }
    }
    const newChat = createChat(language);
    setChats([newChat]);
    setActiveChatId(newChat.id);
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(chatsKey, JSON.stringify(chats));
    if (activeChatId) {
      localStorage.setItem(activeKey, activeChatId);
    }
  }, [chats, activeChatId]);

  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [activeMessages, isLoading]);

  useEffect(() => {
    if (activeChatId && !activeChat) {
      setActiveChatId(chats[0]?.id || "");
    }
  }, [activeChatId, activeChat, chats]);

  const updateChatMessages = (chatId: string, nextMessages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const firstUser = nextMessages.find((message) => message.role === "user");
        const isDefaultTitle =
          chat.title === "محادثة جديدة" || chat.title === "New chat";
        const title = !isDefaultTitle
          ? chat.title
          : firstUser?.text?.slice(0, 40) || chat.title;
        return { ...chat, title, messages: nextMessages, updatedAt: Date.now() };
      })
    );
  };

  const createNewChat = (mode: "text" | "voice" = "text") => {
    const newChat = createChat(language, mode);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInput("");
    setErrorMessage("");
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => {
      const filtered = prev.filter((c) => c.id !== chatId);
      if (filtered.length === 0) {
        const newChat = createChat(language);
        setActiveChatId(newChat.id);
        return [newChat];
      }
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
  };

  const sendToAssistant = async (nextMessages: Message[]) => {
    /* Ensure we have an active chat — create one if somehow missing */
    let chatId = activeChat?.id;
    if (!chatId) {
      const fallback = createChat(language);
      setChats((prev) => (prev.length === 0 ? [fallback] : prev));
      setActiveChatId(fallback.id);
      chatId = fallback.id;
    }
    setErrorMessage("");
    
    // Add empty assistant message that we will stream into
    const messagesWithPlaceholder = [...nextMessages, { role: "assistant", text: "" } as Message];
    updateChatMessages(chatId, messagesWithPlaceholder);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "fusha",
          settings: { length: "concise" },
          mode: activeChat?.mode || "text",
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        }),
      });
      
      if (!response.ok) {
        setErrorMessage(labels.error);
        updateChatMessages(chatId, nextMessages); // rollback placeholder
        setIsLoading(false);
        return;
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMessage = "";

      // We start streaming now, so we can hide the generic loading indicator
      setIsLoading(false); 

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() || "";
          
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            if (line.includes("[DONE]")) break;
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.replace("data: ", "").trim();
                if (jsonStr === "[DONE]") break;
                const data = JSON.parse(jsonStr);
                botMessage += data.choices?.[0]?.delta?.content || "";
                
                setChats((prev) => prev.map((chat) => {
                  if (chat.id !== chatId) return chat;
                  const newMessages = [...nextMessages, { role: "assistant", text: botMessage } as Message];
                  return { ...chat, messages: newMessages, updatedAt: Date.now() };
                }));
              } catch (e) {
                // Ignore corrupt chunks
              }
            }
          }
        }
        if (botMessage.length > 0 && typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(botMessage);
          utterance.lang = "ar-EG";
          utterance.rate = 1.25;
          utterance.pitch = 1.1;
          const voices = window.speechSynthesis.getVoices();
          let femaleVoice = voices.find(v => v.lang.includes('ar') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('muna')));
          if (!femaleVoice) femaleVoice = voices.find(v => v.lang.includes('ar'));
          if (femaleVoice) utterance.voice = femaleVoice;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch {
      setErrorMessage(labels.error);
      updateChatMessages(chatId, nextMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        
        setIsLoading(true);
        try {
          const res = await fetch("/api/assistant/stt", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
            handleSend(data.text);
          }
        } catch (error) {
          setErrorMessage(labels.error);
        } finally {
          stream.getTracks().forEach(track => track.stop());
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(labels.error);
    }
  };

  const handleSend = (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;
    const msgs: Message[] = [...activeMessages, { role: "user", text: trimmed }];
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    sendToAssistant(msgs);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  };

  /* BetaNote in layout is ~2.375rem tall (py-2 + text-sm + border-b).
     Subtract that so the chat container fits inside the remaining viewport. */
  return (
    <div
      className="flex flex-col bg-[#F8FAFB] overflow-hidden"
      style={{ height: "calc(100dvh - 2.375rem)" }}
    >
      <TopBar />

      {/* Sidebar overlay — mobile only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar — always visible on desktop, slide-in drawer on mobile */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col bg-white border-e border-[#E2E8F0]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-4">
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
          </div>
          <div className="flex-1 overflow-y-auto p-3 sim-scroll">
            <div className="flex flex-col gap-1">
              {chats
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                      chat.id === activeChat?.id
                        ? "bg-[#E3EEF9] text-[#2E5C8A]"
                        : "text-[#495057] hover:bg-[#F5F9FF]"
                    }`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <span className="text-sm opacity-60 text-[#2E5C8A]">--</span>
                    <span className="flex-1 truncate text-sm font-medium">{chat.title}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md text-[#ADB5BD] hover:bg-[#FFE0E0] hover:text-[#D32F2F] transition-colors"
                      title={labels.deleteChat}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              {chats.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[#6C757D]">{labels.noChats}</p>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        <aside
          className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-white border-e border-[#E2E8F0] shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0 rtl:translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-4">
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
          </div>
          <div className="flex-1 overflow-y-auto p-3 sim-scroll">
            <div className="flex flex-col gap-1">
              {chats
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                      chat.id === activeChat?.id
                        ? "bg-[#E3EEF9] text-[#2E5C8A]"
                        : "text-[#495057] hover:bg-[#F5F9FF]"
                    }`}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="text-sm opacity-60 text-[#2E5C8A]">--</span>
                    <span className="flex-1 truncate text-sm font-medium">{chat.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md text-[#ADB5BD] hover:bg-[#FFE0E0] hover:text-[#D32F2F] transition-colors"
                      title={labels.deleteChat}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              {chats.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[#6C757D]">{labels.noChats}</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main chat area — takes remaining space */}
        <div className="flex flex-1 flex-col min-h-0 min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#F5F9FF] transition-colors md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5C8A] to-[#4A90C4] text-white font-bold shadow-sm">
                ن
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-[#212529]">{labels.title}</h1>
                <p className="text-xs text-[#6C757D]">{labels.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
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
                  title={language === "ar" ? "محادثة صوتية جديدة" : "New Voice Chat"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                </button>
              </div>
            </div>
          </div>

          {activeChat?.mode === "voice" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-0 bg-white">
              <div 
                className={"flex h-48 w-48 cursor-pointer items-center justify-center rounded-full shadow-2xl transition-all duration-300 " + (isRecording ? "scale-110 bg-red-500 shadow-red-200/50 animate-pulse" : "bg-[#10b981] hover:bg-[#059669] shadow-green-200/50")}
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="9" y="9" width="6" height="6" rx="1"></rect><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path></svg>
                ) : (
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                )}
              </div>
              <div className="font-medium text-lg text-[#6C757D] min-h-[2rem]">
                {isRecording ? (language === "ar" ? "جاري الاستماع..." : "Listening...") : isLoading ? (language === "ar" ? "تفكر..." : "Thinking...") : (language === "ar" ? "انقر للتحدث" : "Tap to Speak")}
              </div>
              {activeMessages.length > 0 && (
                <div className="w-full max-w-2xl px-6 mt-8 flex flex-col items-center gap-4">
                  {activeMessages.slice(-2).map((msg, idx) => (
                    <div key={idx} className={`p-4 rounded-xl max-w-lg w-full font-medium ${msg.role === 'user' ? 'bg-[#2E5C8A] text-white self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
                      <span className="text-xs opacity-70 block mb-1">{msg.role === 'user' ? (language === 'ar' ? 'أنت' : 'You') : 'Nour'}</span>
                      <div className="whitespace-pre-wrap text-start">{msg.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 min-w-0">
              {/* Messages */}
          <div className="flex-1 overflow-y-auto sim-scroll">
            <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6">
              {activeMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-3 py-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {message.role === "assistant" ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5C8A] to-[#4A90C4] text-sm font-bold text-white mt-1">
                      ن
                    </div>
                  ) : null}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      message.role === "user"
                        ? "bg-[#71618E] text-white rounded-ee-md"
                        : "bg-white border border-[#E2E8F0] text-[#3d3d42] rounded-es-md shadow-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#F3F4F6]"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    )}
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5C8A] to-[#4A90C4] text-sm font-bold text-white mt-1 shadow-sm">
                    ن
                  </div>
                  <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm animate-pulse flex items-center gap-2 text-[#2E5C8A]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.968-.524"/><path d="M12 13h12"/><path d="M13 10h11"/><path d="M13 16h11"/></svg>
                    <span className="text-sm font-medium">{language === "en" ? "Nour is reading..." : "نور يقرأ..."}</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* Suggestions — only on new chats */}
          {isNewChat && !isLoading && (
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-4 pb-3">
              {[labels.suggestion1, labels.suggestion2, labels.suggestion3].map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSend(text)}
                  className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#495057] hover:bg-[#F5F9FF] hover:border-[#CBD5E1] transition-all shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <div className="mx-auto max-w-3xl px-4 pb-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#FF9800]/30 bg-[#FFF3E0] px-4 py-2.5 text-sm text-[#212529]">
                <span className="shrink-0 text-[#FF9800] font-bold">!</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Input area */}
          <form onSubmit={handleFormSubmit} className="shrink-0 border-t border-[#E2E8F0] bg-white px-4 py-4">
            <div className="mx-auto flex max-w-3xl items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    autoResize(event.target);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFB] px-4 py-3 pe-24 text-[15px] placeholder:text-[#ADB5BD] focus:border-[#2E5C8A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E5C8A]/20 transition-all"
                  placeholder={labels.placeholder}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute bottom-2 ${language === "ar" ? "left-3" : "right-3"} flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    isRecording ? "bg-red-500 text-white animate-pulse shadow-md" : "bg-[#F8FAFB] text-[#ADB5BD] hover:bg-[#E2E8F0] hover:text-[#495057]"
                  }`}
                  title={isRecording ? "Stop recording..." : "Voice input"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all ${
                  isLoading || !input.trim()
                    ? "bg-[#E2E8F0] text-[#ADB5BD] cursor-not-allowed"
                    : "bg-[#2E5C8A] text-white shadow-md hover:bg-[#24496E] hover:shadow-lg"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
