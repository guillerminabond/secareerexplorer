import React, { useState, useEffect } from "react";
import { createOrg, updateOrg, fetchLookups } from "@/api/organizationsApi";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const MultiCheck = ({ options, value = [], onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(o => (
      <label key={o} className="flex items-center gap-1.5 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={value.includes(o)}
          onChange={() => {
            const next = value.includes(o) ? value.filter(v => v !== o) : [...value, o];
            onChange(next);
          }}
          className="accent-crimson"
        />
        {o}
      </label>
    ))}
  </div>
);

const HIRING_OPTIONS = ["Actively Hiring", "Sometimes Hiring", "Internships Only", "Not Currently Hiring"];

export default function OrgForm({ org, onSave, onCancel }) {
  const [form, setForm] = useState(org || {
    name: "", description: "", website: "", org_type: "",
    cause_areas: [], role_types: [], regions: [], target_populations: [],
    hbs_note: "", notable_alumni: "", hiring_status: "", size: "",
    hq: "", year_established: "", employees: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lookups, setLookups] = useState(null);

  useEffect(() => {
    fetchLookups()
      .then(setLookups)
      .catch(err => console.error('Failed to load lookup options:', err));
  }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (org?.id) {
        await updateOrg(org.id, form);
      } else {
        await createOrg(form);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!lookups) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <Field label="Organization Name *">
        <input className={inputClass} value={form.name} onChange={e => set("name", e.target.value)} />
      </Field>

      <Field label="Description">
        <textarea className={inputClass} rows={3} value={form.description} onChange={e => set("description", e.target.value)} />
      </Field>

      <Field label="Website">
        <input className={inputClass} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Org Type">
          <select className={inputClass} value={form.org_type} onChange={e => set("org_type", e.target.value)}>
            <option value="">Select...</option>
            {lookups.org_types.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Scale">
          <input className={inputClass} value={form.size} onChange={e => set("size", e.target.value)} placeholder="e.g. Small, Mid, Large" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Hiring Status">
          <select className={inputClass} value={form.hiring_status} onChange={e => set("hiring_status", e.target.value)}>
            <option value="">Select...</option>
            {HIRING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Employees">
          <select className={inputClass} value={form.employees} onChange={e => set("employees", e.target.value)}>
            <option value="">Select...</option>
            {lookups.employee_ranges.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Cause Areas">
        <MultiCheck options={lookups.cause_areas} value={form.cause_areas} onChange={v => set("cause_areas", v)} />
      </Field>

      <Field label="Role Types">
        <MultiCheck options={lookups.role_types} value={form.role_types} onChange={v => set("role_types", v)} />
      </Field>

      <Field label="Regions">
        <MultiCheck options={lookups.regions} value={form.regions} onChange={v => set("regions", v)} />
      </Field>

      <Field label="Target Populations">
        <MultiCheck options={lookups.target_populations} value={form.target_populations} onChange={v => set("target_populations", v)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="HQ Location">
          <input className={inputClass} value={form.hq} onChange={e => set("hq", e.target.value)} placeholder="City, Country" />
        </Field>
        <Field label="Year Established">
          <input className={inputClass} value={form.year_established} onChange={e => set("year_established", e.target.value)} placeholder="e.g. 2001" />
        </Field>
      </div>

      <Field label="HBS Note">
        <textarea className={inputClass} rows={2} value={form.hbs_note} onChange={e => set("hbs_note", e.target.value)} />
      </Field>

      <Field label="Notable HBS Alumni">
        <input className={inputClass} value={form.notable_alumni} onChange={e => set("notable_alumni", e.target.value)} />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !form.name}
          className="px-4 py-2 bg-crimson text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Organization"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
