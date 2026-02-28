import React, { useState } from "react";
import LearnMoreModal from "./LearnMoreModal";

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
    salary_range: "$80K–$120K",
    progression: ["Program Associate", "Program Manager", "Program Director", "VP of Programs"],
    key_skills: ["Program design & evaluation", "Team leadership & management", "Stakeholder engagement", "Budget & grant management"],
    personality_fit: ["Mission-driven and values-led", "Collaborative and community-oriented", "Adaptable and resilient"],
    hbs_note: "HBS MBAs often enter at the Program Director or VP level, leveraging their management training. The Leadership Fellows Program places HBS grads in senior nonprofit roles directly post-MBA."
  },
  "Impact Investment Associate": {
    salary_range: "$100K–$160K",
    progression: ["Analyst", "Associate", "Senior Associate / VP", "Partner / Managing Director"],
    key_skills: ["Financial modeling & due diligence", "Impact measurement (IRIS+, GIIRS)", "Portfolio management", "Deal sourcing & relationship management"],
    personality_fit: ["Analytically rigorous and financially savvy", "Genuinely mission-motivated", "Entrepreneurial and self-directed"],
    hbs_note: "The HBS Impact Investing Club is a strong recruiting pipeline. Firms like Acumen, TPG Rise, and Omidyar Network actively recruit HBS MBAs. Summer fellowships often convert to full-time roles."
  },
  "Strategy Consultant (Social Sector)": {
    salary_range: "$90K–$140K",
    progression: ["Consultant", "Senior Consultant", "Principal / Manager", "Partner"],
    key_skills: ["Qualitative & quantitative analysis", "Strategic planning", "Facilitation & stakeholder alignment", "Written and verbal communication"],
    personality_fit: ["Intellectually curious problem-solver", "Comfortable with ambiguity", "Strong communicator and collaborator"],
    hbs_note: "Bridgespan Group and FSG actively recruit at HBS. McKinsey.org and BCG's Social Impact practice also offer pathways. Social sector consulting can be a strong bridge role into nonprofit leadership."
  },
  "Grants Officer": {
    salary_range: "$70K–$110K",
    progression: ["Grants Assistant", "Program Officer", "Senior Program Officer", "Director of Grantmaking"],
    key_skills: ["Proposal review & due diligence", "Relationship management with grantees", "Strategic grantmaking", "Field expertise in a cause area"],
    personality_fit: ["Deeply curious and eager to learn from grantees", "Collaborative and relationship-focused", "Comfortable with uncertainty and long timeframes"],
    hbs_note: "Foundations like Gates, Ford, and Hewlett recruit HBS MBAs for program officer roles, especially when they bring deep content expertise. Compensation is competitive for the sector."
  },
  "Social Entrepreneur": {
    salary_range: "$60K–$150K+ (highly variable)",
    progression: ["Founder / CEO", "Series A growth stage", "Scale & systems building", "Exit / succession planning"],
    key_skills: ["Vision and fundraising", "Product / program design", "Team building & culture", "Impact measurement & storytelling"],
    personality_fit: ["High risk tolerance and resilience", "Intrinsically motivated and mission-obsessed", "Creative and resourceful under constraints"],
    hbs_note: "The Rock Center for Entrepreneurship and HBS Social Enterprise Initiative provide strong support for aspiring founders. HBS alumni have founded Teach For America, City Year, and many other leading social ventures."
  },
  "Policy Advisor": {
    salary_range: "$70K–$130K",
    progression: ["Policy Analyst", "Policy Advisor", "Senior Policy Director", "Chief of Staff / Deputy Secretary"],
    key_skills: ["Policy research & analysis", "Legislative and regulatory process knowledge", "Coalition building", "Political communication"],
    personality_fit: ["Patient and long-term oriented", "Comfortable with political complexity", "Skilled at building across ideological lines"],
    hbs_note: "HBS MBAs enter policy through the White House Fellows Program, think tanks like Brookings and Urban Institute, and senior government appointments. The Harvard Kennedy School connection creates strong cross-school pathways."
  },
  "Corporate Sustainability Lead": {
    salary_range: "$100K–$170K",
    progression: ["Sustainability Analyst", "Sustainability Manager", "Director of ESG", "Chief Sustainability Officer"],
    key_skills: ["ESG reporting frameworks (GRI, SASB, TCFD)", "Supply chain sustainability", "Stakeholder engagement", "Business strategy integration"],
    personality_fit: ["Systems thinker comfortable with complexity", "Skilled at navigating corporate culture", "Passionate about market-driven change"],
    hbs_note: "Corporate sustainability roles are increasingly visible at HBS recruiting events. Consumer goods, financial services, and technology companies all recruit for ESG leadership. The field is professionalizing rapidly with new standards and reporting requirements."
  },
  "Development Director": {
    salary_range: "$80K–$130K",
    progression: ["Development Associate", "Major Gifts Officer", "Director of Development", "VP / Chief Development Officer"],
    key_skills: ["Major donor cultivation & stewardship", "Grant writing & foundation relations", "Database management (Salesforce, Raiser's Edge)", "Organizational storytelling"],
    personality_fit: ["Relationship-driven and empathetic", "Persistent and goal-oriented", "Genuine passion for the organization's mission"],
    hbs_note: "Development Directors are in high demand across the nonprofit sector. HBS MBAs bring strategic thinking and business acumen that distinguishes them in this role. Strong fundraisers can command competitive compensation packages at major organizations."
  }
};

export default function CareerPathsTab() {
  const [selected, setSelected] = useState(null);

  const detail = selected ? CAREER_DETAILS[selected.label] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAREER_PATHS.map((p) => (
          <button
            key={p.label}
            onClick={() => setSelected(p)}
            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="text-2xl mb-2">{p.emoji}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.label}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{p.preview}</p>
          </button>
        ))}
      </div>

      {selected && detail && (
        <LearnMoreModal onClose={() => setSelected(null)}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selected.emoji}</span>
            <h2 className="text-lg font-bold text-gray-900">{selected.label}</h2>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold uppercase tracking-wide">Salary Range</span>
              <span className="text-sm font-bold">{detail.salary_range}</span>
            </div>

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

            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-[#A51C30] uppercase tracking-wide mb-1">🎓 HBS Recruiting Note</p>
              <p className="text-sm text-gray-700">{detail.hbs_note}</p>
            </div>
          </div>
        </LearnMoreModal>
      )}
    </>
  );
}
