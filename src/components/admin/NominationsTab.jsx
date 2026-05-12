import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Search, X, ExternalLink, AlertCircle
} from "lucide-react";
import { updateNominationStatus } from "@/api/nominationsApi";
import { sanitizeUrl } from "@/lib/security";

const STATUS_TABS = ["All", "Pending", "Accepted", "Rejected"];

function StatusBadge({ status }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" /> Accepted
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function NominationsTab({ nominations: initialNoms, onReload, onApprove }) {
  const [items, setItems]         = useState(initialNoms);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState(null);
  const [rejectNote, setRejectNote] = useState({});
  const [rejecting, setRejecting] = useState(null); // id being rejected (shows note input)
  const [working, setWorking]     = useState(null);

  // Use a JSON-serialised ref to detect real content changes rather than
  // reacting to a new array reference on every parent render.
  const initialNomsJsonRef = useRef(null);
  useEffect(() => {
    const json = JSON.stringify(initialNoms);
    if (json !== initialNomsJsonRef.current) {
      initialNomsJsonRef.current = json;
      setItems(initialNoms);
    }
  }, [initialNoms]);

  // ── Counts ────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    All:      items.length,
    Pending:  items.filter(n => n.status === "pending").length,
    Accepted: items.filter(n => n.status === "approved").length,
    Rejected: items.filter(n => n.status === "rejected").length,
  }), [items]);

  // ── Filtered & sorted (submission date desc) ──────────────────
  const filtered = useMemo(() => {
    let list = [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (activeFilter === "Pending")  list = list.filter(n => n.status === "pending");
    if (activeFilter === "Accepted") list = list.filter(n => n.status === "approved");
    if (activeFilter === "Rejected") list = list.filter(n => n.status === "rejected");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.name?.toLowerCase().includes(q) ||
        n.org_type?.toLowerCase().includes(q) ||
        n.submitted_by?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeFilter, search]);

  // ── Actions ───────────────────────────────────────────────────
  const handleReject = async (id) => {
    setWorking(id);
    const note = rejectNote[id] ?? "";
    try {
      await updateNominationStatus(id, "rejected", note);
      setItems(prev => prev.map(n => n.id === id ? { ...n, status: "rejected", admin_notes: note } : n));
      setRejecting(null);
      onReload?.();
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5
                ${activeFilter === tab
                  ? "bg-crimson text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              {tab}
              <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center
                ${activeFilter === tab ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="sm:ml-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 w-52"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-gray-400 text-sm">No nominations found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Submitted By</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell w-24">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Status</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(n => {
                const isExpanded = expanded === n.id;
                const safeWebsite = n.website ? sanitizeUrl(n.website) : null;

                return (
                  <React.Fragment key={n.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : n.id)}
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">{n.name}</span>
                          {safeWebsite && (
                            <a
                              href={safeWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-gray-300 hover:text-crimson flex-shrink-0"
                              title="Visit website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        <span className="text-xs">{n.org_type || <span className="italic text-gray-300">—</span>}</span>
                      </td>

                      {/* Submitted by */}
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                        <span className="text-xs truncate max-w-[120px] block">
                          {n.submitted_by || <span className="italic text-gray-300">Anonymous</span>}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell whitespace-nowrap">
                        {new Date(n.created_at).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={n.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-end">
                          {n.status === "pending" && (
                            <>
                              <button
                                onClick={() => onApprove(n)}
                                disabled={working === n.id}
                                className="flex items-center gap-1 text-xs bg-green-500 text-white rounded-md px-2.5 py-1 hover:bg-green-600 disabled:opacity-50 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" /> Accept
                              </button>
                              <button
                                onClick={() => setRejecting(rejecting === n.id ? null : n.id)}
                                disabled={working === n.id}
                                className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-md px-2.5 py-1 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                              >
                                <XCircle className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          <span className={`text-gray-300 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* ── Reject note input ── */}
                    {rejecting === n.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-3 bg-red-50 border-t border-red-100">
                          <div className="flex items-start gap-2 max-w-xl">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="text-xs text-red-600 font-medium mb-1.5">Optional: add a note before rejecting</p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={rejectNote[n.id] ?? ""}
                                  onChange={e => setRejectNote(r => ({ ...r, [n.id]: e.target.value }))}
                                  placeholder="Reason for rejection (optional)"
                                  className="flex-1 border border-red-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
                                  onKeyDown={e => e.key === "Enter" && handleReject(n.id)}
                                />
                                <button
                                  onClick={() => handleReject(n.id)}
                                  disabled={working === n.id}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                                >
                                  Confirm Reject
                                </button>
                                <button
                                  onClick={() => setRejecting(null)}
                                  className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* ── Expanded detail row ── */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 border-t border-b border-gray-100 px-6 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl text-xs">
                            {n.description && (
                              <div className="sm:col-span-2">
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                                <p className="text-gray-700 leading-relaxed">{n.description}</p>
                              </div>
                            )}
                            {n.cause_areas && (
                              <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Cause Areas</p>
                                <p className="text-gray-700">{n.cause_areas}</p>
                              </div>
                            )}
                            {n.regions && (
                              <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Regions</p>
                                <p className="text-gray-700">{n.regions}</p>
                              </div>
                            )}
                            {n.hbs_connection && (
                              <div className="sm:col-span-2">
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">HBS Connection</p>
                                <p className="text-gray-700">{n.hbs_connection}</p>
                              </div>
                            )}
                            {n.submitted_by && (
                              <div className="sm:hidden">
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Submitted By</p>
                                <p className="text-gray-700">{n.submitted_by}</p>
                              </div>
                            )}
                            {n.admin_notes && (
                              <div className="sm:col-span-2">
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Admin Notes</p>
                                <p className="text-gray-700 italic">{n.admin_notes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right">{filtered.length} of {items.length} nominations shown</p>
    </div>
  );
}
