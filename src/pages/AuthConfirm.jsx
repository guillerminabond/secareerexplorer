import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2, XCircle } from "lucide-react";

/**
 * AuthConfirm — intermediate page that verifies email tokens client-side.
 *
 * Why this exists:
 * Supabase's default email links point directly to its verification endpoint.
 * Email clients (Gmail, Outlook, corporate scanners) prefetch those links,
 * consuming the single-use token before the user actually clicks. By routing
 * through this page instead, the token is only verified when JS executes —
 * which prefetchers don't do.
 *
 * Expected URL:
 *   /auth/confirm?token_hash=TOKEN&type=signup|recovery|invite
 *
 * After verification the user is redirected to:
 *   - /update-password  for recovery and invite flows
 *   - /admin            for email confirmation (signup)
 */
export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!tokenHash || !type) {
      setError("Invalid confirmation link — missing parameters.");
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type })
      .then(({ error: err }) => {
        if (err) {
          setError(
            err.message || "This link is invalid or has expired. Please request a new one."
          );
          return;
        }
        // Redirect based on flow type
        if (type === "recovery" || type === "invite") {
          navigate("/update-password", { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      });
  }, [searchParams, navigate]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center">
        {error ? (
          <>
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-gray-700 mb-1 font-medium">Confirmation failed</p>
            <p className="text-xs text-gray-500 mb-5">{error}</p>
            <a
              href="/admin"
              className="text-xs text-crimson hover:underline"
            >
              ← Go to login
            </a>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-crimson animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Confirming your email…</p>
          </>
        )}
      </div>
    </div>
  );
}
