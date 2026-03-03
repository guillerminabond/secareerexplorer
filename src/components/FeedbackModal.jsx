import React, { useState } from "react";
import { X, MessageSquare, CheckCircle } from "lucide-react";
import { submitFeedback } from "@/api/feedbackApi";

const FEEDBACK_TYPES = ["General", "Bug", "Suggestion", "Content"];

export default function FeedbackModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", type: "General", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-crimson" />
            <span className="font-semibold text-gray-800 text-sm">Send Feedback</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="font-semibold text-gray-800">Thank you!</p>
            <p className="text-sm text-gray-500">Your feedback has been received. We appreciate you taking the time to help improve the site.</p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-crimson text-white rounded-lg text-sm font-medium hover:bg-crimson/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
              <div className="flex gap-2 flex-wrap">
                {FEEDBACK_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.type === t
                        ? "bg-crimson text-white border-crimson"
                        : "bg-white text-gray-600 border-gray-200 hover:border-crimson hover:text-crimson"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Message <span className="text-crimson">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={e => set("message", e.target.value)}
                placeholder="Tell us what you think, report a bug, or suggest an improvement..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 resize-none"
              />
            </div>

            {/* Name + Email (optional) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Name <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting || !form.message.trim()}
                className="flex-1 py-2 bg-crimson text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-crimson/90 transition-colors"
              >
                {submitting ? "Sending..." : "Send Feedback"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
