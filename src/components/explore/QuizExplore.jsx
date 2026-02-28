import React, { useState } from "react";
import { ArrowLeft, RotateCcw, ChevronRight, Shuffle } from "lucide-react";
import OrgCard from "./OrgCard";
import OrgModal from "./OrgModal";

const STREAMS = [
  {
    id: "cause",
    label: "I care about an issue",
    emoji: "🌍",
    desc: "Start with a cause that drives you →",
    filterKey: "cause_areas",
    questions: [
      { q: "Which social issues are you most passionate about?", options: ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"], multi: true },
      { q: "Where do you want to have impact?", options: ["Global", "US National", "Northeast", "Southeast", "Midwest", "West", "Africa", "Asia", "Latin America", "Europe"], filterKey: "regions", multi: true },
      { q: "Who do you most want to serve?", options: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"], filterKey: "target_populations", multi: true }
    ]
  },
  {
    id: "org_type",
    label: "I know what type of org I want",
    emoji: "🏢",
    desc: "Start with the kind of organization you want to work for →",
    filterKey: "org_type",
    questions: [
      { q: "What types of organization appeal to you?", options: ["Nonprofit", "Impact Investing / Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"], multi: true },
      { q: "What size organization do you prefer?", options: ["Startup (<50)", "Mid-size (50-500)", "Large (500+)"], filterKey: "size", multi: true }
    ]
  },
  {
    id: "role",
    label: "I know the role I want",
    emoji: "💼",
    desc: "Start with how the organization creates impact →",
    filterKey: "role_types",
    questions: [
      { q: "Which functional areas are you most drawn to?", options: ["Operator", "Funder", "Enabler", "Advocacy & Policy"], multi: true },
      { q: "What types of impact model excite you?", options: ["Nonprofit", "Impact Investing / Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"], filterKey: "org_type", multi: true },
      { q: "Where do you want to have impact?", options: ["Global", "US National", "Northeast", "Southeast", "Midwest", "West", "Africa", "Asia", "Latin America", "Europe"], filterKey: "regions", multi: true }
    ]
  },
  {
    id: "region",
    label: "I know where I want to work",
    emoji: "🗺️",
    desc: "Start with a region of the world →",
    filterKey: "regions",
    questions: [
      { q: "Which regions do you want to work in?", options: ["Global", "US National", "Northeast", "Southeast", "Midwest", "West", "Africa", "Asia", "Latin America", "Europe"], multi: true },
      { q: "What cause areas interest you?", options: ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"], filterKey: "cause_areas", multi: true }
    ]
  },
  {
    id: "population",
    label: "I know who I want to serve",
    emoji: "🎯",
    desc: "Start with a target population →",
    filterKey: "target_populations",
    questions: [
      { q: "Who do you most want to serve?", options: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"], multi: true },
      { q: "What cause areas align with your focus?", options: ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"], filterKey: "cause_areas", multi: true }
    ]
  }
];

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

export default function QuizExplore({ orgs, savedIds, onSave }) {
  const [stream, setStream] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editingFilters, setEditingFilters] = useState(null);

  const surpriseMe = () => {
    if (!orgs.length) return;
    const unseenIds = orgs.filter(o => !savedIds.includes(o.id));
    const pool = unseenIds.length > 0 ? unseenIds : orgs;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedOrg(pick);
  };

  const currentStream = STREAMS.find(s => s.id === stream);
  const currentQ = currentStream?.questions[step];

  const getFilterKey = (q, stream) => q.filterKey || stream.filterKey;

  const toggle = (filterKey, value) => {
    setAnswers(prev => {
      const current = prev[filterKey] || [];
      return { ...prev, [filterKey]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  const selectAll = (filterKey, options) => {
    setAnswers(prev => {
      const current = prev[filterKey] || [];
      const allSelected = options.every(o => current.includes(o));
      return { ...prev, [filterKey]: allSelected ? [] : [...options] };
    });
  };

  const canProceed = () => {
    const key = getFilterKey(currentQ, currentStream);
    return (answers[key] || []).length > 0;
  };

  const next = () => {
    if (step < currentStream.questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
      setEditingFilters({ ...answers });
    }
  };

  const reset = () => {
    setStream(null);
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setEditingFilters(null);
  };

  const filteredOrgs = orgs.filter(org => {
    const filters = editingFilters || answers;
    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "org_type" || key === "size") {
        if (!values.includes(org[key])) return false;
      } else {
        const orgVals = org[key] || [];
        if (!values.some(v => orgVals.includes(v))) return false;
      }
    }
    return true;
  });

  const toggleFilter = (key, value) => {
    setEditingFilters(prev => {
      const current = prev[key] || [];
      return { ...prev, [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  if (!stream) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Impact Career</h2>
          <p className="text-sm text-gray-500">Where do you want to start? Pick what matters most to you and we'll guide you from there.</p>
        </div>
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
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-crimson transition-colors" />
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
        {selectedOrg && <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} />}
      </div>
    );
  }

  if (!showResults) {
    const key = getFilterKey(currentQ, currentStream);
    const selected = answers[key] || [];
    const progress = ((step + 1) / currentStream.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={reset} className="text-gray-400 hover:text-gray-600">
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

        <div className="flex flex-wrap gap-2 mb-8">
          {currentQ.options.map(opt => (
            <OptionButton key={opt} label={opt} selected={selected.includes(opt)} onClick={() => toggle(key, opt)} />
          ))}
        </div>

        <div className="flex justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
          ) : <div />}
          <button
            onClick={next}
            disabled={!canProceed()}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              canProceed() ? "bg-crimson text-white hover:bg-crimson/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step < currentStream.questions.length - 1 ? "Next →" : "See Results →"}
          </button>
        </div>
      </div>
    );
  }

  const allFilterOptions = {
    cause_areas: ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"],
    org_type: ["Nonprofit", "Impact Investing / Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"],
    role_types: ["Operator", "Funder", "Enabler", "Advocacy & Policy"],
    regions: ["Global", "US National", "Northeast", "Southeast", "Midwest", "West", "Africa", "Asia", "Latin America", "Europe"],
    size: ["Startup (<50)", "Mid-size (50-500)", "Large (500+)"],
    target_populations: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"]
  };

  const filterLabels = {
    cause_areas: "Cause Areas", org_type: "Org Type", role_types: "Role Types",
    regions: "Regions", size: "Size", target_populations: "Target Populations"
  };

  const activeFilters = Object.entries(editingFilters).filter(([, v]) => v?.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-gray-400 hover:text-gray-600">
            <RotateCcw className="w-4 h-4" />
          </button>
          <h2 className="font-semibold text-gray-800">
            {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? "s" : ""} match your profile
          </h2>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your preferences — click to adjust</p>
        {activeFilters.filter(([key]) => filterLabels[key]).map(([key, values]) => {
          const opts = allFilterOptions[key] || [];
          const allSel = opts.every(o => values.includes(o));
          return (
            <div key={key} className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-500">{filterLabels[key]}</p>
                <button
                  onClick={() => {
                    const next = allSel ? [] : [...opts];
                    setEditingFilters(prev => ({ ...prev, [key]: next }));
                  }}
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
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
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
          No organizations match — try adjusting your filters above.
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
            />
          ))}
        </div>
      )}

      {selectedOrg && <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} />}
    </div>
  );
}
