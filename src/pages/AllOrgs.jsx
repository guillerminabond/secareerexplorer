import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, LayoutGrid, List, PlusCircle } from "lucide-react";
import { fetchOrgs, updateSavesCount } from "@/api/organizationsApi";
import { expandRegions } from "@/constants/regions";
import FilterBar from "@/components/explore/FilterBar";
import OrgTable from "@/components/explore/OrgTable";
import OrgCard from "@/components/explore/OrgCard";
import OrgModal from "@/components/explore/OrgModal";

function getValuesAsArray(val) {
  if (Array.isArray(val)) {
    return val
      .flatMap((s) => s.split(";").map((v) => v.trim()))
      .filter(Boolean);
  }
  if (typeof val === "string") {
    return val
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default function AllOrgs() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hbs_saved_orgs") || "[]");
    } catch {
      return [];
    }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? "grid" : "table"
  );

  useEffect(() => {
    fetchOrgs()
      .then((data) => setOrgs(data))
      .catch((err) => console.error("Error fetching organizations:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const isCurrentlySaved = prev.includes(id);
      const delta = isCurrentlySaved ? -1 : 1;
      const next = isCurrentlySaved ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("hbs_saved_orgs", JSON.stringify(next));
      // Update server-side saves counter atomically
      updateSavesCount(id, delta);
      // Optimistically update local org saves count so UI reflects change immediately
      setOrgs(prevOrgs =>
        prevOrgs.map(o =>
          o.id === id ? { ...o, saves: Math.max(0, (o.saves || 0) + delta) } : o
        )
      );
      return next;
    });
  };

  const filtered = orgs.filter((org) => {
    if (
      search &&
      !org.name?.toLowerCase().includes(search.toLowerCase()) &&
      !org.description?.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "org_type") {
        const orgVal = org[key] || "";
        const match = values.some(
          (v) =>
            orgVal === v ||
            (orgVal === "Impact Investing / Foundation" &&
              (v === "Impact Investing" || v === "Foundation"))
        );
        if (!match) return false;
      } else if (key === "regions") {
        const expanded = expandRegions(values);
        const orgVals = getValuesAsArray(org[key]);
        if (!expanded.some((v) => orgVals.includes(v))) return false;
      } else {
        const orgVals = getValuesAsArray(org[key]);
        if (!values.some((v) => orgVals.includes(v))) return false;
      }
    }
    return true;
  });

  const activeFilterCount = Object.values(filters).reduce(
    (n, v) => n + (v?.length || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 bg-white"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-crimson text-crimson bg-crimson/5"
              : "border-gray-200 text-gray-600 bg-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-2 text-sm transition-colors ${
              viewMode === "table"
                ? "bg-crimson text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 text-sm transition-colors ${
              viewMode === "grid"
                ? "bg-crimson text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Nominate button */}
        <button
          onClick={() => navigate("/all-orgs/nominate")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-crimson hover:text-crimson hover:bg-crimson/5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nominate</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
          <FilterBar active={filters} onChange={setFilters} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            {filtered.length} organization{filtered.length !== 1 ? "s" : ""}
          </p>
          {viewMode === "table" ? (
            <OrgTable
              orgs={filtered}
              savedIds={savedIds}
              onSave={toggleSave}
              onRowClick={setSelectedOrg}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((org) => (
                <OrgCard
                  key={org.id}
                  org={org}
                  saved={savedIds.includes(org.id)}
                  onSave={toggleSave}
                  onClick={() => setSelectedOrg(org)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400 text-sm">
                  No organizations match your filters.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {selectedOrg && (
        <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} />
      )}
    </div>
  );
}
