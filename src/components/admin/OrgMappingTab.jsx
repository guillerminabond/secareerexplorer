import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

// ── Dimension definitions ────────────────────────────────────────
const DIMENSIONS = [
  { key: "org_type",            label: "Org Type",           multi: false },
  { key: "cause_areas",         label: "Cause Area",         multi: true  },
  { key: "regions",             label: "Region",             multi: true  },
  { key: "role_types",          label: "Role Type",          multi: true  },
  { key: "target_populations",  label: "Target Population",  multi: true  },
];

// ── Helpers ──────────────────────────────────────────────────────
function getValues(org, dimKey) {
  const val = org[dimKey];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (val) return [val];
  return [];
}

function computeMatrix(orgs, dim1Key, dim2Key) {
  if (!dim1Key || !dim2Key) return null;

  const dim1Set = new Set();
  const dim2Set = new Set();
  orgs.forEach(org => {
    getValues(org, dim1Key).forEach(v => dim1Set.add(v));
    getValues(org, dim2Key).forEach(v => dim2Set.add(v));
  });

  const dim1Values = [...dim1Set].sort();
  const dim2Values = [...dim2Set].sort();

  // Build matrix: { row: { col: org[] } }
  const matrix = {};
  for (const v1 of dim1Values) {
    matrix[v1] = {};
    for (const v2 of dim2Values) {
      matrix[v1][v2] = orgs.filter(org =>
        getValues(org, dim1Key).includes(v1) &&
        getValues(org, dim2Key).includes(v2)
      );
    }
  }

  // Max count for color scaling
  let maxCount = 0;
  for (const v1 of dim1Values) {
    for (const v2 of dim2Values) {
      maxCount = Math.max(maxCount, matrix[v1][v2].length);
    }
  }

  return { dim1Values, dim2Values, matrix, maxCount };
}

// ── Cell color based on count intensity ─────────────────────────
function cellStyle(count, maxCount) {
  if (count === 0) return { background: "#f9fafb", color: "#d1d5db" };
  const intensity = maxCount > 0 ? count / maxCount : 0;
  // Interpolate from light crimson tint → deep crimson
  const alpha = 0.08 + intensity * 0.72;
  const textDark = intensity > 0.55;
  return {
    background: `rgba(165, 28, 48, ${alpha})`,
    color: textDark ? "#fff" : "#A51C30",
    fontWeight: count > 0 ? 600 : 400,
  };
}

// ── Org list popover ─────────────────────────────────────────────
function OrgPopover({ orgs, dim1Val, dim2Val, dim1Label, dim2Label, onClose }) {
  if (!orgs) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full max-h-[70vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
              {dim1Label} × {dim2Label}
            </p>
            <p className="font-semibold text-gray-900 text-sm leading-snug">
              {dim1Val} <span className="text-gray-400 font-normal">+</span> {dim2Val}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Org list */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
          {orgs.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No organizations</p>
          ) : (
            orgs.map(org => (
              <div key={org.id} className="px-5 py-3">
                <p className="font-medium text-gray-900 text-sm">{org.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{org.org_type}</p>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50">
          <p className="text-xs text-gray-400">{orgs.length} organization{orgs.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function OrgMappingTab({ orgs }) {
  const [dim1, setDim1] = useState("regions");
  const [dim2, setDim2] = useState("org_type");
  const [popover, setPopover] = useState(null); // { orgs, v1, v2 }

  const dim1Info = DIMENSIONS.find(d => d.key === dim1);
  const dim2Info = DIMENSIONS.find(d => d.key === dim2);

  const result = useMemo(() => computeMatrix(orgs, dim1, dim2), [orgs, dim1, dim2]);

  return (
    <div className="space-y-5">
      {/* ── Dimension selectors ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Select two dimensions to compare
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Rows</label>
            <select
              value={dim1}
              onChange={e => { if (e.target.value !== dim2) setDim1(e.target.value); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            >
              {DIMENSIONS.map(d => (
                <option key={d.key} value={d.key} disabled={d.key === dim2}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="text-gray-300 font-bold text-lg hidden sm:block mt-5">×</div>

          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Columns</label>
            <select
              value={dim2}
              onChange={e => { if (e.target.value !== dim1) setDim2(e.target.value); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
            >
              {DIMENSIONS.map(d => (
                <option key={d.key} value={d.key} disabled={d.key === dim1}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:mt-5 w-full sm:w-auto">
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 text-center border border-gray-100 whitespace-nowrap">
              {orgs.length} orgs mapped
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }} />
          <span className="text-xs text-gray-400">0</span>
        </div>
        <div className="w-20 h-3 rounded-sm" style={{ background: "linear-gradient(to right, rgba(165,28,48,0.1), rgba(165,28,48,0.8))" }} />
        <span className="text-xs text-gray-400">
          {result?.maxCount ?? 0} orgs
        </span>
        <span className="text-xs text-gray-300 ml-2">— click a cell to see the list</span>
      </div>

      {/* ── Matrix ── */}
      {result && result.dim1Values.length > 0 && result.dim2Values.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse" style={{ minWidth: "max-content" }}>
              <thead>
                <tr>
                  {/* Corner cell */}
                  <th className="sticky left-0 z-10 bg-gray-50 border-r border-b border-gray-100 px-4 py-3 text-left">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase">{dim1Info?.label}</span>
                      <span className="text-[10px] text-gray-300">↓ rows</span>
                    </div>
                  </th>
                  {result.dim2Values.map(v2 => (
                    <th
                      key={v2}
                      className="border-b border-gray-100 px-3 py-3 font-semibold text-gray-600 whitespace-nowrap text-center"
                      style={{ minWidth: "80px" }}
                    >
                      <div className="max-w-[100px] truncate" title={v2}>{v2}</div>
                    </th>
                  ))}
                  {/* Row total */}
                  <th className="border-b border-l border-gray-100 px-3 py-3 font-semibold text-gray-400 text-center whitespace-nowrap">
                    Total
                  </th>
                </tr>
                {/* Dim2 label row */}
                <tr>
                  <td
                    colSpan={result.dim2Values.length + 2}
                    className="sticky left-0 px-4 py-1 bg-gray-50 border-b border-gray-100"
                  >
                    <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                      {dim2Info?.label} → columns
                    </span>
                  </td>
                </tr>
              </thead>
              <tbody>
                {result.dim1Values.map(v1 => {
                  const rowTotal = result.dim2Values.reduce(
                    (sum, v2) => sum + result.matrix[v1][v2].length, 0
                  );
                  return (
                    <tr key={v1} className="group">
                      {/* Row label */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-b border-gray-50 px-4 py-2.5 font-medium text-gray-700 whitespace-nowrap transition-colors">
                        <span className="max-w-[150px] block truncate" title={v1}>{v1}</span>
                      </td>

                      {/* Data cells */}
                      {result.dim2Values.map(v2 => {
                        const cellOrgs = result.matrix[v1][v2];
                        const count = cellOrgs.length;
                        const style = cellStyle(count, result.maxCount);
                        return (
                          <td
                            key={v2}
                            className={`border-b border-gray-50 text-center transition-all ${count > 0 ? "cursor-pointer hover:opacity-80 hover:shadow-inner" : ""}`}
                            style={{ ...style, padding: "8px 12px" }}
                            onClick={() => count > 0 && setPopover({ orgs: cellOrgs, v1, v2 })}
                            title={count > 0 ? `${count} org${count !== 1 ? "s" : ""}: ${cellOrgs.map(o => o.name).join(", ")}` : "No organizations"}
                          >
                            {count > 0 ? count : <span style={{ color: "#d1d5db", fontWeight: 400 }}>·</span>}
                          </td>
                        );
                      })}

                      {/* Row total */}
                      <td className="border-b border-l border-gray-100 px-3 py-2.5 text-center font-semibold text-gray-400">
                        {rowTotal > 0 ? rowTotal : <span className="text-gray-200">·</span>}
                      </td>
                    </tr>
                  );
                })}

                {/* Column totals row */}
                <tr className="bg-gray-50 border-t border-gray-100">
                  <td className="sticky left-0 z-10 bg-gray-50 border-r border-gray-100 px-4 py-2.5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                    Total
                  </td>
                  {result.dim2Values.map(v2 => {
                    const colTotal = result.dim1Values.reduce(
                      (sum, v1) => sum + result.matrix[v1][v2].length, 0
                    );
                    return (
                      <td key={v2} className="px-3 py-2.5 text-center font-semibold text-gray-400">
                        {colTotal > 0 ? colTotal : <span className="text-gray-200">·</span>}
                      </td>
                    );
                  })}
                  <td className="border-l border-gray-100 px-3 py-2.5 text-center font-bold text-[#A51C30]">
                    {orgs.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center text-gray-400 text-sm">
          No data available for the selected dimensions.
        </div>
      )}

      {/* ── Org list popover ── */}
      {popover && (
        <OrgPopover
          orgs={popover.orgs}
          v1={popover.v1}
          v2={popover.v2}
          dim1Val={popover.v1}
          dim2Val={popover.v2}
          dim1Label={dim1Info?.label}
          dim2Label={dim2Info?.label}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  );
}
