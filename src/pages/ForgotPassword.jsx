import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError("");

    const redirectTo = `${window.location.origin}/update-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    setLoading(false);
    if (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#A51C30]" />
          <h1 className="text-lg font-bold text-gray-900">Reset Password</h1>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800 mb-1">Check your inbox</p>
            <p className="text-xs text-gray-500 mb-5">
              A password reset link has been sent to <strong>{email}</strong>. It expires in 1 hour.
            </p>
            <Link to="/admin" className="text-xs text-[#A51C30] hover:underline">
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Enter your admin email and we'll send a reset link.
            </p>
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              autoFocus
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
            <Link
              to="/admin"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
