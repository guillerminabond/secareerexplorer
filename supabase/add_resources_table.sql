-- ============================================================
-- Resources table — single source of truth for all resources
-- Replaces site_content keys: general_resources, hbs_resources
-- ============================================================

CREATE TABLE IF NOT EXISTS resources (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL CHECK (section IN ('general', 'hbs')),
  title       TEXT NOT NULL,
  subtitle    TEXT DEFAULT '',
  emoji       TEXT DEFAULT '',
  url         TEXT NOT NULL,
  cta         TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tips        TEXT[] DEFAULT '{}',
  tags        TEXT[] DEFAULT '{}',
  featured    BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0,
  date_added  DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read, authenticated write
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read resources"
  ON resources FOR SELECT USING (true);

CREATE POLICY "Auth insert resources"
  ON resources FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update resources"
  ON resources FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete resources"
  ON resources FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed: General resources
-- ============================================================

INSERT INTO resources (section, emoji, title, subtitle, description, tips, url, cta, tags, featured, sort_order, date_added) VALUES
('general', '🌐', 'Devex', 'Job Board & News',
 'The media platform for the global development community. Thousands of roles across NGOs, multilaterals, foundations, and government agencies.',
 ARRAY['Filter by sector (health, climate, education)', 'Set job alerts for target organizations', 'Follow editorial coverage for sector intel'],
 'https://www.devex.com', 'Visit Devex',
 ARRAY['Nonprofit', 'Foundation', 'Global'], false, 1, '2026-03-04'),

('general', '🔍', 'Candid', 'Funding & Org Research',
 'World''s largest source on social sector organizations and funders — ideal for researching nonprofits'' financials before applying.',
 ARRAY['Look up 990s to understand org financials', 'Research a foundation''s grant history', 'Find contact info for program officers'],
 'https://candid.org', 'Visit Candid',
 ARRAY['Nonprofit', 'Foundation', 'Research', 'Global'], false, 2, '2026-03-04'),

('general', '🚀', 'Escape the City', 'Career Transition Platform',
 'A global community helping professionals transition from corporate careers into purpose-driven roles.',
 ARRAY['Browse purpose jobs by sector and region', 'Join the community for peer support', 'Use career resources for pivot planning'],
 'https://www.escapethecity.org', 'Visit Escape the City',
 ARRAY['Social Enterprise', 'Global', 'Europe'], false, 3, '2026-03-04'),

('general', '📬', 'Ali Rohde — Jobs for Startups', 'Newsletter & Community',
 'Curated Substack newsletter from Ali Rohde covering job opportunities at startups and in the social enterprise and impact investing space.',
 ARRAY['Subscribe for weekly curated opportunities', 'Filter for impact-focused startup roles', 'Share with your SE study group'],
 'https://alirohde.substack.com', 'Visit Ali Rohde — Jobs for Startups',
 ARRAY['Startup', 'Impact Investing', 'Social Enterprise', 'North America'], false, 4, '2026-03-04'),

('general', '✅', 'B Corp Directory', 'B Corporation Database',
 'Searchable directory of all certified B Corporations worldwide — businesses meeting high standards of social and environmental performance.',
 ARRAY['Filter by industry, location, and impact area', 'Research B Corps before applying', 'Identify mission-aligned employers beyond traditional nonprofits'],
 'https://www.bcorporation.net/en-us/find-a-b-corp/', 'Visit B Corp Directory',
 ARRAY['B Corp', 'Social Enterprise', 'Global'], false, 5, '2026-03-04'),

('general', '💼', 'Fast Forward Job Board', 'Tech Nonprofit Jobs',
 'Job board from Fast Forward, the accelerator for tech nonprofits. Roles at high-growth organizations using technology to drive social change.',
 ARRAY['Filter by role type and cause area', 'Find engineering, product, and ops roles at nonprofits', 'Great for candidates at the tech-impact intersection'],
 'https://jobs.ffwd.org/jobs', 'Visit Fast Forward Job Board',
 ARRAY['Nonprofit', 'Startup', 'North America'], false, 6, '2026-03-04'),

('general', '🌿', 'Climate Base', 'Climate & Sustainability Careers',
 'The go-to job board for climate careers — roles in cleantech, renewable energy, sustainable finance, carbon removal, and climate policy. Filter by role type and climate solution area.',
 ARRAY['Filter by climate solution category for targeted results', 'Follow the newsletter for curated climate jobs weekly', 'Explore the company directory for climate-focused employers', 'Check the blog for climate career transition advice and salary benchmarks'],
 'https://climatebase.org', 'Browse Climate Jobs',
 ARRAY['Social Enterprise', 'Startup', 'Global', 'North America', 'Job Board'], false, 7, '2026-03-04'),

('general', '🌎', 'Net Impact Job Board', 'Social Impact Career Platform',
 'Net Impact''s job board features thousands of roles in CSR, sustainability, nonprofit management, and social enterprise — curated for MBAs and graduate students pursuing careers at the intersection of business and social impact.',
 ARRAY['Create a profile and set job alerts by sector and location', 'Filter by ''MBA preferred'' to find roles targeting your background', 'Join Net Impact''s local chapter for networking and events', 'Use the salary transparency filter to benchmark compensation in the impact space'],
 'https://netimpact.org/careers', 'Browse Jobs',
 ARRAY['Social Enterprise', 'Nonprofit', 'B Corp', 'Global', 'North America', 'Job Board'], false, 8, '2026-03-04'),

('general', '🏛️', 'Idealist', 'Nonprofit & Social Impact Jobs',
 'One of the largest nonprofit job boards worldwide — over 100,000 listings across nonprofits, social enterprises, government, and grassroots organizations. Strong coverage in the US and Latin America.',
 ARRAY['Filter by cause area, salary, and remote-friendly roles', 'Set weekly alerts for target geographies and sectors', 'Browse internship and volunteer listings for early-stage career building', 'Use the Grad School section to find aligned programs and fellowships'],
 'https://www.idealist.org/en', 'Browse Jobs',
 ARRAY['Nonprofit', 'Social Enterprise', 'Global', 'North America', 'Latin America & Caribbean', 'Job Board'], false, 9, '2026-03-04'),

('general', '🔗', 'Work for Good', 'UK Charity & Nonprofit Jobs',
 'Leading UK-focused charity and nonprofit job board. Lists thousands of roles across nonprofits, social enterprises, and the public sector — with strong coverage of the UK, Ireland, and international development orgs headquartered in London.',
 ARRAY['Filter by charity type, salary band, and location', 'Browse CEO and senior leadership roles for post-MBA targeting', 'Strong coverage of international development orgs based in London', 'Set alerts for target organizations or sectors'],
 'https://www.workforgood.co.uk', 'Browse Jobs',
 ARRAY['Nonprofit', 'Social Enterprise', 'Europe', 'Job Board'], false, 10, '2026-03-04'),

('general', '🌱', 'Social Enterprise UK — Job Board', 'UK Social Enterprise Careers',
 'Job board run by the UK''s national body for social enterprise. Roles span community interest companies, cooperatives, and mission-driven businesses. Especially useful for anyone targeting the UK social enterprise ecosystem.',
 ARRAY['Filter by role type and region within the UK', 'Browse member directory for mission-driven employers', 'Check the events calendar for networking and sector conferences', 'Use SEUK''s resources to understand the UK social enterprise landscape before interviews'],
 'https://www.socialenterprise.org.uk/jobs/', 'Browse Jobs',
 ARRAY['Social Enterprise', 'Europe', 'Job Board'], false, 11, '2026-03-04'),

('general', '⚡', 'Tech Jobs for Good', 'Tech Roles at Impact Orgs',
 'Aggregator for tech and digital roles at mission-driven organizations — nonprofits, B Corps, social enterprises, and government. Covers software engineering, data science, product, and design roles at organizations tackling social and environmental problems.',
 ARRAY['Filter by tech skill (Python, data, UX) and cause area', 'Strong for product, engineering, and data science roles at nonprofits', 'Use the company directory to find tech-forward impact employers', 'Subscribe to the weekly digest for curated tech-impact roles'],
 'https://techjobsforgood.com', 'Browse Jobs',
 ARRAY['Nonprofit', 'Social Enterprise', 'Startup', 'B Corp', 'North America', 'Job Board'], false, 12, '2026-03-04'),

('general', '🇮🇳', 'iVolunteer', 'India Social Impact Jobs & Volunteering',
 'India''s leading platform for social impact jobs, fellowships, and volunteer opportunities. Covers NGOs, CSR programs, social enterprises, and government-linked development roles — with special coverage of the Indian social sector.',
 ARRAY['Filter by city, sector, and engagement type (job, fellowship, volunteer)', 'Browse fellowship listings for structured India-based impact programs', 'Set alerts for specific Indian cities or states', 'Strong for roles at grassroots NGOs and India-focused foundations'],
 'https://www.ivolunteer.in', 'Browse Opportunities',
 ARRAY['Nonprofit', 'Social Enterprise', 'Asia', 'Job Board'], false, 13, '2026-03-04'),

('general', '🌍', 'Impactpool', 'UN and international development careers',
 'Career platform specializing in United Nations, multilateral, and international development roles. Features jobs at UNDP, UNHCR, UNFCCC, AfDB, and other major international bodies.',
 ARRAY['Search by organization (UN agencies, World Bank, regional development banks)', 'Explore the Fellowship program for structured career prep', 'Check the weekly newsletter for curated international roles', 'Strong coverage of Africa, Europe, and Asia — ideal for global development careers'],
 'https://www.impactpool.org/search', 'Search International Jobs',
 ARRAY['Nonprofit', 'Foundation', 'Global', 'Africa', 'Europe', 'Asia', 'Job Board', 'Mentorship'], false, 14, '2026-03-04'),

('general', '✨', 'The Impact Job', 'Handpicked social impact jobs with salary transparency',
 'Community-driven platform that handpicks social impact jobs — every listing is vetted and includes salary information for transparency. Joined by 40,000+ social impact professionals via their weekly newsletter.',
 ARRAY['Subscribe to the weekly newsletter for curated handpicked jobs, tips, and social impact news', 'Every listing shows salary — use it to benchmark compensation', 'Filter by full-time, part-time, and contract roles'],
 'https://www.theimpactjob.com', 'Browse Jobs',
 ARRAY['Nonprofit', 'Social Enterprise', 'Global', 'North America', 'Europe', 'Job Board'], false, 15, '2026-03-04'),

('general', '🚀', 'Wellfound', '130K+ startup jobs with equity info',
 'Formerly AngelList Talent, Wellfound is the largest startup job platform with 130,000+ remote and local listings. Includes salary ranges and equity information for every role — essential for finding roles at impact-driven startups, social enterprises, and B Corps.',
 ARRAY['Filter by job function and location to narrow results', 'Look for YC-funded and B Corp-tagged startups for impact alignment', 'Every listing shows salary AND equity — useful for comparing startup offers', 'Use ''Growing fast'' tags to spot high-momentum social ventures'],
 'https://wellfound.com/jobs', 'Search Startup Jobs',
 ARRAY['Startup', 'B Corp', 'Social Enterprise', 'Global', 'North America', 'Job Board'], false, 16, '2026-03-04'),

('general', '📋', 'ProPublica Nonprofit Explorer', 'Free IRS 990 database for nonprofits',
 'Free searchable database of IRS Form 990 filings for 1.8 million nonprofit organizations. Pull audited financials, executive compensation, board composition, and program expenses — essential due diligence before applying or partnering.',
 ARRAY['Search an org before an interview to understand their financials and leadership', 'Compare executive compensation across similar organizations', 'Check program expense ratios to assess operational efficiency', 'Download full 990 PDFs for granular program and grantee data'],
 'https://projects.propublica.org/nonprofits/', 'Search Nonprofits',
 ARRAY['Nonprofit', 'Foundation', 'Thought Leadership', 'North America'], false, 17, '2026-03-10'),

('general', '🌟', 'Audacious Project', 'TED''s collaborative philanthropic initiative',
 'TED''s Audacious Project funds bold ideas for social change at scale. The grantees directory showcases organizations receiving transformational philanthropy — useful for identifying top-tier nonprofits and tracking what major funders are backing globally.',
 ARRAY['Browse grantees to discover organizations tackling systemic issues at scale', 'Use as a signal for which orgs are attracting major philanthropic capital', 'Many grantees post jobs — search their career pages directly', 'Follow announcements to track emerging impact areas gaining funder attention'],
 'https://audaciousproject.org/grantees', 'Browse Grantees',
 ARRAY['Nonprofit', 'Foundation', 'Social Enterprise', 'Funding', 'Thought Leadership', 'Global'], false, 18, '2026-03-10'),

('general', '🏆', 'Skoll Awardees', 'Skoll Foundation''s social entrepreneurship award directory',
 'The Skoll Foundation''s award program recognizes the world''s leading social entrepreneurs driving large-scale, positive change. The awardee directory is a who''s-who of proven social enterprises — useful for researching top organizations, career targets, and how the field''s most impactful leaders define success.',
 ARRAY['Browse by year and sector to discover high-credibility organizations', 'Use awardee orgs as career targets — the Skoll award signals organizational excellence', 'Review awardee profiles for frameworks on how social entrepreneurs measure impact', 'Cross-reference with Audacious Project and Candid for a fuller picture of top-tier orgs'],
 'https://skoll.org/community/awardees/', 'Browse Awardees',
 ARRAY['Social Enterprise', 'Nonprofit', 'Foundation', 'Funding', 'Thought Leadership', 'Global'], false, 19, '2026-03-10'),

('general', '🌍', 'Mulago Foundation Portfolio', 'Evidence-based grantees working at massive scale',
 'Mulago Foundation funds organizations with the potential for massive impact on people living in extreme poverty. Their portfolio is a curated list of high-signal nonprofits and social enterprises — weighted toward global health, agriculture, and economic empowerment in sub-Saharan Africa — selected for evidence of effectiveness and scale potential.',
 ARRAY['Browse the portfolio as a career target list for high-credibility global impact orgs', 'Mulago''s selection criteria emphasize evidence and scale — useful framing for interviews', 'Many portfolio orgs are mid-size and actively hiring senior talent', 'Cross-reference with Skoll Awardees and Audacious Project for overlapping top-tier orgs'],
 'https://www.mulagofoundation.org/portfolio', 'Browse Portfolio',
 ARRAY['Nonprofit', 'Social Enterprise', 'Foundation', 'Funding', 'Thought Leadership', 'Africa', 'Global'], false, 20, '2026-03-23'),

('general', '💡', 'DRK Foundation Portfolio', 'Venture philanthropy for early-stage nonprofits',
 'Draper Richards Kaplan Foundation provides 3-year early-stage grants plus active management support to high-potential nonprofits — modeled on venture capital. Their portfolio surfaces organizations that are pre-scale but backed by rigorous due diligence, making it a useful list for spotting rising orgs before they become widely known.',
 ARRAY['Use the portfolio to find high-potential early-stage orgs not yet on mainstream radar', 'DRK''s VC-style model means portfolio orgs often have strong operational support behind them', 'Great hunting ground for students interested in joining a nonprofit at a formative stage', 'Cross-reference portfolio orgs on Candid and ProPublica for financials and leadership data'],
 'https://www.drkfoundation.org/portfolio/', 'Browse Portfolio',
 ARRAY['Nonprofit', 'Social Enterprise', 'Foundation', 'Funding', 'Thought Leadership', 'North America', 'Global'], false, 21, '2026-03-23');

-- ============================================================
-- Seed: HBS resources
-- ============================================================

INSERT INTO resources (section, title, url, description, tags, featured, sort_order) VALUES
('hbs', 'Social Enterprise Initiative', 'https://www.hbs.edu/socialenterprise/', 'HBS''s hub for SE education, research, and community.', ARRAY['Thought Leadership'], false, 1),
('hbs', 'Rock Center for Entrepreneurship', 'https://www.hbs.edu/entrepreneurship/', 'Supports entrepreneurs including social enterprise founders.', ARRAY[]::TEXT[], false, 2),
('hbs', 'SECON — Social Enterprise Conference', 'https://socialenterpriseconference.net/', 'Annual student-run conference at the intersection of business and social impact.', ARRAY[]::TEXT[], false, 3),
('hbs', 'Social Enterprise Club', 'https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/social-enterprise-club', 'HBS student club for social enterprise — events, treks, and recruiting.', ARRAY['Job Board'], false, 4),
('hbs', 'Impact Investing Club', 'https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/impact-investing-club', 'HBS student club focused on impact investing careers and deal exposure.', ARRAY['Impact Investing'], false, 5),
('hbs', 'Education Club', 'https://www.hbs.edu/mba/student-life/activities-government-and-clubs/student-clubs/education-club', 'HBS student club for MBAs pursuing careers in education.', ARRAY[]::TEXT[], false, 6),
('hbs', 'CPD Career Resources', 'https://my.hbs.edu/cpd', 'HBS Career & Professional Development tools and employer database.', ARRAY['Job Board'], false, 7),
('hbs', 'HBS Summer Fellows Program', 'https://www.hbs.edu/socialenterprise/mba-experience/careers/summer-fellowships', 'Funding for MBAs pursuing summer internships in the nonprofit and public sectors.', ARRAY['Mentorship', 'Funding', 'Nonprofit'], false, 8),
('hbs', 'Leadership Fellows Program', 'https://www.hbs.edu/socialenterprise/for-organizations/leadership-fellows/past-partners-fellows', 'Post-MBA fellowship placing HBS graduates in senior leadership roles at nonprofits.', ARRAY['Mentorship', 'Nonprofit'], false, 9),
('hbs', 'HBS Alumni Directory', 'https://www.alumni.hbs.edu/community/Pages/directory.aspx', 'Search and connect with HBS alumni by industry, role, and location.', ARRAY['Mentorship'], false, 10),
('hbs', '12twenty Networking', 'https://mba-business-harvard.12twenty.com/mentorships/home', 'HBS platform to find and request mentorship from alumni across sectors.', ARRAY['Mentorship'], false, 11),
('hbs', 'SE Faculty & Research', 'https://www.hbs.edu/socialenterprise/faculty-research', 'HBS Social Enterprise Initiative faculty profiles and latest research.', ARRAY['Thought Leadership'], false, 12),
('hbs', 'AI-Powered Opportunities & Connections Platform (OCP)', 'https://cpd.dtxchat.org/', 'CPD''s 2025 AI-powered job search tool. Run a conversational search to find roles and surface HBS alumni at hiring companies — sorted by relevance, recency, alumni presence, or salary. Log in with HBS credentials.', ARRAY['Job Board', 'Mentorship'], false, 13),
('hbs', 'CPD Climate & Sustainability Resources', 'https://cpd.dtxchat.org/', 'CPD''s hub for climate, cleantech, energy, and sustainability careers — specialized coaching, curated job listings, alumni speed-networking events, and Baker Library research access. Co-built with the HBS Business & Environment Initiative.', ARRAY['Job Board', 'Thought Leadership'], false, 14),
('hbs', 'CPD Career Coach Directory', 'https://inside.hbs.edu/Departments/mba/cpd/directory.aspx?LocalFacet2=Social%20Enterprise', 'Find CPD career coaches who specialize in social enterprise — filter by sector focus and book appointments.', ARRAY['Mentorship'], false, 15),
('hbs', '12twenty', 'https://mba-business-harvard.12twenty.com/', 'HBS''s career platform with employment data, recruiting timelines, job sources, job postings, employer events, and more — a go-to hub for SE career planning.', ARRAY['Job Board'], false, 16);
