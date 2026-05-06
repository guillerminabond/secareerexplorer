import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { REGION_HIERARCHY, PARENT_REGIONS, getParent } from "@/constants/regions";
import { INDUSTRIES } from "@/constants/industries";

// Sub-segments keyed by cause area — mirrors CAUSE_DETAILS.subtopics in LearnMore
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
  org_type:           ["Nonprofit", "Impact Investing", "Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"],
  industry:           INDUSTRIES,
  role_types:         ["Operator", "Funder", "Enabler", "Advocacy & Policy"],
  target_populations: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"],
};

const AUM_FILTER = { aum: ["< $10M", "$10M – $100M", "$100M – $500M", "$500M – $1B", "$1B – $10B", "> $10B"] };
const INVESTOR_TYPE_FILTER = { investor_type: ["VC", "Accelerator/Incubator", "Growth/PE", "Investment Bank", "Debt", "Multi-type"] };

const LABEL_MAP = {
  cause_areas:        "Cause Areas",
  org_type:           "Org Type",
  industry:           "Industry",
  role_types:         "Ecosystem Role",
  target_populations: "Target Populations",
};

// ── Hierarchical region filter ─────────────────────────────────────────────────
function RegionFilter({ activeRegions, onToggle }) {
  // Track which parents are manually expanded by the user
  const [expanded, setExpanded] = useState(() => {
    // Auto-expand parents that already have active sub-regions on mount
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
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Regions</p>
      <div className="space-y-2">
        {PARENT_REGIONS.map(parent => {
          const children      = REGION_HIERARCHY[parent];
          const hasChildren   = children.length > 0;
          const isParentActive   = active.includes(parent);
          const activeChildCount = children.filter(c => active.includes(c)).length;
          // Show sub-regions if: parent is active, user manually expanded, or a child is active
          const isExpanded    = isParentActive || expanded.has(parent) || activeChildCount > 0;

          return (
            <div key={parent}>
              {/* Parent chip + optional expand toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggle(parent)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors min-h-[36px] ${
                    isParentActive
                      ? "bg-crimson text-white border-crimson"
                      : activeChildCount > 0
                      ? "bg-crimson/10 text-crimson border-crimson/40"
                      : "bg-white text-gray-600 border-gray-200 hover:border-crimson hover:text-crimson"
                  }`}
                >
                  {parent}
                  {/* Badge showing how many sub-regions are selected (when parent itself isn't) */}
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

              {/* Sub-region chips — indented with a left border guide */}
              {hasChildren && isExpanded && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-gray-100 flex flex-wrap gap-1.5">
                  {children.map(child => {
                    const isChildActive = active.includes(child);
                    return (
                      <button
                        key={child}
                        onClick={() => onToggle(child)}
                        className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs border transition-colors min-h-[30px] ${
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
    </div>
  );
}

// ── Main FilterBar ─────────────────────────────────────────────────────────────
export default function FilterBar({ active, onChange }) {
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

  return (
    <div className="space-y-3">
      {/* Non-region filters (flat chips) + conditional investor filters */}
      {Object.entries(ACTIVE_FILTERS).map(([key, values]) => (
        <React.Fragment key={key}>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {LABEL_MAP[key] || key.replace(/_/g, " ")}
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:flex-wrap scrollbar-hide">
              {values.map(v => {
                const isActive = (active[key] || []).includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(key, v)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors min-h-[36px] ${
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
          </div>

          {/* Sub-segment row: appears inline under Cause Areas when ≥1 cause is selected */}
          {key === "cause_areas" && availableSubtopics.length > 0 && (
            <div className="ml-3 pl-3 border-l-2 border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Sub-segments
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:flex-wrap scrollbar-hide">
                {availableSubtopics.map(v => {
                  const isActive = (active.cause_subtopics || []).includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggle("cause_subtopics", v)}
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs border transition-colors min-h-[30px] ${
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
        </React.Fragment>
      ))}

      {/* Hierarchical region filter */}
      <RegionFilter
        activeRegions={active.regions || []}
        onToggle={(region) => toggle("regions", region)}
      />

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 min-h-[36px]"
        >
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}
