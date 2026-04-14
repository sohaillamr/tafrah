"use client";

import { useEffect, useState } from "react";
import { Terminal, Activity } from "lucide-react";

type PulseLog = {
  id: number;
  action: string;
  admin: string;
  details: string | null;
  createdAt: string;
};

export function SystemPulse() {
  const [logs, setLogs] = useState<PulseLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/staff/admin/pulse");
        if (!res.ok) throw new Error("Pulse detached");
        const data = await res.json();
        setLogs(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black border-2 border-green-500 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b-2 border-green-500 bg-green-950/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="font-mono font-bold tracking-widest text-green-400 uppercase">System Pulse</span>
        </div>
        <Activity className="w-5 h-5 text-green-400 animate-pulse" />
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-sm">
        {error ? (
          <div className="text-red-500 flex items-center gap-2">
            <span>[SYS_ERR]</span> {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-green-600/50 italic">Awaiting telemetry...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex flex-col border-l-2 border-green-500/30 pl-3 py-1 hover:bg-green-900/10 transition-colors">
              <div className="flex items-center gap-3 text-green-300/60 mb-1">
                <span className="shrink-0">{new Date(log.createdAt).toLocaleTimeString()}</span>
                <span className="font-bold text-green-400 shrink-0">@{log.admin}</span>
              </div>
              <div className="text-green-50 break-words whitespace-pre-wrap">
                <span className="font-bold text-green-400 mr-2">[{log.action}]</span>
                {log.details || "No payload"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
