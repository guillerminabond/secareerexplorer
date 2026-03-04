import React, { useState, useEffect } from "react";
import { X, Lock } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "hbsse2024";

export default function AdminAuthModal({ onSuccess, onClose }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const unlock = () => {
    if (pw === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setPw("");
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
          type="password"
          placeholder="Password"
          value={pw}
          autoFocus
          onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && unlock()}
          className={`w-full border rounded-xl px-4 py-3 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        />
        {error && <p className="text-xs text-red-500 mb-3">Incorrect password</p>}
        {!error && <div className="mb-3" />}

        <button
          onClick={unlock}
          className="w-full py-3 bg-crimson text-white rounded-xl text-sm font-semibold hover:bg-crimson/90 transition-colors"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
