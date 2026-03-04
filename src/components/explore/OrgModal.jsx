import React from "react";
import { X, ExternalLink, Pencil, Users, Award, Lightbulb } from "lucide-react";

const Section = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
};

const Tags = ({ label, items }) => {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
        ))}
      </div>
    </div>
  );
};

// ── HBS badge chips ───────────────────────────────────────────
function OrgBadges({ org }) {
  const badges = [
    org.badge_alumni_work_here   && { label: "Alumni Work Here",   color: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: <Users className="w-3 h-3" /> },
    org.badge_fellowship_partner && { label: "Fellowship Partner", color: "bg-blue-50 text-blue-700 border-blue-100",       icon: <Award className="w-3 h-3" /> },
    org.badge_hbs_founder        && { label: "HBS Founder",        color: "bg-amber-50 text-amber-700 border-amber-100",   icon: <Lightbulb className="w-3 h-3" /> },
  ].filter(Boolean);
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map(b => (
        <span key={b.label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${b.color}`}>
          {b.icon}{b.label}
        </span>
      ))}
    </div>
  );
}

export default function OrgModal({ org, onClose, onEdit }) {
  if (!org) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-xl font-bold text-gray-900">{org.name}</h2>
              <p className="text-sm text-gray-500">{org.org_type}</p>
              <OrgBadges org={org} />
              {org.saves > 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {org.saves} student{org.saves !== 1 ? "s" : ""} saved this
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => { onClose(); onEdit(org); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-crimson border border-crimson/30 rounded-lg hover:bg-crimson/5 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Section label="About" value={org.description} />
            <Section label="Size" value={org.size} />
            <Tags label="Cause Areas" items={org.cause_areas} />
            <Tags label="Role Types" items={org.role_types} />
            <Tags label="Regions" items={org.regions} />
            <Tags label="Target Populations" items={org.target_populations} />

            {(org.hq || org.year_established || org.employees) && (
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {org.hq && <span>📍 {org.hq}</span>}
                {org.year_established && <span>📅 Est. {org.year_established}</span>}
                {org.employees && <span>👥 {org.employees} employees</span>}
              </div>
            )}

            {org.hbs_note && (
              <div className="bg-crimson/5 border border-crimson/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-crimson uppercase tracking-wide mb-1">HBS Note</p>
                <p className="text-sm text-gray-700">{org.hbs_note}</p>
              </div>
            )}

            {org.notable_alumni && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notable HBS Alumni</p>
                <p className="text-sm text-gray-700">{org.notable_alumni}</p>
              </div>
            )}

            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-crimson hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
