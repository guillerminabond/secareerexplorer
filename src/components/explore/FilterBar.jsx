import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { REGION_HIERARCHY, PARENT_REGIONS, getParent } from "@/constants/regions";

const NON_REGION_FILTERS = {
  cause_areas:        ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"],
  org_type:           ["Nonprofit", "Impact Investing", "Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"],
  role_types:         ["Operator", "Funder", "Enabler", "Advocacy & Policy"],
  target_populations: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"],
};

const LABEL_MAP = {
  cause_areas:        "Cause Areas",
  org_type:           "Org Type",
  role_types:         "Role",
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
    onChange({ ...active, [key]: updated });
  };

  const clearAll = () => onChange({});
  const hasFilters = Object.values(active).some(v => v?.length > 0);

  return (
    <div className="space-y-3">
      {/* Non-region filters (flat chips) */}
      {Object.entries(NON_REGION_FILTERS).map(([key, values]) => (
        <div key={key}>
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
