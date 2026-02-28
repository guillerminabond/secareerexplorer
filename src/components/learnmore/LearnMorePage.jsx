import React, { useState } from "react";
import CausesTab from "./CausesTab";
import OrgsTab from "./OrgsTab";
import CareerPathsTab from "./CareerPathsTab";

const SUB_TABS = [
  { key: "causes", label: "🌍 Causes" },
  { key: "organizations", label: "🏢 Organizations" },
  { key: "careers", label: "💼 Career Paths" },
];

export default function LearnMorePage() {
  const [subTab, setSubTab] = useState("causes");

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              subTab === t.key
                ? "bg-[#A51C30] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "causes" && <CausesTab />}
      {subTab === "organizations" && <OrgsTab />}
      {subTab === "careers" && <CareerPathsTab />}
    </div>
  );
}
