import React, { useState, useEffect, useMemo } from "react";
import { Star, Plus, Pencil, Trash2, X, SlidersHorizontal, ExternalLink, ArrowUpDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { fetchContent, upsertContent } from "@/api/contentApi";
import { useAdmin } from "@/contexts/AdminContext";
import { PARENT_REGIONS } from "@/constants/regions";

// ── Resource tag taxonomy ─────────────────────────────────────
const RESOURCE_TAG_GROUPS = {
  "Org Type": ["Nonprofit", "Foundation", "Impact Investing", "Social Enterprise", "B Corp", "Startup"],
  "Geography": PARENT_REGIONS,
  "Function": ["Career Support", "Research", "Mentorship", "Alumni", "Fellowship", "Funding", "Community"],
};

const GEO_TAGS = new Set(RESOURCE_TAG_GROUPS["Geography"]);

const TAG_PRIORITY = [
  ...RESOURCE_TAG_GROUPS["Function"],
  ...RESOURCE_TAG_GROUPS["Org Type"],
  ...RESOURCE_TAG_GROUPS["Geography"],
];

function sortTagsByPriority(tags = []) {
  return [...tags].sort((a, b) => {
    const ai = TAG_PRIORITY.indexOf(a);
    const bi = TAG_PRIORITY.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function resourceMatchesFilters(r, activeFilters) {
  if (activeFilters.length === 0) return true;
  const tags = r.tags || [];
  if (tags.some(t => activeFilters.includes(t))) return true;
  if (activeFilters.some(t => GEO_TAGS.has(t)) && tags.includes("Global")) return true;
  return false;
}

function applySort(list, order) {
  const copy = [...list];
  if (order === "az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (order === "newest") return copy.sort((a, b) => {
    if (a.dateAdded && b.dateAdded) return b.dateAdded.localeCompare(a.dateAdded);
    if (a.dateAdded) return -1;
    if (b.dateAdded) return 1;
    return 0;
  });
  // "featured" — pinned first, then original order
  return copy.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

// Relevance sort: when filters active, rank by tag specificity.
// Resources whose matching tags are rarer in the full dataset float higher.
// e.g. GIIN is near-unique for "Impact Investing"; AVPN for "Asia" → they rank first.
function applyRelevanceSort(filtered, allResources, activeFilters) {
  // Build tag → count across full dataset
  const tagCounts = {};
  allResources.forEach(r => {
    (r.tags || []).forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
  });
  const n = allResources.length || 1;

  const score = (r) => {
    const tags = r.tags || [];
    // Expand active geo filters to also match "Global"
    const effectiveFilters = [...activeFilters];
    const hasGeoFilter = activeFilters.some(t => GEO_TAGS.has(t));
    if (hasGeoFilter && tags.includes("Global") && !tags.some(t => activeFilters.includes(t))) {
      // Global wildcard match — give a low score so specific matches outrank it
      return activeFilters.reduce((sum) => sum + 0.1 / n, 0);
    }
    return tags
      .filter(t => activeFilters.includes(t))
      .reduce((sum, t) => sum + 1 / (tagCounts[t] || 1), 0);
  };

  return [...filtered].sort((a, b) => {
    // Featured items always stay on top regardless
    if (b.featured !== a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return score(b) - score(a);
  });
}

const PAGE_SIZE = 16;

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
  // ── Added 2026-03-04 ─────────────────────────────────────────
  {
    emoji: "🌍", title: "Idealist", subtitle: "The largest nonprofit job board",
    desc: "Connects over 1.3 million monthly visitors with nonprofit jobs, internships, and volunteer opportunities across 250,000+ organizations worldwide. Filter by cause area, location, and role type.",
    tips: ["Use the cause area filter to narrow by your issue", "Set up job alerts for new postings", "Check the salary data tool before interviews"],
    url: "https://www.idealist.org", cta: "Browse Jobs",
    tags: ["Nonprofit", "Global", "North America", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🎯", title: "Probably Good", subtitle: "Evidence-based high-impact career guide & job board",
    desc: "Nonprofit offering a curated job board of high-impact roles across cause areas like global health, climate, animal welfare, and AI safety. Also provides free career guides, cause area profiles, career advising, and workshops — all research-backed.",
    tips: ["Use cause area and experience-level filters to narrow results", "Subscribe to the weekly newsletter for new high-impact roles", "Book a free 1-on-1 career advising session to talk through your options"],
    url: "https://jobs.probablygood.org", cta: "Browse Impact Jobs",
    tags: ["Nonprofit", "Global", "Career Support", "Research"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🏦", title: "AVPN", subtitle: "Asia's largest social investment network",
    desc: "The Asian Venture Philanthropy Network connects 600+ members across Asia — funders, foundations, family offices, and corporates — working to deploy capital for social impact. Offers fellowships, research, and member career boards.",
    tips: ["Check the AVPN Academy for Impact Investing and Philanthropy Fellowships", "Browse member org career pages via avpn.asia/members/careers", "Attend the annual AVPN Global Conference for networking"],
    url: "https://avpn.asia", cta: "Explore Network",
    tags: ["Foundation", "Impact Investing", "Asia", "Fellowship", "Research", "Community"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🕌", title: "Wamda", subtitle: "MENA startup and social enterprise ecosystem",
    desc: "Leading platform for the Middle East & North Africa startup ecosystem, covering social enterprises, impact startups, and funding trends. Provides research reports, founder resources, and sector analysis for the region.",
    tips: ["Browse the social enterprise tag for curated MENA impact stories", "Download the annual MENA funding report for sector trends", "Follow Wamda X fellowship for founder opportunities"],
    url: "https://www.wamda.com", cta: "Read Research",
    tags: ["Startup", "Social Enterprise", "Middle East & North Africa", "Research", "Community"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🤝", title: "Net Impact", subtitle: "100K+ students and professionals driving impact",
    desc: "Global community of 100,000+ impact-oriented students and professionals across 250+ chapters at top MBA programs. Offers career treks, case competitions, peer mentorship, and an impact-focused job board.",
    tips: ["Check if your school has a Net Impact chapter", "Attend the annual conference for recruiter access", "Use the Pro membership job board for exclusive impact roles"],
    url: "https://www.netimpact.org", cta: "Join Community",
    tags: ["Nonprofit", "Global", "North America", "Community", "Alumni", "Mentorship", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "📊", title: "GIIN Career Center", subtitle: "Impact investing job board",
    desc: "The Global Impact Investing Network hosts the leading job board for impact investing roles — from analyst to fund manager. Free for GIIN members to post, ensuring high-quality listings from verified impact investors.",
    tips: ["Filter by role type: investment, measurement, or operations", "Set alerts for new postings in your region", "GIIN membership gives access to salary benchmarking data"],
    url: "https://jobs.thegiin.org", cta: "Browse Impact Jobs",
    tags: ["Impact Investing", "Foundation", "Global", "North America", "Europe", "Career Support", "Research"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🗺️", title: "80,000 Hours Job Board", subtitle: "Curated high-impact job board with salary data",
    desc: "Curated job board by the 80,000 Hours team featuring high-impact roles across AI safety, global health, biosecurity, policy, and more. Includes salary data and highlighted 'especially impactful' roles — part of a broader career guide grounded in 10+ years of research.",
    tips: ["Use the salary filter to compare compensation across orgs", "Look for 'highlighted' roles — these are hand-picked as especially impactful", "Subscribe to job alerts filtered by your cause area", "Pair with the 80,000 Hours career guide for strategic planning"],
    url: "https://jobs.80000hours.org", cta: "Browse Jobs",
    tags: ["Nonprofit", "Global", "Career Support", "Research"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "📈", title: "ImpactAlpha", subtitle: "Impact investing news, jobs, and deal flow",
    desc: "The leading news platform for the impact investing industry, covering deal flow, fund launches, and sector trends. Features a weekly curated job board with roles at organizations like Acumen, Ford Foundation, and Goldman Sachs.",
    tips: ["Subscribe to the free 'The Week's Jobs' newsletter for curated impact roles", "Read the 'Breaking into Impact Investing' series for MBA career pathways", "Use the deal flow tracker to understand which sectors are attracting capital"],
    url: "https://impactalpha.com", cta: "Browse Jobs & News",
    tags: ["Impact Investing", "Social Enterprise", "Global", "North America", "Europe", "Africa", "Career Support", "Research", "Funding"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "📚", title: "Stanford Social Innovation Review", subtitle: "Thought leadership for social change",
    desc: "Published by Stanford University, SSIR is the leading publication on social innovation — covering social enterprise strategy, impact measurement, nonprofit management, and philanthropy. Offers articles, case studies, webinars, and podcasts.",
    tips: ["Start with the Social Enterprise topic page for curated frameworks and case studies", "Subscribe to the free newsletter for weekly research highlights", "Use SSIR articles to prep for social enterprise interviews — recruiters value candidates who reference them"],
    url: "https://ssir.org", cta: "Read Articles",
    tags: ["Nonprofit", "Foundation", "Social Enterprise", "Global", "Research"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🌱", title: "Acumen Academy", subtitle: "Free courses and fellowships for changemakers",
    desc: "Global school for social change with 600,000+ learners across 193 countries. Offers free online courses and competitive regional fellowships across Colombia, East Africa, India, Pakistan, Southeast Asia, UK, and West Africa.",
    tips: ["Start with the free Social Entrepreneurship 101 course (5 weeks)", "Apply for a regional Fellowship for immersive leadership development and a global alumni network of 1,800+", "Use the Moral Leadership course to strengthen your impact narrative for interviews"],
    url: "https://acumenacademy.org", cta: "Explore Courses",
    tags: ["Social Enterprise", "Nonprofit", "Global", "Africa", "Asia", "Latin America & Caribbean", "Europe", "Fellowship", "Mentorship", "Community"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "💻", title: "Tech Jobs for Good", subtitle: "Tech roles at mission-driven organizations",
    desc: "Job board focused exclusively on technology roles (engineering, data analytics, design, product, IT) at social impact organizations. Features impact area filters including Clean Energy, Climate Change, Education, Health, and Human Rights.",
    tips: ["Filter by job function (Engineering, Data, Design, Product) and impact area", "Create an email alert for new tech-for-good listings", "Use 'Get Matched to Companies' for personalized recommendations", "Check salary ranges — most listings include them"],
    url: "https://techjobsforgood.com", cta: "Browse Tech Jobs",
    tags: ["Nonprofit", "Social Enterprise", "Startup", "North America", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🏛️", title: "Public Sector Job Board", subtitle: "Tech & innovation jobs in government",
    desc: "Biweekly Substack newsletter sharing tech and innovation jobs in government and public sector. Over 5,000 subscribers. Covers federal, state, and local roles for people who want to bring tech skills to public service.",
    tips: ["Subscribe for free biweekly job roundups", "Great for candidates interested in civic tech and gov-tech career paths", "Pair with the Tech Jobs for Good board for a wider tech-for-impact search"],
    url: "https://publicsectorjobboard.substack.com", cta: "Subscribe",
    tags: ["Nonprofit", "North America", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🤖", title: "ImpactSource", subtitle: "AI-powered social impact job aggregator",
    desc: "Built by TechChange, ImpactSource aggregates 4,000+ jobs across 200+ social impact organizations. Filter by roles, skills, location, org stage, sector, and salary. Also offers a talent network and Impact Coach for personalized career guidance.",
    tips: ["Use the skill-based filters to find roles matching your MBA specialization", "Join the Talent Network for direct recruiter outreach", "Try the Impact Coach for 1-on-1 guidance", "Filter by org stage (startup, growth, established) to match your risk preference"],
    url: "https://www.impactsource.ai/jobs", cta: "Search Jobs",
    tags: ["Nonprofit", "Social Enterprise", "Startup", "Global", "North America", "Africa", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🌊", title: "Rippleworks Job Board", subtitle: "1,000+ jobs at world-changing social ventures",
    desc: "Curated by Rippleworks Foundation, this board aggregates 1,000+ open positions across 200+ social impact organizations worldwide, spanning every business function from entry-level to senior.",
    tips: ["Filter by seniority and salary to find MBA-level roles", "Browse the companies tab to explore Rippleworks portfolio orgs", "Join the talent network to be matched with ventures", "Strong coverage of Africa, India, and Latin America — complements US-focused boards"],
    url: "https://careers.rippleworks.org/jobs", cta: "Search Impact Jobs",
    tags: ["Social Enterprise", "Startup", "Nonprofit", "Global", "Africa", "Asia", "Latin America & Caribbean", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "✨", title: "The Impact Job", subtitle: "Handpicked social impact jobs with salary transparency",
    desc: "Community-driven platform that handpicks social impact jobs — every listing is vetted and includes salary information for transparency. Joined by 40,000+ social impact professionals via their weekly newsletter.",
    tips: ["Subscribe to the weekly newsletter for curated handpicked jobs, tips, and social impact news", "Every listing shows salary — use it to benchmark compensation", "Filter by full-time, part-time, and contract roles"],
    url: "https://www.theimpactjob.com", cta: "Browse Jobs",
    tags: ["Nonprofit", "Social Enterprise", "Global", "North America", "Europe", "Career Support", "Community"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🚀", title: "Wellfound", subtitle: "130K+ startup jobs with equity info",
    desc: "Formerly AngelList Talent, Wellfound is the largest startup job platform with 130,000+ remote and local listings. Includes salary ranges and equity information for every role — essential for finding roles at impact-driven startups, social enterprises, and B Corps.",
    tips: ["Filter by job function and location to narrow results", "Look for YC-funded and B Corp-tagged startups for impact alignment", "Every listing shows salary AND equity — useful for comparing startup offers", "Use 'Growing fast' tags to spot high-momentum social ventures"],
    url: "https://wellfound.com/jobs", cta: "Search Startup Jobs",
    tags: ["Startup", "B Corp", "Social Enterprise", "Global", "North America", "Career Support"], featured: false, dateAdded: "2026-03-04",
  },
  {
    emoji: "🌐", title: "Impactpool", subtitle: "UN and international development careers",
    desc: "Career platform specializing in United Nations, multilateral, and international development roles. Features jobs at UNDP, UNHCR, UNFCCC, AfDB, and other major international bodies.",
    tips: ["Search by organization (UN agencies, World Bank, regional development banks)", "Explore the Fellowship program for structured career prep", "Check the weekly newsletter for curated international roles", "Strong coverage of Africa, Europe, and Asia — ideal for global development careers"],
    url: "https://www.impactpool.org/search", cta: "Search International Jobs",
    tags: ["Nonprofit", "Foundation", "Global", "Africa", "Europe", "Asia", "Career Support", "Fellowship"], featured: false, dateAdded: "2026-03-04",
  },
  // ── Added 2026-03-10 ─────────────────────────────────────────
  {
    emoji: "📋", title: "ProPublica Nonprofit Explorer", subtitle: "Free IRS 990 database for nonprofits",
    desc: "Free searchable database of IRS Form 990 filings for 1.8 million nonprofit organizations. Pull audited financials, executive compensation, board composition, and program expenses — essential due diligence before applying or partnering.",
    tips: ["Search an org before an interview to understand their financials and leadership", "Compare executive compensation across similar organizations", "Check program expense ratios to assess operational efficiency", "Download full 990 PDFs for granular program and grantee data"],
    url: "https://projects.propublica.org/nonprofits/", cta: "Search Nonprofits",
    tags: ["Nonprofit", "Foundation", "Research", "North America"], featured: false, dateAdded: "2026-03-10",
  },
  {
    emoji: "🌟", title: "Audacious Project", subtitle: "TED's collaborative philanthropic initiative",
    desc: "TED's Audacious Project funds bold ideas for social change at scale. The grantees directory showcases organizations receiving transformational philanthropy — useful for identifying top-tier nonprofits and tracking what major funders are backing globally.",
    tips: ["Browse grantees to discover organizations tackling systemic issues at scale", "Use as a signal for which orgs are attracting major philanthropic capital", "Many grantees post jobs — search their career pages directly", "Follow announcements to track emerging impact areas gaining funder attention"],
    url: "https://audaciousproject.org/grantees", cta: "Browse Grantees",
    tags: ["Nonprofit", "Foundation", "Social Enterprise", "Funding", "Research", "Global"], featured: false, dateAdded: "2026-03-10",
  },
  {
    emoji: "🏆", title: "Skoll Awardees", subtitle: "Skoll Foundation's social entrepreneurship award directory",
    desc: "The Skoll Foundation's award program recognizes the world's leading social entrepreneurs driving large-scale, positive change. The awardee directory is a who's-who of proven social enterprises — useful for researching top organizations, career targets, and how the field's most impactful leaders define success.",
    tips: ["Browse by year and sector to discover high-credibility organizations", "Use awardee orgs as career targets — the Skoll award signals organizational excellence", "Review awardee profiles for frameworks on how social entrepreneurs measure impact", "Cross-reference with Audacious Project and Candid for a fuller picture of top-tier orgs"],
    url: "https://skoll.org/skoll-awardees/", cta: "Browse Awardees",
    tags: ["Social Enterprise", "Nonprofit", "Foundation", "Funding", "Research", "Global"], featured: false, dateAdded: "2026-03-10",
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

// ── Resource Detail Modal ─────────────────────────────────────
function ResourceDetailModal({ resource, onClose, onFilterTag, activeFilters }) {
  const r = resource;
  const isGeneral = !!r.emoji;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              {r.emoji && <span className="text-2xl flex-shrink-0">{r.emoji}</span>}
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 text-base leading-snug">{r.title}</h2>
                {r.subtitle && <p className="text-xs text-gray-400 mt-0.5">{r.subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.desc}</p>

          {/* Tips */}
          {r.tips?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">💡 How to use it</p>
              <ul className="space-y-1.5">
                {r.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All tags */}
          {(r.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {sortTagsByPriority(r.tags).map(tag => (
                <button
                  key={tag}
                  onClick={() => { onFilterTag(tag); onClose(); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeFilters.includes(tag)
                      ? "bg-crimson/10 text-crimson border-crimson/20"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-crimson/40 hover:text-crimson"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-crimson text-white rounded-xl text-sm font-medium hover:bg-crimson/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {r.cta || `Visit ${r.title}`}
          </a>
        </div>
      </div>
    </div>
  );
}

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
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setData(d => ({ ...d, featured: !d.featured }))}
                className={`relative w-9 h-5 rounded-full transition-colors ${data.featured ? "bg-amber-400" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${data.featured ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" /> Pin to top
              </span>
            </label>
            {isGeneral && (
              <div className="flex gap-2">
                <input value={data.emoji || ""} onChange={e => setData(d => ({ ...d, emoji: e.target.value }))} placeholder="Emoji"
                  className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30" />
                <input value={data.subtitle || ""} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))} placeholder="Subtitle"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30" />
              </div>
            )}
            <input value={data.title || ""} onChange={e => setData(d => ({ ...d, title: e.target.value }))} placeholder="Title"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30" />
            <input value={data.url || ""} onChange={e => setData(d => ({ ...d, url: e.target.value }))} placeholder="URL (https://...)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30" />
            <textarea value={data.desc || ""} onChange={e => setData(d => ({ ...d, desc: e.target.value }))} placeholder="Description" rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30 resize-none" />
            {isGeneral && (
              <>
                <input value={data.cta || ""} onChange={e => setData(d => ({ ...d, cta: e.target.value }))} placeholder={`CTA label (e.g. Visit ${data.title || "Site"})`}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30" />
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Tips — one per line</label>
                  <textarea
                    value={data.tipsText !== undefined ? data.tipsText : (data.tips || []).join("\n")}
                    onChange={e => setData(d => ({ ...d, tipsText: e.target.value }))}
                    placeholder={"Tip 1\nTip 2\nTip 3"} rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson/30 resize-none"
                  />
                </div>
              </>
            )}
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
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active ? "bg-crimson text-white border-crimson" : "bg-white text-gray-500 border-gray-200 hover:border-crimson/50 hover:text-crimson"}`}>
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
              className="flex-1 py-2 bg-crimson text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-crimson/90">
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

// ── Tag chips (capped at 3) ───────────────────────────────────
function TagChips({ tags, activeFilters, onFilterTag, onOpenModal }) {
  const sorted = sortTagsByPriority(tags || []);
  const visible = sorted.slice(0, 3);
  const overflow = sorted.length - 3;
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map(tag => (
        <button
          key={tag}
          onClick={e => { e.stopPropagation(); onFilterTag(tag); }}
          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            activeFilters.includes(tag)
              ? "bg-crimson/10 text-crimson border-crimson/20"
              : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
          }`}
        >
          {tag}
        </button>
      ))}
      {overflow > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onOpenModal(); }}
          className="text-[10px] px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
        >
          +{overflow}
        </button>
      )}
    </div>
  );
}

// ── Sort control ──────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "az",       label: "A – Z" },
  { value: "newest",   label: "Newest" },
];

function SortControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <ArrowUpDown className="w-3 h-3 text-gray-400" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer hover:text-gray-700"
      >
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Main Resources Page ───────────────────────────────────────
export default function Resources() {
  const { adminMode } = useAdmin();
  const location = useLocation();
  const [generalResources, setGeneralResources] = useState([...DEFAULT_GENERAL_RESOURCES]);
  const [hbsResources, setHbsResources] = useState([...DEFAULT_HBS_RESOURCES]);
  const [editingResource, setEditingResource] = useState(null);
  const [savingResource, setSavingResource] = useState(false);
  const [resourceTagFilters, setResourceTagFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [sortOrder, setSortOrder] = useState("featured");
  const [generalPage, setGeneralPage] = useState(0);

  // Accept pre-filters from navigation state (e.g. from "View entry paths" in Explore)
  useEffect(() => {
    const preFilters = location.state?.preFilters;
    if (preFilters?.length) {
      setResourceTagFilters(preFilters);
      setShowFilters(true);
      // Clear the state so a page refresh doesn't re-apply them
      window.history.replaceState({}, "");
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchContent("general_resources").then(data => {
      if (data) {
        // Merge: keep stored resources, append any new defaults not yet saved (matched by URL)
        const existingUrls = new Set(data.map(r => r.url));
        const newItems = DEFAULT_GENERAL_RESOURCES.filter(r => !existingUrls.has(r.url));
        setGeneralResources(newItems.length > 0 ? [...data, ...newItems] : data);
      }
    }).catch(() => {});
    fetchContent("hbs_resources").then(data => { if (data) setHbsResources(data); }).catch(() => {});
  }, []);

  const toggleResourceTag = tag => {
    setGeneralPage(0);
    setResourceTagFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredGeneralResources = useMemo(() => {
    const matched = generalResources.filter(r => resourceMatchesFilters(r, resourceTagFilters));
    if (resourceTagFilters.length > 0) {
      return applyRelevanceSort(matched, generalResources, resourceTagFilters);
    }
    return applySort(matched, sortOrder);
  }, [generalResources, resourceTagFilters, sortOrder]);

  const totalGeneralPages = Math.ceil(filteredGeneralResources.length / PAGE_SIZE);
  const pagedGeneralResources = filteredGeneralResources.slice(
    generalPage * PAGE_SIZE,
    (generalPage + 1) * PAGE_SIZE
  );

  const filteredHbsResources = useMemo(() =>
    applySort(hbsResources.filter(r => resourceMatchesFilters(r, resourceTagFilters)), sortOrder),
    [hbsResources, resourceTagFilters, sortOrder]
  );

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
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">

        {/* ── Filter toggle + collapsible panel ───────────────── */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || resourceTagFilters.length > 0
                  ? "border-crimson text-crimson bg-crimson/5"
                  : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter{resourceTagFilters.length > 0 ? ` (${resourceTagFilters.length})` : ""}
            </button>

            {resourceTagFilters.map(tag => (
              <button
                key={tag}
                onClick={() => toggleResourceTag(tag)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors"
              >
                {tag} <X className="w-3 h-3" />
              </button>
            ))}
            {resourceTagFilters.length > 1 && (
              <button onClick={() => setResourceTagFilters([])} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-2 bg-white border border-gray-100 rounded-xl p-4">
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
                              active ? "bg-crimson text-white border-crimson" : "bg-white text-gray-500 border-gray-200 hover:border-crimson/50 hover:text-crimson"
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
            </div>
          )}
        </div>

        {/* ── Job Boards & Career Platforms ──────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">
              Job Boards &amp; Career Platforms
              <span className="ml-2 text-xs font-normal text-gray-400">
                {resourceTagFilters.length > 0
                  ? `${filteredGeneralResources.length} of ${generalResources.length}`
                  : generalResources.length}
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <SortControl value={sortOrder} onChange={v => { setGeneralPage(0); setSortOrder(v); }} />
              {adminMode && (
                <button
                  onClick={() => setEditingResource({ section: "general", index: null, data: { emoji: "🔗", title: "", subtitle: "", desc: "", tipsText: "", url: "", cta: "", tags: [], featured: false } })}
                  className="flex items-center gap-1.5 text-xs text-crimson border border-crimson/30 rounded-md px-2.5 py-1 hover:bg-crimson/5"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>
          </div>

          {filteredGeneralResources.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No resources match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pagedGeneralResources.map((r) => {
                const realIndex = generalResources.indexOf(r);
                return (
                  <div
                    key={realIndex}
                    onClick={() => setSelectedResource(r)}
                    className={`bg-white border rounded-xl p-4 flex flex-col gap-2 relative group cursor-pointer hover:shadow-md transition-shadow ${r.featured ? "border-amber-200 shadow-sm" : "border-gray-100"}`}
                  >
                    {r.featured && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                        <Star className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {adminMode && (
                      <div className="absolute top-3 right-3 hidden group-hover:flex gap-1 z-10">
                        <button onClick={e => { e.stopPropagation(); toggleFeatured("general", realIndex); }} title={r.featured ? "Unpin" : "Pin to top"}
                          className={`rounded shadow-sm p-1 ${r.featured ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 bg-white"}`}>
                          <Star className="w-3 h-3" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setEditingResource({ section: "general", index: realIndex, data: { ...r, tipsText: (r.tips || []).join("\n") } }); }}
                          className="text-gray-400 hover:text-crimson bg-white rounded shadow-sm p-1" title="Edit">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDeleteResource("general", realIndex); }}
                          className="text-gray-400 hover:text-red-500 bg-white rounded shadow-sm p-1" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className={r.featured ? "mt-4" : ""}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl flex-shrink-0">{r.emoji}</span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{r.title}</h3>
                          <p className="text-xs text-gray-400 truncate">{r.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{r.desc}</p>
                    </div>
                    <TagChips
                      tags={r.tags}
                      activeFilters={resourceTagFilters}
                      onFilterTag={tag => { toggleResourceTag(tag); }}
                      onOpenModal={() => setSelectedResource(r)}
                    />
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-xs font-medium text-crimson hover:underline mt-auto"
                    >
                      {r.cta} →
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalGeneralPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setGeneralPage(p => Math.max(0, p - 1))}
                disabled={generalPage === 0}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="text-xs text-gray-400">
                Page {generalPage + 1} of {totalGeneralPages}
                <span className="ml-1 text-gray-300">({filteredGeneralResources.length} resources)</span>
              </span>
              <button
                onClick={() => setGeneralPage(p => Math.min(totalGeneralPages - 1, p + 1))}
                disabled={generalPage >= totalGeneralPages - 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* ── HBS-Specific Resources ──────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">
              🎓 HBS-Specific Resources
              <span className="ml-2 text-xs font-normal text-gray-400">
                {resourceTagFilters.length > 0
                  ? `${filteredHbsResources.length} of ${hbsResources.length}`
                  : hbsResources.length}
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <SortControl value={sortOrder} onChange={setSortOrder} />
              {adminMode && (
                <button
                  onClick={() => setEditingResource({ section: "hbs", index: null, data: { title: "", url: "", desc: "", tags: [], featured: false } })}
                  className="flex items-center gap-1.5 text-xs text-crimson border border-crimson/30 rounded-md px-2.5 py-1 hover:bg-crimson/5"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>
          </div>

          {filteredHbsResources.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No resources match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredHbsResources.map((r) => {
                const realIndex = hbsResources.indexOf(r);
                return (
                  <div
                    key={realIndex}
                    onClick={() => setSelectedResource(r)}
                    className={`bg-white border rounded-xl p-4 flex flex-col gap-2 relative group cursor-pointer hover:shadow-md transition-shadow ${r.featured ? "border-amber-200" : "border-gray-100"}`}
                  >
                    {r.featured && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 mb-0.5">
                        <Star className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {adminMode && (
                      <div className="absolute top-3 right-3 hidden group-hover:flex gap-1 z-10">
                        <button onClick={e => { e.stopPropagation(); toggleFeatured("hbs", realIndex); }} title={r.featured ? "Unpin" : "Pin to top"}
                          className={`rounded shadow-sm p-1 ${r.featured ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 bg-white"}`}>
                          <Star className="w-3 h-3" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setEditingResource({ section: "hbs", index: realIndex, data: { ...r } }); }}
                          className="text-gray-400 hover:text-crimson bg-white rounded shadow-sm p-1" title="Edit">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDeleteResource("hbs", realIndex); }}
                          className="text-gray-400 hover:text-red-500 bg-white rounded shadow-sm p-1" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{r.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{r.desc}</p>
                    </div>
                    <TagChips
                      tags={r.tags}
                      activeFilters={resourceTagFilters}
                      onFilterTag={tag => { toggleResourceTag(tag); }}
                      onOpenModal={() => setSelectedResource(r)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      {selectedResource && !editingResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onFilterTag={toggleResourceTag}
          activeFilters={resourceTagFilters}
        />
      )}
      {editingResource && (
        <ResourceEditModal
          editing={editingResource}
          onSave={handleSaveResource}
          onClose={() => setEditingResource(null)}
          saving={savingResource}
        />
      )}
    </div>
  );
}
