import React, { useState, useEffect } from "react";
import { fetchOrgs } from "@/api/organizationsApi";
import FilterBar from "@/components/explore/FilterBar";
import OrgCard from "@/components/explore/OrgCard";
import OrgModal from "@/components/explore/OrgModal";
import QuizExplore from "@/components/explore/QuizExplore";
import { Search, Download, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import OrgTable from "@/components/explore/OrgTable";
import LearnMorePage from "@/components/learnmore/LearnMorePage";
import OrgDashboard from "@/components/dashboard/OrgDashboard";

const TABS = ["Explore", "Learn More", "Dashboard", "All Organizations", "Saved Organizations", "Additional Resources"];

const GENERAL_RESOURCES = [
{
  emoji: "🌐",
  title: "Devex",
  subtitle: "Job Board & News",
  desc: "The media platform for the global development community. Thousands of roles across NGOs, multilaterals, foundations, and government agencies.",
  tips: ["Filter by sector (health, climate, education)", "Set job alerts for target organizations", "Follow editorial coverage for sector intel"],
  url: "https://www.devex.com",
  cta: "Visit Devex"
},
{
  emoji: "🔍",
  title: "Candid",
  subtitle: "Funding & Org Research",
  desc: "World's largest source on social sector organizations and funders — ideal for researching nonprofits' financials before applying.",
  tips: ["Look up 990s to understand org financials", "Research a foundation's grant history", "Find contact info for program officers"],
  url: "https://candid.org",
  cta: "Visit Candid"
},
{
  emoji: "🚀",
  title: "Escape the City",
  subtitle: "Career Transition Platform",
  desc: "A global community helping professionals transition from corporate careers into purpose-driven roles.",
  tips: ["Browse purpose jobs by sector and region", "Join the community for peer support", "Use career resources for pivot planning"],
  url: "https://www.escapethecity.org",
  cta: "Visit Escape the City"
},
{
  emoji: "📬",
  title: "Ali Rohde — Jobs for Startups",
  subtitle: "Newsletter & Community",
  desc: "Curated Substack newsletter from Ali Rohde covering job opportunities at startups and in the social enterprise and impact investing space.",
  tips: ["Subscribe for weekly curated opportunities", "Filter for impact-focused startup roles", "Share with your SE study group"],
  url: "https://alirohde.substack.com",
  cta: "Visit Ali Rohde — Jobs for Startups"
}];

const HBS_RESOURCES = [
{ title: "Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/", desc: "HBS's hub for SE education, research, and community." },
{ title: "Rock Center for Entrepreneurship", url: "https://www.hbs.edu/entrepreneurship/", desc: "Supports entrepreneurs including social enterprise founders." },
{ title: "SECON — Social Enterprise Conference", url: "https://socialenterpriseconference.net/", desc: "Annual student-run conference at the intersection of business and social impact." },
{ title: "Social Enterprise Club", url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/social-enterprise-club", desc: "HBS student club for social enterprise — events, treks, and recruiting." },
{ title: "Impact Investing Club", url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/impact-investing-club", desc: "HBS student club focused on impact investing careers and deal exposure." },
{ title: "Education Club", url: "https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/education-club", desc: "HBS student club for MBAs pursuing careers in education." },
{ title: "CPD Career Resources", url: "https://www.hbs.edu/careers/", desc: "HBS Career & Professional Development tools and employer database." },
{ title: "HBS Summer Fellows Program", url: "https://www.hbs.edu/socialenterprise/mba-experience/careers/summer-fellowships", desc: "Funding for MBAs pursuing summer internships in the nonprofit and public sectors." },
{ title: "Leadership Fellows Program", url: "https://www.hbs.edu/socialenterprise/for-organizations/leadership-fellows/past-partners-fellows", desc: "Post-MBA fellowship placing HBS graduates in senior leadership roles at nonprofits." },
{ title: "HBS Alumni Directory", url: "https://www.alumni.hbs.edu/community/Pages/directory.aspx", desc: "Search and connect with HBS alumni by industry, role, and location." },
{ title: "12Twenty Mentorships", url: "https://mba-business-harvard.12twenty.com/mentorships/home", desc: "HBS platform to find and request mentorship from alumni across sectors." },
{ title: "SE Faculty & Research", url: "https://www.hbs.edu/socialenterprise/faculty-research", desc: "HBS Social Enterprise Initiative faculty profiles and latest research." }];

export default function Home() {
  const [tab, setTab] = useState("Explore");
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {return JSON.parse(localStorage.getItem("hbs_saved_orgs") || "[]");} catch {return [];}
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchOrgs()
      .then(data => setOrgs(data))
      .catch(err => console.error('Error fetching organizations:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("hbs_saved_orgs", JSON.stringify(next));
      return next;
    });
  };

  const getValuesAsArray = (val) => {
    if (Array.isArray(val)) return val.flatMap((s) => s.split(";").map((v) => v.trim()).filter(Boolean));
    if (typeof val === "string") return val.split(";").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const filtered = orgs.filter((org) => {
    if (search && !org.name?.toLowerCase().includes(search.toLowerCase()) &&
    !org.description?.toLowerCase().includes(search.toLowerCase())) return false;

    for (const [key, values] of Object.entries(filters)) {
      if (!values?.length) continue;
      if (key === "org_type" || key === "hiring_status") {
        const orgVal = org[key] || "";
        const match = values.some(v => orgVal === v || (orgVal === "Impact Investing / Foundation" && (v === "Impact Investing" || v === "Foundation")));
        if (!match) return false;
      } else {
        const orgVals = getValuesAsArray(org[key]);
        if (!values.some((v) => orgVals.includes(v))) return false;
      }
    }
    return true;
  });

  const savedOrgs = orgs.filter((o) => savedIds.includes(o.id));

  const exportCSV = () => {
    const rows = [["Name", "Type", "Cause Areas", "Hiring Status", "Website"]];
    savedOrgs.forEach((o) => rows.push([o.name, o.org_type, (o.cause_areas || []).join("; "), o.hiring_status, o.website]));
    const csv = rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;a.download = "saved_orgs.csv";a.click();
  };

  const activeFilterCount = Object.values(filters).reduce((n, v) => n + (v?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-crimson-100 text-sm font-medium tracking-wide uppercase mb-1">Harvard Business School</p>
          <h1 className="text-3xl font-bold mb-1">Social Enterprise Career Explorer</h1>
          <p className="text-crimson-100 text-sm">Discover impact organizations and opportunities</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 flex gap-2 items-center">
          {TABS.map((t) =>
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`my-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              t === tab
                ? "bg-[#A51C30] text-white shadow-md"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}>
              {t} {t === "Saved Organizations" && savedIds.length > 0 && <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${t === tab ? "bg-white/30 text-white" : "bg-crimson text-white"}`}>{savedIds.length}</span>}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {tab === "Explore" &&
          <QuizExplore orgs={orgs} savedIds={savedIds} onSave={toggleSave} />
        }

        {tab === "Learn More" && <LearnMorePage />}

        {tab === "Dashboard" && <OrgDashboard orgs={orgs} />}

        {tab === "All Organizations" &&
        <div>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 bg-white"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0 ? "border-crimson text-crimson bg-crimson/5" : "border-gray-200 text-gray-600 bg-white"}`}>
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("table")} className={`px-3 py-2 text-sm transition-colors ${viewMode === "table" ? "bg-crimson text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                  <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("grid")} className={`px-3 py-2 text-sm transition-colors ${viewMode === "grid" ? "bg-crimson text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showFilters &&
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
                <FilterBar active={filters} onChange={setFilters} />
              </div>
          }

            {loading ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array(6).fill(0).map((_, i) =>
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-50 rounded w-1/2" />
                  </div>
            )}
              </div> :
          <>
                <p className="text-sm text-gray-500 mb-3">{filtered.length} organization{filtered.length !== 1 ? "s" : ""}</p>
                {viewMode === "table" ? (
                  <OrgTable orgs={filtered} savedIds={savedIds} onSave={toggleSave} onRowClick={setSelectedOrg} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((org) =>
                      <OrgCard key={org.id} org={org} saved={savedIds.includes(org.id)} onSave={toggleSave} onClick={() => setSelectedOrg(org)} />
                    )}
                    {filtered.length === 0 &&
                      <div className="col-span-3 text-center py-12 text-gray-400 text-sm">No organizations match your filters.</div>
                    }
                  </div>
                )}
              </>
          }
          </div>
        }

        {tab === "Saved Organizations" &&
        <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Saved Organizations ({savedOrgs.length})</h2>
              {savedOrgs.length > 0 &&
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-crimson hover:text-crimson">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
            }
            </div>
            {savedOrgs.length === 0 ?
          <div className="text-center py-16 text-gray-400 text-sm">
                <p>No saved organizations yet.</p>
                <p className="mt-1">Click the bookmark icon on any org card to save it.</p>
              </div> :
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedOrgs.map((org) =>
            <OrgCard key={org.id} org={org} saved={true} onSave={toggleSave} onClick={() => setSelectedOrg(org)} />
            )}
              </div>
          }
          </div>
        }

        {tab === "Additional Resources" &&
        <div className="space-y-8">
            <div>
              <h2 className="font-semibold text-gray-800 mb-3">Job Boards & Career Platforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GENERAL_RESOURCES.map((r) =>
              <div key={r.title} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{r.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{r.title}</h3>
                          <p className="text-xs text-gray-400">{r.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{r.desc}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">💡 How to use it</p>
                      <ul className="space-y-1">
                        {r.tips.map((tip) =>
                    <li key={tip} className="text-xs text-gray-600 flex gap-1.5"><span className="text-gray-400 mt-0.5">•</span>{tip}</li>
                    )}
                      </ul>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-crimson hover:underline">
                      {r.cta} →
                    </a>
                  </div>
              )}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 mb-3">🎓 HBS-Specific Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HBS_RESOURCES.map((r) =>
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow block group">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-crimson transition-colors">{r.title} →</h3>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </a>
              )}
              </div>
            </div>
          </div>
        }
      </div>

      {selectedOrg && <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} />}
    </div>
  );
}
