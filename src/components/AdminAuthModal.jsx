import React, { useState, useEffect } from "react";
import { X, Lock, Loader2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

/**
 * AdminAuthModal — authenticates via Supabase Auth (email + password).
 * The password is verified server-side; no secrets live in the client bundle.
 */
export default function AdminAuthModal({ onSuccess, onClose }) {
  const { login } = useAdmin();
  const [email,    setEmail]    = useState("");
  const [pw,       setPw]       = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const unlock = async () => {
    if (!email.trim() || !pw) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await login(email.trim(), pw);
    setLoading(false);
    if (authError) {
      setError("Incorrect email or password.");
      setPw("");
    } else {
      onSuccess();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-crimson" />
            <h2 className="text-base font-bold text-gray-900">Admin Access</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          autoFocus
          onChange={e => { setEmail(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && unlock()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-colors"
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && unlock()}
          className={`w-full border rounded-xl px-4 py-3 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        />
        {error
          ? <p className="text-xs text-red-500 mb-3">{error}</p>
          : <div className="mb-3" />
        }

        <button
          onClick={unlock}
          disabled={loading}
          className="w-full py-3 bg-crimson text-white rounded-xl text-sm font-semibold hover:bg-crimson/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Verifying…" : "Unlock"}
        </button>
      </div>
    </div>
  );
}
