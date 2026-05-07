import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { REGION_HIERARCHY, PARENT_REGIONS, getParent } from "@/constants/regions";
import { INDUSTRIES } from "@/constants/industries";

// Sub-segments keyed by cause area
const CAUSE_SUBTOPICS = {
  "Poverty Alleviation":      ["Cash Transfers", "Food Security", "Water & Sanitation", "Refugee Support", "Rural Livelihoods", "Safety Nets"],
  "Economic Development":     ["Small Business Lending", "Workforce Development", "Supply Chain Inclusion", "Rural Entrepreneurship", "Trade & Market Access", "Job Creation"],
  "Global Health":            ["Infectious Disease", "Maternal & Child Health", "Mental Health", "Health Systems Strengthening", "Access to Medicines", "Pandemic Preparedness"],
  "Education":                ["Early Childhood", "K–12 Reform", "Higher Ed Access", "EdTech & Digital Learning", "Workforce Training", "Girls' Education"],
  "Climate & Energy":         ["Renewable Energy", "Carbon Markets", "Sustainable Agriculture", "Climate Adaptation", "Circular Economy", "Green Finance"],
  "Gender & Social Justice":  ["Women's Economic Empowerment", "Gender-Based Violence", "Reproductive Health", "Pay Equity", "LGBTQ+ Rights", "Racial Justice"],
  "Financial Inclusion":      ["Microfinance", "Mobile Banking", "Savings & Insurance", "Credit Scoring", "Remittances", "MSME Lending"],
  "Housing & Community":      ["Affordable Housing", "CDFIs", "Neighborhood Revitalization", "Homelessness", "Tenant Advocacy", "Mixed-Income Communities"],
  "Arts & Culture":           ["Arts Education", "Community Arts", "Cultural Preservation", "Creative Economy", "Performing Arts", "Social Practice Art"],
};

const NON_REGION_FILTERS = {
  cause_areas:        ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"],
  org_type:           ["Nonprofit", "Social Enterprise", "Impact Investing", "Foundation", "Government / Public Sector"],
  industry:           INDUSTRIES,
  role_types:         ["Operator", "Funder", "Enabler", "Advocacy & Policy"],
  target_populations: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families", "LGBTQ+", "People with Disabilities", "Indigenous Communities", "Elderly"],
};

const AUM_FILTER = { aum: ["< $10M", "$10M – $100M", "$100M – $500M", "$500M – $1B", "$1B – $10B", "> $10B"] };
const INVESTOR_TYPE_FILTER = { investor_type: ["VC", "Accelerator/Incubator", "Growth/PE", "Investment Bank", "Debt", "Multi-type"] };

const LABEL_MAP = {
  cause_areas:        "Cause Areas",
  org_type:           "Org Type",
  industry:           "Industry",
  role_types:         "Ecosystem Role",
  target_populations: "Target Populations",
  regions:            "Regions",
  aum:               "AUM",
  investor_type:     "Investor Type",
  cause_subtopics:   "Sub-segments",
};

// Filters that render as dropdown instead of chips
const DROPDOWN_FILTERS = new Set(["industry", "target_populations"]);

// ── Multi-select Dropdown ─────────────────────────────────────────────────────
function MultiSelectDropdown({ label, options, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
          selected.length > 0
            ? "border-crimson text-crimson bg-crimson/5"
            : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
        }`}
      >
        <span className="truncate">{label}</span>
        {selected.length > 0 && (
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-crimson text-white text-xs flex items-center justify-center font-medium">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {options.map((opt) => {
            const isActive = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                  isActive ? "text-crimson font-medium" : "text-gray-700"
                }`}
              >
                <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                  isActive ? "bg-crimson border-crimson" : "border-gray-300"
                }`}>
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Accordion Section ─────────────────────────────────────────────────────────
function AccordionSection({ title, count, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors">
            {title}
          </span>
          {count > 0 && (
            <span className="w-5 h-5 rounded-full bg-crimson text-white text-xs flex items-center justify-center font-medium">
              {count}
            </span>
          )}
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
}

// ── Hierarchical region filter (nested inside accordion) ──────────────────────
function RegionFilter({ activeRegions, onToggle }) {
  const [expanded, setExpanded] = useState(() => {
    const s = new Set();
    (activeRegions || []).forEach(r => {
      const p = getParent(r);
      if (p) s.add(p);
    });
    return s;
  });

  const toggleExpand = (parent) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(parent) ? next.delete(parent) : next.add(parent);
      return next;
    });
  };

  const active = activeRegions || [];

  return (
    <div className="space-y-2">
      {PARENT_REGIONS.map(parent => {
        const children      = REGION_HIERARCHY[parent];
        const hasChildren   = children.length > 0;
        const isParentActive   = active.includes(parent);
        const activeChildCount = children.filter(c => active.includes(c)).length;
        const isExpanded    = isParentActive || expanded.has(parent) || activeChildCount > 0;

        return (
          <div key={parent}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggle(parent)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors min-h-[32px] ${
                  isParentActive
                    ? "bg-crimson text-white border-crimson"
                    : activeChildCount > 0
                    ? "bg-crimson/10 text-crimson border-crimson/40"
                    : "bg-white text-gray-600 border-gray-200 hover:border-crimson hover:text-crimson"
                }`}
              >
                {parent}
                {activeChildCount > 0 && !isParentActive && (
                  <span className="ml-1.5 text-[10px] font-semibold opacity-80">
                    {activeChildCount}
                  </span>
                )}
              </button>

              {hasChildren && (
                <button
                  onClick={() => toggleExpand(parent)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isExpanded ? "Collapse sub-regions" : "Expand sub-regions"}
                >
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />
                  }
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="mt-1.5 ml-3 pl-3 border-l-2 border-gray-100 flex flex-wrap gap-1.5">
                {children.map(child => {
                  const isChildActive = active.includes(child);
                  return (
                    <button
                      key={child}
                      onClick={() => onToggle(child)}
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs border transition-colors min-h-[28px] ${
                        isChildActive
                          ? "bg-crimson text-white border-crimson"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:border-crimson hover:text-crimson"
                      }`}
                    >
                      {child}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Active Filter Summary Bar ─────────────────────────────────────────────────
function FilterSummaryBar({ active, onRemove, onClearAll }) {
  const tags = [];
  for (const [key, values] of Object.entries(active)) {
    if (!values?.length) continue;
    for (const v of values) {
      tags.push({ key, value: v });
    }
  }
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-gray-100 mb-1">
      <span className="text-xs text-gray-400 font-medium mr-1">Active:</span>
      {tags.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-crimson/10 text-crimson text-xs font-medium rounded-full border border-crimson/20"
        >
          <span className="max-w-[120px] truncate">{value}</span>
          <button
            onClick={() => onRemove(key, value)}
            className="hover:text-crimson/70 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {tags.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-400 hover:text-gray-600 ml-1 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

// ── Main FilterBar ─────────────────────────────────────────────────────────────
export default function FilterBar({ active, onChange }) {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (key, value) => {
    const current = active[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    let next = { ...active, [key]: updated };

    // When a cause area is removed, also clear any sub-segments that belong to it
    if (key === "cause_areas" && current.includes(value)) {
      const removedSubtopics = new Set(CAUSE_SUBTOPICS[value] || []);
      const remainingSubtopics = (active.cause_subtopics || []).filter(s => !removedSubtopics.has(s));
      next.cause_subtopics = remainingSubtopics;
    }

    // Clear conditional investor filters when their org types are deselected
    if (key === "org_type") {
      const hasAumType = updated.some(v => v === "Impact Investing" || v === "Foundation");
      const hasInvestor = updated.includes("Impact Investing");
      if (!hasAumType) delete next.aum;
      if (!hasInvestor) delete next.investor_type;
    }

    onChange(next);
  };

  const removeFilter = (key, value) => {
    const current = active[key] || [];
    const updated = current.filter(v => v !== value);
    let next = { ...active, [key]: updated };
    if (key === "cause_areas") {
      const removedSubtopics = new Set(CAUSE_SUBTOPICS[value] || []);
      const remainingSubtopics = (active.cause_subtopics || []).filter(s => !removedSubtopics.has(s));
      next.cause_subtopics = remainingSubtopics;
    }
    if (key === "org_type") {
      const hasAumType = updated.some(v => v === "Impact Investing" || v === "Foundation");
      const hasInvestor = updated.includes("Impact Investing");
      if (!hasAumType) delete next.aum;
      if (!hasInvestor) delete next.investor_type;
    }
    onChange(next);
  };

  const clearAll = () => onChange({});
  const hasFilters = Object.values(active).some(v => v?.length > 0);

  // Conditional investor/foundation filters
  const orgTypes = active.org_type || [];
  const showAum = orgTypes.some(v => v === "Impact Investing" || v === "Foundation");
  const showInvestorType = orgTypes.includes("Impact Investing");

  const ACTIVE_FILTERS = {
    ...NON_REGION_FILTERS,
    ...(showAum ? AUM_FILTER : {}),
    ...(showInvestorType ? INVESTOR_TYPE_FILTER : {}),
  };

  // Build the flat list of sub-segment options for whichever cause areas are active
  const activeCauses = active.cause_areas || [];
  const availableSubtopics = activeCauses.flatMap(c => CAUSE_SUBTOPICS[c] || []);

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const getCount = (key) => (active[key] || []).length;

  return (
    <div className="space-y-0">
      {/* Active filter summary bar */}
      {hasFilters && (
        <FilterSummaryBar
          active={active}
          onRemove={removeFilter}
          onClearAll={clearAll}
        />
      )}

      {/* Accordion filter sections */}
      {Object.entries(ACTIVE_FILTERS).map(([key, values]) => {
        // Dropdown filters get their own compact rendering
        if (DROPDOWN_FILTERS.has(key)) {
          return (
            <div key={key} className="border-b border-gray-100 py-2.5">
              <MultiSelectDropdown
                label={LABEL_MAP[key] || key.replace(/_/g, " ")}
                options={values}
                selected={active[key] || []}
                onToggle={(v) => toggle(key, v)}
              />
            </div>
          );
        }

        return (
          <React.Fragment key={key}>
            <AccordionSection
              title={LABEL_MAP[key] || key.replace(/_/g, " ")}
              count={getCount(key)}
              isOpen={openSection === key}
              onToggle={() => toggleSection(key)}
            >
              <div className="flex gap-1.5 flex-wrap">
                {values.map(v => {
                  const isActive = (active[key] || []).includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggle(key, v)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors min-h-[32px] ${
                        isActive
                          ? "bg-crimson text-white border-crimson"
                          : "bg-white text-gray-600 border-gray-200 hover:border-crimson hover:text-crimson"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>

              {/* Sub-segment row: appears under Cause Areas when causes are selected */}
              {key === "cause_areas" && availableSubtopics.length > 0 && (
                <div className="mt-3 ml-3 pl-3 border-l-2 border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Sub-segments
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {availableSubtopics.map(v => {
                      const isActive = (active.cause_subtopics || []).includes(v);
                      return (
                        <button
                          key={v}
                          onClick={() => toggle("cause_subtopics", v)}
                          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs border transition-colors min-h-[28px] ${
                            isActive
                              ? "bg-crimson text-white border-crimson"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-crimson hover:text-crimson"
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </AccordionSection>
          </React.Fragment>
        );
      })}

      {/* Regions accordion section */}
      <AccordionSection
        title="Regions"
        count={getCount("regions")}
        isOpen={openSection === "regions"}
        onToggle={() => toggleSection("regions")}
      >
        <RegionFilter
          activeRegions={active.regions || []}
          onToggle={(region) => toggle("regions", region)}
        />
      </AccordionSection>
    </div>
  );
}
