"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TopBar from "../components/TopBar";
import { useLanguage } from "../components/LanguageProvider";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

type InterviewMessage = {
  role: "hr" | "candidate";
  text: string;
  at: string;
};

type InterviewReport = {
  score: number;
  summary: string;
  strengths: string[];
  improve: string[];
  focusPlan: string[];
};

type Interview = {
  id: number;
  companyName: string;
  jobTitle: string;
  language: string;
  status: "active" | "completed";
  transcript?: InterviewMessage[];
  report?: InterviewReport | null;
  score?: number | null;
  createdAt: string;
  updatedAt: string;
};

type ViewMode = "chat" | "interview";

const chatsKey = "tafrah_assistant_chats_v2";
const activeKey = "tafrah_assistant_active_chat_v2";
const readAloudKey = "tafrah_nour_read_aloud";

const copy = {
  en: {
    nour: "Nour",
    subtitle: "Your calm AI assistant at Tafrah",
    chats: "Chats",
    mockInterview: "Mock interview",
    newChat: "New chat",
    typeHere: "Type your message here...",
    send: "Send",
    voiceInput: "Voice input",
    stopRecording: "Stop recording",
    listening: "Listening...",
    thinking: "Thinking...",
    readAloud: "Read Nour aloud",
    readThis: "Read this reply",
    deleteChat: "Delete",
    noChats: "No previous chats",
    loading: "Nour is typing...",
    error: "Something went wrong. Try again.",
    suggestions: ["What courses are available?", "Explain this task more simply", "How do I start training?"],
    welcome: "Welcome to Tafrah. I'm Nour, your AI assistant.\nHow can I help you?",
    newChatTitle: "New chat",
    interviewTitle: "Mock interview",
    interviewIntro: "Practice a voice interview. You are the candidate and Nour acts as the HR employer.",
    company: "Company name",
    jobTitle: "Job title",
    startInterview: "Start interview",
    answerByVoice: "Answer by voice",
    typeAnswer: "Or type your answer...",
    sendAnswer: "Send answer",
    endInterview: "End and generate report",
    savedInterviews: "Saved interviews",
    noInterviews: "No saved mock interviews yet",
    report: "Interview report",
    score: "Score",
    summary: "Summary",
    strengths: "Strengths",
    improve: "Areas to improve",
    focusPlan: "Focus plan",
    transcript: "Full transcript",
    hr: "Nour HR",
    candidate: "You",
    active: "Active",
    completed: "Completed",
    load: "Open",
    companyPlaceholder: "Example: Microsoft",
    rolePlaceholder: "Example: Junior Data Analyst",
  },
  ar: {
    nour: "نور",
    subtitle: "مساعدك الهادئ في طفرة",
    chats: "المحادثات",
    mockInterview: "مقابلة تدريبية",
    newChat: "محادثة جديدة",
    typeHere: "اكتب رسالتك هنا...",
    send: "إرسال",
    voiceInput: "إدخال صوتي",
    stopRecording: "إيقاف التسجيل",
    listening: "جاري الاستماع...",
    thinking: "جاري التفكير...",
    readAloud: "قراءة ردود نور بصوت",
    readThis: "اقرأ هذا الرد",
    deleteChat: "حذف",
    noChats: "لا توجد محادثات سابقة",
    loading: "نور يكتب...",
    error: "حدث خطأ. حاول مرة أخرى.",
    suggestions: ["ما الدورات المتاحة؟", "اشرح المهمة بشكل أبسط", "كيف أبدأ التدريب؟"],
    welcome: "مرحباً بك في طفرة. أنا نور، مساعدك الذكي.\nكيف يمكنني مساعدتك؟",
    newChatTitle: "محادثة جديدة",
    interviewTitle: "مقابلة تدريبية",
    interviewIntro: "تدرب على مقابلة صوتية. أنت المرشح، ونور يتصرف كمسؤول HR من جهة العمل.",
    company: "اسم الشركة",
    jobTitle: "المسمى الوظيفي",
    startInterview: "ابدأ المقابلة",
    answerByVoice: "أجب بالصوت",
    typeAnswer: "أو اكتب إجابتك...",
    sendAnswer: "إرسال الإجابة",
    endInterview: "إنهاء وإنشاء التقرير",
    savedInterviews: "المقابلات المحفوظة",
    noInterviews: "لا توجد مقابلات تدريبية محفوظة بعد",
    report: "تقرير المقابلة",
    score: "الدرجة",
    summary: "الملخص",
    strengths: "نقاط القوة",
    improve: "مناطق التحسين",
    focusPlan: "خطة التركيز",
    transcript: "النص الكامل للمقابلة",
    hr: "نور HR",
    candidate: "أنت",
    active: "نشطة",
    completed: "مكتملة",
    load: "فتح",
    companyPlaceholder: "مثال: فودافون",
    rolePlaceholder: "مثال: محلل بيانات مبتدئ",
  },
};

function createChat(language: "ar" | "en"): Chat {
  const t = copy[language];
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: t.newChatTitle,
    messages: [{ role: "assistant", text: t.welcome }],
    updatedAt: Date.now(),
  };
}

function normalizeChats(value: unknown, language: "ar" | "en"): Chat[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as any;
      const messages = Array.isArray(raw.messages)
        ? raw.messages
            .filter((message: any) => message?.role === "user" || message?.role === "assistant")
            .map((message: any) => ({ role: message.role, text: String(message.text || "") }))
            .filter((message: Message) => message.text)
        : [];
      if (!messages.length) return null;
      return {
        id: typeof raw.id === "string" ? raw.id : `${Date.now()}-${Math.random()}`,
        title: typeof raw.title === "string" ? raw.title : copy[language].newChatTitle,
        messages,
        updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
      } as Chat;
    })
    .filter(Boolean) as Chat[];
}

function stripForSpeech(text: string) {
  return text.replace(/[*#_~`[\]()]/g, " ").replace(/\s+/g, " ").trim();
}

export default function AssistantPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<"chat" | "interview" | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const interviewEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );
  const activeMessages = useMemo(() => activeChat?.messages || [], [activeChat]);
  const isNewChat = activeMessages.length <= 1;

  const loadInterviews = useCallback(async () => {
    try {
      const response = await fetch("/api/mock-interviews", { method: "GET" });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data.interviews) ? data.interviews : [];
      setInterviews(items);
      setActiveInterview((current) => current || items[0] || null);
    } catch {
      // Non-critical; the page can still run a new interview.
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(chatsKey);
    const storedActive = localStorage.getItem(activeKey);
    let parsed: Chat[] = [];
    try {
      parsed = stored ? normalizeChats(JSON.parse(stored), language) : [];
    } catch {
      parsed = [];
    }
    const firstChat = parsed[0] || createChat(language);
    setChats(parsed.length ? parsed : [firstChat]);
    setActiveChatId(storedActive || firstChat.id);
    setReadAloud(localStorage.getItem(readAloudKey) === "true");
    loadInterviews();
  }, [language, loadInterviews]);

  useEffect(() => {
    localStorage.setItem(chatsKey, JSON.stringify(chats));
    if (activeChatId) localStorage.setItem(activeKey, activeChatId);
  }, [chats, activeChatId]);

  useEffect(() => {
    localStorage.setItem(readAloudKey, String(readAloud));
    if (!readAloud && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [readAloud]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [activeMessages, isLoading]);

  useEffect(() => {
    interviewEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [activeInterview?.transcript, interviewLoading]);

  function speak(text: string, force = false) {
    if ((!readAloud && !force) || typeof window === "undefined" || !window.speechSynthesis) return;
    const clean = stripForSpeech(text);
    if (!clean) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = language === "ar" ? "ar-EG" : "en-US";
    utterance.rate = language === "ar" ? 0.95 : 1;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.lang.toLowerCase().startsWith(language));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  function updateChatMessages(chatId: string, messages: Message[]) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const firstUser = messages.find((message) => message.role === "user");
        const defaultTitles = [copy.ar.newChatTitle, copy.en.newChatTitle];
        const title = defaultTitles.includes(chat.title) && firstUser ? firstUser.text.slice(0, 46) : chat.title;
        return { ...chat, title, messages, updatedAt: Date.now() };
      })
    );
  }

  function createNewChat() {
    const chat = createChat(language);
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setInput("");
    setErrorMessage("");
    setViewMode("chat");
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function deleteChat(chatId: string) {
    setChats((prev) => {
      const remaining = prev.filter((chat) => chat.id !== chatId);
      if (!remaining.length) {
        const chat = createChat(language);
        setActiveChatId(chat.id);
        return [chat];
      }
      if (activeChatId === chatId) setActiveChatId(remaining[0].id);
      return remaining;
    });
  }

  async function sendToAssistant(nextMessages: Message[]) {
    const chat = activeChat || createChat(language);
    if (!activeChat) {
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
    }

    const chatId = chat.id;
    setErrorMessage("");
    setIsLoading(true);
    updateChatMessages(chatId, [...nextMessages, { role: "assistant", text: "" }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          settings: { length: "concise" },
          mode: "text",
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("assistant_error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMessage = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || line === "data: [DONE]") continue;
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.replace("data: ", ""));
            botMessage += data.choices?.[0]?.delta?.content || "";
            updateChatMessages(chatId, [...nextMessages, { role: "assistant", text: botMessage }]);
          } catch {
            // Ignore partial/corrupt stream chunks.
          }
        }
      }

      if (botMessage) speak(botMessage);
    } catch {
      setErrorMessage(t.error);
      updateChatMessages(chatId, nextMessages);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;
    setInput("");
    const messages = [...activeMessages, { role: "user" as const, text: trimmed }];
    sendToAssistant(messages);
  }

  async function transcribeAudio(blob: Blob) {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    formData.append("language", language);
    const response = await fetch("/api/assistant/stt", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.text) throw new Error("stt_error");
    return String(data.text);
  }

  async function toggleRecording(target: "chat" | "interview") {
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
      setRecordingTarget(target);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        const finalTarget = recordingTarget || target;
        setRecordingTarget(null);
        try {
          if (finalTarget === "chat") {
            setIsLoading(true);
            const text = await transcribeAudio(audioBlob);
            setIsLoading(false);
            handleSend(text);
          } else {
            setInterviewLoading(true);
            const text = await transcribeAudio(audioBlob);
            await sendInterviewAnswer(text);
          }
        } catch {
          setErrorMessage(t.error);
        } finally {
          setIsLoading(false);
          setInterviewLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setErrorMessage(t.error);
      setIsRecording(false);
      setRecordingTarget(null);
    }
  }

  async function startInterview() {
    if (!companyName.trim() || !jobTitle.trim()) return;
    setInterviewLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/mock-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          companyName,
          jobTitle,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "start_failed");
      setActiveInterview(data.interview);
      setInterviews((prev) => [data.interview, ...prev.filter((item) => item.id !== data.interview.id)]);
      setViewMode("interview");
      speak(data.question);
    } catch {
      setErrorMessage(t.error);
    } finally {
      setInterviewLoading(false);
    }
  }

  async function sendInterviewAnswer(answerText?: string) {
    const answer = (answerText ?? typedAnswer).trim();
    if (!answer || !activeInterview || interviewLoading) return;
    setTypedAnswer("");
    setInterviewLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/mock-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          interviewId: activeInterview.id,
          answer,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "answer_failed");
      setActiveInterview(data.interview);
      setInterviews((prev) => [data.interview, ...prev.filter((item) => item.id !== data.interview.id)]);
      speak(data.question);
    } catch {
      setErrorMessage(t.error);
    } finally {
      setInterviewLoading(false);
    }
  }

  async function finishInterview() {
    if (!activeInterview || interviewLoading) return;
    setInterviewLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/mock-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finish",
          interviewId: activeInterview.id,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "finish_failed");
      setActiveInterview(data.interview);
      setInterviews((prev) => [data.interview, ...prev.filter((item) => item.id !== data.interview.id)]);
    } catch {
      setErrorMessage(t.error);
    } finally {
      setInterviewLoading(false);
    }
  }

  function autoResize(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }

  const transcript = activeInterview?.transcript || [];
  const activeReport = activeInterview?.report || null;

  return (
    <div className="assistant-shell flex min-h-screen flex-col bg-[#F8FAFB]">
      <TopBar />

      <main className="assistant-layout mx-auto grid min-h-[calc(100dvh-5.5rem)] w-full max-w-7xl grid-cols-1 overflow-hidden border-x border-[#E2E8F0] bg-white text-[#212529] md:grid-cols-[300px_1fr]">
        <aside className="flex flex-col border-b border-[#E2E8F0] bg-[#F8FAFB] md:border-b-0 md:border-e">
          <div className="border-b border-[#E2E8F0] p-4">
            <div className="mb-3 flex rounded-sm border border-[#D9E6F2] bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("chat")}
                className={`min-h-10 flex-1 rounded-sm px-3 text-sm font-semibold ${viewMode === "chat" ? "bg-[#2E5C8A] text-white" : "text-[#495057]"}`}
              >
                {t.chats}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("interview")}
                className={`min-h-10 flex-1 rounded-sm px-3 text-sm font-semibold ${viewMode === "interview" ? "bg-[#2E5C8A] text-white" : "text-[#495057]"}`}
              >
                {t.mockInterview}
              </button>
            </div>

            <label className="flex min-h-11 items-center gap-3 rounded-sm border border-[#D9E6F2] bg-white px-3 text-sm font-semibold text-[#495057]">
              <input
                type="checkbox"
                checked={readAloud}
                onChange={(event) => setReadAloud(event.target.checked)}
                className="h-4 w-4"
              />
              {t.readAloud}
            </label>
          </div>

          {viewMode === "chat" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] p-4">
                <h2 className="font-semibold text-[#2E5C8A]">{t.chats}</h2>
                <button
                  type="button"
                  onClick={createNewChat}
                  className="min-h-10 rounded-sm bg-[#2E5C8A] px-3 text-sm font-semibold text-white"
                >
                  {t.newChat}
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 sim-scroll">
                {chats.length ? (
                  chats
                    .slice()
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className={`mb-2 flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 ${
                          chat.id === activeChat?.id
                            ? "border-[#2E5C8A] bg-[#E3EEF9] text-[#2E5C8A]"
                            : "border-[#D9E6F2] bg-white text-[#495057]"
                        }`}
                        onClick={() => setActiveChatId(chat.id)}
                      >
                        <span className="flex-1 truncate text-sm font-semibold">{chat.title}</span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="min-h-8 rounded-sm px-2 text-xs text-[#D32F2F]"
                        >
                          {t.deleteChat}
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="p-3 text-sm text-[#6C757D]">{t.noChats}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-[#E2E8F0] p-4">
                <h2 className="font-semibold text-[#2E5C8A]">{t.savedInterviews}</h2>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 sim-scroll">
                {interviews.length ? (
                  interviews.map((interview) => (
                    <button
                      key={interview.id}
                      type="button"
                      onClick={() => setActiveInterview(interview)}
                      className={`mb-2 flex w-full flex-col gap-1 rounded-sm border p-3 text-start ${
                        activeInterview?.id === interview.id ? "border-[#2E5C8A] bg-[#E3EEF9]" : "border-[#D9E6F2] bg-white"
                      }`}
                    >
                      <span className="font-semibold text-[#2E5C8A]">{interview.jobTitle}</span>
                      <span className="text-sm text-[#495057]">{interview.companyName}</span>
                      <span className="text-xs text-[#6C757D]">
                        {interview.status === "completed" ? t.completed : t.active}
                        {typeof interview.score === "number" ? ` · ${t.score}: ${interview.score}%` : ""}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-sm text-[#6C757D]">{t.noInterviews}</p>
                )}
              </div>
            </div>
          )}
        </aside>

        <section className="flex min-h-0 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-5 py-4">
            <div>
              <h1 className="text-xl font-semibold text-[#2E5C8A]">
                {viewMode === "chat" ? t.nour : t.interviewTitle}
              </h1>
              <p className="text-sm text-[#6C757D]">{viewMode === "chat" ? t.subtitle : t.interviewIntro}</p>
            </div>
            {readAloud ? (
              <button
                type="button"
                onClick={() => window.speechSynthesis?.cancel()}
                className="min-h-10 rounded-sm border border-[#D9E6F2] px-3 text-sm font-semibold text-[#495057]"
              >
                Stop audio
              </button>
            ) : null}
          </header>

          {viewMode === "chat" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFB] sim-scroll">
                <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 py-6">
                  {activeMessages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <article
                        className={`max-w-[82%] rounded-sm border px-4 py-3 text-[15px] leading-relaxed ${
                          message.role === "user"
                            ? "border-[#71618E] bg-[#71618E] text-white"
                            : "border-[#D9E6F2] bg-white text-[#212529]"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                            {message.text ? (
                              <button
                                type="button"
                                onClick={() => speak(message.text, true)}
                                className="mt-2 min-h-9 rounded-sm border border-[#D9E6F2] px-3 text-xs font-semibold text-[#2E5C8A]"
                              >
                                {t.readThis}
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.text}</div>
                        )}
                      </article>
                    </div>
                  ))}
                  {isLoading ? (
                    <div className="w-fit rounded-sm border border-[#D9E6F2] bg-white px-4 py-3 text-sm font-semibold text-[#2E5C8A]">
                      {recordingTarget === "chat" && isRecording ? t.listening : t.loading}
                    </div>
                  ) : null}
                  <div ref={endRef} />
                </div>
              </div>

              {isNewChat && !isLoading ? (
                <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 px-5 py-3">
                  {t.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-sm border border-[#D9E6F2] bg-white px-4 py-2 text-sm text-[#495057]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mx-auto w-full max-w-4xl px-5 pb-2">
                  <div className="rounded-sm border border-[#FFCC80] bg-[#FFF8E1] px-4 py-2 text-sm text-[#7A4F01]">
                    {errorMessage}
                  </div>
                </div>
              ) : null}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend();
                }}
                className="shrink-0 border-t border-[#E2E8F0] bg-white px-5 py-4"
              >
                <div className="mx-auto flex max-w-4xl items-end gap-3">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      autoResize(event.target);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    className="min-h-12 flex-1 resize-none rounded-sm border border-[#B8CBDD] bg-[#F8FAFB] px-4 py-3 focus:border-[#2E5C8A] focus:outline-none"
                    placeholder={t.typeHere}
                  />
                  <button
                    type="button"
                    onClick={() => toggleRecording("chat")}
                    disabled={isLoading && !isRecording}
                    className={`min-h-12 rounded-sm px-4 font-semibold ${
                      isRecording && recordingTarget === "chat" ? "bg-[#D32F2F] text-white" : "border border-[#2E5C8A] text-[#2E5C8A]"
                    }`}
                  >
                    {isRecording && recordingTarget === "chat" ? t.stopRecording : t.voiceInput}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="min-h-12 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white disabled:opacity-60"
                  >
                    {t.send}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1fr_380px]">
              <div className="flex min-h-0 flex-col bg-[#F8FAFB]">
                {!activeInterview ? (
                  <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-5 py-8">
                    <div className="rounded-sm border border-[#D9E6F2] bg-white p-6">
                      <h2 className="text-2xl font-semibold text-[#2E5C8A]">{t.interviewTitle}</h2>
                      <p className="mt-2 text-[#495057]">{t.interviewIntro}</p>
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">{t.company}</span>
                          <input
                            value={companyName}
                            onChange={(event) => setCompanyName(event.target.value)}
                            className="min-h-12 rounded-sm border border-[#B8CBDD] px-3"
                            placeholder={t.companyPlaceholder}
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">{t.jobTitle}</span>
                          <input
                            value={jobTitle}
                            onChange={(event) => setJobTitle(event.target.value)}
                            className="min-h-12 rounded-sm border border-[#B8CBDD] px-3"
                            placeholder={t.rolePlaceholder}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={startInterview}
                        disabled={!companyName.trim() || !jobTitle.trim() || interviewLoading}
                        className="mt-5 min-h-12 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white disabled:opacity-60"
                      >
                        {interviewLoading ? t.thinking : t.startInterview}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-[#E2E8F0] bg-white px-5 py-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-[#2E5C8A]">{activeInterview.jobTitle}</h2>
                          <p className="text-sm text-[#495057]">{activeInterview.companyName}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveInterview(null)}
                            className="min-h-10 rounded-sm border border-[#D9E6F2] px-3 text-sm font-semibold text-[#495057]"
                          >
                            {t.startInterview}
                          </button>
                          <button
                            type="button"
                            onClick={finishInterview}
                            disabled={interviewLoading || activeInterview.status === "completed"}
                            className="min-h-10 rounded-sm bg-[#2E5C8A] px-3 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {t.endInterview}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sim-scroll">
                      <div className="mx-auto flex max-w-4xl flex-col gap-3">
                        {transcript.map((message, index) => (
                          <article
                            key={`${message.role}-${index}`}
                            className={`max-w-[86%] rounded-sm border px-4 py-3 ${
                              message.role === "candidate"
                                ? "ms-auto border-[#71618E] bg-[#71618E] text-white"
                                : "me-auto border-[#D9E6F2] bg-white text-[#212529]"
                            }`}
                          >
                            <div className="mb-1 text-xs font-semibold opacity-75">
                              {message.role === "candidate" ? t.candidate : t.hr}
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                            {message.role === "hr" ? (
                              <button
                                type="button"
                                onClick={() => speak(message.text, true)}
                                className="mt-2 min-h-9 rounded-sm border border-[#D9E6F2] px-3 text-xs font-semibold text-[#2E5C8A]"
                              >
                                {t.readThis}
                              </button>
                            ) : null}
                          </article>
                        ))}
                        {interviewLoading ? (
                          <div className="w-fit rounded-sm border border-[#D9E6F2] bg-white px-4 py-3 text-sm font-semibold text-[#2E5C8A]">
                            {isRecording && recordingTarget === "interview" ? t.listening : t.thinking}
                          </div>
                        ) : null}
                        <div ref={interviewEndRef} />
                      </div>
                    </div>

                    {activeInterview.status !== "completed" ? (
                      <div className="shrink-0 border-t border-[#E2E8F0] bg-white px-5 py-4">
                        <div className="mx-auto flex max-w-4xl items-end gap-3">
                          <textarea
                            value={typedAnswer}
                            onChange={(event) => {
                              setTypedAnswer(event.target.value);
                              autoResize(event.target);
                            }}
                            rows={1}
                            className="min-h-12 flex-1 resize-none rounded-sm border border-[#B8CBDD] bg-[#F8FAFB] px-4 py-3 focus:border-[#2E5C8A] focus:outline-none"
                            placeholder={t.typeAnswer}
                          />
                          <button
                            type="button"
                            onClick={() => toggleRecording("interview")}
                            disabled={interviewLoading && !isRecording}
                            className={`min-h-12 rounded-sm px-4 font-semibold ${
                              isRecording && recordingTarget === "interview" ? "bg-[#D32F2F] text-white" : "border border-[#2E5C8A] text-[#2E5C8A]"
                            }`}
                          >
                            {isRecording && recordingTarget === "interview" ? t.stopRecording : t.answerByVoice}
                          </button>
                          <button
                            type="button"
                            onClick={() => sendInterviewAnswer()}
                            disabled={interviewLoading || !typedAnswer.trim()}
                            className="min-h-12 rounded-sm bg-[#2E5C8A] px-5 font-semibold text-white disabled:opacity-60"
                          >
                            {t.sendAnswer}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              <aside className="min-h-0 overflow-y-auto border-t border-[#E2E8F0] bg-white p-5 lg:border-s lg:border-t-0 sim-scroll">
                {activeReport ? (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFB] p-4">
                      <h2 className="text-xl font-semibold text-[#2E5C8A]">{t.report}</h2>
                      <p className="mt-2 text-3xl font-bold text-[#2E5C8A]">{activeReport.score}%</p>
                      <p className="text-sm text-[#6C757D]">{t.score}</p>
                    </div>
                    <ReportBlock title={t.summary} items={[activeReport.summary]} />
                    <ReportBlock title={t.strengths} items={activeReport.strengths || []} />
                    <ReportBlock title={t.improve} items={activeReport.improve || []} />
                    <ReportBlock title={t.focusPlan} items={activeReport.focusPlan || []} />
                    <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFB] p-4">
                      <h3 className="font-semibold text-[#2E5C8A]">{t.transcript}</h3>
                      <div className="mt-3 flex flex-col gap-2 text-sm">
                        {transcript.map((message, index) => (
                          <p key={`${message.role}-report-${index}`} className="leading-relaxed text-[#495057]">
                            <strong>{message.role === "candidate" ? t.candidate : t.hr}:</strong> {message.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFB] p-4 text-sm leading-relaxed text-[#495057]">
                    {activeInterview
                      ? language === "ar"
                        ? "بعد إنهاء المقابلة سيظهر هنا التقرير والدرجة ونقاط التحسين."
                        : "After ending the interview, the report, score, and improvement areas will appear here."
                      : t.noInterviews}
                  </div>
                )}
              </aside>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ReportBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-sm border border-[#D9E6F2] bg-[#F8FAFB] p-4">
      <h3 className="font-semibold text-[#2E5C8A]">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[#495057]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
