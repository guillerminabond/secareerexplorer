import React, { useState } from "react";
import LearnMoreModal from "./LearnMoreModal";

const ORG_TYPES = [
  { label: "Nonprofit", emoji: "🤝", preview: "Mission-driven orgs funded by grants and donations." },
  { label: "Social Enterprise", emoji: "⚡", preview: "Revenue-generating businesses with a social mission." },
  { label: "Impact Investing", emoji: "💰", preview: "Financial vehicles deploying capital for measurable impact." },
  { label: "Foundation", emoji: "🏛️", preview: "Philanthropic entities funding social change initiatives." },
  { label: "Government", emoji: "🏛️", preview: "Public sector agencies and development institutions." },
  { label: "Consulting", emoji: "📊", preview: "Advisory firms helping social sector clients solve problems." },
  { label: "Corporate/CSR", emoji: "🏢", preview: "Companies integrating social responsibility into core strategy." },
];

const ECO_ROLES = [
  { label: "Operator", emoji: "🔧", preview: "Directly delivers programs and services on the ground." },
  { label: "Funder", emoji: "💵", preview: "Provides capital or grants to other organizations." },
  { label: "Enabler", emoji: "🛠️", preview: "Builds infrastructure, tools, or capacity for the sector." },
  { label: "Advocacy & Policy", emoji: "📢", preview: "Shapes systems through policy influence and advocacy." },
];

const DETAILS = {
  "Nonprofit": {
    description: "Nonprofits are mission-driven organizations that reinvest all revenue into their programs rather than distributing profits to shareholders. They are funded through grants, donations, government contracts, and earned revenue, and governed by volunteer boards. Nonprofits are central to delivering social services, advocacy, and community development across every issue area.",
    pros: ["Deep mission alignment and values-driven culture", "Diverse programming across virtually every social issue", "Strong network of peer organizations and foundation support"],
    cons: ["Often constrained by restricted funding and tight budgets", "Slower to scale than market-driven organizations", "Compensation typically lower than private sector"],
    examples: ["Teach For America", "Doctors Without Borders", "Habitat for Humanity"]
  },
  "Social Enterprise": {
    description: "Social enterprises are businesses that pursue a social mission through market-based approaches, generating revenue while creating measurable social or environmental impact. They blend commercial rigor with mission focus, often serving underserved markets or employing marginalized populations.",
    pros: ["Financial sustainability through earned revenue", "Ability to scale through market mechanisms", "Growing investor and talent interest in the sector"],
    cons: ["Tension between financial returns and mission depth", "Harder to attract traditional philanthropic funding", "Balancing stakeholder expectations is complex"],
    examples: ["Warby Parker", "TOMS", "Grameen Bank"]
  },
  "Impact Investing": {
    description: "Impact investing deploys financial capital—through equity, debt, or guarantees—into organizations and projects that generate measurable social or environmental benefits alongside financial returns. The field spans venture capital, private equity, fixed income, and public markets, with assets under management growing rapidly.",
    pros: ["Leverage of financial markets to drive systems-level change", "Competitive compensation, especially at senior levels", "Growing mainstream adoption across asset classes"],
    cons: ["Impact measurement remains inconsistent across the field", "Risk of 'impact washing' or mission drift", "Entry-level roles are highly competitive and limited"],
    examples: ["Acumen", "TPG Rise Fund", "Bridges Fund Management"]
  },
  "Foundation": {
    description: "Foundations are philanthropic entities—typically funded by wealthy individuals, families, or corporations—that grant money to nonprofits, social enterprises, and public institutions pursuing social change. They set strategic priorities, fund grantees, and increasingly engage in advocacy, convening, and direct investment.",
    pros: ["Significant resources and convening power to drive change", "Long-term, patient capital not subject to quarterly pressures", "Broad influence across issue areas and geographies"],
    cons: ["Accountability to communities served can be limited", "Grantee relationships can create power imbalances", "Slow-moving decision processes in large foundations"],
    examples: ["Bill & Melinda Gates Foundation", "Ford Foundation", "Bloomberg Philanthropies"]
  },
  "Government": {
    description: "Government and public sector roles in social impact range from federal agencies like USAID and EPA to state and local government departments, multilateral institutions like the UN and World Bank, and legislative offices. Government sets the rules that shape all other actors and deploys massive public resources toward social goals.",
    pros: ["Unparalleled scale and systems-level influence", "Stable employment with strong benefits", "Access to policy levers unavailable to other sectors"],
    cons: ["Bureaucratic structures can slow innovation", "Compensation significantly below private sector", "Political cycles create uncertainty and instability"],
    examples: ["USAID", "World Bank", "NYC Mayor's Office for Economic Opportunity"]
  },
  "Consulting": {
    description: "Social sector consulting firms and strategy advisors help nonprofits, foundations, and government agencies solve complex strategic, operational, and organizational challenges. The field ranges from large generalist firms with dedicated social sector practices to boutique firms exclusively serving mission-driven clients.",
    pros: ["Exposure to diverse organizations and issue areas", "Strong analytical and strategic skill development", "Good entry point into the sector for career changers"],
    cons: ["Impact is indirect—through clients, not programs", "Demanding hours similar to traditional consulting", "Risk of 'consulting treadmill' without deep sector expertise"],
    examples: ["The Bridgespan Group", "FSG", "McKinsey.org"]
  },
  "Corporate/CSR": {
    description: "Corporate social responsibility (CSR) and sustainability teams work within companies to integrate social and environmental responsibility into business strategy, operations, and culture. Increasingly called ESG teams, they manage community investment, employee volunteer programs, supply chain ethics, and stakeholder reporting.",
    pros: ["Access to corporate resources and global scale", "Growing executive-level commitment to ESG", "Competitive compensation relative to other impact roles"],
    cons: ["CSR can be marginalized or underfunded in tough times", "Internal culture may not align with mission values", "Difficult to drive deep change from within large corporations"],
    examples: ["Patagonia", "Salesforce.org", "Google.org"]
  },
  "Operator": {
    description: "Operators directly deliver programs and services to beneficiaries on the ground. They manage staff, run programs, measure outcomes, and adapt interventions based on community needs. Operators are at the frontlines of social change, translating strategy into real impact for real people.",
    pros: ["Direct, visible impact on communities and beneficiaries", "Deep expertise in program design and implementation", "Strong relationships with the communities you serve"],
    cons: ["Resource constraints limit scale and reach", "Operational demands can crowd out strategic thinking", "High staff turnover and burnout in demanding program environments"],
    examples: ["City Year", "International Rescue Committee", "KIPP Foundation"]
  },
  "Funder": {
    description: "Funders provide capital—through grants, loans, or equity—to other organizations working on social change. They set priorities, evaluate grantees, and deploy financial resources strategically across portfolios. Funders have outsized influence on the sector through their capital allocation decisions.",
    pros: ["Broad visibility across the ecosystem and many organizations", "Ability to shape sector strategy and priorities", "Leverage: one funder can enable many operators"],
    cons: ["Removed from direct service delivery and community impact", "Power dynamics with grantees can be challenging to navigate", "Responsible stewardship of others' capital creates high accountability"],
    examples: ["Gates Foundation", "Skoll Foundation", "Omidyar Network"]
  },
  "Enabler": {
    description: "Enablers build the infrastructure, tools, and capacity that allow other social sector organizations to function more effectively. They include management support organizations, technology providers, research institutions, and field-building initiatives that strengthen the ecosystem as a whole.",
    pros: ["Multiplier effect: help one enabler, strengthen many operators", "Diverse client base provides broad sector exposure", "Often at the forefront of innovation and best practices"],
    cons: ["Impact is indirect and harder to measure", "Revenue model can be challenging for nonprofits in this space", "Success dependent on adoption by other organizations"],
    examples: ["Bridgespan Group", "Candid", "TechSoup"]
  },
  "Advocacy & Policy": {
    description: "Advocacy and policy organizations work to shape legislation, regulation, and public opinion to drive systemic change. They engage in direct lobbying, public campaigns, coalition building, litigation, and research to change the rules that govern society. Policy change can unlock impact at massive scale.",
    pros: ["Potential for systems-level change affecting millions", "Intellectually stimulating work at the intersection of politics, research, and strategy", "Growing philanthropic investment in policy and advocacy"],
    cons: ["Long time horizons—policy change is slow and uncertain", "Political environment can reverse hard-won gains", "Difficult to measure and attribute impact"],
    examples: ["ACLU", "Center on Budget and Policy Priorities", "Environmental Defense Fund"]
  }
};

function TypeCard({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="text-2xl mb-2">{item.emoji}</div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{item.preview}</p>
    </button>
  );
}

export default function OrgsTab() {
  const [selected, setSelected] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const detail = selected ? DETAILS[selected.label] : null;

  const openModal = (item, category) => {
    setSelected(item);
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Organization Types</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ORG_TYPES.map((item) => (
              <TypeCard key={item.label} item={item} onClick={(i) => openModal(i, "org_type")} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ecosystem Roles</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ECO_ROLES.map((item) => (
              <TypeCard key={item.label} item={item} onClick={(i) => openModal(i, "eco_role")} />
            ))}
          </div>
        </div>
      </div>

      {selected && detail && (
        <LearnMoreModal onClose={() => setSelected(null)}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{selectedCategory === "org_type" ? "Org Type" : "Ecosystem Role"}</p>
              <h2 className="text-lg font-bold text-gray-900">{selected.label}</h2>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{detail.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">✅ Pros</p>
                <ul className="space-y-1">
                  {detail.pros?.map((p) => <li key={p} className="text-xs text-gray-700 flex gap-1.5"><span className="text-green-400">•</span>{p}</li>)}
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">⚠️ Challenges</p>
                <ul className="space-y-1">
                  {detail.cons?.map((c) => <li key={c} className="text-xs text-gray-700 flex gap-1.5"><span className="text-orange-400">•</span>{c}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Example Organizations</p>
              <div className="flex flex-wrap gap-2">
                {detail.examples?.map((e) => (
                  <span key={e} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </LearnMoreModal>
      )}
    </>
  );
}
