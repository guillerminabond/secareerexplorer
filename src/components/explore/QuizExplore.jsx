import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowLeft, RotateCcw, ChevronRight, Shuffle, Search, X, Info,
  Download, Bookmark, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PARENT_REGIONS, expandRegions } from "@/constants/regions";
import OrgCard from "./OrgCard";
import OrgModal from "./OrgModal";

// ── Text search ───────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "in", "for", "the", "and", "or", "a", "an", "with", "of", "at", "to", "by",
  "that", "is", "are", "was", "on", "about", "from", "i", "my", "me", "want",
  "looking", "find", "work", "job", "career", "focused", "based", "working",
]);

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

function searchOrgs(orgs, query) {
  const raw = query?.trim().toLowerCase() ?? "";
  if (raw.length < 2) return { mode: "idle" };
  const terms = raw.split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t));
  if (!terms.length) return { mode: "idle" };
  const scored = orgs.map(org => {
    const perTerm   = terms.map(t => ({ term: t, score: termScore(org, t) }));
    const matched   = perTerm.filter(r => r.score > 0);
    const unmatched = perTerm.filter(r => r.score === 0);
    return { org, matched, unmatched, totalScore: matched.reduce((s, r) => s + r.score, 0) };
  });
  const full = scored.filter(s => s.unmatched.length === 0)
    .sort((a, b) => b.totalScore - a.totalScore).map(s => s.org);
  if (full.length > 0) return { mode: "full", results: full, terms };
  const maxMatched = Math.max(0, ...scored.map(s => s.matched.length));
  if (maxMatched === 0) return { mode: "none", terms };
  const partials = scored.filter(s => s.matched.length === maxMatched)
    .sort((a, b) => b.totalScore - a.totalScore);
  const unmatchedFreq = {};
  partials.forEach(p => p.unmatched.forEach(r => {
    unmatchedFreq[r.term] = (unmatchedFreq[r.term] || 0) + 1;
  }));
  const missing = Object.entries(unmatchedFreq).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  return { mode: "partial", results: partials.map(s => s.org), terms,
    matchedCount: maxMatched, totalTerms: terms.length, missing };
}

// ── Option taxonomies ─────────────────────────────────────────────────────────
const CAUSE_OPTIONS = [
  "Poverty Alleviation", "Economic Development", "Global Health", "Education",
  "Climate & Energy", "Gender & Social Justice", "Financial Inclusion",
  "Housing & Community", "Arts & Culture",
];
const REGION_OPTIONS = PARENT_REGIONS;
const ORG_TYPE_OPTIONS = [
  "Nonprofit", "Impact Investing", "Foundation", "Hybrid",
  "B Corporation", "Government / Public Sector", "Cooperative",
];
const POPULATION_OPTIONS = [
  "People in Poverty", "Women & Girls", "Children", "Youth & Teenagers",
  "Smallholder Farmers", "Migrants & Refugees", "Families",
];
const ROLE_OPTIONS = ["Operator", "Funder", "Enabler", "Advocacy & Policy"];

// ── Hierarchical suggestion maps ──────────────────────────────────────────────
// When a cause is selected, options in these maps are sorted to the top of the
// subsequent filter step. Hard disable comes from real data counts, not maps.
const CAUSE_POPULATION_MAP = {
  "Poverty Alleviation":    ["People in Poverty", "Families", "Children", "Women & Girls", "Smallholder Farmers", "Migrants & Refugees"],
  "Economic Development":   ["People in Poverty", "Women & Girls", "Youth & Teenagers", "Smallholder Farmers", "Families"],
  "Global Health":          ["People in Poverty", "Children", "Families", "Women & Girls", "Migrants & Refugees"],
  "Education":              ["Children", "Youth & Teenagers", "Women & Girls", "People in Poverty", "Families"],
  "Climate & Energy":       ["Smallholder Farmers", "People in Poverty", "Families", "Children"],
  "Gender & Social Justice":["Women & Girls", "Youth & Teenagers", "People in Poverty", "Migrants & Refugees"],
  "Financial Inclusion":    ["People in Poverty", "Women & Girls", "Smallholder Farmers", "Families"],
  "Housing & Community":    ["Families", "People in Poverty", "Migrants & Refugees", "Youth & Teenagers"],
  "Arts & Culture":         ["Children", "Youth & Teenagers", "Families"],
};

const CAUSE_ORGTYPE_MAP = {
  "Poverty Alleviation":    ["Nonprofit", "Foundation", "Impact Investing", "Hybrid"],
  "Economic Development":   ["Nonprofit", "Impact Investing", "Foundation", "B Corporation", "Cooperative"],
  "Global Health":          ["Nonprofit", "Foundation", "Impact Investing"],
  "Education":              ["Nonprofit", "Foundation", "Government / Public Sector", "B Corporation"],
  "Climate & Energy":       ["Nonprofit", "B Corporation", "Impact Investing", "Foundation", "Cooperative"],
  "Gender & Social Justice":["Nonprofit", "Foundation", "Government / Public Sector"],
  "Financial Inclusion":    ["Nonprofit", "Impact Investing", "Foundation", "B Corporation"],
  "Housing & Community":    ["Nonprofit", "Foundation", "Government / Public Sector", "Cooperative"],
  "Arts & Culture":         ["Nonprofit", "Foundation"],
};

// Map org types present in quiz results → relevant resource filter tags
const ORG_TYPE_RESOURCE_TAGS = {
  "Nonprofit":                 ["Nonprofit", "Career Support"],
  "Impact Investing":          ["Impact Investing", "Career Support"],
  "Foundation":                ["Foundation", "Career Support"],
  "B Corporation":             ["Career Support"],
  "Hybrid":                    ["Career Support"],
  "Government / Public Sector":["Career Support"],
  "Cooperative":               ["Career Support"],
};

// ── Stream definitions ────────────────────────────────────────────────────────
const STREAMS = [
  {
    id: "cause", label: "I care about an issue", emoji: "🌍",
    desc: "Start with a cause that drives you →",
    filterKey: "cause_areas",
    questions: [
      { q: "Which social issues are you most passionate about?",    options: CAUSE_OPTIONS,      multi: true },
      { q: "Where do you want to have impact?",                     options: REGION_OPTIONS,     filterKey: "regions",             multi: true },
      { q: "Who do you most want to serve?",                        options: POPULATION_OPTIONS, filterKey: "target_populations",  multi: true },
    ],
  },
  {
    id: "org_type", label: "I know what type of org I want", emoji: "🏢",
    desc: "Start with the kind of organization you want to work for →",
    filterKey: "org_type",
    questions: [
      { q: "What types of organization appeal to you?",             options: ORG_TYPE_OPTIONS,   multi: true },
      { q: "Which cause areas interest you most?",                  options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
  {
    id: "role", label: "I know the role I want", emoji: "💼",
    desc: "Start with how the organization creates impact →",
    filterKey: "role_types",
    questions: [
      { q: "Which functional areas are you most drawn to?",         options: ROLE_OPTIONS,       multi: true },
      { q: "What types of impact model excite you?",                options: ORG_TYPE_OPTIONS,   filterKey: "org_type",            multi: true },
      { q: "Where do you want to have impact?",                     options: REGION_OPTIONS,     filterKey: "regions",             multi: true },
    ],
  },
  {
    id: "region", label: "I know where I want to work", emoji: "🗺️",
    desc: "Start with a region of the world →",
    filterKey: "regions",
    questions: [
      { q: "Which regions do you want to work in?",                 options: REGION_OPTIONS,     multi: true },
      { q: "What cause areas interest you?",                        options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
  {
    id: "population", label: "I know who I want to serve", emoji: "🎯",
    desc: "Start with a target population →",
    filterKey: "target_populations",
    questions: [
      { q: "Who do you most want to serve?",                        options: POPULATION_OPTIONS, multi: true },
      { q: "What cause areas align with your focus?",               options: CAUSE_OPTIONS,      filterKey: "cause_areas",         multi: true },
    ],
  },
];

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

// ── Descriptions ──────────────────────────────────────────────────────────────
const DESCRIPTIONS = {
  // Cause areas
  "Poverty Alleviation":      "Reducing extreme deprivation through direct services, cash transfers, and systems change.",
  "Economic Development":     "Strengthening local economies, job creation, and livelihoods in underserved communities.",
  "Global Health":            "Improving health outcomes worldwide through prevention, treatment, and health systems strengthening.",
  "Education":                "Expanding access to quality learning from early childhood through higher education.",
  "Climate & Energy":         "Addressing climate change through clean energy, conservation, and emissions reduction.",
  "Gender & Social Justice":  "Advancing equity for women, marginalized groups, and underserved communities.",
  "Financial Inclusion":      "Expanding access to banking, credit, and financial services for the unbanked.",
  "Housing & Community":      "Creating affordable housing and building strong, resilient communities.",
  "Arts & Culture":           "Using creative expression and cultural work to drive social change.",
  // Org types
  "Nonprofit":                "Mission-driven organizations reinvesting all revenue into their programs and services.",
  "Impact Investing":         "Funds and vehicles deploying capital to generate measurable social and financial returns.",
  "Foundation":               "Philanthropic organizations making grants to support nonprofit and social sector work.",
  "Hybrid":                   "Organizations blending nonprofit and for-profit models (e.g., PBCs, L3Cs).",
  "B Corporation":            "Certified for-profit companies meeting high standards of social and environmental performance.",
  "Government / Public Sector":"Government agencies and public institutions driving policy-led social outcomes.",
  "Cooperative":              "Member-owned organizations sharing profits and decision-making democratically.",
  // Role types
  "Operator":          "Organizations directly delivering programs and services on the ground.",
  "Funder":            "Foundations and investors providing grants or capital to other organizations.",
  "Enabler":           "Organizations building the capacity, tools, and infrastructure for the broader sector.",
  "Advocacy & Policy": "Influencing laws, regulations, and systems to drive systemic change at scale.",
  // Regions
  "Global":                   "Organizations with programs spanning multiple continents.",
  "North America":            "United States, Canada, and the broader North American region.",
  "Latin America & Caribbean":"Central and South America, from Mexico through Patagonia and the Caribbean.",
  "Europe":                   "Western, Eastern, and Northern European countries.",
  "Africa":                   "Sub-Saharan, East, West, North, and Central African countries.",
  "Middle East & North Africa":"The Arab world, Israel, Turkey, and surrounding regions.",
  "Asia":                     "South Asia, East Asia, Southeast Asia, and Central Asia.",
  // Target populations
  "People in Poverty":   "Communities facing extreme or relative poverty and economic hardship.",
  "Women & Girls":       "Programs specifically advancing the rights and opportunities of women and girls.",
  "Children":            "Serving children from birth through early adolescence.",
  "Youth & Teenagers":   "Programming for teens and young adults ages 13–24.",
  "Smallholder Farmers": "Supporting agricultural smallholders and rural communities.",
  "Migrants & Refugees": "Serving displaced people and those navigating migration.",
  "Families":            "Holistic support for family units and households.",
};

// ── Filtering helpers ─────────────────────────────────────────────────────────
function applyFilters(orgs, filters) {
  return orgs.filter(org => {
    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "org_type") {
        if (!values.includes(org[key])) return false;
      } else if (key === "regions") {
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

/**
 * For each option in `options`, compute how many orgs match if ONLY that
 * option is selected for `filterKey` (keeping all other filter answers).
 * Returns { [option]: count }.
 */
function computeOptionCounts(orgs, answers, filterKey, options) {
  const otherAnswers = Object.fromEntries(
    Object.entries(answers).filter(([k]) => k !== filterKey)
  );
  const result = {};
  for (const opt of options) {
    result[opt] = applyFilters(orgs, { ...otherAnswers, [filterKey]: [opt] }).length;
  }
  return result;
}

/**
 * Sort options so that "relevant" ones (based on selected causes) appear first.
 * Non-relevant options stay in original order at the bottom.
 */
function sortByRelevance(options, relevanceMap, selectedCauses) {
  if (!selectedCauses?.length) return options;
  const relevant = new Set(selectedCauses.flatMap(c => relevanceMap[c] || []));
  return [
    ...options.filter(o => relevant.has(o)),
    ...options.filter(o => !relevant.has(o)),
  ];
}

/** Export the filtered org list as a CSV download. */
function exportToCSV(orgs) {
  const headers = ["Name", "Type", "Cause Areas", "Regions", "Role Types", "Website"];
  const rows = orgs.map(o => [
    o.name || "",
    o.org_type || "",
    (o.cause_areas || []).join("; "),
    (o.regions || []).join("; "),
    (o.role_types || []).join("; "),
    o.website || "",
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "impact-organizations.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── OptionButton ──────────────────────────────────────────────────────────────
function OptionButton({ label, selected, onClick, disabled, count }) {
  const desc = DESCRIPTIONS[label];
  const [showInfo, setShowInfo] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!showInfo) return;
    const handler = e => { if (!wrapRef.current?.contains(e.target)) setShowInfo(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showInfo]);

  // Disabled state — grey pill with tooltip, not clickable
  if (disabled) {
    return (
      <div className="relative inline-flex items-center group">
        <div className="pl-4 pr-4 py-2.5 rounded-xl border text-sm font-medium text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed flex items-center gap-2 select-none">
          <span className="inline-flex w-4 h-4 rounded border border-gray-200 flex-shrink-0" />
          {label}
          <span className="ml-0.5 text-xs text-gray-300">0</span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          No organizations match this combination.
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative inline-flex items-center">
      <button
        onClick={onClick}
        className={`${desc ? "pr-7" : "pr-4"} pl-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-2 ${
          selected
            ? "bg-crimson text-white border-crimson shadow-sm"
            : "bg-white text-gray-700 border-gray-200 hover:border-crimson hover:text-crimson"
        }`}
      >
        <span className={`inline-flex w-4 h-4 rounded border flex-shrink-0 items-center justify-center text-xs ${selected ? "bg-white border-white text-crimson" : "border-gray-300"}`}>
          {selected ? "✓" : ""}
        </span>
        {label}
        {/* Match count badge — only shown when not selected */}
        {!selected && count !== undefined && count > 0 && (
          <span className="ml-0.5 text-xs font-normal text-gray-400">({count})</span>
        )}
      </button>

      {desc && (
        <button
          onClick={e => { e.stopPropagation(); setShowInfo(v => !v); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full transition-colors ${
            selected ? "text-white/60 hover:text-white" : "text-gray-300 hover:text-crimson/60"
          }`}
          title={`About: ${label}`}
        >
          <Info className="w-3 h-3" />
        </button>
      )}

      {showInfo && desc && (
        <div className="absolute bottom-full left-0 mb-2 z-50 bg-white border border-gray-100 rounded-xl shadow-lg p-3 w-56 text-xs text-gray-600 leading-relaxed pointer-events-none">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p>{desc}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuizExplore({ orgs, savedIds, onSave, onEdit, onDelete }) {
  const navigate = useNavigate();

  // Quiz state
  const [stream, setStream]                 = useState(null);
  const [step, setStep]                     = useState(0);
  const [answers, setAnswers]               = useState({});
  const [showResults, setShowResults]       = useState(false);
  const [editingFilters, setEditingFilters] = useState(null);
  const [saveAllDone, setSaveAllDone]       = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Shared
  const [selectedOrg, setSelectedOrg] = useState(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentStream = STREAMS.find(s => s.id === stream);
  const currentQ      = currentStream?.questions[step];
  const getFilterKey  = (q, s) => q.filterKey || s.filterKey;

  const quizKey     = currentQ ? getFilterKey(currentQ, currentStream) : null;
  const quizOptions = currentQ?.options || [];

  const isSearching = !stream && searchQuery.trim().length >= 2;

  // Free-text search
  const search = useMemo(
    () => isSearching ? searchOrgs(orgs, searchQuery) : { mode: "idle" },
    [orgs, searchQuery, isSearching]
  );

  // Quiz results
  const filteredOrgs = useMemo(
    () => showResults ? applyFilters(orgs, editingFilters || answers) : [],
    [orgs, showResults, editingFilters, answers]
  );

  // ── Dynamic option counts (data-driven disable logic) ─────────────────────
  // Counts how many orgs match each option given the other filter answers.
  // Computed unconditionally (hooks can't be inside conditionals).
  const optionCounts = useMemo(() => {
    if (!quizKey || !quizOptions.length) return {};
    return computeOptionCounts(orgs, answers, quizKey, quizOptions);
  }, [orgs, answers, quizKey, quizOptions.join(",")]); // eslint-disable-line

  // Sort options by hierarchical relevance (cause → population/orgtype)
  const selectedCauses = answers["cause_areas"] || [];
  const sortedOptions = useMemo(() => {
    if (!quizKey) return quizOptions;
    if (quizKey === "target_populations") return sortByRelevance(quizOptions, CAUSE_POPULATION_MAP, selectedCauses);
    if (quizKey === "org_type")           return sortByRelevance(quizOptions, CAUSE_ORGTYPE_MAP,    selectedCauses);
    return quizOptions;
  }, [quizKey, quizOptions.join(","), selectedCauses.join(",")]); // eslint-disable-line

  // ── Quiz handlers ─────────────────────────────────────────────────────────
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

  // Select all — only picks options that have matches (skips disabled)
  const selectAll = (filterKey, opts) => {
    const enabledOpts = opts.filter(o => (optionCounts[o] ?? 1) > 0);
    setAnswers(prev => {
      const cur = prev[filterKey] || [];
      const allSelected = enabledOpts.every(o => cur.includes(o));
      return { ...prev, [filterKey]: allSelected ? cur.filter(o => !enabledOpts.includes(o)) : [...new Set([...cur, ...enabledOpts])] };
    });
  };

  const canProceed = () => (answers[getFilterKey(currentQ, currentStream)] || []).length > 0;

  const next = () => {
    if (step < currentStream.questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
      setEditingFilters({ ...answers });
      setSaveAllDone(false);
    }
  };

  const reset = () => {
    setStream(null); setStep(0); setAnswers({});
    setShowResults(false); setEditingFilters(null); setSaveAllDone(false);
  };

  const toggleFilter = (key, value) => {
    setEditingFilters(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
  };

  // ── Results: engagement actions ───────────────────────────────────────────
  const unsavedCount = filteredOrgs.filter(o => !savedIds.includes(o.id)).length;

  const handleSaveAll = () => {
    filteredOrgs.filter(o => !savedIds.includes(o.id)).forEach(o => onSave(o.id));
    setSaveAllDone(true);
  };

  const handleViewPaths = () => {
    const orgTypes   = [...new Set(filteredOrgs.map(o => o.org_type).filter(Boolean))];
    const tags       = [...new Set(orgTypes.flatMap(t => ORG_TYPE_RESOURCE_TAGS[t] || ["Career Support"]))];
    navigate("/resources", { state: { preFilters: tags } });
  };

  // ── Home screen ───────────────────────────────────────────────────────────
  if (!stream) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Impact Career</h2>
          <p className="text-sm text-gray-500">Describe what you're looking for, or pick a starting point below.</p>
        </div>

        {/* Free-text search */}
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
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search results */}
        {isSearching && (
          <div className="mb-6">
            {search.mode === "none" && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-1">No organizations match <span className="font-medium">"{searchQuery}"</span></p>
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
                      <>The term{search.missing.length > 1 ? "s" : ""}{" "}
                        {search.missing.map((t, i) => (
                          <span key={t}><span className="font-semibold">"{t}"</span>{i < search.missing.length - 1 ? " and " : ""}</span>
                        ))}{" "}didn't match any organization.{" "}</>
                    )}
                    Showing {search.results.length} partial match{search.results.length !== 1 ? "es" : ""} ({search.matchedCount} of {search.totalTerms} terms matched).
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {search.results.map(org => (
                    <OrgCard key={org.id} org={org} saved={savedIds.includes(org.id)}
                      onSave={onSave} onClick={() => setSelectedOrg(org)} onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
              </>
            )}
            {search.mode === "full" && (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  <span className="font-medium text-gray-600">{search.results.length} result{search.results.length !== 1 ? "s" : ""}</span>{" "}
                  for <span className="font-medium text-gray-600">"{searchQuery}"</span> — sorted by relevance
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {search.results.map(org => (
                    <OrgCard key={org.id} org={org} saved={savedIds.includes(org.id)}
                      onSave={onSave} onClick={() => setSelectedOrg(org)} onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Stream selector */}
        {(!isSearching || search.mode === "none" || search.mode === "partial") && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Or explore by</p>
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

  // ── Quiz question screen ──────────────────────────────────────────────────
  if (!showResults) {
    const key        = getFilterKey(currentQ, currentStream);
    const selected   = answers[key] || [];
    const progress   = ((step + 1) / currentStream.questions.length) * 100;
    const previewCount = applyFilters(orgs, answers).length;

    // Enabled options for "select all"
    const enabledOptions = sortedOptions.filter(o => optionCounts[o] > 0);

    return (
      <div className="max-w-2xl mx-auto py-8">
        {/* Progress bar */}
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
          <button onClick={() => selectAll(key, sortedOptions)} className="text-xs text-crimson hover:underline font-medium">
            {enabledOptions.every(o => selected.includes(o)) ? "Deselect all" : "Select all"}
          </button>
        </div>

        {/* Option buttons — sorted by relevance, disabled when count = 0 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sortedOptions.map(opt => {
            const count    = optionCounts[opt] ?? 0;
            const isDisabled = count === 0 && !selected.includes(opt);
            return (
              <OptionButton
                key={opt}
                label={opt}
                selected={selected.includes(opt)}
                disabled={isDisabled}
                count={count}
                onClick={() => !isDisabled && toggle(key, opt)}
              />
            );
          })}
        </div>

        {/* Live match preview */}
        {Object.values(answers).some(v => v?.length) && (
          <p className="text-xs text-gray-400 mb-4 text-center">
            {previewCount > 0
              ? <><span className="font-medium text-gray-600">{previewCount} org{previewCount !== 1 ? "s" : ""}</span> match your selections so far</>
              : <span className="text-amber-600">No matches yet — try selecting more options</span>
            }
          </p>
        )}

        {/* Navigation */}
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

  // ── Results screen ────────────────────────────────────────────────────────
  const activeFilters = Object.entries(editingFilters).filter(([, v]) => v?.length > 0);

  return (
    <div>
      {/* Header */}
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
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your preferences — click to adjust</p>
        {activeFilters.filter(([key]) => FILTER_LABELS[key]).map(([key, values]) => {
          const opts   = ALL_FILTER_OPTIONS[key] || [];
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

      {/* ── Engagement panel ── */}
      {filteredOrgs.length > 0 && (
        <div className="mb-5 bg-gradient-to-r from-crimson/5 to-transparent border border-crimson/10 rounded-xl px-4 py-3.5">
          <p className="text-sm font-medium text-gray-800 mb-0.5">
            Want to help these organizations?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Explore entry paths through fellowships, alumni networks, and curated job boards.
          </p>
          <div className="flex flex-wrap gap-2">
            {unsavedCount > 0 && !saveAllDone ? (
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-crimson/40 hover:text-crimson transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Save all {filteredOrgs.length} org{filteredOrgs.length !== 1 ? "s" : ""}
              </button>
            ) : saveAllDone ? (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-crimson/5 border border-crimson/20 rounded-lg text-crimson">
                <Bookmark className="w-3.5 h-3.5" />
                {filteredOrgs.length} saved ✓
              </span>
            ) : null}
            <button
              onClick={() => exportToCSV(filteredOrgs)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-crimson/40 hover:text-crimson transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleViewPaths}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-crimson text-white rounded-lg hover:bg-crimson/90 transition-colors"
            >
              View entry paths
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Org grid */}
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
