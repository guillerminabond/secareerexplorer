import React from "react";
import { X } from "lucide-react";

const FILTERS = {
  cause_areas: ["Poverty Alleviation", "Economic Development", "Global Health", "Education", "Climate & Energy", "Gender & Social Justice", "Financial Inclusion", "Housing & Community", "Arts & Culture"],
  org_type: ["Nonprofit", "Impact Investing", "Foundation", "Hybrid", "B Corporation", "Government / Public Sector", "Cooperative"],
  role_types: ["Operator", "Funder", "Enabler", "Advocacy & Policy"],
  target_populations: ["People in Poverty", "Women & Girls", "Children", "Youth & Teenagers", "Smallholder Farmers", "Migrants & Refugees", "Families"],
  regions: ["Global", "US National", "Northeast", "Southeast", "Midwest", "West", "Africa", "Asia", "Latin America", "Europe"],
  hiring_status: ["Actively Hiring", "Sometimes Hiring", "Internships Only"]
};

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
    <div className="space-y-4">
      {Object.entries(FILTERS).map(([key, values]) => (
        <div key={key}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {key.replace(/_/g, " ")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {values.map(v => {
              const isActive = (active[key] || []).includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggle(key, v)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
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
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" /> Clear all filters
        </button>
      )}
    </div>
  );
}
