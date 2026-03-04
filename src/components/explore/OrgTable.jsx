import React, { useState } from "react";
import { ExternalLink, Bookmark, BookmarkCheck, Pencil, Trash2, Users, Award, Lightbulb } from "lucide-react";

// ── Inline badge chips for table rows ────────────────────────
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
  const tags = Array.isArray(items)
    ? items.flatMap(i => i.split(";").map(s => s.trim()).filter(Boolean))
    : items.split(";").map(s => s.trim()).filter(Boolean);
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
      <button
        onClick={() => onDelete(orgId)}
        className="px-2.5 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 min-h-[36px]"
      >
        Confirm
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-2.5 py-1.5 text-xs font-medium border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 min-h-[36px]"
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true); }}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export default function OrgTable({ orgs, savedIds, onSave, onRowClick, onEdit, onDelete }) {
  const hasAdminCols = onEdit || onDelete;

  return (
    // overflow-x-auto gives mobile a horizontal scroll fallback if needed;
    // responsive column hiding handles the common case without scrolling.
    <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[320px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {/* Save — always visible */}
            <th className="text-left px-3 sm:px-4 py-3 w-8"></th>
            {/* Organization — always visible */}
            <th className="text-left px-3 sm:px-4 py-3">Organization</th>
            {/* Type — hidden on xs, visible sm+ */}
            <th className="text-left px-3 sm:px-4 py-3 hidden sm:table-cell">Type</th>
            {/* Cause Areas — hidden on xs/sm, visible md+ */}
            <th className="text-left px-3 sm:px-4 py-3 hidden md:table-cell">Cause Areas</th>
            {/* Regions — hidden on xs/sm/md, visible lg+ */}
            <th className="text-left px-3 sm:px-4 py-3 hidden lg:table-cell">Regions</th>
            {/* External link — always visible */}
            <th className="text-left px-3 sm:px-4 py-3 w-8"></th>
            {hasAdminCols && <th className="text-left px-3 sm:px-4 py-3 w-20"></th>}
          </tr>
        </thead>
        <tbody>
          {orgs.map((org, i) => (
            <tr
              key={org.id}
              onClick={() => onRowClick(org)}
              className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
            >
              {/* Save / bookmark */}
              <td className="px-3 sm:px-4 py-3">
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

              {/* Organization name + description */}
              <td className="px-3 sm:px-4 py-3">
                <p className="font-semibold text-gray-900 leading-tight">{org.name}</p>
                {org.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs hidden sm:block">{org.description}</p>
                )}
                <RowBadges org={org} />
                {/* Show type inline on mobile since the Type column is hidden */}
                {org.org_type && (
                  <span className="mt-1 inline-block sm:hidden px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{org.org_type}</span>
                )}
              </td>

              {/* Type — sm+ */}
              <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                {org.org_type && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{org.org_type}</span>
                )}
              </td>

              {/* Cause Areas — md+ */}
              <td className="px-3 sm:px-4 py-3 max-w-xs hidden md:table-cell">
                <TagList items={org.cause_areas} colorClass="bg-crimson/10 text-crimson" />
              </td>

              {/* Regions — lg+ */}
              <td className="px-3 sm:px-4 py-3 max-w-xs hidden lg:table-cell">
                <TagList items={org.regions} colorClass="bg-blue-50 text-blue-600" />
              </td>

              {/* External link */}
              <td className="px-3 sm:px-4 py-3">
                {org.website && (
                  <a
                    href={org.website}
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
                <td className="px-3 sm:px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-0.5">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(org)}
                        className="p-2 text-gray-300 hover:text-crimson hover:bg-crimson/5 rounded-lg transition-colors"
                        title="Edit"
                      >
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
      {orgs.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No organizations match your filters.</div>
      )}
    </div>
  );
}
