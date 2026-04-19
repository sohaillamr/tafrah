"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-6 left-6 right-6 z-50 flex flex-col gap-2 sm:left-auto sm:right-6 sm:max-w-sm"
          aria-live="polite"
          role="status"
        >
          {toasts.map((toast) => {
            const colors =
              toast.type === "success"
                ? "border-[#28A745] bg-[#E8F5E9] text-[#212529]"
                : toast.type === "error"
                  ? "border-[#FFD54F] bg-[#FFF8E1] text-[#A66700]" // Warm yellow/orange instead of bright red
                  : "border-[#2E5C8A] bg-[#E3F2FD] text-[#212529]";
            return (
              <div
                key={toast.id}
                className={`flex items-center justify-between gap-3 rounded-sm border p-3 ${colors}`}
              >
                <span className="text-sm">{toast.message}</span>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="min-h-8 min-w-8 flex items-center justify-center"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}
