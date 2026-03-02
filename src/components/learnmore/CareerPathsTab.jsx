import React, { useState, useEffect } from "react";
import LearnMoreModal from "./LearnMoreModal";
import { fetchContent, upsertContent } from "@/api/contentApi";
import { ExternalLink, Pencil, Trash2, Plus, Check, X } from "lucide-react";

const CAREER_PATHS = [
  { label: "Program Director", emoji: "🎯", preview: "Lead delivery of social programs at nonprofits or NGOs." },
  { label: "Impact Investment Associate", emoji: "📊", preview: "Source, evaluate, and manage impact-focused investments." },
  { label: "Strategy Consultant (Social Sector)", emoji: "🧠", preview: "Advise nonprofits and foundations on strategy and operations." },
  { label: "Grants Officer", emoji: "📋", preview: "Manage grant-making cycles at foundations or government agencies." },
  { label: "Social Entrepreneur", emoji: "🚀", preview: "Found and scale a venture with embedded social mission." },
  { label: "Policy Advisor", emoji: "🏛️", preview: "Shape legislation and public programs at government or think tanks." },
  { label: "Corporate Sustainability Lead", emoji: "🌿", preview: "Drive ESG and impact strategy inside a corporation." },
  { label: "Development Director", emoji: "💌", preview: "Lead fundraising and donor relations for nonprofits." },
];

const CAREER_DETAILS = {
  "Program Director": {
    progression: ["Program Associate", "Program Manager", "Program Director", "VP of Programs"],
    key_skills: ["Program design & evaluation", "Team leadership & management", "Stakeholder engagement", "Budget & grant management"],
    personality_fit: ["Mission-driven and values-led", "Collaborative and community-oriented", "Adaptable and resilient"],
    hbs_note: "HBS MBAs often enter at the Program Director or VP level, leveraging their management training. The Leadership Fellows Program places HBS grads in senior nonprofit roles directly post-MBA."
  },
  "Impact Investment Associate": {
    progression: ["Analyst", "Associate", "Senior Associate / VP", "Partner / Managing Director"],
    key_skills: ["Financial modeling & due diligence", "Impact measurement (IRIS+, GIIRS)", "Portfolio management", "Deal sourcing & relationship management"],
    personality_fit: ["Analytically rigorous and financially savvy", "Genuinely mission-motivated", "Entrepreneurial and self-directed"],
    hbs_note: "The HBS Impact Investing Club is a strong recruiting pipeline. Firms like Acumen, TPG Rise, and Omidyar Network actively recruit HBS MBAs. Summer fellowships often convert to full-time roles."
  },
  "Strategy Consultant (Social Sector)": {
    progression: ["Consultant", "Senior Consultant", "Principal / Manager", "Partner"],
    key_skills: ["Qualitative & quantitative analysis", "Strategic planning", "Facilitation & stakeholder alignment", "Written and verbal communication"],
    personality_fit: ["Intellectually curious problem-solver", "Comfortable with ambiguity", "Strong communicator and collaborator"],
    hbs_note: "Bridgespan Group and FSG actively recruit at HBS. McKinsey.org and BCG's Social Impact practice also offer pathways. Social sector consulting can be a strong bridge role into nonprofit leadership."
  },
  "Grants Officer": {
    progression: ["Grants Assistant", "Program Officer", "Senior Program Officer", "Director of Grantmaking"],
    key_skills: ["Proposal review & due diligence", "Relationship management with grantees", "Strategic grantmaking", "Field expertise in a cause area"],
    personality_fit: ["Deeply curious and eager to learn from grantees", "Collaborative and relationship-focused", "Comfortable with uncertainty and long timeframes"],
    hbs_note: "Foundations like Gates, Ford, and Hewlett recruit HBS MBAs for program officer roles, especially when they bring deep content expertise. Compensation is competitive for the sector."
  },
  "Social Entrepreneur": {
    progression: ["Founder / CEO", "Series A growth stage", "Scale & systems building", "Exit / succession planning"],
    key_skills: ["Vision and fundraising", "Product / program design", "Team building & culture", "Impact measurement & storytelling"],
    personality_fit: ["High risk tolerance and resilience", "Intrinsically motivated and mission-obsessed", "Creative and resourceful under constraints"],
    hbs_note: "The Rock Center for Entrepreneurship and HBS Social Enterprise Initiative provide strong support for aspiring founders. HBS alumni have founded Teach For America, City Year, and many other leading social ventures."
  },
  "Policy Advisor": {
    progression: ["Policy Analyst", "Policy Advisor", "Senior Policy Director", "Chief of Staff / Deputy Secretary"],
    key_skills: ["Policy research & analysis", "Legislative and regulatory process knowledge", "Coalition building", "Political communication"],
    personality_fit: ["Patient and long-term oriented", "Comfortable with political complexity", "Skilled at building across ideological lines"],
    hbs_note: "HBS MBAs enter policy through the White House Fellows Program, think tanks like Brookings and Urban Institute, and senior government appointments. The Harvard Kennedy School connection creates strong cross-school pathways."
  },
  "Corporate Sustainability Lead": {
    progression: ["Sustainability Analyst", "Sustainability Manager", "Director of ESG", "Chief Sustainability Officer"],
    key_skills: ["ESG reporting frameworks (GRI, SASB, TCFD)", "Supply chain sustainability", "Stakeholder engagement", "Business strategy integration"],
    personality_fit: ["Systems thinker comfortable with complexity", "Skilled at navigating corporate culture", "Passionate about market-driven change"],
    hbs_note: "Corporate sustainability roles are increasingly visible at HBS recruiting events. Consumer goods, financial services, and technology companies all recruit for ESG leadership. The field is professionalizing rapidly with new standards and reporting requirements."
  },
  "Development Director": {
    progression: ["Development Associate", "Major Gifts Officer", "Director of Development", "VP / Chief Development Officer"],
    key_skills: ["Major donor cultivation & stewardship", "Grant writing & foundation relations", "Database management (Salesforce, Raiser's Edge)", "Organizational storytelling"],
    personality_fit: ["Relationship-driven and empathetic", "Persistent and goal-oriented", "Genuine passion for the organization's mission"],
    hbs_note: "Development Directors are in high demand across the nonprofit sector. HBS MBAs bring strategic thinking and business acumen that distinguishes them in this role. Strong fundraisers can command competitive compensation packages at major organizations."
  }
};

// Curated resource links per career path — editable by admin via Supabase
const DEFAULT_CAREER_RESOURCES = {
  "Program Director": [
    { title: "Bridgespan Group", url: "https://www.bridgespan.org", desc: "Strategy and leadership resources for nonprofits and social sector leaders" },
    { title: "Idealist Jobs", url: "https://www.idealist.org/en/jobs", desc: "Nonprofit and social sector job board with thousands of mission-driven roles" },
    { title: "HBS Leadership Fellows", url: "https://www.hbs.edu/socialenterprise/for-organizations/leadership-fellows", desc: "Post-MBA fellowship placing HBS grads in senior nonprofit leadership roles" },
  ],
  "Impact Investment Associate": [
    { title: "GIIN", url: "https://thegiin.org", desc: "Global Impact Investing Network — IRIS+ framework, research, and sector resources" },
    { title: "ImpactAlpha", url: "https://impactalpha.com", desc: "News and analysis for the impact investing and social finance sector" },
    { title: "SOCAP", url: "https://socapglobal.com", desc: "Leading impact investing conference and global community" },
    { title: "Confluence Philanthropy", url: "https://confluencephilanthropy.org", desc: "Network for mission-aligned investors and philanthropists" },
  ],
  "Strategy Consultant (Social Sector)": [
    { title: "Bridgespan Group", url: "https://www.bridgespan.org", desc: "Leading social sector consulting firm — articles, tools, and job postings" },
    { title: "FSG", url: "https://www.fsg.org", desc: "Strategy and evaluation consulting for foundations and nonprofits" },
    { title: "McKinsey.org", url: "https://www.mckinsey.org", desc: "McKinsey's social sector practice — fellowships and pro bono projects" },
    { title: "BCG Social Impact", url: "https://www.bcg.com/beyond-consulting/bcg-rise/overview", desc: "BCG's social impact consulting practice and fellowship" },
  ],
  "Grants Officer": [
    { title: "Candid (GrantSpace)", url: "https://grantspace.org", desc: "Foundation Center's hub for grant seekers, program officers, and funders" },
    { title: "Council on Foundations", url: "https://www.cof.org", desc: "Membership association for grant-making organizations and foundations" },
    { title: "GrantStation", url: "https://grantstation.com", desc: "Grant research database and proposal resources for nonprofit professionals" },
  ],
  "Social Entrepreneur": [
    { title: "Ashoka", url: "https://www.ashoka.org", desc: "Global network of leading social entrepreneurs and systems changers" },
    { title: "Echoing Green", url: "https://echoinggreen.org", desc: "Fellowship and funding for early-stage social entrepreneurs" },
    { title: "Skoll Foundation", url: "https://skoll.org", desc: "Resources and awards for systems-changing social entrepreneurs" },
    { title: "HBS Rock Center", url: "https://www.hbs.edu/entrepreneurship", desc: "HBS hub for entrepreneurship — resources, courses, and community" },
  ],
  "Policy Advisor": [
    { title: "Brookings Institution", url: "https://www.brookings.edu", desc: "Leading think tank with research on economic and social policy" },
    { title: "Urban Institute", url: "https://www.urban.org", desc: "Nonpartisan research on economic and social policy" },
    { title: "New America", url: "https://www.newamerica.org", desc: "Think tank developing next-generation public policy solutions" },
    { title: "White House Fellows", url: "https://www.whitehouse.gov/get-involved/fellows/", desc: "Prestigious public service leadership program" },
  ],
  "Corporate Sustainability Lead": [
    { title: "GRI Standards", url: "https://www.globalreporting.org", desc: "Global Reporting Initiative — sustainability reporting frameworks and standards" },
    { title: "SASB", url: "https://www.sasb.org", desc: "Industry-specific sustainability accounting standards for investors" },
    { title: "BSR", url: "https://www.bsr.org", desc: "Business for Social Responsibility — corporate sustainability research and consulting" },
    { title: "Net Zero Tracker", url: "https://zerotracker.net", desc: "Track and assess corporate and government net zero commitments" },
  ],
  "Development Director": [
    { title: "AFP Global", url: "https://afpglobal.org", desc: "Association of Fundraising Professionals — certification, ethics, and resources" },
    { title: "Network for Good", url: "https://www.networkforgood.com", desc: "Tools and learning resources for nonprofit fundraising teams" },
    { title: "NonprofitReady", url: "https://www.nonprofitready.org", desc: "Free professional development courses for nonprofit fundraisers" },
    { title: "Chronicle of Philanthropy", url: "https://www.philanthropy.com", desc: "News and resources for development and philanthropic professionals" },
  ],
};

// ── Inline resource edit form ─────────────────────────────────
function ResourceForm({ form, onChange, onSave, onCancel, saving }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
      <input
        value={form.title}
        onChange={e => onChange(f => ({ ...f, title: e.target.value }))}
        placeholder="Title"
        className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#A51C30]/30"
      />
      <input
        value={form.url}
        onChange={e => onChange(f => ({ ...f, url: e.target.value }))}
        placeholder="URL (https://...)"
        className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#A51C30]/30"
      />
      <input
        value={form.desc}
        onChange={e => onChange(f => ({ ...f, desc: e.target.value }))}
        placeholder="Short description (optional)"
        className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#A51C30]/30"
      />
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={onSave}
          disabled={saving || !form.title || !form.url}
          className="flex items-center gap-1 text-xs bg-[#A51C30] text-white rounded px-2.5 py-1 disabled:opacity-50 hover:bg-[#A51C30]/90"
        >
          <Check className="w-3 h-3" /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          <X className="w-3 h-3" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function CareerPathsTab({ adminMode }) {
  const [selected, setSelected] = useState(null);
  const [careerResources, setCareerResources] = useState(DEFAULT_CAREER_RESOURCES);
  const [editingRes, setEditingRes] = useState(null); // { pathLabel, index } — index null = new
  const [resForm, setResForm] = useState({ title: "", url: "", desc: "" });
  const [saving, setSaving] = useState(false);

  // Load saved resources from Supabase on mount, merge with defaults
  useEffect(() => {
    fetchContent("career_path_resources")
      .then(data => { if (data) setCareerResources(prev => ({ ...prev, ...data })); })
      .catch(() => {});
  }, []);

  const persistResources = async (updated) => {
    setSaving(true);
    try {
      await upsertContent("career_path_resources", updated);
      setCareerResources(updated);
    } catch (err) {
      console.error("Failed to save career resources:", err);
    } finally {
      setSaving(false);
    }
  };

  const startAdd = (pathLabel) => {
    setResForm({ title: "", url: "", desc: "" });
    setEditingRes({ pathLabel, index: null });
  };

  const startEdit = (pathLabel, index) => {
    const r = (careerResources[pathLabel] || [])[index];
    setResForm({ title: r.title, url: r.url, desc: r.desc || "" });
    setEditingRes({ pathLabel, index });
  };

  const handleSaveRes = async () => {
    const { pathLabel, index } = editingRes;
    const current = [...(careerResources[pathLabel] || [])];
    if (index === null) {
      current.push({ ...resForm });
    } else {
      current[index] = { ...resForm };
    }
    await persistResources({ ...careerResources, [pathLabel]: current });
    setEditingRes(null);
  };

  const handleDeleteRes = async (pathLabel, index) => {
    const current = [...(careerResources[pathLabel] || [])];
    current.splice(index, 1);
    await persistResources({ ...careerResources, [pathLabel]: current });
  };

  const detail = selected ? CAREER_DETAILS[selected.label] : null;
  const resources = selected ? (careerResources[selected.label] || []) : [];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAREER_PATHS.map((p) => (
          <button
            key={p.label}
            onClick={() => { setSelected(p); setEditingRes(null); }}
            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="text-2xl mb-2">{p.emoji}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.label}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{p.preview}</p>
          </button>
        ))}
      </div>

      {selected && detail && (
        <LearnMoreModal onClose={() => { setSelected(null); setEditingRes(null); }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selected.emoji}</span>
            <h2 className="text-lg font-bold text-gray-900">{selected.label}</h2>
          </div>

          <div className="space-y-4">
            {/* Career progression */}
            {detail.progression?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Career Progression</p>
                <div className="flex flex-wrap items-center gap-1">
                  {detail.progression.map((step, i) => (
                    <React.Fragment key={step}>
                      <span className="text-xs bg-[#A51C30]/10 text-[#A51C30] px-2.5 py-1 rounded-full font-medium">{step}</span>
                      {i < detail.progression.length - 1 && <span className="text-gray-300 text-xs">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & personality */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Key Skills</p>
                <ul className="space-y-1">
                  {detail.key_skills?.map((s) => (
                    <li key={s} className="text-xs text-gray-600 flex gap-1.5"><span className="text-[#A51C30]">•</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Personality Fit</p>
                <ul className="space-y-1">
                  {detail.personality_fit?.map((t) => (
                    <li key={t} className="text-xs text-gray-600 flex gap-1.5"><span className="text-purple-400">•</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* HBS note */}
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-[#A51C30] uppercase tracking-wide mb-1">🎓 HBS Recruiting Note</p>
              <p className="text-sm text-gray-700">{detail.hbs_note}</p>
            </div>

            {/* Resources section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">🔗 Useful Resources</p>
                {adminMode && (
                  <button
                    onClick={() => startAdd(selected.label)}
                    className="flex items-center gap-1 text-xs text-[#A51C30] border border-[#A51C30]/30 rounded-md px-2 py-1 hover:bg-[#A51C30]/5"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {resources.map((r, i) => (
                  editingRes?.pathLabel === selected.label && editingRes?.index === i ? (
                    <ResourceForm
                      key={`edit-${i}`}
                      form={resForm}
                      onChange={setResForm}
                      onSave={handleSaveRes}
                      onCancel={() => setEditingRes(null)}
                      saving={saving}
                    />
                  ) : (
                    <div key={i} className="flex items-start justify-between gap-2 group">
                      <div className="min-w-0">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#A51C30] hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          {r.title}
                        </a>
                        {r.desc && <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>}
                      </div>
                      {adminMode && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                          <button onClick={() => startEdit(selected.label, i)} className="text-gray-400 hover:text-[#A51C30]">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteRes(selected.label, i)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ))}

                {/* New resource form */}
                {editingRes?.pathLabel === selected.label && editingRes?.index === null && (
                  <ResourceForm
                    form={resForm}
                    onChange={setResForm}
                    onSave={handleSaveRes}
                    onCancel={() => setEditingRes(null)}
                    saving={saving}
                  />
                )}

                {resources.length === 0 && !editingRes && (
                  <p className="text-xs text-gray-400 italic">
                    No resources yet{adminMode ? " — click Add to add one" : ""}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </LearnMoreModal>
      )}
    </>
  );
}
