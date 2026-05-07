-- ============================================================
-- Add impact investing firms for underrepresented regions
-- East Asia (4), Levant & Middle East (3), Southern Africa (6),
-- West Africa (2)  — 15 orgs total (Cadiz Asset Management skipped)
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: org inserts skip if name already exists;
-- junction inserts use ON CONFLICT DO NOTHING.
-- ============================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- EAST ASIA
-- ═══════════════════════════════════════════════════════════════

-- ── 1. ADM Capital ───────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'ADM Capital',
  'Hong Kong-based alternative credit manager founded in 1998, managing ~$2B across private credit, distressed debt, and private equity in Asia. Integrates ESG into every investment process through its affiliated ADM Capital Foundation, which focuses on environmental conservation and poverty alleviation. Raised a $500M fund for Southeast Asian renewable energy.',
  'https://www.admcapital.com',
  'Hong Kong, China',
  '1998',
  'Strong fit for students interested in Asian private credit and sustainability-linked lending — demonstrates how alternative credit can integrate ESG in emerging Asian markets.',
  'Chris Botsford (Co-founder), Deny Firth (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'ADM Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'ADM Capital'
  AND ca.name IN ('Climate & Energy', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'ADM Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'ADM Capital' AND r.name IN ('East Asia', 'Southeast Asia')
ON CONFLICT DO NOTHING;

-- ── 2. Coolidge Corner Investment ────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Coolidge Corner Investment',
  'Seoul-based seed and early-stage VC founded in 2010, focused on impact-oriented startups in South Korea. Has invested in 110+ companies across life sciences, edtech, manufacturing, and agriculture — with 4 IPOs. Manages the CCVC Korea Impact Fund.',
  'https://www.coolidgecorner.co.kr',
  'Seoul, South Korea',
  '2010',
  'Strong fit for students interested in early-stage impact investing in East Asia — rare example of a dedicated Korean impact VC.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Coolidge Corner Investment');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Coolidge Corner Investment'
  AND ca.name IN ('Education', 'Global Health', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Coolidge Corner Investment' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Coolidge Corner Investment' AND r.name IN ('East Asia')
ON CONFLICT DO NOTHING;

-- ── 3. The Osiris Group ──────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'The Osiris Group',
  'Hong Kong-based growth equity firm founded in 2012, pioneering impact investing in frontier Asian markets. Invests in rural and semi-urban companies across emerging Asia, combining fiduciary capital management with advisory for DFIs, banks, and governments. Focuses on catalyzing inclusive growth through transformative investments.',
  'https://www.theosirisgroup.com',
  'Hong Kong, China',
  '2012',
  'Strong fit for students interested in frontier-market impact investing in Asia — unusual focus on rural and semi-urban economies where formal capital is scarce.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'The Osiris Group');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'The Osiris Group'
  AND ca.name IN ('Financial Inclusion', 'Poverty Alleviation', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'The Osiris Group' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'The Osiris Group' AND r.name IN ('East Asia', 'South Asia', 'Southeast Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'The Osiris Group' AND tp.name IN ('People in Poverty', 'Smallholder Farmers')
ON CONFLICT DO NOTHING;

-- ── 4. Tsing Capital ─────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Tsing Capital',
  'Beijing-based cleantech VC founded in 2000, one of the world''s first fund managers dedicated to sustainable technology investing. Manages the China Environment Fund series (USD funds) investing in growth-stage companies across clean energy, environmental protection, sustainable agriculture, and advanced manufacturing. Named a case study by Harvard Business School on sustainable investment.',
  'https://www.tsingcapital.com',
  'Beijing, China',
  '2000',
  'HBS case study on sustainable investment. Named one of 10 "Companies That Will Shape the World" in Sustainable Excellence. Pioneer of triple-bottom-line investing in China.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Tsing Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Tsing Capital'
  AND ca.name IN ('Climate & Energy', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Tsing Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Tsing Capital' AND r.name IN ('East Asia', 'Global')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- LEVANT & MIDDLE EAST
-- ═══════════════════════════════════════════════════════════════

-- ── 5. Impact First Investments ──────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Impact First Investments',
  'Israel''s pioneering impact VC fund, founded in 2011, investing exclusively in socially driven Israeli tech startups. Partners with Pitango Venture Capital, Microsoft, and Mayo Clinic. Targets healthcare, edtech, cleantech, and agritech startups positioned at the intersection of global social challenges and Israeli technology innovation.',
  'https://impact1st.com',
  'Herzliya, Israel',
  '2011',
  'Strong fit for students interested in how the Israeli tech ecosystem applies venture capital to global social challenges — rare impact VC model in the Middle East.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Impact First Investments');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Impact First Investments'
  AND ca.name IN ('Global Health', 'Education', 'Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Impact First Investments' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Impact First Investments' AND r.name IN ('Middle East & North Africa', 'Global')
ON CONFLICT DO NOTHING;

-- ── 6. Masdar Capital ────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Masdar Capital',
  'Abu Dhabi-based clean energy venture arm of Masdar (owned by TAQA, ADNOC, and Mubadala), managing ~$540M across two cleantech funds. Invests in the commercialization of renewable energy, energy storage, waste-to-energy, and clean technology globally. Parent company Masdar targets 100GW renewable capacity by 2030 with a $30B investment pipeline.',
  'https://masdar.ae',
  'Abu Dhabi, United Arab Emirates',
  '2006',
  'Strong fit for students interested in sovereign-backed cleantech venture capital — demonstrates how Gulf states are deploying oil wealth into energy transition at massive scale.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '201–500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Masdar Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Masdar Capital'
  AND ca.name IN ('Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Masdar Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Masdar Capital' AND r.name IN ('Middle East & North Africa', 'Global')
ON CONFLICT DO NOTHING;

-- ── 7. Silicon Badia ─────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Silicon Badia',
  'Amman-based global VC firm founded in 2012, investing in early-stage tech companies with a "Local-to-Global" thesis — backing founders from Africa and the Middle East who build globally competitive tech. 106 investments and 50 exits to date. Manages the Badia Impact Fund, anchored by Cisco, the EIB, and King Abdullah Fund for Development.',
  'https://www.siliconbadia.com',
  'Amman, Jordan',
  '2012',
  'Strong fit for students interested in MENA tech venture capital — demonstrates how regional VC can bridge local founders to global markets. Cisco-anchored impact fund model is a teaching case in DFI co-investment.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Silicon Badia');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Silicon Badia'
  AND ca.name IN ('Economic Development', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Silicon Badia' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Silicon Badia' AND r.name IN ('Middle East & North Africa', 'Sub-Saharan Africa', 'Global')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- SOUTHERN AFRICA
-- ═══════════════════════════════════════════════════════════════

-- ── 8. Business Partners International ───────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Business Partners International',
  'South Africa''s leading specialist SME finance firm, established in 1981. Has financed 73,000+ transactions worth over R25B, facilitating 700,000+ jobs. Provides debt, equity, and blended finance from R500K to R50M. International arm (BPI, est. 2004) manages a $40M Southern Africa SME Fund covering Namibia, Zimbabwe, Zambia, and Malawi.',
  'https://www.businesspartners.africa',
  'Johannesburg, South Africa',
  '1981',
  'Strong fit for students interested in SME finance at scale in Africa — 40+ year track record proves the commercial viability of lending to small businesses in developing markets. Won SME Bank of the Year Africa (2019).',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '201–500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Business Partners International');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Business Partners International'
  AND ca.name IN ('Economic Development', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Business Partners International' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Business Partners International' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Business Partners International' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- ── 9. Convergence Partners ──────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Convergence Partners',
  'Johannesburg-based pan-African PE firm founded in 2006, focused exclusively on ICT infrastructure and digital access across sub-Saharan Africa. Manages ~$500M across 3 funds. Invests in broadband, connectivity, and tech services to expand communications access on the continent. Backed by EIB and BIO.',
  'https://www.convergencepartners.com',
  'Johannesburg, South Africa',
  '2006',
  'Strong fit for students interested in tech-enabled development in Africa — demonstrates how PE capital accelerates digital infrastructure in underserved markets.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Convergence Partners');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Convergence Partners'
  AND ca.name IN ('Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Convergence Partners' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Convergence Partners' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa', 'East Africa', 'West Africa')
ON CONFLICT DO NOTHING;

-- ── 10. Edge Growth ──────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Edge Growth',
  'South African VC and fund manager since 2008, focused on SME impact investing. Describes itself as "VC with a twist" — combines venture capital with corporate venturing and developmental capital to deliver financial returns and social impact. Has created 2,500+ jobs. Portfolio spans legal tech, logistics, home services, and agribusiness.',
  'https://edgegrowth.com',
  'Sandton, South Africa',
  '2008',
  'Strong fit for students interested in inclusive VC models in Africa — demonstrates how venture capital can be structured to serve the "missing middle" of SMEs.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Edge Growth');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Edge Growth'
  AND ca.name IN ('Economic Development', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Edge Growth' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Edge Growth' AND r.name IN ('Southern Africa')
ON CONFLICT DO NOTHING;

-- ── 11. Kukula Capital ───────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Kukula Capital',
  'Zambia-headquartered venture finance and PE firm founded in 2009 as a Danish-Zambian joint venture. Manages two funds (Kukula Fund I and Kukula Seed Fund) investing in Zambian growth companies with equity and mezzanine financing. Offices in Lusaka and Solwezi give deep local deal-flow access.',
  'https://kukulacapital.com',
  'Lusaka, Zambia',
  '2009',
  'Strong fit for students interested in local-first impact investing — rare example of a Zambian-domiciled VC firm with strong local networks and international backing.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Kukula Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Kukula Capital'
  AND ca.name IN ('Economic Development', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Kukula Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Kukula Capital' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Kukula Capital' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- ── 12. Phatisa Group ────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Phatisa Group',
  'Pan-African PE fund manager established in 2005, managing $400M+ across three food value chain funds. Invests in agri-inputs, processing, cold chain, food distribution, and affordable housing across 20+ African countries. Portfolio has contributed to 5M+ tonnes of food production, 19,000+ jobs, and 120,000+ supported smallholder farmers.',
  'https://www.phatisa.com',
  'Johannesburg, South Africa',
  '2005',
  'Strong fit for students interested in agricultural value chain investing in Africa — demonstrates how PE capital addresses food security while generating commercial returns at scale.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Phatisa Group');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Phatisa Group'
  AND ca.name IN ('Poverty Alleviation', 'Economic Development', 'Housing & Community')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Phatisa Group' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Phatisa Group' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa', 'East Africa', 'West Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Phatisa Group' AND tp.name IN ('Smallholder Farmers', 'People in Poverty')
ON CONFLICT DO NOTHING;

-- ── 13. Summit Development Group ─────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Summit Development Group',
  'Botswana-registered impact PE firm with offices in Johannesburg and London, focused on African financial services. Invests in banks serving the "missing middle" — SMEs, unbanked consumers, and low-cost mortgage finance. Targets 25%+ IRR while creating 1.4M jobs and reaching 5M previously unbanked customers.',
  'https://www.summitafrica.co.za',
  'Gaborone, Botswana',
  '2010',
  'Strong fit for students interested in financial inclusion through bank-level PE — invests in the institutions themselves rather than individual companies, creating systemic access to capital.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Summit Development Group');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Summit Development Group'
  AND ca.name IN ('Financial Inclusion', 'Economic Development', 'Housing & Community')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Summit Development Group' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Summit Development Group' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Summit Development Group' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- ── 14. Cadiz Asset Management ───────────────────────────────
-- Skipped: primarily a fixed income fund manager, not a core impact investor.
-- Weak fit for the SE Explorer.

-- ═══════════════════════════════════════════════════════════════
-- WEST AFRICA
-- ═══════════════════════════════════════════════════════════════

-- ── 15. Alitheia Capital ─────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Alitheia Capital',
  'Lagos-based impact PE and advisory firm that launched Africa''s first dedicated gender lens investing fund (Alitheia IDF, $100M final close). Invests in growth-stage SMEs led by gender-diverse teams across Nigeria, South Africa, Ghana, Zimbabwe, Lesotho, and Zambia. 70%+ of investments go to female-led businesses, addressing the $42B financing gap between male and female African entrepreneurs.',
  'https://thealitheia.com',
  'Lagos, Nigeria',
  '2007',
  'Strong fit for students interested in gender lens investing in Africa — first-of-its-kind fund proves that backing women-led businesses delivers market-rate returns. Rich teaching case on how PE can address structural inequality.',
  'Tokunboh Ishmael (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Alitheia Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Alitheia Capital'
  AND ca.name IN ('Gender & Social Justice', 'Economic Development', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Alitheia Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Alitheia Capital' AND r.name IN ('West Africa', 'Southern Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Alitheia Capital' AND tp.name IN ('Women & Girls')
ON CONFLICT DO NOTHING;

-- ── 16. Jacana Partners ──────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Jacana Partners',
  'Pan-African SME PE firm established in 2008, investing $1–5M per deal across Ghana, Kenya, Liberia, Sierra Leone, Tanzania, and Uganda. Merged with East Africa''s InReturn Capital to create pan-African coverage, raising a $75M SME fund. Has invested $20M in 20 portfolio companies, creating 1,300+ jobs. Combines international PE expertise with dedicated local investment teams.',
  'https://www.jacanapartners.com',
  'Accra, Ghana',
  '2008',
  'Strong fit for students interested in SME-focused PE in frontier Africa — the international-plus-local team model is a compelling operating approach for markets where on-the-ground presence is essential.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Jacana Partners');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Jacana Partners'
  AND ca.name IN ('Economic Development', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Jacana Partners' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Jacana Partners' AND r.name IN ('West Africa', 'East Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Jacana Partners' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

COMMIT;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT name, hq, year_established, hbs_note
FROM organizations
WHERE name IN (
  'ADM Capital', 'Coolidge Corner Investment', 'The Osiris Group', 'Tsing Capital',
  'Impact First Investments', 'Masdar Capital', 'Silicon Badia',
  'Business Partners International', 'Convergence Partners', 'Edge Growth',
  'Kukula Capital', 'Phatisa Group', 'Summit Development Group',
  'Alitheia Capital', 'Jacana Partners'
);
