import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import LearnMoreModal from "./LearnMoreModal";

const CAUSES = [
  { label: "Poverty Alleviation", emoji: "🏘️", sdgNum: 1, sdg: "SDG 1", preview: "Addressing root causes of extreme poverty through economic inclusion and safety nets." },
  { label: "Economic Development", emoji: "📈", sdgNum: 8, sdg: "SDG 8", preview: "Building resilient local economies, entrepreneurship, and fair labor markets." },
  { label: "Global Health", emoji: "🩺", sdgNum: 3, sdg: "SDG 3", preview: "Improving access to healthcare and combating disease globally." },
  { label: "Education", emoji: "🎓", sdgNum: 4, sdg: "SDG 4", preview: "Expanding quality learning opportunities for all ages and geographies." },
  { label: "Climate & Energy", emoji: "🌱", sdgNum: 13, sdg: "SDG 13", preview: "Tackling climate change through clean energy and sustainable systems." },
  { label: "Gender & Social Justice", emoji: "⚖️", sdgNum: 5, sdg: "SDG 5", preview: "Advancing equity, rights, and inclusion across gender and identity." },
  { label: "Financial Inclusion", emoji: "💳", sdgNum: 10, sdg: "SDG 10", preview: "Bringing underserved communities into the formal financial system." },
  { label: "Housing & Community", emoji: "🏗️", sdgNum: 11, sdg: "SDG 11", preview: "Creating affordable, safe, and sustainable housing and neighborhoods." },
  { label: "Arts & Culture", emoji: "🎨", sdgNum: 11, sdg: "SDG 11", preview: "Using creative expression to drive social change and community cohesion." },
];

const SDG_BASE = "https://sdgs.un.org/goals/goal";

const CAUSE_DETAILS = {
  "Poverty Alleviation": {
    description:
      "Poverty alleviation addresses the systemic barriers that prevent individuals from meeting their basic needs, including food, shelter, healthcare, and education. Effective interventions combine direct aid with structural reforms to economic and social systems. The field increasingly emphasizes dignity, agency, and community-led approaches over top-down models.",
    subtopics: ["Cash Transfers", "Food Security", "Water & Sanitation", "Refugee Support", "Rural Livelihoods", "Safety Nets"],
    hbs_pathway: {
      text: "HBS MBAs typically engage through impact investing vehicles, consulting for organizations like GiveDirectly or the World Bank, or founding social enterprises that create economic opportunity for low-income populations.",
      courses: ["Entrepreneurship in the Social Sector", "Business at the Base of the Pyramid", "FIELD Global Immersion"],
      clubs: ["Social Enterprise Club", "Africa Business Club", "Latin America Business Club"],
    },
    sdg_links: [
      { label: "SDG 1: No Poverty", url: `${SDG_BASE}1` },
      { label: "SDG 10: Reduced Inequalities", url: `${SDG_BASE}10` },
    ],
    read_more: [
      { category: "Problem Overview", source: "World Bank", url: "https://www.worldbank.org/en/topic/poverty" },
      { category: "Research & Evidence", source: "GiveWell", url: "https://www.givewell.org/" },
      { category: "Funding Landscape", source: "Bridgespan Group", url: "https://www.bridgespan.org/insights/library/philanthropy/big-bets-philanthropy" },
      { category: "Key Organization", source: "Acumen", url: "https://acumen.org/" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Economic Development": {
    description:
      "Economic development focuses on building resilient local economies through job creation, entrepreneurship support, workforce development, and fair trade. It operates at the intersection of public policy, private sector engagement, and community organizing. Increasingly, practitioners emphasize inclusive growth that reaches marginalized communities.",
    subtopics: ["Small Business Lending", "Workforce Development", "Supply Chain Inclusion", "Rural Entrepreneurship", "Trade & Market Access", "Job Creation"],
    hbs_pathway: {
      text: "HBS graduates often work in economic development through roles at development finance institutions (DFIs) like IFC or OPIC, management consulting for government agencies, or leading workforce development nonprofits and social enterprises.",
      courses: ["Entrepreneurship in the Social Sector", "FIELD Global Immersion", "The Coming Apart of the American Economy"],
      clubs: ["Social Enterprise Club", "Africa Business Club", "South Asia Business Club"],
    },
    sdg_links: [
      { label: "SDG 8: Decent Work & Economic Growth", url: `${SDG_BASE}8` },
      { label: "SDG 9: Industry, Innovation & Infrastructure", url: `${SDG_BASE}9` },
    ],
    read_more: [
      { category: "Problem Overview", source: "World Bank – Economic Growth", url: "https://www.worldbank.org/en/topic/economic-growth" },
      { category: "Key Organization", source: "IFC (Int'l Finance Corporation)", url: "https://www.ifc.org/" },
      { category: "Research", source: "Brookings – Economic Development", url: "https://www.brookings.edu/topic/economic-development/" },
      { category: "Funding Landscape", source: "Bridgespan Group", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Global Health": {
    description:
      "Global health addresses disparities in health outcomes across countries and communities by improving access to care, strengthening health systems, and combating infectious and chronic diseases. The field blends clinical medicine, public health, policy, and technology to tackle challenges like HIV/AIDS, malaria, maternal mortality, and pandemic preparedness.",
    subtopics: ["Infectious Disease", "Maternal & Child Health", "Mental Health", "Health Systems Strengthening", "Access to Medicines", "Pandemic Preparedness"],
    hbs_pathway: {
      text: "HBS MBAs enter global health through operations and strategy roles at organizations like Partners in Health, the Gates Foundation, WHO, or health-focused impact investors. The HBS Health Care Initiative provides strong networking and recruiting pathways.",
      courses: ["Health Care in the Digital Age", "Strategic Perspectives in Nonprofit Management", "Entrepreneurship in the Social Sector"],
      clubs: ["Healthcare Club", "Social Enterprise Club", "Global Health Initiative"],
    },
    sdg_links: [
      { label: "SDG 3: Good Health & Well-Being", url: `${SDG_BASE}3` },
      { label: "SDG 1: No Poverty", url: `${SDG_BASE}1` },
    ],
    read_more: [
      { category: "Problem Overview", source: "World Health Organization (WHO)", url: "https://www.who.int/health-topics" },
      { category: "Key Organization", source: "Partners in Health", url: "https://www.pih.org/" },
      { category: "Funding Landscape", source: "Gates Foundation – Global Health", url: "https://www.gatesfoundation.org/our-work/programs/global-health" },
      { category: "Research", source: "Bridgespan – Global Health Funding", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Health Care Initiative", url: "https://www.hbs.edu/faculty/Units/healthcarepolicy/hci/Pages/default.aspx" },
    ],
  },

  "Education": {
    description:
      "The education sector works to expand access to quality learning from early childhood through higher education, with particular focus on underserved communities globally. Innovations in EdTech, alternative credentialing, and community schooling are reshaping how education is delivered and financed.",
    subtopics: ["Early Childhood", "K–12 Reform", "Higher Ed Access", "EdTech & Digital Learning", "Workforce Training", "Girls' Education"],
    hbs_pathway: {
      text: "HBS MBAs pursue education careers at charter management organizations like KIPP and Uncommon Schools, EdTech ventures, education-focused foundations like Gates or Bloomberg Philanthropies, and consulting practices that serve school districts and universities.",
      courses: ["Entrepreneurship in the Social Sector", "FIELD Global Immersion", "Leadership and Corporate Accountability"],
      clubs: ["Education Club", "Social Enterprise Club", "Women's Student Association"],
    },
    sdg_links: [
      { label: "SDG 4: Quality Education", url: `${SDG_BASE}4` },
      { label: "SDG 10: Reduced Inequalities", url: `${SDG_BASE}10` },
    ],
    read_more: [
      { category: "Problem Overview", source: "UNESCO – Education", url: "https://www.unesco.org/en/education" },
      { category: "Key Organization", source: "NewSchools Venture Fund", url: "https://www.newschools.org/" },
      { category: "Funding Landscape", source: "Bridgespan – Education Funding", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "Research", source: "EdSurge", url: "https://www.edsurge.com/" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Climate & Energy": {
    description:
      "Climate and clean energy is one of the fastest-growing areas in social impact, encompassing renewable energy deployment, carbon markets, climate policy, sustainable agriculture, and climate adaptation for vulnerable communities. The sector spans nonprofits, government, impact investing, and mainstream corporate strategy.",
    subtopics: ["Renewable Energy", "Carbon Markets", "Sustainable Agriculture", "Climate Adaptation", "Circular Economy", "Green Finance"],
    hbs_pathway: {
      text: "HBS MBAs are highly sought after in climate tech venture capital, corporate sustainability leadership, climate policy consulting, and clean energy infrastructure finance. Programs like the HBS Social Enterprise Initiative and Energy & Environment Club connect students to this growing field.",
      courses: ["Climate Change: Science, Economics, and Policy", "Sustainable Business Strategy", "FIELD Global Immersion"],
      clubs: ["Energy & Environment Club", "Business & Climate Initiative", "Social Enterprise Club"],
    },
    sdg_links: [
      { label: "SDG 13: Climate Action", url: `${SDG_BASE}13` },
      { label: "SDG 7: Affordable & Clean Energy", url: `${SDG_BASE}7` },
    ],
    read_more: [
      { category: "Problem Overview", source: "Project Drawdown", url: "https://drawdown.org/" },
      { category: "Research", source: "IRENA – Renewable Energy", url: "https://www.irena.org/" },
      { category: "Key Organization", source: "RMI (Rocky Mountain Institute)", url: "https://rmi.org/" },
      { category: "Funding Landscape", source: "Bridgespan – Climate Philanthropy", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Gender & Social Justice": {
    description:
      "Gender and social justice work advances equity, rights, and inclusion for women, girls, and marginalized groups through direct service, policy advocacy, and systems change. The field encompasses reproductive rights, gender-based violence prevention, pay equity, and LGBTQ+ rights, often operating at the intersection of multiple identities.",
    subtopics: ["Women's Economic Empowerment", "Gender-Based Violence", "Reproductive Health", "Pay Equity", "LGBTQ+ Rights", "Racial Justice"],
    hbs_pathway: {
      text: "HBS MBAs in this space tend to work at gender-lens investing funds, women's economic empowerment organizations, foundations focused on racial equity, or social justice advocacy organizations. The Women's Student Association and related clubs offer a strong community.",
      courses: ["Power and Influence for Positive Impact", "Leadership and Corporate Accountability", "Entrepreneurship in the Social Sector"],
      clubs: ["Women's Student Association", "African American Student Union", "Social Enterprise Club"],
    },
    sdg_links: [
      { label: "SDG 5: Gender Equality", url: `${SDG_BASE}5` },
      { label: "SDG 10: Reduced Inequalities", url: `${SDG_BASE}10` },
    ],
    read_more: [
      { category: "Problem Overview", source: "UN Women", url: "https://www.unwomen.org/en" },
      { category: "Research", source: "Catalyst – Workplace Equity", url: "https://www.catalyst.org/" },
      { category: "Funding Landscape", source: "Bridgespan – Racial Equity Funding", url: "https://www.bridgespan.org/insights/library/organizational-effectiveness/racial-equity" },
      { category: "Key Organization", source: "Open Society Foundations", url: "https://www.opensocietyfoundations.org/" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Financial Inclusion": {
    description:
      "Financial inclusion brings underserved individuals and communities into the formal financial system through microfinance, mobile banking, credit access, and insurance products. With over 1.4 billion adults remaining unbanked globally, the sector addresses a critical barrier to economic mobility and resilience.",
    subtopics: ["Microfinance", "Mobile Banking", "Savings & Insurance", "Credit Scoring", "Remittances", "MSME Lending"],
    hbs_pathway: {
      text: "HBS MBAs pursue financial inclusion through roles at microfinance institutions, fintech startups serving the underserved, impact-first investment funds like Accion Venture Lab, and development banks. The field is increasingly driven by mobile technology and data.",
      courses: ["Fintech Ventures", "Impact Investing", "Business at the Base of the Pyramid"],
      clubs: ["Fintech Club", "Social Enterprise Club", "Africa Business Club"],
    },
    sdg_links: [
      { label: "SDG 10: Reduced Inequalities", url: `${SDG_BASE}10` },
      { label: "SDG 1: No Poverty", url: `${SDG_BASE}1` },
    ],
    read_more: [
      { category: "Problem Overview", source: "CGAP – Financial Inclusion", url: "https://www.cgap.org/" },
      { category: "Research", source: "World Bank – Financial Inclusion", url: "https://www.worldbank.org/en/topic/financialinclusion" },
      { category: "Key Organization", source: "Accion", url: "https://www.accion.org/" },
      { category: "Funding Landscape", source: "Bridgespan Group", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Housing & Community": {
    description:
      "Housing and community development addresses the affordable housing crisis, neighborhood revitalization, and equitable urban planning. The sector combines real estate development, community organizing, policy advocacy, and social services to create stable, thriving communities for low-income residents.",
    subtopics: ["Affordable Housing", "CDFIs", "Neighborhood Revitalization", "Homelessness", "Tenant Advocacy", "Mixed-Income Communities"],
    hbs_pathway: {
      text: "HBS MBAs engage through community development financial institutions (CDFIs), affordable housing developers, urban planning consultancies, and real estate impact funds. The Real Estate Club often connects students to impact-focused developers.",
      courses: ["Real Estate Finance", "Urban Land Economics", "Entrepreneurship in the Social Sector"],
      clubs: ["Real Estate Club", "Social Enterprise Club", "Urban Planning Club"],
    },
    sdg_links: [
      { label: "SDG 11: Sustainable Cities & Communities", url: `${SDG_BASE}11` },
      { label: "SDG 1: No Poverty", url: `${SDG_BASE}1` },
    ],
    read_more: [
      { category: "Problem Overview", source: "Urban Institute", url: "https://www.urban.org/" },
      { category: "Key Organization", source: "LISC", url: "https://www.lisc.org/" },
      { category: "Key Organization", source: "Enterprise Community Partners", url: "https://www.enterprisecommunity.org/" },
      { category: "Funding Landscape", source: "Bridgespan Group", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },

  "Arts & Culture": {
    description:
      "Arts and culture organizations use creative expression to drive social change, build community cohesion, and preserve cultural heritage. The sector includes performing arts nonprofits, community arts programs, cultural institutions, and social enterprises that use art as a vehicle for healing, advocacy, and economic opportunity.",
    subtopics: ["Arts Education", "Community Arts", "Cultural Preservation", "Creative Economy", "Performing Arts", "Social Practice Art"],
    hbs_pathway: {
      text: "HBS MBAs in arts and culture typically take on leadership and operations roles at major cultural institutions, consult for arts nonprofits on strategy and sustainability, or work at foundations with arts funding portfolios. The field values both business acumen and genuine passion for the arts.",
      courses: ["The Business of Entertainment, Media, and Sports", "Leadership and Corporate Accountability", "Strategic Perspectives in Nonprofit Management"],
      clubs: ["Arts & Culture Club", "Social Enterprise Club", "Media & Entertainment Club"],
    },
    sdg_links: [
      { label: "SDG 11: Sustainable Cities & Communities", url: `${SDG_BASE}11` },
      { label: "SDG 4: Quality Education", url: `${SDG_BASE}4` },
    ],
    read_more: [
      { category: "Problem Overview", source: "Americans for the Arts", url: "https://www.americansforthearts.org/" },
      { category: "Key Organization", source: "National Endowment for the Arts", url: "https://www.arts.gov/" },
      { category: "Key Organization", source: "Creative Capital", url: "https://creative-capital.org/" },
      { category: "Funding Landscape", source: "Bridgespan Group", url: "https://www.bridgespan.org/insights/library/philanthropy" },
      { category: "HBS Resources", source: "HBS Social Enterprise Initiative", url: "https://www.hbs.edu/socialenterprise/" },
    ],
  },
};

export default function CausesTab() {
  const [selected, setSelected] = useState(null);

  const detail = selected ? CAUSE_DETAILS[selected.label] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAUSES.map((c) => (
          <button
            key={c.label}
            onClick={() => setSelected(c)}
            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="text-2xl mb-2">{c.emoji}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{c.label}</h3>
            <span className="text-xs font-medium text-[#A51C30] bg-red-50 px-2 py-0.5 rounded-full">{c.sdg}</span>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.preview}</p>
          </button>
        ))}
      </div>

      {selected && detail && (
        <LearnMoreModal onClose={() => setSelected(null)}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selected.label}</h2>
              <a
                href={`${SDG_BASE}${selected.sdgNum}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-[#A51C30] bg-red-50 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors inline-flex items-center gap-1"
              >
                {selected.sdg} ↗
              </a>
            </div>
          </div>

          <div className="space-y-5">
            {/* Subtopics */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subtopics</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.subtopics.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">About this Cause</p>
              <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
            </div>

            {/* HBS Pathway */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#A51C30] uppercase tracking-wide mb-2">🎓 HBS Pathway</p>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{detail.hbs_pathway.text}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Relevant Courses</p>
                  <div className="space-y-1.5">
                    {detail.hbs_pathway.courses.map((c) => (
                      <div
                        key={c}
                        className="text-xs bg-white border border-red-100 text-[#A51C30] px-2.5 py-1.5 rounded-lg leading-snug"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Student Clubs</p>
                  <div className="space-y-1.5">
                    {detail.hbs_pathway.clubs.map((c) => (
                      <div
                        key={c}
                        className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg leading-snug"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="https://www.hbs.edu/socialenterprise/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#A51C30] hover:underline"
              >
                HBS Social Enterprise Initiative <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Relevant SDGs */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Relevant SDGs</p>
              <div className="flex flex-wrap gap-2">
                {detail.sdg_links.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                  >
                    {s.label} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Read More */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Read More</p>
              <div className="space-y-1.5">
                {detail.read_more.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 w-28">{r.category}</span>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {r.source}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </LearnMoreModal>
      )}
    </>
  );
}
