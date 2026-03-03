import React, { useState, useMemo, useEffect } from "react";
import { PARENT_REGIONS, expandRegions } from "@/constants/regions";
import { fetchFeedback } from "@/api/feedbackApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CRIMSON = "#A51C30";
const COLORS = [
  "#A51C30", "#c0392b", "#e74c3c", "#e67e22", "#f39c12",
  "#27ae60", "#2980b9", "#8e44ad", "#16a085", "#2c3e50"
];

// ── Helpers ───────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-1">
      <p className="text-3xl font-bold text-[#A51C30]">{value}</p>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{children}</h3>;
}

function splitVals(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.flatMap(v => typeof v === "string" ? v.split(";").map(s => s.trim()).filter(Boolean) : [v]);
  if (typeof val === "string") return val.split(";").map(s => s.trim()).filter(Boolean);
  return [val];
}

function countBy(orgs, key) {
  const map = {};
  orgs.forEach((org) => {
    splitVals(org[key]).forEach((v) => { map[v] = (map[v] || 0) + 1; });
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// ── Nomination status badge ───────────────────────────────────
function StatusBadge({ status }) {
  if (status === "approved") return (
    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">✓ Approved</span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">✗ Rejected</span>
  );
  return (
    <span className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">● Pending</span>
  );
}

// ── Nominations queue (admin only) ────────────────────────────
const NOM_TABS = ["Pending", "Approved", "Rejected", "All"];

function NominationsQueue({ nominations, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");

  const counts = useMemo(() => ({
    Pending:  nominations.filter(n => n.status === "pending").length,
    Approved: nominations.filter(n => n.status === "approved").length,
    Rejected: nominations.filter(n => n.status === "rejected").length,
    All:      nominations.length,
  }), [nominations]);

  const visible = useMemo(() => {
    if (activeTab === "All") return nominations;
    return nominations.filter(n => n.status === activeTab.toLowerCase());
  }, [nominations, activeTab]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>Nominations Queue</SectionTitle>
        {counts.Pending > 0 && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {counts.Pending} pending
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-3 border-b border-gray-100 pb-3">
        {NOM_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab
                ? "bg-crimson text-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab}
            <span className={`ml-1 ${activeTab === tab ? "opacity-80" : "opacity-60"}`}>
              ({counts[tab]})
            </span>
          </button>
        ))}
      </div>

      {nominations.length === 0 ? (
        <p className="text-sm text-gray-400">
          No nominations yet. They'll appear here when users submit them via the "Nominate an Org" button.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-400">No {activeTab.toLowerCase()} nominations.</p>
      ) : (
        <div className="space-y-2">
          {visible.map(n => (
            <div key={n.id} className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === n.id ? null : n.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <StatusBadge status={n.status} />
                  <span className="font-medium text-sm text-gray-900 truncate">{n.name}</span>
                  {n.org_type && <span className="text-xs text-gray-400 hidden sm:inline">{n.org_type}</span>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
                  {n.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); onApprove(n); }}
                        className="text-xs bg-green-500 text-white rounded px-2 py-0.5 hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onReject(n.id); }}
                        className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {expanded === n.id && (
                <div className="border-t border-gray-100 px-3 py-2.5 bg-gray-50 space-y-1 text-xs text-gray-600">
                  {n.website && <p><span className="font-semibold text-gray-500">Website:</span>{" "}
                    <a href={n.website} target="_blank" rel="noopener noreferrer" className="text-[#A51C30] hover:underline">{n.website}</a>
                  </p>}
                  {n.description && <p><span className="font-semibold text-gray-500">Description:</span> {n.description}</p>}
                  {n.cause_areas && <p><span className="font-semibold text-gray-500">Cause areas:</span> {n.cause_areas}</p>}
                  {n.regions && <p><span className="font-semibold text-gray-500">Regions:</span> {n.regions}</p>}
                  {n.hbs_connection && <p><span className="font-semibold text-gray-500">HBS connection:</span> {n.hbs_connection}</p>}
                  {n.submitted_by && <p><span className="font-semibold text-gray-500">Submitted by:</span> {n.submitted_by}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Feedback inbox (admin only) ───────────────────────────────
function FeedbackInbox() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchFeedback()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const typeColor = (t) => {
    if (t === "Bug") return "bg-red-50 text-red-600";
    if (t === "Suggestion") return "bg-blue-50 text-blue-600";
    if (t === "Content") return "bg-purple-50 text-purple-600";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <SectionTitle>Feedback Inbox</SectionTitle>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-crimson rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No feedback yet. The form is visible to all users via the feedback button.</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${typeColor(item.type)}`}>
                    {item.type || "General"}
                  </span>
                  <span className="text-sm text-gray-700 truncate">{item.message}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {item.name && <span className="text-xs text-gray-500 hidden sm:inline">{item.name}</span>}
                  <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {expanded === item.id && (
                <div className="border-t border-gray-100 px-3 py-2.5 bg-gray-50 space-y-1 text-xs text-gray-600">
                  <p className="text-sm text-gray-800 leading-relaxed">{item.message}</p>
                  {item.name  && <p className="mt-2"><span className="font-semibold text-gray-500">Name:</span> {item.name}</p>}
                  {item.email && <p><span className="font-semibold text-gray-500">Email:</span>{" "}
                    <a href={`mailto:${item.email}`} className="text-[#A51C30] hover:underline">{item.email}</a>
                  </p>}
                  <p><span className="font-semibold text-gray-500">Submitted:</span> {new Date(item.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cause × Region matrix (admin only) ───────────────────────
const MATRIX_CAUSES = [
  "Poverty Alleviation", "Economic Development", "Global Health", "Education",
  "Climate & Energy", "Gender & Social Justice", "Financial Inclusion",
  "Housing & Community", "Arts & Culture",
];

const MATRIX_REGIONS = PARENT_REGIONS;

function CauseRegionMatrix({ orgs, onNavigate }) {
  const matrix = useMemo(() => {
    const m = {};
    MATRIX_CAUSES.forEach(c => {
      m[c] = {};
      MATRIX_REGIONS.forEach(r => { m[c][r] = 0; });
    });
    orgs.forEach(org => {
      const orgCauses = splitVals(org.cause_areas);
      const orgRegions = [...new Set(
        splitVals(org.regions).flatMap(subRegion => {
          const match = MATRIX_REGIONS.find(parent =>
            expandRegions([parent]).includes(subRegion)
          );
          return match ? [match] : [];
        })
      )];
      const uniqueRegions = [...new Set(orgRegions)];
      orgCauses.forEach(c => {
        if (m[c]) {
          uniqueRegions.forEach(r => { m[c][r]++; });
        }
      });
    });
    return m;
  }, [orgs]);

  const maxVal = Math.max(1, ...MATRIX_CAUSES.flatMap(c => MATRIX_REGIONS.map(r => matrix[c][r])));

  const cellColor = (val) => {
    if (val === 0) return "bg-gray-50 text-gray-300";
    const intensity = val / maxVal;
    if (intensity < 0.2) return "bg-red-100 text-red-700";
    if (intensity < 0.5) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="overflow-x-auto">
      <table className="text-xs w-full border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th className="text-left text-gray-400 font-medium pb-1 pr-2 min-w-[140px]">Cause \ Region</th>
            {MATRIX_REGIONS.map(r => (
              <th key={r} className="text-gray-400 font-medium pb-1 px-1 text-center whitespace-nowrap">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX_CAUSES.map(c => (
            <tr key={c}>
              <td className="text-gray-600 font-medium pr-2 py-0.5 whitespace-nowrap">{c}</td>
              {MATRIX_REGIONS.map(r => {
                const val = matrix[c][r];
                const clickable = val > 0 && onNavigate;
                return (
                  <td
                    key={r}
                    onClick={clickable ? () => onNavigate({ cause_areas: [c], regions: [r] }) : undefined}
                    className={`text-center rounded font-semibold py-1.5 px-2 ${cellColor(val)} ${clickable ? "cursor-pointer hover:ring-2 hover:ring-crimson/40 transition-all" : ""}`}
                    title={clickable ? `View orgs: ${c} × ${r}` : undefined}
                  >
                    {val > 0 ? val : "–"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-100" /> Dense</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-orange-100" /> Moderate</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-100" /> Sparse</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-gray-50 border" /> None</span>
        {onNavigate && <span className="flex items-center gap-1 text-crimson/70">● Click any cell to explore those orgs</span>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function OrgDashboard({ orgs, adminMode = false, nominations = [], onApprove, onReject, onNavigate }) {
  const causeData  = useMemo(() => countBy(orgs, "cause_areas"), [orgs]);
  const typeData   = useMemo(() => countBy(orgs, "org_type"), [orgs]);
  const regionData = useMemo(() => countBy(orgs, "regions"), [orgs]);
  const roleData   = useMemo(() => countBy(orgs, "role_types"), [orgs]);
  const popData    = useMemo(() => countBy(orgs, "target_populations"), [orgs]);

  const uniqueCauses  = useMemo(() => new Set(orgs.flatMap(o => splitVals(o.cause_areas))).size, [orgs]);
  const uniqueRegions = useMemo(() => new Set(orgs.flatMap(o => splitVals(o.regions))).size, [orgs]);
  const uniqueTypes   = useMemo(() => new Set(orgs.map(o => o.org_type).filter(Boolean)).size, [orgs]);

  const navigate = onNavigate || null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-md">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-[#A51C30]">{payload[0].value} orgs</p>
          {navigate && <p className="text-gray-400 mt-0.5">Click to explore →</p>}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-md">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-[#A51C30]">{payload[0].value} orgs</p>
          {navigate && <p className="text-gray-400 mt-0.5">Click to explore →</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* ── Admin: Nominations queue ── */}
      {adminMode && (
        <NominationsQueue nominations={nominations} onApprove={onApprove} onReject={onReject} />
      )}

      {/* ── At a Glance ── */}
      <div>
        <SectionTitle>At a Glance</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Organizations" value={orgs.length} sub="in database" />
          <StatCard label="Cause Areas" value={uniqueCauses} sub="distinct issues" />
          <StatCard label="Regions Covered" value={uniqueRegions} sub="geographic areas" />
          <StatCard label="Org Types" value={uniqueTypes} sub="sector categories" />
        </div>
      </div>

      {/* ── Cause Area Breakdown ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <SectionTitle>Cause Area Breakdown</SectionTitle>
        {navigate && <p className="text-xs text-gray-400 mb-3">Click a bar to explore organizations in that cause area.</p>}
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={causeData} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: "#374151" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill={CRIMSON}
              radius={[0, 4, 4, 0]}
              style={navigate ? { cursor: "pointer" } : {}}
              onClick={navigate ? (data) => navigate({ cause_areas: [data.name] }) : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Org Type + Role ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <SectionTitle>Org Type Distribution</SectionTitle>
          {navigate && <p className="text-xs text-gray-400 mb-3">Click a segment to filter by org type.</p>}
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="count"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
                style={navigate ? { cursor: "pointer" } : {}}
                onClick={navigate ? (data) => navigate({ org_type: [data.name] }) : undefined}
              >
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <SectionTitle>Ecosystem Role Coverage</SectionTitle>
          {navigate && <p className="text-xs text-gray-400 mb-3">Click a segment to filter by role type.</p>}
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="count"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
                style={navigate ? { cursor: "pointer" } : {}}
                onClick={navigate ? (data) => navigate({ role_types: [data.name] }) : undefined}
              >
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Regional Coverage ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <SectionTitle>Regional Coverage</SectionTitle>
        {navigate && <p className="text-xs text-gray-400 mb-3">Click a bar to explore organizations in that region.</p>}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={regionData} margin={{ left: 8, right: 24, bottom: 8 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} angle={-20} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#2980b9"
              radius={[4, 4, 0, 0]}
              style={navigate ? { cursor: "pointer" } : {}}
              onClick={navigate ? (data) => navigate({ regions: [data.name] }) : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Population Focus ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <SectionTitle>Population Focus</SectionTitle>
        {navigate && <p className="text-xs text-gray-400 mb-3">Click a tag to explore organizations serving that population.</p>}
        <div className="flex flex-wrap gap-2">
          {popData.map(({ name, count }) => {
            const maxCount = popData[0]?.count || 1;
            const intensity = count / maxCount;
            const size = intensity > 0.7 ? "text-base px-4 py-2" : intensity > 0.4 ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
            const bg = intensity > 0.7 ? "bg-[#A51C30] text-white" : intensity > 0.4 ? "bg-red-100 text-[#A51C30]" : "bg-gray-100 text-gray-600";
            return (
              <span
                key={name}
                onClick={navigate ? () => navigate({ target_populations: [name] }) : undefined}
                className={`rounded-full font-medium ${size} ${bg} ${navigate ? "cursor-pointer hover:ring-2 hover:ring-crimson/40 transition-all" : ""}`}
                title={navigate ? `Explore orgs focused on: ${name}` : undefined}
              >
                {name} <span className="opacity-70">({count})</span>
              </span>
            );
          })}
          {popData.length === 0 && <p className="text-sm text-gray-400">No population data available.</p>}
        </div>
      </div>

      {/* ── Admin: Cause × Region Matrix ── */}
      {adminMode && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <SectionTitle>Cause × Region Coverage Matrix</SectionTitle>
          <p className="text-xs text-gray-400 mb-4">
            Green = dense coverage · Orange = moderate · Red = sparse · Gray = no orgs tagged for that region.
          </p>
          <CauseRegionMatrix orgs={orgs} onNavigate={navigate} />
        </div>
      )}

      {/* ── Admin: Feedback inbox ── */}
      {adminMode && <FeedbackInbox />}
    </div>
  );
}
