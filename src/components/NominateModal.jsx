import React, { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { submitNomination } from "@/api/nominationsApi";
import { REGION_HIERARCHY } from "@/constants/regions";
import { validateText, isSafeUrl, isValidEmail, checkRateLimit, LIMITS } from "@/lib/security";

const ORG_TYPES = ["Nonprofit", "Impact Investing", "Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"];

const CAUSE_AREAS = [
  "Poverty Alleviation", "Economic Development", "Global Health", "Education",
  "Climate & Energy", "Gender & Social Justice", "Financial Inclusion",
  "Housing & Community", "Arts & Culture",
];

export default function NominateModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    org_type: "",
    cause_areas: [],
    regions: [],
    hbs_connection: "",
    submitted_by: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleMulti = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  const handleSubmit = async () => {
    // ── Rate limiting ────────────────────────────────────────
    const rateCheck = checkRateLimit("nominate");
    if (!rateCheck.allowed) {
      setError(`Too many submissions. Please wait ${rateCheck.retryAfter} seconds before trying again.`);
      return;
    }

    // ── Validation ───────────────────────────────────────────
    const nameCheck = validateText(form.name, LIMITS.NAME, true);
    if (!nameCheck.valid) { setError(`Name: ${nameCheck.error}`); return; }

    if (form.website.trim() && !isSafeUrl(form.website.trim())) {
      setError("Website must be a valid URL starting with http:// or https://"); return;
    }
    if (form.website.trim() && form.website.trim().length > LIMITS.URL) {
      setError(`Website URL must be ${LIMITS.URL} characters or fewer.`); return;
    }

    const descCheck = validateText(form.description, LIMITS.DESCRIPTION);
    if (!descCheck.valid) { setError(`Description: ${descCheck.error}`); return; }

    const connCheck = validateText(form.hbs_connection, LIMITS.SHORT_TEXT);
    if (!connCheck.valid) { setError(`HBS connection: ${connCheck.error}`); return; }

    // submitted_by may be name or email — validate length only
    const byCheck = validateText(form.submitted_by, LIMITS.SHORT_TEXT);
    if (!byCheck.valid) { setError(`Submitter name: ${byCheck.error}`); return; }

    // ── Submit ───────────────────────────────────────────────
    setSubmitting(true);
    setError("");
    try {
      await submitNomination({
        name:           nameCheck.value,
        website:        form.website.trim() || null,
        description:    descCheck.value,
        org_type:       form.org_type || null,
        cause_areas:    form.cause_areas.join(", ") || null,
        regions:        form.regions.join(", ") || null,
        hbs_connection: connCheck.value,
        submitted_by:   byCheck.value,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nominate an Organization</h2>
              <p className="text-xs text-gray-500 mt-0.5">Suggest an org for the HBS SE Career Explorer. Our team will review it.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-3">
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Thanks for the nomination!</h3>
              <p className="text-sm text-gray-500 mb-5">
                We'll review your suggestion and add it to the explorer if it's a good fit.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  Organization Name <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="e.g. Ashoka"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Website</label>
                <input
                  value={form.website}
                  onChange={e => set("website", e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Brief Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="What does this org do?"
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 resize-none"
                />
              </div>

              {/* Org type */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Org Type</label>
                <select
                  value={form.org_type}
                  onChange={e => set("org_type", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                >
                  <option value="">Select…</option>
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Cause areas */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Cause Areas</label>
                <div className="flex flex-wrap gap-1.5">
                  {CAUSE_AREAS.map(ca => {
                    const active = form.cause_areas.includes(ca);
                    return (
                      <button
                        key={ca}
                        type="button"
                        onClick={() => toggleMulti("cause_areas", ca)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                          active ? "bg-[#A51C30] text-white border-[#A51C30]" : "bg-white text-gray-600 border-gray-200 hover:border-[#A51C30] hover:text-[#A51C30]"
                        }`}
                      >
                        {ca}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regions — grouped by parent, tagging at sub-region level */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Regions</label>
                <div className="space-y-2">
                  {Object.entries(REGION_HIERARCHY).map(([parent, children]) => {
                    if (children.length === 0) {
                      // Global — standalone chip
                      const isActive = form.regions.includes(parent);
                      return (
                        <div key={parent} className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleMulti("regions", parent)}
                            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                              isActive ? "bg-[#A51C30] text-white border-[#A51C30]" : "bg-white text-gray-600 border-gray-200 hover:border-[#A51C30] hover:text-[#A51C30]"
                            }`}
                          >
                            {parent}
                          </button>
                        </div>
                      );
                    }
                    return (
                      <div key={parent}>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{parent}</p>
                        <div className="ml-2 flex flex-wrap gap-1.5">
                          {children.map(child => {
                            const isActive = form.regions.includes(child);
                            return (
                              <button
                                key={child}
                                type="button"
                                onClick={() => toggleMulti("regions", child)}
                                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                                  isActive ? "bg-[#A51C30] text-white border-[#A51C30]" : "bg-white text-gray-600 border-gray-200 hover:border-[#A51C30] hover:text-[#A51C30]"
                                }`}
                              >
                                {child}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HBS connection */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  HBS Connection / Why nominate?
                </label>
                <textarea
                  value={form.hbs_connection}
                  onChange={e => set("hbs_connection", e.target.value)}
                  placeholder="e.g. HBS alumna is COO, recruits at HBS, case study written..."
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 resize-none"
                />
              </div>

              {/* Submitted by */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  Your name or email <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  value={form.submitted_by}
                  onChange={e => set("submitted_by", e.target.value)}
                  placeholder="e.g. Jane Smith or jane@hbs.edu"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.name.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#A51C30]/90 transition-colors"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting…" : "Submit Nomination"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
