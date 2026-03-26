import React, { useState, useMemo, useEffect } from "react";
import {
  Star, Archive, ArchiveRestore, Trash2, ChevronDown,
  MessageSquare, Send, Loader2, Search, X, AlertTriangle
} from "lucide-react";
import { updateFeedback, deleteFeedback } from "@/api/feedbackApi";

const TYPE_COLORS = {
  "General":         "bg-blue-50 text-blue-700",
  "Bug":             "bg-red-50 text-red-700",
  "Feature Request": "bg-purple-50 text-purple-700",
  "Missing Org":     "bg-amber-50 text-amber-700",
  "Other":           "bg-gray-100 text-gray-600",
};

const FILTER_TABS  = ["All", "Starred", "Archived"];
const TYPE_OPTIONS = ["All Types", "General", "Bug", "Feature Request", "Missing Org", "Other"];

export default function FeedbackTab({ feedback: initialFeedback }) {
  const [items,        setItems]        = useState(initialFeedback);
  const [activeFilter, setActiveFilter] = useState("All");
  const [typeFilter,   setTypeFilter]   = useState("All Types");
  const [search,       setSearch]       = useState("");
  const [expanded,     setExpanded]     = useState(null);
  const [commentDraft, setCommentDraft] = useState({});
  const [saving,       setSaving]       = useState({});
  const [saveError,    setSaveError]    = useState({});
  const [deleting,     setDeleting]     = useState(null);

  useEffect(() => { setItems(initialFeedback); }, [initialFeedback]);

  // ── Optimistic patch helper ───────────────────────────────────
  const patch = (id, updates) =>
    setItems(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

  // ── Star / archive (DB-backed, optimistic) ────────────────────
  const toggleStar = async (id, current) => {
    patch(id, { starred: !current });
    try { await updateFeedback(id, { starred: !current }); }
    catch { patch(id, { starred: current }); }
  };

  const toggleArchive = async (id, current) => {
    patch(id, { archived: !current });
    try { await updateFeedback(id, { archived: !current }); }
    catch { patch(id, { archived: current }); }
  };

  // ── Admin comment (DB-backed) ─────────────────────────────────
  const saveComment = async (id) => {
    const comment = commentDraft[id] ?? "";
    setSaving(s  => ({ ...s,  [id]: true  }));
    setSaveError(e => ({ ...e, [id]: null }));
    try {
      await updateFeedback(id, { admin_comment: comment });
      setItems(prev => prev.map(f => f.id === id ? { ...f, admin_comment: comment } : f));
      setCommentDraft(d => { const n = { ...d }; delete n[id]; return n; });
    } catch (err) {
      const msg = err?.message?.toLowerCase().includes("security policy")
        ? "Run add_feedback_admin_columns.sql in Supabase to enable notes."
        : (err?.message || "Failed to save.");
      setSaveError(e => ({ ...e, [id]: msg }));
    } finally {
      setSaving(s => ({ ...s, [id]: false }));
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      setItems(prev => prev.filter(f => f.id !== id));
    } catch (err) { console.error("Delete failed:", err); }
    setDeleting(null);
  };

  // ── Counts ────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    All:      items.filter(f => !f.archived).length,
    Starred:  items.filter(f => f.starred && !f.archived).length,
    Archived: items.filter(f => f.archived).length,
  }), [items]);

  // ── Filtered list ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = items;
    if (activeFilter === "Starred")       list = list.filter(f => f.starred && !f.archived);
    else if (activeFilter === "Archived") list = list.filter(f => f.archived);
    else                                  list = list.filter(f => !f.archived);

    if (typeFilter !== "All Types") list = list.filter(f => f.type === typeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.message?.toLowerCase().includes(q) ||
        f.name?.toLowerCase().includes(q)    ||
        f.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [enriched, activeFilter, typeFilter, search]);

  return (
    <div className="space-y-4">
      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5
                ${activeFilter === tab
                  ? "bg-[#A51C30] text-white shadow-sm"
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

        <div className="flex gap-2 sm:ml-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
          >
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 w-40"
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
          <div className="text-center py-14 text-gray-400 text-sm">No feedback entries found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-8 px-3 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell w-24">Date</th>
                <th className="px-3 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(f => {
                const isExpanded     = expanded === f.id;
                const draftComment   = commentDraft[f.id] ?? f.admin_comment ?? "";
                const commentChanged = commentDraft[f.id] !== undefined && commentDraft[f.id] !== (f.admin_comment ?? "");

                return (
                  <React.Fragment key={f.id}>
                    <tr
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${f.starred ? "bg-amber-50/30" : ""}`}
                      onClick={() => setExpanded(isExpanded ? null : f.id)}
                    >
                      {/* Star */}
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleStar(f.id, f.starred)}
                          className={`p-1 rounded transition-colors ${f.starred ? "text-amber-400 hover:text-amber-500" : "text-gray-200 hover:text-amber-300"}`}
                          title={f.starred ? "Unstar" : "Star"}
                        >
                          <Star className={`w-3.5 h-3.5 ${f.starred ? "fill-current" : ""}`} />
                        </button>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[f.type] || TYPE_COLORS["Other"]}`}>
                          {f.type}
                        </span>
                      </td>

                      {/* From */}
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        <div className="text-xs">
                          {f.name  && <span className="font-medium text-gray-700">{f.name}</span>}
                          {f.email && <div className="text-gray-400 truncate max-w-[140px]">{f.email}</div>}
                          {!f.name && !f.email && <span className="italic text-gray-300">Anonymous</span>}
                        </div>
                      </td>

                      {/* Message preview */}
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="line-clamp-2 text-sm leading-snug">{f.message}</span>
                          {f.admin_comment && (
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" title="Has admin note" />
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">
                        {new Date(f.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => toggleArchive(f.id, f.archived)}
                            className={`p-1.5 rounded transition-colors ${
                              f.archived
                                ? "text-[#A51C30] hover:bg-red-50"
                                : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                            }`}
                            title={f.archived ? "Unarchive" : "Archive"}
                          >
                            {f.archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                          </button>

                          {deleting === f.id ? (
                            <div className="flex items-center gap-1 text-xs">
                              <button onClick={() => handleDelete(f.id)} className="text-red-500 font-medium hover:text-red-700">Del</button>
                              <button onClick={() => setDeleting(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleting(f.id)}
                              className="p-1.5 rounded text-gray-200 hover:text-red-400 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <span className={`p-1 text-gray-300 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expanded detail ── */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 border-t border-b border-gray-100 px-6 py-4">
                          <div className="space-y-3 max-w-2xl">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full message</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{f.message}</p>
                            </div>

                            {(f.name || f.email) && (
                              <div className="sm:hidden">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">From</p>
                                <p className="text-sm text-gray-600">
                                  {f.name && <span className="font-medium">{f.name}</span>}
                                  {f.name && f.email && " · "}
                                  {f.email}
                                </p>
                              </div>
                            )}

                            <div className="md:hidden text-xs text-gray-400">
                              {new Date(f.created_at).toLocaleString()}
                            </div>

                            {/* Admin note */}
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Admin note</p>
                              <div className="flex gap-2">
                                <textarea
                                  rows={2}
                                  value={draftComment}
                                  onChange={e => setCommentDraft(d => ({ ...d, [f.id]: e.target.value }))}
                                  placeholder="Add a private note…"
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30"
                                />
                                <button
                                  onClick={() => saveComment(f.id)}
                                  disabled={!commentChanged || saving[f.id]}
                                  className="px-3 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-40 flex items-center gap-1.5 self-start"
                                >
                                  {saving[f.id]
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Send className="w-3.5 h-3.5" />
                                  }
                                  <span className="hidden sm:inline">Save</span>
                                </button>
                              </div>
                              {saveError[f.id] && (
                                <p className="mt-1.5 text-xs text-amber-700 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                  {saveError[f.id]}
                                </p>
                              )}
                            </div>
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

      <p className="text-xs text-gray-400 text-right">{filtered.length} of {items.length} entries shown</p>
    </div>
  );
}
