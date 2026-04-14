"use client";

import { useState } from "react";
import { UserCircle, Terminal, ArrowRight } from "lucide-react";

export function Impersonator() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/staff/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impersonation failed");

      // Redirect explicitly to standard dashboard (or wherever API points)
      window.location.href = data.redirectUrl || "/dashboard/student";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-green-500/30 bg-green-950/20 p-6 rounded flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCircle className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold tracking-widest text-green-500 uppercase">Impersonation Override</h2>
        </div>
        <p className="text-sm text-green-300/60 mb-6 max-w-sm">
          Warning: Logging in as a user bypasses normal auth. Action gets permanently recorded in the AuditLog.
        </p>
      </div>

      <form onSubmit={handleImpersonate} className="flex flex-col gap-3">
        {error && <div className="text-red-400 text-xs bg-red-900/20 p-2 border border-red-500/50 rounded">{error}</div>}
        <div className="flex gap-2 items-center">
          <Terminal className="w-4 h-4 text-green-400/50" />
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID (e.g. 42)"
            className="w-full bg-black border border-green-500/30 text-green-400 px-3 py-2 rounded focus:outline-none focus:border-green-400 font-mono"
            required
            min="1"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !userId}
          className="w-full bg-green-900/30 hover:bg-green-700/50 text-green-300 font-bold py-2 px-4 rounded border border-green-500/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "AUTHENTICATING..." : "EXECUTE OVERRIDE"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
