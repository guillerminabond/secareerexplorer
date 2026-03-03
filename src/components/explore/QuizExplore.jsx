import React, { useState, useMemo } from "react";
import { ArrowLeft, RotateCcw, ChevronRight, Shuffle, Search, X } from "lucide-react";
import { PARENT_REGIONS, expandRegions } from "@/constants/regions";
import OrgCard from "./OrgCard";
import OrgModal from "./OrgModal";

// ── Text search ───────────────────────────────────────────────────────────────
// Words that carry no meaning for matching — filtered out before scoring.
const STOPWORDS = new Set([
  "in", "for", "the", "and", "or", "a", "an", "with", "of", "at", "to", "by",
  "that", "is", "are", "was", "on", "about", "from", "i", "my", "me", "want",
  "looking", "find", "work", "job", "career", "focused", "based", "working",
]);

// Score a single term against a single org. Returns 0 if the term doesn't match.
function termScore(org, term) {
  const fields = [
    { text: (org.name || "").toLowerCase(),                         weight: 5 },
    { text: (org.org_type || "").toLowerCase(),                     weight: 3 },
    { text: (org.cause_areas || []).join(" ").toLowerCase(),        weight: 3 },
    { text: (org.regions || []).join(" ").toLowerCase(),            weight: 3 },
    { text: (org.role_types || []).join(" ").toLowerCase(),         weight: 2 },
    { text: (org.target_populations || []).join(" ").toLowerCase(), weight: 2 },
    { text: (org.description || "").toLowerCase(),                  weight: 1 },
  ];
  let score = 0;
  for (const { text, weight } of fields) {
    if (text.includes(term)) score += weight;
  }
  return score;
}

/**
 * AND-first search with partial fallback.
 *
 * Returns:
 *   { mode: "idle" }                                — query too short
 *   { mode: "full",    results, terms }             — all terms matched
 *   { mode: "partial", results, terms,
 *     matchedCount, totalTerms, missing }           — best partial match
 *   { mode: "none",    terms }                      — nothing matched at all
 */
function searchOrgs(orgs, query) {
  const raw = query?.trim().toLowerCase() ?? "";
  if (raw.length < 2) return { mode: "idle" };

  const terms = raw.split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t));
  if (!terms.length) return { mode: "idle" };

  // Per-org: score each term independently
  const scored = orgs.map(org => {
    const perTerm = terms.map(t => ({ term: t, score: termScore(org, t) }));
    const matched   = perTerm.filter(r => r.score > 0);
    const unmatched = perTerm.filter(r => r.score === 0);
    return {
      org,
      matched,
      unmatched,
      totalScore: matched.reduce((s, r) => s + r.score, 0),
    };
  });

  // ── Full matches: every term must be present ──
  const full = scored
    .filter(s => s.unmatched.length === 0)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map(s => s.org);

  if (full.length > 0) return { mode: "full", results: full, terms };

  // ── Partial matches: best coverage available ──
  const maxMatched = Math.max(0, ...scored.map(s => s.matched.length));
  if (maxMatched === 0) return { mode: "none", terms };

  const partials = scored
    .filter(s => s.matched.length === maxMatched)
    .sort((a, b) => b.totalScore - a.totalScore);

  // Identify which terms were consistently unmatched (to explain to user)
  const unmatchedFreq = {};
  partials.forEach(p => p.unmatched.forEach(r => {
    unmatchedFreq[r.term] = (unmatchedFreq[r.term] || 0) + 1;
  }));
  const missing = Object.entries(unmatchedFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);

  return {
    mode:         "partial",
    results:      partials.map(s => s.org),
    terms,
    matchedCount: maxMatched,
    totalTerms:   terms.length,
    missing,
  };
}

// ── Quiz stream definitions ───────────────────────────────────────────────────
const CAUSE_OPTIONS = [
  "Poverty Alleviation", "Economic Development", "Global Health", "Education",
  "Climate & Energy", "Gender & Social Justice", "Financial Inclusion",
  "Housing & Community", "Arts & Culture",
];
// Quiz shows parent regions only; applyFilters expands each to its sub-regions
const REGION_OPTIONS = PARENT_REGIONS;
const ORG_TYPE_OPTIONS = [
  "Nonprofit", "Impact Investing / Foundation", "Hybrid",
  "B Corporation", "Government / Public Sector", "Cooperative",
];
const POPULATION_OPTIONS = [
  "People in Poverty", "Women & Girls", "Children", "Youth & Teenagers",
  "Smallholder Farmers", "Migrants & Refugees", "Families",
];
const ROLE_OPTIONS = ["Operator", "Funder", "Enabler", "Advocacy & Policy"];

const STREAMS = [
  {
    id: "cause",
    label: "I care about an issue",
    emoji: "🌍",
    desc: "Start with a cause that drives you →",
    filterKey: "cause_areas",
    questions: [
      { q: "Which social issues are you most passionate about?",       options: CAUSE_OPTIONS,      multi: true },
      { q: "Where do you want to have impact?",                        options: REGION_OPTIONS,     filterKey: "regions",             multi: true },
      { q: "Who do you most want to serve?",                           options: POPULATION_OPTIONS, filterKey: "target_populations",  multi: true },
    ],
  },
  {
    id: "org_type",
    label: "I know what type of org I want",
    emoji: "🏢",
    desc: "Start with the kind of organization you want to work for →",
    filterKey: "org_type",
    questions: [
      { q: "What types of organization appeal to you?",                options: ORG_TYPE_OPTIONS,   multi: true },
      { q: "Which cause areas interest you most?",                     options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
  {
    id: "role",
    label: "I know the role I want",
    emoji: "💼",
    desc: "Start with how the organization creates impact →",
    filterKey: "role_types",
    questions: [
      { q: "Which functional areas are you most drawn to?",            options: ROLE_OPTIONS,       multi: true },
      { q: "What types of impact model excite you?",                   options: ORG_TYPE_OPTIONS,   filterKey: "org_type",            multi: true },
      { q: "Where do you want to have impact?",                        options: REGION_OPTIONS,     filterKey: "regions",             multi: true },
    ],
  },
  {
    id: "region",
    label: "I know where I want to work",
    emoji: "🗺️",
    desc: "Start with a region of the world →",
    filterKey: "regions",
    questions: [
      { q: "Which regions do you want to work in?",                    options: REGION_OPTIONS,     multi: true },
      { q: "What cause areas interest you?",                           options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
  {
    id: "population",
    label: "I know who I want to serve",
    emoji: "🎯",
    desc: "Start with a target population →",
    filterKey: "target_populations",
    questions: [
      { q: "Who do you most want to serve?",                           options: POPULATION_OPTIONS, multi: true },
      { q: "What cause areas align with your focus?",                  options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
];

// allFilterOptions used on the results refinement panel
const ALL_FILTER_OPTIONS = {
  cause_areas:        CAUSE_OPTIONS,
  org_type:           ORG_TYPE_OPTIONS,
  role_types:         ROLE_OPTIONS,
  regions:            REGION_OPTIONS,
  target_populations: POPULATION_OPTIONS,
};

const FILTER_LABELS = {
  cause_areas: "Cause Areas", org_type: "Org Type", role_types: "Role Types",
  regions: "Regions", target_populations: "Target Populations",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function OptionButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-2 ${
        selected
          ? "bg-crimson text-white border-crimson shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:border-crimson hover:text-crimson"
      }`}
    >
      <span className={`inline-flex w-4 h-4 rounded border flex-shrink-0 items-center justify-center text-xs ${selected ? "bg-white border-white text-crimson" : "border-gray-300"}`}>
        {selected ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

// ── Filtering helpers ─────────────────────────────────────────────────────────
function applyFilters(orgs, filters) {
  return orgs.filter(org => {
    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "org_type") {
        // Single-value field — exact match
        if (!values.includes(org[key])) return false;
      } else if (key === "regions") {
        // Expand parent selections (e.g. "Africa" → all Africa sub-regions)
        const expanded = expandRegions(values);
        const orgVals  = org[key] || [];
        if (!expanded.some(v => orgVals.includes(v))) return false;
      } else {
        const orgVals = org[key] || [];
        if (!values.some(v => orgVals.includes(v))) return false;
      }
    }
    return true;
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuizExplore({ orgs, savedIds, onSave, onEdit, onDelete }) {
  // Quiz state
  const [stream, setStream]               = useState(null);
  const [step, setStep]                   = useState(0);
  const [answers, setAnswers]             = useState({});
  const [showResults, setShowResults]     = useState(false);
  const [editingFilters, setEditingFilters] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery]     = useState("");

  // Shared
  const [selectedOrg, setSelectedOrg]     = useState(null);

  // ── Derived state ───────────────────────────────────────────────────────────
  const currentStream = STREAMS.find(s => s.id === stream);
  const currentQ      = currentStream?.questions[step];
  const getFilterKey  = (q, s) => q.filterKey || s.filterKey;

  const isSearching = !stream && searchQuery.trim().length >= 2;

  // AND-first search with partial fallback — recomputed when orgs or query changes
  const search = useMemo(
    () => isSearching ? searchOrgs(orgs, searchQuery) : { mode: "idle" },
    [orgs, searchQuery, isSearching]
  );

  // Quiz filtered results
  const filteredOrgs = useMemo(() =>
    showResults ? applyFilters(orgs, editingFilters || answers) : [],
    [orgs, showResults, editingFilters, answers]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const surpriseMe = () => {
    if (!orgs.length) return;
    const pool = orgs.filter(o => !savedIds.includes(o.id));
    setSelectedOrg((pool.length ? pool : orgs)[Math.floor(Math.random() * (pool.length || orgs.length))]);
  };

  const toggle = (filterKey, value) => {
    setAnswers(prev => {
      const cur = prev[filterKey] || [];
      return { ...prev, [filterKey]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
  };

  const selectAll = (filterKey, options) => {
    setAnswers(prev => {
      const cur = prev[filterKey] || [];
      return { ...prev, [filterKey]: options.every(o => cur.includes(o)) ? [] : [...options] };
    });
  };

  const canProceed = () => (answers[getFilterKey(currentQ, currentStream)] || []).length > 0;

  const next = () => {
    if (step < currentStream.questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
      setEditingFilters({ ...answers });
    }
  };

  const reset = () => {
    setStream(null); setStep(0); setAnswers({});
    setShowResults(false); setEditingFilters(null);
  };

  const toggleFilter = (key, value) => {
    setEditingFilters(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
  };

  // ── Home screen ─────────────────────────────────────────────────────────────
  if (!stream) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Impact Career</h2>
          <p className="text-sm text-gray-500">Describe what you're looking for, or pick a starting point below.</p>
        </div>

        {/* ── Free-text search ────────────────────────────────────────── */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='e.g. "climate nonprofit in Africa" or "education funder"'
            className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Search results ──────────────────────────────────────────── */}
        {isSearching && (
          <div className="mb-6">
            {search.mode === "none" && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-1">
                  No organizations match <span className="font-medium">"{searchQuery}"</span>
                </p>
                <p className="text-xs text-gray-400">Try different keywords, or use the guided explorer below.</p>
              </div>
            )}

            {search.mode === "partial" && (
              <>
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                  <div className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">No exact matches</span> for all your terms.{" "}
                    {search.missing.length > 0 && (
                      <>
                        The term{search.missing.length > 1 ? "s" : ""}{" "}
                        {search.missing.map((t, i) => (
                          <span key={t}>
                            <span className="font-semibold">"{t}"</span>
                            {i < search.missing.length - 1 ? " and " : ""}
                          </span>
                        ))}{" "}
                        didn't match any organization.{" "}
                      </>
                    )}
                    Showing {search.results.length} partial match{search.results.length !== 1 ? "es" : ""} ({search.matchedCount} of {search.totalTerms} terms matched).
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {search.results.map(org => (
                    <OrgCard key={org.id} org={org} saved={savedIds.includes(org.id)}
                      onSave={onSave} onClick={() => setSelectedOrg(org)}
                      onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
              </>
            )}

            {search.mode === "full" && (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  <span className="font-medium text-gray-600">
                    {search.results.length} result{search.results.length !== 1 ? "s" : ""}
                  </span>{" "}
                  for <span className="font-medium text-gray-600">"{searchQuery}"</span> — sorted by relevance
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {search.results.map(org => (
                    <OrgCard key={org.id} org={org} saved={savedIds.includes(org.id)}
                      onSave={onSave} onClick={() => setSelectedOrg(org)}
                      onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Stream selector — hidden only when full search results fill the screen ── */}
        {(!isSearching || search.mode === "none" || search.mode === "partial") && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
              Or explore by
            </p>
            <div className="grid gap-3 mb-4">
              {STREAMS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setStream(s.id); setStep(0); setAnswers({}); }}
                  className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:shadow-md hover:border-crimson/20 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-crimson transition-colors">{s.label}</p>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-crimson transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
            <button
              onClick={surpriseMe}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-crimson hover:text-crimson hover:bg-red-50 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              "Surprise me" — Show me an org I haven't seen yet
            </button>
          </>
        )}

        {selectedOrg && <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} onEdit={onEdit} />}
      </div>
    );
  }

  // ── Quiz question screen ─────────────────────────────────────────────────────
  if (!showResults) {
    const key      = getFilterKey(currentQ, currentStream);
    const selected = answers[key] || [];
    const progress = ((step + 1) / currentStream.questions.length) * 100;

    // How many orgs match so far (gives user a live sense of result set size)
    const previewCount = applyFilters(orgs, answers).length;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={reset} className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-crimson rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{step + 1} / {currentStream.questions.length}</span>
        </div>

        <div className="mb-2">
          <span className="text-xs font-medium text-crimson uppercase tracking-wide">{currentStream.label}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{currentQ.q}</h2>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">Select all that apply</p>
          <button onClick={() => selectAll(key, currentQ.options)} className="text-xs text-crimson hover:underline font-medium">
            {currentQ.options.every(o => selected.includes(o)) ? "Deselect all" : "Select all"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {currentQ.options.map(opt => (
            <OptionButton key={opt} label={opt} selected={selected.includes(opt)} onClick={() => toggle(key, opt)} />
          ))}
        </div>

        {/* Live match count — helps users know if they're being too narrow */}
        {Object.values(answers).some(v => v?.length) && (
          <p className="text-xs text-gray-400 mb-4 text-center">
            {previewCount > 0
              ? <><span className="font-medium text-gray-600">{previewCount} org{previewCount !== 1 ? "s" : ""}</span> match your selections so far</>
              : <span className="text-amber-600">No matches yet — try selecting more options</span>
            }
          </p>
        )}

        <div className="flex justify-between">
          {step > 0
            ? <button onClick={() => setStep(step - 1)} className="text-sm text-gray-500 hover:text-gray-700 py-2">← Back</button>
            : <div />
          }
          <button
            onClick={next}
            disabled={!canProceed()}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              canProceed() ? "bg-crimson text-white hover:bg-crimson/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step < currentStream.questions.length - 1 ? "Next →" : "See Results →"}
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz results screen ──────────────────────────────────────────────────────
  const activeFilters = Object.entries(editingFilters).filter(([, v]) => v?.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-600" title="Start over">
            <RotateCcw className="w-4 h-4" />
          </button>
          <h2 className="font-semibold text-gray-800">
            {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? "s" : ""} match your profile
          </h2>
        </div>
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-crimson border border-gray-200 rounded-md px-2.5 py-1.5 hover:border-crimson/30 transition-colors"
        >
          Start over
        </button>
      </div>

      {/* Preference editor */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your preferences — click to adjust</p>
        {activeFilters.filter(([key]) => FILTER_LABELS[key]).map(([key, values]) => {
          const opts = ALL_FILTER_OPTIONS[key] || [];
          const allSel = opts.every(o => values.includes(o));
          return (
            <div key={key} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-500">{FILTER_LABELS[key]}</p>
                <button
                  onClick={() => setEditingFilters(prev => ({ ...prev, [key]: allSel ? [] : [...opts] }))}
                  className="text-xs text-crimson hover:underline"
                >
                  {allSel ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {opts.map(opt => {
                  const active = values.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter(key, opt)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        active ? "bg-crimson text-white border-crimson" : "bg-white text-gray-500 border-gray-200 hover:border-crimson hover:text-crimson"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrgs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <p>No organizations match — try adjusting your filters above.</p>
          <button onClick={reset} className="mt-3 text-crimson hover:underline text-sm">Start over</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOrgs.map(org => (
            <OrgCard
              key={org.id}
              org={org}
              saved={savedIds.includes(org.id)}
              onSave={onSave}
              onClick={() => setSelectedOrg(org)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {selectedOrg && <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} onEdit={onEdit} />}
    </div>
  );
}
