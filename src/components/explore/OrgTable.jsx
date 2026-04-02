import React, { useState, useMemo, useRef, useEffect } from "react";
import { ExternalLink, Bookmark, BookmarkCheck, Pencil, Trash2, Users, Award, Lightbulb, ArrowUp, ArrowDown, ArrowUpDown, Filter, Check, X } from "lucide-react";
import { sanitizeUrl } from "@/lib/security";

// ── helpers ─────────────────────────────────────────────────
function parseTags(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.flatMap(s => s.split(";").map(v => v.trim()).filter(Boolean));
  return val.split(";").map(s => s.trim()).filter(Boolean);
}

// ── Column definitions ──────────────────────────────────────
const COLUMNS = [
  { key: "_save",              label: "",             sortable: false, filterable: false, width: "w-8" },
  { key: "name",               label: "Organization", sortable: true,  filterable: false, type: "text" },
  { key: "org_type",           label: "Type",         sortable: true,  filterable: true,  type: "text" },
  { key: "industry",           label: "Industry",     sortable: true,  filterable: true,  type: "text" },
  { key: "cause_areas",        label: "Cause Areas",  sortable: false, filterable: true,  type: "tags" },
  { key: "regions",            label: "Regions",      sortable: false, filterable: true,  type: "tags" },
  { key: "role_types",         label: "Role",         sortable: false, filterable: true,  type: "tags" },
  { key: "target_populations", label: "Populations",  sortable: false, filterable: true,  type: "tags" },
  { key: "hq",                label: "HQ",           sortable: true,  filterable: true,  type: "text" },
  { key: "employees",         label: "Employees",    sortable: true,  filterable: true,  type: "text" },
  { key: "year_established",  label: "Est.",          sortable: true,  filterable: false, type: "number" },
  { key: "_link",              label: "",             sortable: false, filterable: false, width: "w-8" },
];

// ── Inline badge chips for table rows ───────────────────────
function RowBadges({ org }) {
  const badges = [
    org.badge_alumni_work_here   && { label: "Alumni",     color: "bg-indigo-50 text-indigo-600", icon: <Users className="w-2.5 h-2.5" /> },
    org.badge_fellowship_partner && { label: "Fellowship", color: "bg-blue-50 text-blue-600",     icon: <Award className="w-2.5 h-2.5" /> },
    org.badge_hbs_founder        && { label: "Founder",    color: "bg-amber-50 text-amber-600",   icon: <Lightbulb className="w-2.5 h-2.5" /> },
  ].filter(Boolean);
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-0.5">
      {badges.map(b => (
        <span key={b.label} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${b.color}`}>
          {b.icon}{b.label}
        </span>
      ))}
    </div>
  );
}

function TagList({ items, colorClass = "bg-crimson/10 text-crimson" }) {
  if (!items?.length) return null;
  const tags = parseTags(items);
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{tag}</span>
      ))}
    </div>
  );
}

function DeleteCell({ orgId, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <button onClick={() => onDelete(orgId)} className="px-2.5 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 min-h-[36px]">Confirm</button>
      <button onClick={() => setConfirming(false)} className="px-2.5 py-1.5 text-xs font-medium border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 min-h-[36px]">Cancel</button>
    </div>
  ) : (
    <button onClick={e => { e.stopPropagation(); setConfirming(true); }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// ── Filter dropdown popover ─────────────────────────────────
function FilterDropdown({ column, allOrgs, activeFilters, onApply, onClose }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState(new Set(activeFilters || []));
  const [search, setSearch] = useState("");

  const allValues = useMemo(() => {
    const set = new Set();
    allOrgs.forEach(row => {
      if (column.type === "tags") {
        parseTags(row[column.key]).forEach(v => set.add(v));
      } else if (row[column.key]) {
        set.add(String(row[column.key]));
      }
    });
    return [...set].sort();
  }, [allOrgs, column]);

  const filtered = search
    ? allValues.filter(v => v.toLowerCase().includes(search.toLowerCase()))
    : allValues;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const toggle = (v) => {
    const next = new Set(selected);
    next.has(v) ? next.delete(v) : next.add(v);
    setSelected(next);
  };

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-56 overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="p-2 border-b border-gray-100">
        <input
          autoFocus
          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson/40"
          placeholder={`Search ${column.label.toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-48 overflow-y-auto p-1">
        {filtered.length === 0 && <div className="text-xs text-gray-400 text-center py-3">No matches</div>}
        {filtered.map(v => (
          <label key={v} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer text-xs text-gray-700" onClick={() => toggle(v)}>
            <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selected.has(v) ? "bg-crimson border-crimson" : "border-gray-300"}`}>
              {selected.has(v) && <Check className="w-3 h-3 text-white" />}
            </span>
            <span className="truncate">{v}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between p-2 border-t border-gray-100 bg-gray-50/50">
        <button onClick={() => { setSelected(new Set()); onApply([]); onClose(); }} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
        <button onClick={() => { onApply([...selected]); onClose(); }} className="px-3 py-1 text-xs font-medium text-white rounded-md bg-crimson hover:bg-crimson/90 transition-colors">Apply</button>
      </div>
    </div>
  );
}

// ── Column header with sort + filter ────────────────────────
function ColumnHeader({ col, sortConfig, onSort, filterActive, openFilter, onToggleFilter }) {
  return (
    <th className={`text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide relative ${col.width || ""}`}>
      <div className="flex items-center gap-1">
        {col.sortable ? (
          <button onClick={() => onSort(col.key)} className="flex items-center gap-1 hover:text-gray-800 transition-colors group">
            {col.label}
            {sortConfig?.key === col.key ? (
              sortConfig.dir === "asc"
                ? <ArrowUp className="w-3 h-3 text-crimson" />
                : <ArrowDown className="w-3 h-3 text-crimson" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />
            )}
          </button>
        ) : col.label ? (
          <span>{col.label}</span>
        ) : null}

        {col.filterable && (
          <button
            onClick={e => { e.stopPropagation(); onToggleFilter(col.key); }}
            className={`p-0.5 rounded transition-colors ${filterActive ? "text-crimson bg-crimson/10" : "text-gray-300 hover:text-gray-500"}`}
            title={`Filter by ${col.label}`}
          >
            <Filter className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Render the filter dropdown anchored to this header */}
      {openFilter === col.key && col.filterable && (
        <div className="absolute left-0 top-full z-50" style={{ minWidth: "14rem" }}>
          {/* placeholder: the actual dropdown is rendered via props */}
        </div>
      )}
    </th>
  );
}

// ── Main component ──────────────────────────────────────────
export default function OrgTable({ orgs, allOrgs, savedIds, onSave, onRowClick, onEdit, onDelete, columnFilters, onColumnFiltersChange }) {
  const hasAdminCols = onEdit || onDelete;
  const [sortConfig, setSortConfig] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);

  // Use allOrgs (unfiltered) for populating filter dropdowns, fallback to orgs
  const orgPool = allOrgs || orgs;

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.dir === "asc") return { key, dir: "desc" };
        return null;
      }
      return { key, dir: "asc" };
    });
  };

  const handleApplyFilter = (colKey, values) => {
    if (onColumnFiltersChange) {
      const next = { ...columnFilters };
      if (!values.length) delete next[colKey];
      else next[colKey] = values;
      onColumnFiltersChange(next);
    }
  };

  // Sort the already-filtered orgs
  const sortedOrgs = useMemo(() => {
    if (!sortConfig) return orgs;
    const { key, dir } = sortConfig;
    return [...orgs].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  }, [orgs, sortConfig]);

  return (
    <div>
      {/* Active column-filter pills */}
      {columnFilters && Object.keys(columnFilters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium text-gray-500">Column filters:</span>
          {Object.entries(columnFilters).map(([colKey, values]) => {
            const col = COLUMNS.find(c => c.key === colKey);
            return values.map(v => (
              <span key={`${colKey}-${v}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-crimson/10 text-crimson">
                {col?.label}: {v}
                <button
                  onClick={() => handleApplyFilter(colKey, values.filter(x => x !== v))}
                  className="hover:bg-crimson/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ));
          })}
          <button onClick={() => onColumnFiltersChange && onColumnFiltersChange({})} className="text-xs text-gray-500 hover:text-gray-700 underline">
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {COLUMNS.map(col => (
                <ColumnHeader
                  key={col.key}
                  col={col}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  filterActive={!!columnFilters?.[col.key]?.length}
                  openFilter={openFilter}
                  onToggleFilter={k => setOpenFilter(prev => prev === k ? null : k)}
                />
              ))}
              {hasAdminCols && <th className="text-left px-3 py-3 w-20"></th>}
            </tr>
            {/* Filter dropdown rendered as an overlay row */}
            {openFilter && (
              <tr>
                <td colSpan={COLUMNS.length + (hasAdminCols ? 1 : 0)} className="p-0" style={{ height: 0, position: "relative", overflow: "visible" }}>
                  <div style={{ position: "absolute", left: (() => {
                    // Position the dropdown roughly below the column header
                    const idx = COLUMNS.findIndex(c => c.key === openFilter);
                    // Approximate: 1st col is narrow (bookmark), rest ~120px
                    if (idx <= 0) return "0px";
                    return `${32 + (idx - 1) * 110}px`;
                  })(), top: 0, zIndex: 50 }}>
                    <FilterDropdown
                      column={COLUMNS.find(c => c.key === openFilter)}
                      allOrgs={orgPool}
                      activeFilters={columnFilters?.[openFilter] || []}
                      onApply={vals => handleApplyFilter(openFilter, vals)}
                      onClose={() => setOpenFilter(null)}
                    />
                  </div>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {sortedOrgs.map((org, i) => (
              <tr
                key={org.id}
                onClick={() => onRowClick(org)}
                className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
              >
                {/* Save / bookmark */}
                <td className="px-3 py-3">
                  <button
                    onClick={e => { e.stopPropagation(); onSave(org.id); }}
                    className="p-1.5 -m-1.5 text-gray-300 hover:text-crimson rounded"
                    aria-label={savedIds.includes(org.id) ? "Unsave" : "Save"}
                  >
                    {savedIds.includes(org.id)
                      ? <BookmarkCheck className="w-4 h-4 text-crimson" />
                      : <Bookmark className="w-4 h-4" />}
                  </button>
                </td>

                {/* Organization name + description + badges */}
                <td className="px-3 py-3 min-w-[180px]">
                  <p className="font-semibold text-gray-900 leading-tight">{org.name}</p>
                  {org.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{org.description}</p>
                  )}
                  <RowBadges org={org} />
                </td>

                {/* Type */}
                <td className="px-3 py-3 whitespace-nowrap">
                  {org.org_type && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{org.org_type}</span>
                  )}
                </td>

                {/* Industry */}
                <td className="px-3 py-3 whitespace-nowrap">
                  {org.industry && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">{org.industry}</span>
                  )}
                </td>

                {/* Cause Areas */}
                <td className="px-3 py-3 max-w-[200px]">
                  <TagList items={org.cause_areas} colorClass="bg-crimson/10 text-crimson" />
                </td>

                {/* Regions */}
                <td className="px-3 py-3 max-w-[180px]">
                  <TagList items={org.regions} colorClass="bg-blue-50 text-blue-600" />
                </td>

                {/* Role */}
                <td className="px-3 py-3 max-w-[160px]">
                  <TagList items={org.role_types} colorClass="bg-purple-50 text-purple-600" />
                </td>

                {/* Target Populations */}
                <td className="px-3 py-3 max-w-[180px]">
                  <TagList items={org.target_populations} colorClass="bg-amber-50 text-amber-700" />
                </td>

                {/* HQ */}
                <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                  {org.hq || ""}
                </td>

                {/* Employees */}
                <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                  {org.employees || ""}
                </td>

                {/* Year Established */}
                <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                  {org.year_established || ""}
                </td>

                {/* External link */}
                <td className="px-3 py-3">
                  {sanitizeUrl(org.website) && (
                    <a
                      href={sanitizeUrl(org.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 -m-1.5 text-gray-400 hover:text-crimson inline-block"
                      aria-label="Visit website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </td>

                {/* Admin actions */}
                {hasAdminCols && (
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-0.5">
                      {onEdit && (
                        <button onClick={() => onEdit(org)} className="p-2 text-gray-300 hover:text-crimson hover:bg-crimson/5 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && <DeleteCell orgId={org.id} onDelete={onDelete} />}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedOrgs.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No organizations match your filters.</div>
        )}
      </div>
    </div>
  );
}
