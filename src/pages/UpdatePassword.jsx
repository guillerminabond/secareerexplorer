import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Lock, Loader2, CheckCircle } from "lucide-react";

/**
 * UpdatePassword — handles the Supabase password recovery flow.
 *
 * Supabase redirects password recovery emails to:
 *   <site-url>/#access_token=...&type=recovery
 *
 * The Supabase JS client automatically detects this hash and fires
 * an onAuthStateChange event with event = 'PASSWORD_RECOVERY', which
 * gives us a session we can use to call supabase.auth.updateUser().
 */
export default function UpdatePassword() {
  const navigate = useNavigate();
  const [ready,    setReady]    = useState(false); // recovery session established
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  // Wait for Supabase to exchange the recovery token from the URL hash
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") setReady(true);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message || "Failed to update password. The link may have expired.");
    } else {
      setDone(true);
      setTimeout(() => navigate("/admin"), 2500);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#A51C30]" />
          <h1 className="text-lg font-bold text-gray-900">Set New Password</h1>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Password updated! Redirecting to admin…</p>
          </div>
        ) : !ready ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying recovery link…
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating…" : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
