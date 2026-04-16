"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuthStore } from "@/lib/store/auth";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  companyName?: string;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
  available?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  signup: (data: Record<string, unknown>) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUserStore = useAuthStore((state) => state.setUser);
  const userStore = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUserStore(data.user || null);
    } catch {
      setUserStore(null);
    } finally {
      setLoading(false);
    }
  }, [setUserStore]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUserStore(data.user);
    return { user: data.user };
  };

  const signup = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUserStore(data.user);
    return {};
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logoutStore();
  };

  return (
    <AuthContext.Provider value={{ user: userStore as User, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
