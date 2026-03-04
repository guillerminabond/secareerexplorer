import React, { useState, useEffect, useMemo } from "react";
import { Star, Plus, Pencil, Trash2, X, Lock } from "lucide-react";
import { fetchContent, upsertContent } from "@/api/contentApi";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "hbsse2024";

// ── Resource tag taxonomy ─────────────────────────────────────
const RESOURCE_TAG_GROUPS = {
  "Org Type": ["Nonprofit", "Foundation", "Impact Investing", "Social Enterprise", "B Corp", "Startup"],
  "Geography": ["Global", "North America", "Europe"],
  "Function": ["Career Support", "Research", "Mentorship", "Alumni", "Fellowship", "Funding", "Community"],
};

// ── Default resource seeds ────────────────────────────────────
const DEFAULT_GENERAL_RESOURCES = [
  {
    emoji: "🌐", title: "Devex", subtitle: "Job Board & News",
    desc: "The media platform for the global development community. Thousands of roles across NGOs, multilaterals, foundations, and government agencies.",
    tips: ["Filter by sector (health, climate, education)", "Set job alerts for target organizations", "Follow editorial coverage for sector intel"],
    url: "https://www.devex.com", cta: "Visit Devex",
    tags: ["Nonprofit", "Foundation", "Global"], featured: false,
  },
  {
    emoji: "🔍", title: "Candid", subtitle: "Funding & Org Research",
    desc: "World's largest source on social sector organizations and funders — ideal for researching nonprofits' financials before applying.",
    tips: ["Look up 990s to understand org financials", "Research a foundation's grant history", "Find contact info for program officers"],
    url: "https://candid.org", cta: "Visit Candid",
    tags: ["Nonprofit", "Foundation", "Research", "Global"], featured: false,
  },
  {
    emoji: "🚀", title: "Escape the City", subtitle: "Career Transition Platform",
    desc: "A global community helping professionals transition from corporate careers into purpose-driven roles.",
    tips: ["Browse purpose jobs by sector and region", "Join the community for peer support", "Use career resources for pivot planning"],
    url: "https://www.escapethecity.org", cta: "Visit Escape the City",
    tags: ["Social Enterprise", "Global", "Europe"], featured: false,
  },
  {
    emoji: "📬", title: "Ali Rohde — Jobs for Startups", subtitle: "Newsletter & Community",
    desc: "Curated Substack newsletter from Ali Rohde covering job opportunities at startups and in the social enterprise and impact investing space.",
    tips: ["Subscribe for weekly curated opportunities", "Filter for impact-focused startup roles", "Share with your SE study group"],
    url: "https://alirohde.substack.com", cta: "Visit Ali Rohde — Jobs for Startups",
    tags: ["Startup", "Impact Investing", "Social Enterprise", "North America"], featured: false,
  },
  {
    emoji: "✅", title: "B Corp Directory", subtitle: "B Corporation Database",
    desc: "Searchable directory of all certified B Corporations worldwide — businesses meeting high standards of social and environmental performance.",
    tips: ["Filter by industry, location, and impact area", "Research B Corps before applying", "Identify mission-aligned employers beyond traditional nonprofits"],
    url: "https://www.bcorporation.net/en-us/find-a-b-corp/", cta: "Visit B Corp Directory",
    tags: ["B Corp", "Social Enterprise", "Global"], featured: false,
  },
  {
    emoji: "💼", title: "Fast Forward Job Board", subtitle: "Tech Nonprofit Jobs",
    desc: "Job board from Fast Forward, the accelerator for tech nonprofits. Roles at high-growth organizations using technology to drive social change.",
    tips: ["Filter by role type and cause area", "Find engineering, product, and ops roles at nonprofits", "Great for candidates at the tech-impact intersection"],
    url: "https://jobs.ffwd.org/jobs", cta: "Visit Fast Forward Job Board",
    tags: ["Nonprofit", "Startup", "North America"], featured: false,
  },
];

const DEFAULT_HBS_RESOURCES = [
  { title: "Social Enterprise Initiative",        url: "https://www.hbs.edu/socialenterprise/",                                                                                                    desc: "HBS's hub for SE education, research, and community.",                                                            tags: ["Community", "Research"],              featured: false },
  { title: "Rock Center for Entrepreneurship",    url: "https://www.hbs.edu/entrepreneurship/",                                                                                                    desc: "Supports entrepreneurs including social enterprise founders.",                                                    tags: ["Community"],                          featured: false },
  { title: "SECON — Social Enterprise Conference",url: "https://socialenterpriseconference.net/",                                                                                                  desc: "Annual student-run conference at the intersection of business and social impact.",                                tags: ["Community"],                          featured: false },
  { title: "Social Enterprise Club",              url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/social-enterprise-club",                               desc: "HBS student club for social enterprise — events, treks, and recruiting.",                                         tags: ["Community", "Career Support"],        featured: false },
  { title: "Impact Investing Club",               url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/impact-investing-club",                                desc: "HBS student club focused on impact investing careers and deal exposure.",                                          tags: ["Impact Investing", "Community"],      featured: false },
  { title: "Education Club",                      url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/education-club",                                       desc: "HBS student club for MBAs pursuing careers in education.",                                                        tags: ["Community"],                          featured: false },
  { title: "CPD Career Resources",                url: "https://www.hbs.edu/careers/",                                                                                                            desc: "HBS Career & Professional Development tools and employer database.",                                               tags: ["Career Support"],                     featured: false },
  { title: "HBS Summer Fellows Program",          url: "https://www.hbs.edu/socialenterprise/mba-experience/careers/summer-fellowships",                                                          desc: "Funding for MBAs pursuing summer internships in the nonprofit and public sectors.",                                tags: ["Fellowship", "Funding", "Nonprofit"], featured: false },
  { title: "Leadership Fellows Program",          url: "https://www.hbs.edu/socialenterprise/for-organizations/leadership-fellows/past-partners-fellows",                                         desc: "Post-MBA fellowship placing HBS graduates in senior leadership roles at nonprofits.",                             tags: ["Fellowship", "Nonprofit"],            featured: false },
  { title: "HBS Alumni Directory",                url: "https://www.alumni.hbs.edu/community/Pages/directory.aspx",                                                                               desc: "Search and connect with HBS alumni by industry, role, and location.",                                             tags: ["Alumni"],                             featured: false },
  { title: "12Twenty Mentorships",                url: "https://mba-business-harvard.12twenty.com/mentorships/home",                                                                              desc: "HBS platform to find and request mentorship from alumni across sectors.",                                          tags: ["Mentorship", "Alumni"],               featured: false },
  { title: "SE Faculty & Research",               url: "https://www.hbs.edu/socialenterprise/faculty-research",                                                                                   desc: "HBS Social Enterprise Initiative faculty profiles and latest research.",                                           tags: ["Research"],                           featured: false },
];

// ── Resource Edit Modal ───────────────────────────────────────
function ResourceEditModal({ editing, onSave, onClose, saving }) {
  const [data, setData] = useState({ ...editing.data });
  const isGeneral = editing.section === "general";
  const isNew = editing.index === null;

  const toggleTag = (tag) => {
    setData(d => {
      const current = d.tags || [];
      return { ...d, tags: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{isNew ? "Add" : "Edit"} Resource</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            {/* Featured toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setData(d => ({ ...d, featured: !d.featured }))}
                className={`relative w-9 h-5 rounded-full transition-colors ${data.featured ? "bg-amber-400" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${data.featured ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                Pin to top <span className="text-gray-400 font-normal">(floats above others)</span>
              </span>
            </label>

            {isGeneral && (
              <div className="flex gap-2">
                <input value={data.emoji || ""} onChange={e => setData(d => ({ ...d, emoji: e.target.value }))} placeholder="Emoji"
                  className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30" />
                <input value={data.subtitle || ""} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))} placeholder="Subtitle"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30" />
              </div>
            )}
            <input value={data.title || ""} onChange={e => setData(d => ({ ...d, title: e.target.value }))} placeholder="Title"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30" />
            <input value={data.url || ""} onChange={e => setData(d => ({ ...d, url: e.target.value }))} placeholder="URL (https://...)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30" />
            <textarea value={data.desc || ""} onChange={e => setData(d => ({ ...d, desc: e.target.value }))} placeholder="Description" rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 resize-none" />
            {isGeneral && (
              <>
                <input value={data.cta || ""} onChange={e => setData(d => ({ ...d, cta: e.target.value }))} placeholder={`CTA label (e.g. Visit ${data.title || "Site"})`}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30" />
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Tips — one per line</label>
                  <textarea
                    value={data.tipsText !== undefined ? data.tipsText : (data.tips || []).join("\n")}
                    onChange={e => setData(d => ({ ...d, tipsText: e.target.value }))}
                    placeholder={"Tip 1\nTip 2\nTip 3"} rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 resize-none"
                  />
                </div>
              </>
            )}
            {/* Tag editor */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Tags</label>
              {Object.entries(RESOURCE_TAG_GROUPS).map(([group, tags]) => (
                <div key={group} className="mb-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => {
                      const active = (data.tags || []).includes(tag);
                      return (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active ? "bg-[#A51C30] text-white border-[#A51C30]" : "bg-white text-gray-500 border-gray-200 hover:border-[#A51C30]/50 hover:text-[#A51C30]"}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onSave(data)} disabled={saving || !data.title || !data.url}
              className="flex-1 py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#A51C30]/90">
              {saving ? "Saving…" : "Save Resource"}
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin Auth Modal ──────────────────────────────────────────
function AdminAuthModal({ onSuccess, onClose }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const submit = () => {
    if (pw === ADMIN_PASSWORD) { onSuccess(); }
    else { setError(true); setPw(""); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#A51C30]" />
            <h2 className="font-semibold text-gray-900">Admin Access</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <input type="password" placeholder="Password" value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && submit()} autoFocus
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A51C30]/30 mb-2" />
        {error && <p className="text-xs text-red-500 mb-2">Incorrect password.</p>}
        <button onClick={submit} className="w-full py-2 bg-[#A51C30] text-white rounded-lg text-sm font-medium hover:bg-[#A51C30]/90">
          Unlock
        </button>
      </div>
    </div>
  );
}

// ── Main Resources Page ───────────────────────────────────────
export default function Resources() {
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [generalResources, setGeneralResources] = useState([...DEFAULT_GENERAL_RESOURCES]);
  const [hbsResources, setHbsResources] = useState([...DEFAULT_HBS_RESOURCES]);
  const [editingResource, setEditingResource] = useState(null);
  const [savingResource, setSavingResource] = useState(false);
  const [resourceTagFilters, setResourceTagFilters] = useState([]);

  useEffect(() => {
    fetchContent("general_resources").then(data => { if (data) setGeneralResources(data); }).catch(() => {});
    fetchContent("hbs_resources").then(data => { if (data) setHbsResources(data); }).catch(() => {});
  }, []);

  const toggleResourceTag = tag =>
    setResourceTagFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const filteredGeneralResources = useMemo(() => {
    const out = resourceTagFilters.length === 0
      ? [...generalResources]
      : generalResources.filter(r => (r.tags || []).some(t => resourceTagFilters.includes(t)));
    return out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [generalResources, resourceTagFilters]);

  const filteredHbsResources = useMemo(() => {
    const out = resourceTagFilters.length === 0
      ? [...hbsResources]
      : hbsResources.filter(r => (r.tags || []).some(t => resourceTagFilters.includes(t)));
    return out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [hbsResources, resourceTagFilters]);

  const toggleFeatured = async (section, index) => {
    const isGeneral = section === "general";
    const current = isGeneral ? [...generalResources] : [...hbsResources];
    current[index] = { ...current[index], featured: !current[index].featured };
    try {
      await upsertContent(isGeneral ? "general_resources" : "hbs_resources", current);
      if (isGeneral) setGeneralResources(current); else setHbsResources(current);
    } catch (err) { console.error("Failed to toggle featured:", err); }
  };

  const handleSaveResource = async (formData) => {
    setSavingResource(true);
    try {
      const { section, index } = editingResource;
      const isGeneral = section === "general";
      const current = isGeneral ? [...generalResources] : [...hbsResources];
      let cleaned;
      if (isGeneral) {
        const tips = (formData.tipsText !== undefined ? formData.tipsText : (formData.tips || []).join("\n"))
          .split("\n").map(t => t.trim()).filter(Boolean);
        cleaned = {
          emoji: formData.emoji || "🔗", title: formData.title,
          subtitle: formData.subtitle || "", desc: formData.desc || "",
          tips, url: formData.url, cta: formData.cta || `Visit ${formData.title}`,
          tags: formData.tags || [], featured: formData.featured || false,
        };
      } else {
        cleaned = { title: formData.title, url: formData.url, desc: formData.desc || "", tags: formData.tags || [], featured: formData.featured || false };
      }
      if (index === null) { current.push(cleaned); } else { current[index] = cleaned; }
      await upsertContent(isGeneral ? "general_resources" : "hbs_resources", current);
      if (isGeneral) setGeneralResources(current); else setHbsResources(current);
      setEditingResource(null);
    } catch (err) { console.error("Failed to save resource:", err); }
    finally { setSavingResource(false); }
  };

  const handleDeleteResource = async (section, index) => {
    const isGeneral = section === "general";
    const current = isGeneral ? [...generalResources] : [...hbsResources];
    current.splice(index, 1);
    try {
      await upsertContent(isGeneral ? "general_resources" : "hbs_resources", current);
      if (isGeneral) setGeneralResources(current); else setHbsResources(current);
    } catch (err) { console.error("Failed to delete resource:", err); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-crimson text-white px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-crimson-100 text-sm font-medium tracking-wide uppercase mb-1">
              Harvard Business School
            </p>
            <h1 className="text-3xl font-bold mb-1">Additional Resources</h1>
            <p className="text-crimson-100 text-sm">
              Job boards, career platforms, and HBS-specific resources for social enterprise.
            </p>
          </div>
          <button
            onClick={() => adminMode ? setAdminMode(false) : setShowAdminAuth(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors mt-1 ${adminMode ? "bg-white/20 text-white border-white/30" : "border-white/30 text-white/70 hover:bg-white/10"}`}
          >
            {adminMode ? "Exit Admin" : "Admin"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">

        {/* ── Tag filter bar ──────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter resources</p>
            {resourceTagFilters.length > 0 && (
              <button onClick={() => setResourceTagFilters([])} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {Object.entries(RESOURCE_TAG_GROUPS).map(([group, tags]) => (
              <div key={group} className="flex items-start gap-2 sm:gap-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-14 sm:w-16 shrink-0 pt-1.5">{group}</span>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:flex-wrap scrollbar-hide">
                  {tags.map(tag => {
                    const active = resourceTagFilters.includes(tag);
                    return (
                      <button key={tag} onClick={() => toggleResourceTag(tag)}
                        className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full border transition-colors min-h-[32px] ${
                          active ? "bg-[#A51C30] text-white border-[#A51C30]" : "bg-white text-gray-500 border-gray-200 hover:border-[#A51C30]/50 hover:text-[#A51C30]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {resourceTagFilters.length > 0 && (
            <p className="text-xs text-gray-400 mt-2.5">
              Showing resources matching any of:{resourceTagFilters.map(t => <strong key={t} className="text-gray-600"> {t}</strong>)}
            </p>
          )}
        </div>

        {/* ── Job Boards & Career Platforms ──────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">
              Job Boards &amp; Career Platforms
              {resourceTagFilters.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {filteredGeneralResources.length} of {generalResources.length}
                </span>
              )}
            </h2>
            {adminMode && (
              <button
                onClick={() => setEditingResource({ section: "general", index: null, data: { emoji: "🔗", title: "", subtitle: "", desc: "", tipsText: "", url: "", cta: "", tags: [], featured: false } })}
                className="flex items-center gap-1.5 text-xs text-[#A51C30] border border-[#A51C30]/30 rounded-md px-2.5 py-1 hover:bg-[#A51C30]/5"
              >
                <Plus className="w-3 h-3" /> Add Resource
              </button>
            )}
          </div>

          {filteredGeneralResources.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No resources match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGeneralResources.map((r, i) => {
                const realIndex = generalResources.indexOf(r);
                return (
                  <div key={realIndex} className={`bg-white border rounded-xl p-5 flex flex-col gap-3 relative group ${r.featured ? "border-amber-200 shadow-sm" : "border-gray-100"}`}>
                    {r.featured && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                        <Star className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {adminMode && (
                      <div className={`absolute top-3 right-3 flex gap-1 ${r.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}>
                        <button onClick={() => toggleFeatured("general", realIndex)} title={r.featured ? "Unpin" : "Pin to top"}
                          className={`rounded shadow-sm p-1 ${r.featured ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 bg-white"}`}>
                          <Star className="w-3 h-3" />
                        </button>
                        <button onClick={() => setEditingResource({ section: "general", index: realIndex, data: { ...r, tipsText: (r.tips || []).join("\n") } })}
                          className="text-gray-400 hover:text-[#A51C30] bg-white rounded shadow-sm p-1" title="Edit">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteResource("general", realIndex)}
                          className="text-gray-400 hover:text-red-500 bg-white rounded shadow-sm p-1" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className={r.featured ? "mt-4" : ""}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{r.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{r.title}</h3>
                          <p className="text-xs text-gray-400">{r.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{r.desc}</p>
                    </div>
                    {r.tips?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">💡 How to use it</p>
                        <ul className="space-y-1">
                          {r.tips.map((tip) => (
                            <li key={tip} className="text-xs text-gray-600 flex gap-1.5"><span className="text-gray-400 mt-0.5">•</span>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(r.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {r.tags.map(tag => (
                          <button key={tag} onClick={() => { if (!resourceTagFilters.includes(tag)) toggleResourceTag(tag); }}
                            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                              resourceTagFilters.includes(tag) ? "bg-[#A51C30]/10 text-[#A51C30] border-[#A51C30]/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                            }`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-crimson hover:underline">
                      {r.cta} →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── HBS-Specific Resources ──────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">
              🎓 HBS-Specific Resources
              {resourceTagFilters.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {filteredHbsResources.length} of {hbsResources.length}
                </span>
              )}
            </h2>
            {adminMode && (
              <button
                onClick={() => setEditingResource({ section: "hbs", index: null, data: { title: "", url: "", desc: "", tags: [], featured: false } })}
                className="flex items-center gap-1.5 text-xs text-[#A51C30] border border-[#A51C30]/30 rounded-md px-2.5 py-1 hover:bg-[#A51C30]/5"
              >
                <Plus className="w-3 h-3" /> Add Resource
              </button>
            )}
          </div>

          {filteredHbsResources.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No resources match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredHbsResources.map((r) => {
                const realIndex = hbsResources.indexOf(r);
                return (
                  <div key={realIndex} className={`bg-white border rounded-xl p-4 relative group hover:shadow-md transition-shadow ${r.featured ? "border-amber-200" : "border-gray-100"}`}>
                    {r.featured && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 mb-1.5">
                        <Star className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {adminMode && (
                      <div className={`absolute top-3 right-3 flex gap-1 ${r.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}>
                        <button onClick={() => toggleFeatured("hbs", realIndex)} title={r.featured ? "Unpin" : "Pin to top"}
                          className={`rounded shadow-sm p-1 ${r.featured ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 bg-white"}`}>
                          <Star className="w-3 h-3" />
                        </button>
                        <button onClick={() => setEditingResource({ section: "hbs", index: realIndex, data: { ...r } })}
                          className="text-gray-400 hover:text-[#A51C30] bg-white rounded shadow-sm p-1" title="Edit">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteResource("hbs", realIndex)}
                          className="text-gray-400 hover:text-red-500 bg-white rounded shadow-sm p-1" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="block group/link">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover/link:text-crimson transition-colors">{r.title} →</h3>
                      <p className="text-xs text-gray-500 mb-2">{r.desc}</p>
                    </a>
                    {(r.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.tags.map(tag => (
                          <button key={tag} onClick={() => { if (!resourceTagFilters.includes(tag)) toggleResourceTag(tag); }}
                            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                              resourceTagFilters.includes(tag) ? "bg-[#A51C30]/10 text-[#A51C30] border-[#A51C30]/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                            }`}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingResource && (
        <ResourceEditModal
          editing={editingResource}
          onSave={handleSaveResource}
          onClose={() => setEditingResource(null)}
          saving={savingResource}
        />
      )}
      {showAdminAuth && (
        <AdminAuthModal
          onSuccess={() => { setAdminMode(true); setShowAdminAuth(false); }}
          onClose={() => setShowAdminAuth(false)}
        />
      )}
    </div>
  );
}
