import React from "react";
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";

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

export default function OrgTable({ orgs, savedIds, onSave, onRowClick }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="text-left px-4 py-3 w-8"></th>
            <th className="text-left px-4 py-3">Organization</th>
            <th className="text-left px-4 py-3">Type</th>
            <th className="text-left px-4 py-3">Cause Areas</th>
            <th className="text-left px-4 py-3">Regions</th>
            <th className="text-left px-4 py-3 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {orgs.map((org, i) => (
            <tr
              key={org.id}
              onClick={() => onRowClick(org)}
              className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
            >
              <td className="px-4 py-3">
                <button
                  onClick={e => { e.stopPropagation(); onSave(org.id); }}
                  className="text-gray-300 hover:text-crimson"
                >
                  {savedIds.includes(org.id)
                    ? <BookmarkCheck className="w-4 h-4 text-crimson" />
                    : <Bookmark className="w-4 h-4" />}
                </button>
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-gray-900 leading-tight">{org.name}</p>
                {org.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{org.description}</p>
                )}
              </td>
              <td className="px-4 py-3">
                {org.org_type && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{org.org_type}</span>
                )}
              </td>
              <td className="px-4 py-3 max-w-xs">
                <TagList items={org.cause_areas} colorClass="bg-crimson/10 text-crimson" />
              </td>
              <td className="px-4 py-3 max-w-xs">
                <TagList items={org.regions} colorClass="bg-blue-50 text-blue-600" />
              </td>
              <td className="px-4 py-3">
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-gray-400 hover:text-crimson"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </td>
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
