import React, { useState } from "react";
import { ExternalLink, Bookmark, BookmarkCheck, Pencil, Trash2 } from "lucide-react";

export default function OrgCard({ org, saved, onSave, onClick, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer relative group"
      onClick={onClick}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{org.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{org.org_type}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSave(org.id); }}
          className="text-gray-300 hover:text-crimson flex-shrink-0 mt-0.5">
          {saved ? <BookmarkCheck className="w-4 h-4 text-crimson" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {org.description &&
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{org.description}</p>
      }

      {(org.cause_areas || []).length > 0 &&
        <div className="mt-3 flex flex-wrap gap-1 justify-center">
          {org.cause_areas.flatMap(a => a.split(";").map(s => s.trim()).filter(Boolean)).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium bg-crimson/10 text-crimson">{tag}</span>
          ))}
        </div>
      }

      <div className="mt-3 flex items-center justify-between">
        {/* Admin actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={() => onEdit(org)}
                className="p-1.5 text-gray-400 hover:text-crimson hover:bg-crimson/5 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && confirmDelete && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDelete(org.id)}
                  className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs font-medium border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {!(onEdit || onDelete) && <div />}

        {org.website &&
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-crimson">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      </div>
    </div>
  );
}
