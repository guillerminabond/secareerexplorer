import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, LayoutGrid, List, PlusCircle, Bookmark, X } from "lucide-react";
import { fetchOrgs, updateSavesCount, deleteOrg } from "@/api/organizationsApi";
import { expandRegions } from "@/constants/regions";

/* ── Smart search parser (shared logic) ─────────────────────────────── */
const SEARCH_PATTERNS = [
  { regex: /(?:founded|established)\s+after\s+(\d{4})/i,                                      build: (m) => ({ field: "year_established", op: ">",       value: parseInt(m[1]),                          label: `Founded after ${m[1]}` }) },
  { regex: /(?:founded|established)\s+before\s+(\d{4})/i,                                     build: (m) => ({ field: "year_established", op: "<",       value: parseInt(m[1]),                          label: `Founded before ${m[1]}` }) },
  { regex: /(?:founded|established)\s+in\s+(\d{4})/i,                                         build: (m) => ({ field: "year_established", op: "=",       value: parseInt(m[1]),                          label: `Founded in ${m[1]}` }) },
  { regex: /(?:founded|established)\s+between\s+(\d{4})\s+(?:and|to|-)\s+(\d{4})/i,           build: (m) => ({ field: "year_established", op: "between", value: [parseInt(m[1]), parseInt(m[2])],        label: `Founded ${m[1]}–${m[2]}` }) },
  { regex: /older\s+than\s+(\d+)\s+years?/i,                                                  build: (m) => ({ field: "year_established", op: "<",       value: new Date().getFullYear() - parseInt(m[1]), label: `Older than ${m[1]} years` }) },
  { regex: /(?:newer|younger)\s+than\s+(\d+)\s+years?/i,                                      build: (m) => ({ field: "year_established", op: ">",       value: new Date().getFullYear() - parseInt(m[1]), label: `Newer than ${m[1]} years` }) },
];
function parseSearch(raw) {
  let remaining = raw;
  const conditions = [];
  for (const { regex, build } of SEARCH_PATTERNS) {
    const match = remaining.match(regex);
    if (match) { conditions.push(build(match)); remaining = remaining.replace(match[0], "").trim(); }
  }
  remaining = remaining.replace(/^\s*(and|,)\s*/i, "").replace(/\s*(and|,)\s*$/i, "").trim();
  return { keyword: remaining, conditions };
}
function matchesCondition(org, cond) {
  const year = parseInt(org.year_established);
  if (isNaN(year)) return false;
  if (cond.op === ">") return year > cond.value;
  if (cond.op === "<") return year < cond.value;
  if (cond.op === "=") return year === cond.value;
  if (cond.op === "between") return year >= cond.value[0] && year <= cond.value[1];
  return true;
}
import FilterBar from "@/components/explore/FilterBar";
import OrgTable from "@/components/explore/OrgTable";
import OrgCard from "@/components/explore/OrgCard";
import OrgModal from "@/components/explore/OrgModal";
import OrgForm from "@/components/admin/OrgForm";
import { useAdmin } from "@/contexts/AdminContext";

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
  const location = useLocation();
  const { adminMode } = useAdmin();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState(null); // null = closed, {} = new, org = editing
  // Pre-populate filters if navigated here from the dashboard
  const [filters, setFilters] = useState(() => location.state?.filters || {});

  const pathnameRef = React.useRef(location.pathname);
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate;
  useEffect(() => {
    // Clear router state after consuming it so back-nav doesn't re-apply stale filters.
    // We only want this to fire once on mount, so we read refs rather than listing
    // location/navigate as deps (which would re-run on every navigation).
    if (location.state?.filters) {
      navigateRef.current(pathnameRef.current, { replace: true, state: null });
    }
  }, []); // intentional: runs only on mount to consume initial route state
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hbs_saved_orgs") || "[]");
    } catch {
      return [];
    }
  });
  const [showFilters, setShowFilters] = useState(() => !!(location.state?.filters && Object.keys(location.state.filters).length > 0));
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? "grid" : "table"
  );

  const reloadOrgs = () => {
    setLoading(true);
    fetchOrgs()
      .then((data) => setOrgs(data))
      .catch((err) => console.error("Error fetching organizations:", err))
      .finally(() => setLoading(false));
  };

  const reloadOrgsRef = React.useRef(reloadOrgs);
  reloadOrgsRef.current = reloadOrgs;
  useEffect(() => {
    reloadOrgsRef.current();
  }, []); // intentional: fetch once on mount only

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

  const handleDelete = async (org) => {
    try {
      await deleteOrg(org.id);
      setOrgs(prev => prev.filter(o => o.id !== org.id));
    } catch (err) {
      console.error("Error deleting org:", err);
    }
  };

  const parsed = useMemo(() => parseSearch(search), [search]);

  const filtered = orgs.filter((org) => {
    if (showSavedOnly && !savedIds.includes(org.id)) return false;
    const kw = parsed.keyword;
    if (
      kw &&
      !org.name?.toLowerCase().includes(kw.toLowerCase()) &&
      !org.description?.toLowerCase().includes(kw.toLowerCase())
    )
      return false;
    for (const cond of parsed.conditions) {
      if (!matchesCondition(org, cond)) return false;
    }

    // FilterBar filters
    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "aum") {
        const orgAum = org.aum || "";
        if (!values.includes(orgAum)) return false;
      } else if (key === "org_type") {
        const orgVal = org[key] || "";
        const match = values.some(
          (v) =>
            orgVal === v ||
            (orgVal === "Impact Investing / Foundation" &&
              (v === "Impact Investing" || v === "Foundation"))
        );
        if (!match) return false;
      } else if (key === "industry") {
        const orgVal = org.industry || "";
        if (!values.includes(orgVal)) return false;
      } else if (key === "regions") {
        const expanded = expandRegions(values);
        const orgVals = getValuesAsArray(org[key]);
        if (!expanded.some((v) => orgVals.includes(v))) return false;
      } else {
        const orgVals = getValuesAsArray(org[key]);
        if (!values.some((v) => orgVals.includes(v))) return false;
      }
    }

    // Column-level inline filters (additive AND with FilterBar)
    for (const [colKey, values] of Object.entries(columnFilters)) {
      if (!values?.length) continue;
      const orgVals = getValuesAsArray(org[colKey]);
      if (orgVals.length) {
        // Tag / multi-value column: OR within the column
        if (!values.some((v) => orgVals.includes(v))) return false;
      } else {
        // Scalar column (org_type, industry, hq, employees)
        const scalar = String(org[colKey] || "");
        if (!values.includes(scalar)) return false;
      }
    }

    return true;
  });

  const activeFilterCount = Object.values(filters).reduce(
    (n, v) => n + (v?.length || 0),
    0
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 bg-white"
            placeholder='Search orgs... try "founded after 2003"'
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

        {/* Saved filter toggle */}
        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showSavedOnly
              ? "border-crimson text-crimson bg-crimson/5"
              : "border-gray-200 text-gray-600 bg-white hover:border-crimson hover:text-crimson hover:bg-crimson/5"
          }`}
          title="Show saved organizations"
        >
          <Bookmark className={`w-4 h-4 ${showSavedOnly ? "fill-crimson" : ""}`} />
          <span className="hidden sm:inline">
            Saved{savedIds.length > 0 ? ` (${savedIds.length})` : ""}
          </span>
        </button>

        {/* Nominate button */}
        <button
          onClick={() => navigate("/all-orgs/nominate")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-crimson hover:text-crimson hover:bg-crimson/5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nominate</span>
        </button>

        {/* Admin: Add Org button */}
        {adminMode && (
          <button
            onClick={() => setEditingOrg({})}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Org</span>
          </button>
        )}
      </div>

      {parsed.conditions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs text-gray-400 font-medium">Smart filters:</span>
          {parsed.conditions.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-crimson/10 text-crimson text-xs font-medium rounded-full border border-crimson/20">
              {c.label}
              <button onClick={() => {
                let cleaned = search;
                for (const p of SEARCH_PATTERNS) {
                  const m = cleaned.match(p.regex);
                  if (m && p.build(m).label === c.label) { cleaned = cleaned.replace(p.regex, "").replace(/\s+/g, " ").trim(); break; }
                }
                setSearch(cleaned);
              }} className="ml-0.5 hover:text-crimson/70"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {parsed.keyword && <span className="text-xs text-gray-400">+ keyword: "{parsed.keyword}"</span>}
        </div>
      )}

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
              allOrgs={orgs}
              savedIds={savedIds}
              onSave={toggleSave}
              onRowClick={setSelectedOrg}
              onEdit={adminMode ? (org) => setEditingOrg(org) : undefined}
              onDelete={adminMode ? handleDelete : undefined}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
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
                  onEdit={adminMode ? () => setEditingOrg(org) : undefined}
                  onDelete={adminMode ? () => handleDelete(org) : undefined}
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

      {/* Admin: inline OrgForm modal */}
      {editingOrg !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-10"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingOrg(null); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingOrg?.id ? "Edit Organization" : "Add Organization"}
              </h2>
              <button
                onClick={() => setEditingOrg(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5">
              <OrgForm
                org={editingOrg?.id ? editingOrg : undefined}
                onSave={() => { setEditingOrg(null); reloadOrgs(); }}
                onCancel={() => setEditingOrg(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
