import React, { useState } from "react";
import LearnMoreModal from "./LearnMoreModal";

const CAUSES = [
  { label: "Poverty Alleviation", emoji: "🏘️", sdg: "SDG 1", preview: "Addressing root causes of extreme poverty through economic inclusion and safety nets." },
  { label: "Economic Development", emoji: "📈", sdg: "SDG 8", preview: "Building resilient local economies, entrepreneurship, and fair labor markets." },
  { label: "Global Health", emoji: "🩺", sdg: "SDG 3", preview: "Improving access to healthcare and combating disease globally." },
  { label: "Education", emoji: "🎓", sdg: "SDG 4", preview: "Expanding quality learning opportunities for all ages and geographies." },
  { label: "Climate & Energy", emoji: "🌱", sdg: "SDG 13", preview: "Tackling climate change through clean energy and sustainable systems." },
  { label: "Gender & Social Justice", emoji: "⚖️", sdg: "SDG 5", preview: "Advancing equity, rights, and inclusion across gender and identity." },
  { label: "Financial Inclusion", emoji: "💳", sdg: "SDG 10", preview: "Bringing underserved communities into the formal financial system." },
  { label: "Housing & Community", emoji: "🏗️", sdg: "SDG 11", preview: "Creating affordable, safe, and sustainable housing and neighborhoods." },
  { label: "Arts & Culture", emoji: "🎨", sdg: "SDG 11", preview: "Using creative expression to drive social change and community cohesion." },
];

const CAUSE_DETAILS = {
  "Poverty Alleviation": {
    description: "Poverty alleviation addresses the systemic barriers that prevent individuals from meeting their basic needs, including food, shelter, healthcare, and education. Effective interventions combine direct aid with structural reforms to economic and social systems. The field increasingly emphasizes dignity, agency, and community-led approaches over top-down models.",
    hbs_pathway: "HBS MBAs typically engage through impact investing vehicles, consulting for organizations like GiveDirectly or the World Bank, or founding social enterprises that create economic opportunity for low-income populations.",
    sdg_links: ["SDG 1: No Poverty", "SDG 10: Reduced Inequalities"]
  },
  "Economic Development": {
    description: "Economic development focuses on building resilient local economies through job creation, entrepreneurship support, workforce development, and fair trade. It operates at the intersection of public policy, private sector engagement, and community organizing. Increasingly, practitioners emphasize inclusive growth that reaches marginalized communities.",
    hbs_pathway: "HBS graduates often work in economic development through roles at development finance institutions (DFIs) like IFC or OPIC, management consulting for government agencies, or leading workforce development nonprofits and social enterprises.",
    sdg_links: ["SDG 8: Decent Work and Economic Growth", "SDG 9: Industry, Innovation and Infrastructure"]
  },
  "Global Health": {
    description: "Global health addresses disparities in health outcomes across countries and communities by improving access to care, strengthening health systems, and combating infectious and chronic diseases. The field blends clinical medicine, public health, policy, and technology to tackle challenges like HIV/AIDS, malaria, maternal mortality, and pandemic preparedness.",
    hbs_pathway: "HBS MBAs enter global health through operations and strategy roles at organizations like Partners in Health, the Gates Foundation, WHO, or health-focused impact investors. The HBS Health Care Initiative provides strong networking and recruiting pathways.",
    sdg_links: ["SDG 3: Good Health and Well-Being", "SDG 1: No Poverty"]
  },
  "Education": {
    description: "The education sector works to expand access to quality learning from early childhood through higher education, with particular focus on underserved communities globally. Innovations in EdTech, alternative credentialing, and community schooling are reshaping how education is delivered and financed.",
    hbs_pathway: "HBS MBAs pursue education careers at charter management organizations like KIPP and Uncommon Schools, EdTech ventures, education-focused foundations like Gates or Bloomberg Philanthropies, and consulting practices that serve school districts and universities.",
    sdg_links: ["SDG 4: Quality Education", "SDG 10: Reduced Inequalities"]
  },
  "Climate & Energy": {
    description: "Climate and clean energy is one of the fastest-growing areas in social impact, encompassing renewable energy deployment, carbon markets, climate policy, sustainable agriculture, and climate adaptation for vulnerable communities. The sector spans nonprofits, government, impact investing, and mainstream corporate strategy.",
    hbs_pathway: "HBS MBAs are highly sought after in climate tech venture capital, corporate sustainability leadership, climate policy consulting, and clean energy infrastructure finance. Programs like the HBS Social Enterprise Initiative and Energy & Environment Club connect students to this growing field.",
    sdg_links: ["SDG 13: Climate Action", "SDG 7: Affordable and Clean Energy"]
  },
  "Gender & Social Justice": {
    description: "Gender and social justice work advances equity, rights, and inclusion for women, girls, and marginalized groups through direct service, policy advocacy, and systems change. The field encompasses reproductive rights, gender-based violence prevention, pay equity, and LGBTQ+ rights, often operating at the intersection of multiple identities.",
    hbs_pathway: "HBS MBAs in this space tend to work at gender-lens investing funds, women's economic empowerment organizations, foundations focused on racial equity, or social justice advocacy organizations. The Women's Student Association and related clubs offer a strong community.",
    sdg_links: ["SDG 5: Gender Equality", "SDG 10: Reduced Inequalities"]
  },
  "Financial Inclusion": {
    description: "Financial inclusion brings underserved individuals and communities into the formal financial system through microfinance, mobile banking, credit access, and insurance products. With over 1.4 billion adults remaining unbanked globally, the sector addresses a critical barrier to economic mobility and resilience.",
    hbs_pathway: "HBS MBAs pursue financial inclusion through roles at microfinance institutions, fintech startups serving the underserved, impact-first investment funds like Accion Venture Lab, and development banks. The field is increasingly driven by mobile technology and data.",
    sdg_links: ["SDG 10: Reduced Inequalities", "SDG 1: No Poverty"]
  },
  "Housing & Community": {
    description: "Housing and community development addresses the affordable housing crisis, neighborhood revitalization, and equitable urban planning. The sector combines real estate development, community organizing, policy advocacy, and social services to create stable, thriving communities for low-income residents.",
    hbs_pathway: "HBS MBAs engage through community development financial institutions (CDFIs), affordable housing developers, urban planning consultancies, and real estate impact funds. The Real Estate Club often connects students to impact-focused developers.",
    sdg_links: ["SDG 11: Sustainable Cities and Communities", "SDG 1: No Poverty"]
  },
  "Arts & Culture": {
    description: "Arts and culture organizations use creative expression to drive social change, build community cohesion, and preserve cultural heritage. The sector includes performing arts nonprofits, community arts programs, cultural institutions, and social enterprises that use art as a vehicle for healing, advocacy, and economic opportunity.",
    hbs_pathway: "HBS MBAs in arts and culture typically take on leadership and operations roles at major cultural institutions, consult for arts nonprofits on strategy and sustainability, or work at foundations with arts funding portfolios. The field values both business acumen and genuine passion for the arts.",
    sdg_links: ["SDG 11: Sustainable Cities and Communities", "SDG 4: Quality Education"]
  }
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selected.label}</h2>
              <span className="text-xs font-medium text-[#A51C30] bg-red-50 px-2 py-0.5 rounded-full">{selected.sdg}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">About this Cause</p>
              <p className="text-sm text-gray-600">{detail.description}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-[#A51C30] uppercase tracking-wide mb-1">🎓 HBS Pathway</p>
              <p className="text-sm text-gray-700">{detail.hbs_pathway}</p>
            </div>
            {detail.sdg_links?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Relevant SDGs</p>
                <div className="flex flex-wrap gap-2">
                  {detail.sdg_links.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </LearnMoreModal>
      )}
    </>
  );
}
