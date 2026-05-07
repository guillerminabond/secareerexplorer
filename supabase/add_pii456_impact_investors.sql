-- ============================================================
-- Add: 35 High-Value Impact Investors from PII 456 SEI Tool
-- Curated from 456-org database, prioritized by HBS relevance,
-- geographic diversity, and brand recognition.
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: org inserts skip if name already exists;
-- junction inserts use ON CONFLICT DO NOTHING.
-- ============================================================

BEGIN;

-- -- 1. Generation Investment Management ----------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Generation Investment Management',
  'Founded by former US Vice President Al Gore and David Blood, Generation is a $15B+ sustainable investment firm integrating ESG factors into long-term equity and growth equity strategies. It manages public equity, private equity, and land restoration funds from offices in London and San Francisco. Named one of the most influential sustainability-focused asset managers globally.',
  'https://www.generationim.com/',
  'London, United Kingdom',
  '2004',
  'Co-founded by David Blood, former CEO of Goldman Sachs Asset Management. A landmark case in sustainable finance  -  demonstrates how mainstream capital markets can integrate sustainability without sacrificing returns. Strong fit for students interested in sustainable investing at institutional scale.',
  'Al Gore (Co-founder, Chairman), David Blood (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Generation Investment Management');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Generation Investment Management'
  AND ca.name IN ('Climate & Energy', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Generation Investment Management' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Generation Investment Management' AND r.name IN ('Global', 'Europe', 'North America')
ON CONFLICT DO NOTHING;

-- -- 2. Acumen ------------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Acumen',
  'Global nonprofit that uses patient capital  -  long-term debt and equity  -  to invest in companies serving low-income communities across Africa, South Asia, Latin America, and the US. Founded in 2001 by Jacqueline Novogratz, Acumen has impacted over 700 million people and trained 1,800+ social enterprise builders through Acumen Academy. A defining institution in the impact investing field.',
  'https://acumen.org/',
  'New York, United States',
  '2001',
  'Jacqueline Novogratz serves on the HBS Social Enterprise Initiative. Acumen is one of the most-studied impact investing models in MBA curricula  -  the tension between patient capital and market-rate returns is a core SE teaching case. Top destination for HBS students pursuing careers in impact.',
  'Jacqueline Novogratz (Founder & CEO)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Acumen');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Acumen'
  AND ca.name IN ('Poverty Alleviation', 'Global Health', 'Education', 'Climate & Energy', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Acumen' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Acumen' AND r.name IN ('Global', 'Sub-Saharan Africa', 'South Asia', 'Latin America', 'US National')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Acumen' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- -- 3. FMO  -  Dutch Development Bank -------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'FMO',
  'The Dutch entrepreneurial development bank, founded in 1970 and 51% owned by the Dutch government. With EUR11.1B in total assets and a AAA credit rating, FMO invests risk capital in private-sector projects across 85+ developing countries. Focuses on energy, financial institutions, and agribusiness. Contributed to 750,000 jobs in 2022 alone through its portfolio companies.',
  'https://www.fmo.nl/',
  'The Hague, Netherlands',
  '1970',
  'One of the world''s largest bilateral DFIs  -  a model for how government-backed institutions can mobilize private capital for development. Strong fit for students interested in development finance, blended finance structures, or the intersection of public policy and private markets.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Government / Public Sector'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'FMO');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'FMO'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'FMO' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'FMO' AND r.name IN ('Global', 'Sub-Saharan Africa', 'South Asia', 'Southeast Asia', 'Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'FMO' AND tp.name IN ('People in Poverty', 'Smallholder Farmers')
ON CONFLICT DO NOTHING;

-- -- 4. LeapFrog Investments ---------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'LeapFrog Investments',
  'Impact private equity firm managing $2.8B+, investing in high-growth financial services, healthcare, and climate solution companies across Asia and Africa. Founded in South Africa in 2007 and launched alongside President Bill Clinton. Ranked by Fortune as a top-5 "Company to Change the World." First impact investor to release independent audit results against the Operating Principles for Impact Management.',
  'https://leapfroginvest.com/',
  'Sydney, Australia',
  '2007',
  'One of the most prominent "profit with purpose" PE firms  -  demonstrates that impact and returns can be mutually reinforcing at scale. Backed by Temasek, JP Morgan, and Omidyar Network. Strong fit for students interested in impact PE in emerging markets.',
  'Andrew Kuper (Founder & CEO, Rhodes Scholar)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'LeapFrog Investments');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'LeapFrog Investments'
  AND ca.name IN ('Financial Inclusion', 'Global Health', 'Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'LeapFrog Investments' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'LeapFrog Investments' AND r.name IN ('Sub-Saharan Africa', 'South Asia', 'Southeast Asia', 'East Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'LeapFrog Investments' AND tp.name IN ('People in Poverty', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 5. Accion ------------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Accion',
  'Global nonprofit and pioneer of microfinance, founded in 1961. Accion has reached 478 million underserved people, helped build 285 financial service providers across 77 countries, and issued its first microloan in 1973. Through Accion Venture Lab, it invests seed-stage capital in fintech startups that serve underserved populations. Headquartered in Cambridge, MA with offices in Bogota, Mumbai, and Beijing.',
  'https://www.accion.org/',
  'Cambridge, United States',
  '1961',
  'A foundational institution in the financial inclusion space  -  one of the original microfinance innovators. Located in Cambridge near HBS. Strong fit for students interested in fintech for inclusion, venture philanthropy, or the evolution from microfinance to digital finance.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '201-500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Accion');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Accion'
  AND ca.name IN ('Financial Inclusion', 'Poverty Alleviation', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Accion' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Accion' AND r.name IN ('Global', 'Latin America', 'South Asia', 'East Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Accion' AND tp.name IN ('People in Poverty', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 6. Bain Capital Double Impact ---------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Bain Capital Double Impact',
  'Impact investing arm of Bain Capital, deploying $390M+ in mission-driven companies delivering competitive financial returns alongside measurable social and environmental impact. Invests across three themes: Health & Wellness, Education & Workforce Development, and Climate & Sustainability. Uses Bain Capital''s deep operational expertise to build great companies.',
  'https://www.baincapitaldoubleimpact.com/',
  'Boston, United States',
  '2017',
  'Greg Shell (MBA 2001) is Managing Director and serves on the HBS Impact Investment Fund Investment Committee. Direct Bain Capital connection to HBS. One of the clearest examples of how top-tier PE firms are building dedicated impact strategies  -  a key career path for HBS students.',
  'Greg Shell (MBA 2001, Managing Director)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Bain Capital Double Impact');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Bain Capital Double Impact'
  AND ca.name IN ('Global Health', 'Education', 'Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Bain Capital Double Impact' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Bain Capital Double Impact' AND r.name IN ('US National', 'North America')
ON CONFLICT DO NOTHING;

-- -- 7. Aavishkaar Capital -----------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Aavishkaar Capital',
  'India''s pioneering impact venture capital firm, founded in 2001 by Vineet Rai with just INR5,000 in savings. The Aavishkaar Group now manages $1.2B+ across 8,000 employees, investing in 70+ companies serving excluded communities in India, Indonesia, Bangladesh, and Kenya. Has impacted 110 million people (55% women) and created 300,000+ jobs and livelihoods. Focuses on agriculture, healthcare, financial services, and technology for rural populations.',
  'https://aavishkaarcapital.in/',
  'Mumbai, India',
  '2001',
  'The archetypal "venture capital for development" story  -  started with nothing, built the ecosystem. A powerful teaching case on building impact infrastructure in markets where conventional VC doesn''t reach. Strong fit for students interested in BoP investing, India, or building impact platforms from scratch.',
  'Vineet Rai (Founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Aavishkaar Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Aavishkaar Capital'
  AND ca.name IN ('Financial Inclusion', 'Global Health', 'Economic Development', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Aavishkaar Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Aavishkaar Capital' AND r.name IN ('South Asia', 'Southeast Asia', 'East Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Aavishkaar Capital' AND tp.name IN ('People in Poverty', 'Smallholder Farmers', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 8. IGNIA Partners ---------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'IGNIA Partners',
  'Mexico''s largest venture capital firm focused on investing in businesses serving the emerging middle class  -  the segment earning $2-$10/day. Founded in 2007 by Alvaro Rodriguez-Arregui and HBS Senior Lecturer Michael Chu. Portfolio includes vision care, branchless banking, and affordable housing companies. Manages $289M.',
  'https://ignia.com/',
  'Mexico City, Mexico',
  '2007',
  'Co-founded by HBS Senior Lecturer Michael Chu and Alvaro Rodriguez-Arregui (MBA 1995), who received an HBS Alumni Achievement Award in 2019. One of the most direct HBS-to-impact-venture stories. The firm''s BoP investment thesis is a core case in SE curriculum.',
  'Alvaro Rodriguez-Arregui (MBA 1995, Co-founder), Michael Chu (HBS Senior Lecturer, Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'IGNIA Partners');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'IGNIA Partners'
  AND ca.name IN ('Financial Inclusion', 'Global Health', 'Housing & Community', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'IGNIA Partners' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'IGNIA Partners' AND r.name IN ('Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'IGNIA Partners' AND tp.name IN ('People in Poverty', 'Families')
ON CONFLICT DO NOTHING;

-- -- 9. Adobe Capital ----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Adobe Capital',
  'Mexico''s first triple-bottom-line impact investment fund, founded in 2012. Manages ~$50M across two mezzanine funds investing in early- and growth-stage social and environmental enterprises in Latin America. Uses flexible mezzanine financing structures (equity and quasi-equity) to support impact-driven entrepreneurs addressing social and environmental challenges.',
  'https://www.adobe.capital/',
  'Mexico City, Mexico',
  '2012',
  'Pioneered mezzanine impact investing in Latin America  -  an innovative financing structure that reduces dilution for social entrepreneurs. Strong fit for students interested in creative deal structures in emerging markets or LatAm impact entrepreneurship.',
  'Erik Wallsten (Co-founder, Managing Partner)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Adobe Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Adobe Capital'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Adobe Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Adobe Capital' AND r.name IN ('Latin America')
ON CONFLICT DO NOTHING;

-- -- 10. Vox Capital -----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Vox Capital',
  'Brazil''s first certified impact investing fund, founded in 2009. Provides early-stage capital to companies offering innovative, scalable solutions to improve the lives of low-income Brazilians. Aims to generate market-rate financial returns alongside measurable social impact. Manages ~$72M across multiple funds.',
  'https://www.vfrm.com.br/',
  'Sao Paulo, Brazil',
  '2009',
  'Subject of an HBS case study "Vox Capital: Pioneering Impact Investing in Brazil" (HBS Case 417-051). Also has an HKS case study. Ideal for students interested in impact investing in Latin America, the challenges of early-stage impact fund management, or building impact ecosystems in emerging markets.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Vox Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Vox Capital'
  AND ca.name IN ('Financial Inclusion', 'Education', 'Global Health', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Vox Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Vox Capital' AND r.name IN ('Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Vox Capital' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- -- 11. Co-Creation Hub (CcHUB) -----------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Co-Creation Hub (CcHUB)',
  'Nigeria''s first open living lab and tech innovation center, founded in 2010 by Bosun Tijani and Femi Longe. Has supported 95+ early-stage tech ventures solving social problems, creating 450+ jobs. Operates in Kenya, Nigeria, Namibia, and Rwanda across 18+ African countries. Received MacArthur Foundation grant. Runs the Make-IT Accelerator programme.',
  'https://cchub.africa/',
  'Lagos, Nigeria',
  '2010',
  'The leading tech-for-social-impact hub in West Africa. A great case of how innovation ecosystems can be built in frontier markets. Strong fit for students interested in African tech entrepreneurship, accelerator models, or how social innovation hubs catalyze local startup ecosystems.',
  'Bosun Tijani (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Hybrid'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Co-Creation Hub (CcHUB)');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Co-Creation Hub (CcHUB)'
  AND ca.name IN ('Economic Development', 'Education')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Co-Creation Hub (CcHUB)' AND rt.name IN ('Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Co-Creation Hub (CcHUB)' AND r.name IN ('West Africa', 'East Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Co-Creation Hub (CcHUB)' AND tp.name IN ('Youth & Teenagers')
ON CONFLICT DO NOTHING;

-- -- 12. Novastar Ventures -----------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Novastar Ventures',
  'Nairobi-based early-stage VC firm managing $200M+ across funds investing in innovative businesses serving low-income consumers in East Africa, Nigeria, and Ghana. Focuses on education, healthcare, agribusiness, food, and water sectors. Portfolio includes 22+ investments. Backed by DFIs including FMO, British International Investment, and EIB.',
  'https://www.novastarventures.com/',
  'Nairobi, Kenya',
  '2013',
  'A leading BoP-focused VC in East Africa  -  demonstrates how venture capital models can work in frontier markets where basic goods and services need innovative delivery. Strong fit for students interested in African venture capital or base-of-pyramid business models.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Novastar Ventures');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Novastar Ventures'
  AND ca.name IN ('Global Health', 'Education', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Novastar Ventures' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Novastar Ventures' AND r.name IN ('East Africa', 'West Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Novastar Ventures' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- -- 13. Secha Capital ---------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Secha Capital',
  'Black, female-founded growth capital impact firm in South Africa employing an innovative Operator-Investor model. Invests in traditional industries making the tech-enabled, green economy transition. Embeds young professionals directly into portfolio companies. Has created 1,000+ sustainable jobs. Recently closed $40M Fund II.',
  'https://www.sechacapital.com/',
  'Cape Town, South Africa',
  '2016',
  'A powerful model of embedded operational support in impact investing  -  the Operator-Investor approach is a distinctive PE innovation worth studying. Black, female-founded in South Africa. Strong fit for students interested in African PE, inclusive capitalism, or operational value creation in impact.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Secha Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Secha Capital'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Gender & Social Justice')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Secha Capital' AND rt.name IN ('Funder', 'Operator')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Secha Capital' AND r.name IN ('Southern Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

-- -- 14. Swedfund International ------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Swedfund',
  'Sweden''s Development Finance Institution, founded in 1979 and owned by the Swedish government. Invests venture capital, start-up aid, and expertise in low- and middle-income countries across Africa, South/Southeast Asia, and Ukraine. Focuses on energy & climate, financial inclusion, sustainable enterprises, and food systems.',
  'https://www.swedfund.se/en',
  'Stockholm, Sweden',
  '1979',
  'A model European DFI with a strong focus on sustainability metrics and impact measurement. Complements FMO and CDC in the explorer as an example of how Scandinavian development models approach private-sector development. Good for students comparing DFI approaches across countries.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Government / Public Sector'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Swedfund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Swedfund'
  AND ca.name IN ('Climate & Energy', 'Financial Inclusion', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Swedfund' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Swedfund' AND r.name IN ('Sub-Saharan Africa', 'South Asia', 'Southeast Asia', 'Europe')
ON CONFLICT DO NOTHING;

-- -- 15. BlueOrchard Finance ---------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'BlueOrchard Finance',
  'Founded in 2001 as part of a UN initiative, BlueOrchard is a leading impact asset manager and home to the world''s largest commercial microfinance fund. Headquartered in Geneva with offices in Cambodia, Georgia, Peru, and Kenya. Now part of the Schroders Group. Has a 20+ year track record reaching over 300 million people through debt financing for microfinance institutions.',
  'https://www.blueorchard.com/',
  'Geneva, Switzerland',
  '2001',
  'The world''s largest commercial microfinance fund manager  -  a key case in how impact investing can achieve institutional scale. Now owned by Schroders, demonstrating how mainstream asset managers are acquiring impact capabilities. Strong fit for students interested in microfinance, debt-based impact strategies, or the institutionalization of impact.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'BlueOrchard Finance');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'BlueOrchard Finance'
  AND ca.name IN ('Financial Inclusion', 'Climate & Energy', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'BlueOrchard Finance' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'BlueOrchard Finance' AND r.name IN ('Global', 'South Asia', 'Southeast Asia', 'Latin America', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'BlueOrchard Finance' AND tp.name IN ('People in Poverty', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 16. GAWA Capital ----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'GAWA Capital',
  'Pioneered impact investing in Spain. Founded in 2009, manages $164M+ across three funds focused on microfinance, MSME-lending, and agricultural financing worldwide. Has impacted 770,000+ families across 20 countries. Promotes social and economic development by leveraging private capital markets to support social enterprises in underserved markets.',
  'https://www.gawacapital.com/',
  'Madrid, Spain',
  '2009',
  'Spain''s first impact investment manager  -  fills a geographic gap in the explorer for Southern European impact investors. The firm''s focus on microfinance and agricultural lending in frontier markets offers a European perspective on financial inclusion investing.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'GAWA Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'GAWA Capital'
  AND ca.name IN ('Financial Inclusion', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'GAWA Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'GAWA Capital' AND r.name IN ('Global', 'Latin America', 'Sub-Saharan Africa', 'South Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'GAWA Capital' AND tp.name IN ('People in Poverty', 'Smallholder Farmers', 'Families')
ON CONFLICT DO NOTHING;

-- -- 17. Omnivore --------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Omnivore',
  'India''s leading agritech impact VC, founded in 2011. Manages $143M+ across three funds investing in food, agriculture, and climate innovation. Has backed 40+ startups involved with 12M+ smallholder farmers, creating $3.1B in economic value. First Indian signatory to the Operating Principles for Impact Management. Team of 18 across India and Singapore.',
  'https://omnivore.vc/',
  'Mumbai, India',
  '2011',
  'The definitive agritech impact investor in India  -  demonstrates how venture capital can transform agricultural supply chains at massive scale. Strong fit for students interested in agritech, food systems, climate in emerging markets, or India''s rural economy.',
  'Mark Kahn (Co-founder), Jinesh Shah (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Omnivore');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Omnivore'
  AND ca.name IN ('Climate & Energy', 'Economic Development', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Omnivore' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Omnivore' AND r.name IN ('South Asia', 'Southeast Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Omnivore' AND tp.name IN ('Smallholder Farmers')
ON CONFLICT DO NOTHING;

-- -- 18. Caspian Impact Investments --------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Caspian Impact Investments',
  'India-based impact investor founded in 2004 by Viswanatha Prasad. Started in financial inclusion and diversified across sectors through four funds including the Bellwether Microfinance Fund and India Financial Inclusion Fund. ~125 employees. Merged with BlackSoil Capital in 2024, representing consolidation in India''s impact space.',
  'https://www.caspian.in/',
  'Mumbai, India',
  '2004',
  'One of the earliest dedicated impact investors in India  -  the arc from microfinance specialist to diversified impact platform, and eventual merger with BlackSoil, is a rich teaching case on impact investing evolution. Strong fit for students interested in India''s financial inclusion landscape.',
  'Viswanatha Prasad (Founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Caspian Impact Investments');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Caspian Impact Investments'
  AND ca.name IN ('Financial Inclusion', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Caspian Impact Investments' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Caspian Impact Investments' AND r.name IN ('South Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Caspian Impact Investments' AND tp.name IN ('People in Poverty', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 19. Turner Impact Capital -------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Turner Impact Capital',
  'One of the nation''s largest social impact real estate investment firms, managing $6.1B+ since founding in 2013. Develops affordable multifamily housing, schools, and healthcare facilities. Employs ~250 people  -  90% women and/or people of color. Provides on-site academic support, health education, and community programs in its housing communities.',
  'https://turnerimpact.com/',
  'Santa Monica, United States',
  '2013',
  'Demonstrates that real estate can be a vehicle for social impact at massive scale  -  the embedded services model (teachers, health workers, police in housing) is an innovative approach. Strong fit for students interested in impact real estate, affordable housing, or scaling social services through commercial infrastructure.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '201-500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Turner Impact Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Turner Impact Capital'
  AND ca.name IN ('Housing & Community', 'Education', 'Global Health')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Turner Impact Capital' AND rt.name IN ('Operator', 'Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Turner Impact Capital' AND r.name IN ('US National')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Turner Impact Capital' AND tp.name IN ('Families', 'Children')
ON CONFLICT DO NOTHING;

-- -- 20. NewSchools Venture Fund -----------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'NewSchools Venture Fund',
  'Venture philanthropy applying VC techniques to K-12 education reform. Founded in the late 1990s by Silicon Valley investors. Has raised $250M+ and invested in 100+ organizations across four areas: Innovative Schools, Learning Solutions, Teaching Reimagined, and Learning Differences. Makes $23M+ in annual investments across 80+ ventures.',
  'https://www.newschools.org/',
  'Oakland, United States',
  '1998',
  'One of the earliest and most successful venture philanthropy models  -  applies Silicon Valley investing discipline to education. A core teaching case in how market-based approaches can be used in traditionally public-sector domains.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'NewSchools Venture Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'NewSchools Venture Fund'
  AND ca.name IN ('Education')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'NewSchools Venture Fund' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'NewSchools Venture Fund' AND r.name IN ('US National')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'NewSchools Venture Fund' AND tp.name IN ('Children', 'Youth & Teenagers')
ON CONFLICT DO NOTHING;

-- -- 21. EcoEnterprises Fund ---------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'EcoEnterprises Fund',
  'Women-led impact fund pioneering biodiversity investing in Latin America since 1998. Has an unparalleled 25+ year track record in nature-based solutions. Portfolio companies have protected 16M+ acres, benefited 600,000+ local people, and generated $2B+ in sales. Invests in regenerative agriculture, agroforestry, blue economy, and ecotourism. IFC recently invested $10M in Fund IV.',
  'https://ecoenterprisesfund.com/',
  'San Jose, Costa Rica',
  '1998',
  'The longest-running biodiversity-focused impact fund  -  a unique case in nature-based investing with proven returns. Women-led, Costa Rica-based, and backed by IFC. Strong fit for students interested in conservation finance, biodiversity credits, or the business case for nature.',
  'Tammy Newmark (CEO)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '1-10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'EcoEnterprises Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'EcoEnterprises Fund'
  AND ca.name IN ('Climate & Energy', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'EcoEnterprises Fund' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'EcoEnterprises Fund' AND r.name IN ('Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'EcoEnterprises Fund' AND tp.name IN ('Smallholder Farmers', 'Indigenous Communities')
ON CONFLICT DO NOTHING;

-- -- 22. Boston Community Capital (BlueHub Capital) ----------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Boston Community Capital',
  'A leading CDFI founded in 1984, now also known as BlueHub Capital. Has lent $1B+ and leveraged $6B in additional investment. Built or preserved nearly 20,000 affordable housing units, prevented 800+ foreclosure evictions, created 4,440 living-wage jobs, and became one of the largest solar providers to affordable housing in the US with 26.5M kilowatts of solar capacity.',
  'https://bluehubcapital.org/',
  'Boston, United States',
  '1984',
  'One of the most impactful CDFIs in the country, headquartered blocks from HBS. Demonstrates how community development finance can achieve massive scale. The foreclosure relief + solar-on-affordable-housing combination is a distinctive model. Strong fit for students interested in CDFIs, community development, or green affordable housing.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Boston Community Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Boston Community Capital'
  AND ca.name IN ('Housing & Community', 'Climate & Energy', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Boston Community Capital' AND rt.name IN ('Funder', 'Operator')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Boston Community Capital' AND r.name IN ('Northeast', 'US National')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Boston Community Capital' AND tp.name IN ('People in Poverty', 'Families')
ON CONFLICT DO NOTHING;

-- -- 23. Capital Impact Partners -----------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Capital Impact Partners',
  'National nonprofit CDFI and part of the Momentus Capital family, which has collectively delivered $24B in financing, created 298,000 jobs, served 14,350 small businesses, and reached 6 million people. Focuses on expanding access to healthcare, education, affordable housing, and healthy food through flexible, mission-aligned financing.',
  'https://www.capitalimpact.org/',
  'Arlington, United States',
  '1982',
  'One of the nation''s largest CDFIs  -  the scale and breadth of impact (healthcare + education + housing + food) makes it an exceptional case in community development finance. Part of the Momentus Capital platform, showing how CDFIs can professionalize and scale. Strong fit for students interested in CDFI models or domestic economic development.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '201-500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Capital Impact Partners');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Capital Impact Partners'
  AND ca.name IN ('Housing & Community', 'Global Health', 'Education', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Capital Impact Partners' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Capital Impact Partners' AND r.name IN ('US National')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Capital Impact Partners' AND tp.name IN ('People in Poverty', 'Families')
ON CONFLICT DO NOTHING;

-- -- 24. SEAF ------------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'SEAF',
  'Small Enterprise Assistance Funds  -  a global SME impact investment manager since 1989. Has managed 38 funds and 14 entrepreneurship centers across 33 countries. Headquartered in Washington DC with 15 offices spanning Central/Eastern Europe, Latin America, the Caribbean, Asia, MENA, and Sub-Saharan Africa. Focuses on climate, food security, and inclusion through an ESG+ investment approach.',
  'https://www.seaf.com/',
  'Washington DC, United States',
  '1989',
  'One of the oldest and most geographically diverse impact investors in the world  -  33 countries, 38 funds. The breadth of experience across every major emerging market region is unmatched. Strong fit for students interested in SME finance, emerging markets, or how impact investing adapts across vastly different contexts.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'SEAF');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'SEAF'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'SEAF' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'SEAF' AND r.name IN ('Global', 'Latin America', 'Sub-Saharan Africa', 'Southeast Asia', 'Middle East & North Africa', 'Europe')
ON CONFLICT DO NOTHING;

-- -- 25. Calvert Impact --------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Calvert Impact',
  'Global impact investment firm with a 30-year track record, founded in 1995 by Calvert Investments with Ford, MacArthur, and Mott Foundations. A certified CDFI that created the Community Investment Note  -  a fixed-income security channeling capital to organizations creating opportunity in underserved communities across the US and globally. Formerly Calvert Foundation.',
  'https://calvertimpact.org/',
  'Bethesda, United States',
  '1995',
  'Pioneered the idea that individual investors could direct capital to community development through a simple fixed-income product. The Community Investment Note is a notable financial innovation. Strong fit for students interested in democratizing impact investing or community development finance.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Calvert Impact');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Calvert Impact'
  AND ca.name IN ('Financial Inclusion', 'Housing & Community', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Calvert Impact' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Calvert Impact' AND r.name IN ('US National', 'Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Calvert Impact' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- -- 26. Creation Investments Capital Management -------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Creation Investments',
  'Leading global impact investment manager in emerging markets, founded in 2007. Deploys $707M+ through private equity and private credit funds investing in next-generation financial services. Team operates from Bangalore, Mexico City, Dallas, and Chicago. Believes financial returns and social impact are "not mutually exclusive, but highly correlated."',
  'https://www.creationinvestments.com/',
  'Chicago, United States',
  '2007',
  'A strong example of a thesis-driven impact investor  -  the conviction that financial inclusion drives both returns and impact is core to their model. Global team with on-the-ground presence in key emerging markets. Strong fit for students interested in financial inclusion investing or PE in emerging markets.',
  'Patrick Fisher (Co-founder), Ken Vander Weele (Co-founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Creation Investments');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Creation Investments'
  AND ca.name IN ('Financial Inclusion', 'Gender & Social Justice', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Creation Investments' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Creation Investments' AND r.name IN ('Global', 'South Asia', 'Latin America', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Creation Investments' AND tp.name IN ('People in Poverty', 'Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 27. AlphaMundi Group ------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'AlphaMundi Group',
  'Geneva-based impact investment manager founded in 2007. Manages two funds (SocialAlpha and AlphaJiri) investing in scalable impact ventures across financial inclusion, sustainable food, and renewable energy in Latin America and Sub-Saharan Africa. Has invested $115M+ across 50+ ventures and 270 transactions. The companion AlphaMundi Foundation has disbursed $4M in grants, mobilizing 4x in follow-on investments.',
  'https://www.alphamundigroup.com/',
  'Geneva, Switzerland',
  '2007',
  'Notable for its dual-entity model (commercial fund + grant-making foundation)  -  demonstrates how blended finance structures can catalyze follow-on investment. Certified B Corp. Strong fit for students interested in blended finance, venture debt in emerging markets, or Swiss impact investing.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'B Corporation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'AlphaMundi Group');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'AlphaMundi Group'
  AND ca.name IN ('Financial Inclusion', 'Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'AlphaMundi Group' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'AlphaMundi Group' AND r.name IN ('Latin America', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'AlphaMundi Group' AND tp.name IN ('People in Poverty', 'Smallholder Farmers')
ON CONFLICT DO NOTHING;

-- -- 28. Grassroots Business Fund ----------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Grassroots Business Fund',
  'Non-profit impact investment organization spun out of the IFC in 2008. Combines long-term investment capital with tailored business advisory services for SMEs in Africa, Asia, and Latin America. Has deployed $140M+ and conducted 200+ advisory projects with businesses that benefit 1.7M people/year. Uses quasi-equity/mezzanine to avoid excessive dilution for social entrepreneurs.',
  'https://www.gbfund.org/',
  'Washington DC, United States',
  '2008',
  'Born out of the IFC  -  a rare case of a development institution spinning off an independent impact fund. The combination of patient capital + hands-on advisory is a model many impact investors aspire to. Focus on smallholder-linked agribusiness is highly relevant to SE curriculum.',
  'Harold Rosen (Founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Grassroots Business Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Grassroots Business Fund'
  AND ca.name IN ('Economic Development', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Grassroots Business Fund' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Grassroots Business Fund' AND r.name IN ('East Africa', 'South Asia', 'Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Grassroots Business Fund' AND tp.name IN ('People in Poverty', 'Smallholder Farmers')
ON CONFLICT DO NOTHING;

-- -- 29. Media Development Investment Fund -------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Media Development Investment Fund',
  'Non-profit impact fund providing affordable debt, equity, and quasi-equity financing to independent news businesses in challenging environments. Has supported 143+ media outlets across 46 countries, investing $285M and reaching 330M+ people annually with quality journalism. Originally backed by Soros Economic Development Fund. Operates in emerging and frontier markets where press freedom is under threat.',
  'https://www.mdif.org/',
  'New York, United States',
  '1995',
  'A completely unique model in the impact space  -  investing in independent media as a development tool. Fills a gap in the explorer around arts/culture/media. The tension between financial sustainability and press freedom in hostile environments is a compelling SE teaching case.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Media Development Investment Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Media Development Investment Fund'
  AND ca.name IN ('Arts & Culture', 'Gender & Social Justice')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Media Development Investment Fund' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Media Development Investment Fund' AND r.name IN ('Global', 'Europe', 'Sub-Saharan Africa', 'South Asia', 'Southeast Asia')
ON CONFLICT DO NOTHING;

-- -- 30. Global Environment Fund -----------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Global Environment Fund',
  'Pioneer sustainability and impact investing firm founded in 1990, managing $1B+ in assets. Invests in businesses deploying proven technologies, products, and services that reduce energy consumption and GHG emissions. Focus on environmental quality, resource efficiency, and "lightening the footprint" of traditional industries.',
  'https://www.globalenvironmentfund.com/',
  'Washington DC, United States',
  '1990',
  'One of the earliest climate-focused impact investors  -  predates the modern ESG movement by decades. The $1B scale and focus on proven (not speculative) cleantech makes it a useful contrast to more venture-oriented climate funds. Strong fit for students interested in mature climate investing.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Global Environment Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Global Environment Fund'
  AND ca.name IN ('Climate & Energy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Global Environment Fund' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Global Environment Fund' AND r.name IN ('Global', 'North America')
ON CONFLICT DO NOTHING;

-- -- 31. Agora Partnerships ----------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Agora Partnerships',
  'Nonprofit accelerator founded in 2005 empowering early-stage impact entrepreneurs in Latin America. Flagship 4-month Impact Accelerator has supported 125+ companies across 19 countries, catalyzing $47M in investments. In 2022, launched Juntas Contamos to support women-led enterprises in Mexico and Central America.',
  'https://agorapartnerships.org/',
  'Washington DC, United States',
  '2005',
  'A long-running accelerator model specifically focused on LatAm impact entrepreneurs  -  the $47M catalyzed from 125 companies is strong evidence of accelerator value creation. The Juntas Contamos women-focused program adds a gender lens. Good for students interested in acceleration, LatAm, or support infrastructure for impact entrepreneurs.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Nonprofit'
  AND er.label = '1-10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Agora Partnerships');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Agora Partnerships'
  AND ca.name IN ('Economic Development', 'Gender & Social Justice')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Agora Partnerships' AND rt.name IN ('Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Agora Partnerships' AND r.name IN ('Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Agora Partnerships' AND tp.name IN ('Women & Girls')
ON CONFLICT DO NOTHING;

-- -- 32. Asian Development Bank ------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Asian Development Bank',
  'Multilateral development bank founded in 1966, owned by 69 member countries (50 from Asia-Pacific). Provides debt, equity, and mezzanine finance for private-sector projects with development impact across Asia. Supports economic growth, poverty reduction, and regional cooperation. Employs staff from 60+ countries.',
  'https://www.adb.org/',
  'Manila, Philippines',
  '1966',
  'The premier multilateral development bank for Asia  -  essential context for understanding development finance in the region. The private-sector operations arm offers PE/VC-style roles. Strong fit for students interested in development finance, infrastructure, or Asia-Pacific economic development.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Government / Public Sector'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Asian Development Bank');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Asian Development Bank'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Asian Development Bank' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Asian Development Bank' AND r.name IN ('South Asia', 'East Asia', 'Southeast Asia', 'Central Asia')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Asian Development Bank' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;

-- -- 33. Flint Atlantic Capital ------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Flint Atlantic Capital',
  'Lagos-based impact investment firm founded in 2016, specializing in healthcare investing across Africa. Uses patient capital  -  convertible debt and equity  -  with extended investment horizons and social impact as a key investment criterion. Portfolio includes investments in Africa Healthcare Network and other health infrastructure companies across the continent.',
  'http://www.flint-atlantic.com/',
  'Lagos, Nigeria',
  '2016',
  'One of very few Nigeria-based healthcare impact investors  -  fills a critical gap in the explorer around West African impact investing. The healthcare focus in a continent where health infrastructure is desperately needed makes this a compelling SE case.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '1-10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Flint Atlantic Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Flint Atlantic Capital'
  AND ca.name IN ('Global Health')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Flint Atlantic Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Flint Atlantic Capital' AND r.name IN ('West Africa', 'Sub-Saharan Africa')
ON CONFLICT DO NOTHING;

-- -- 34. Blue Earth Capital (formerly PG Impact Investments) -
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Blue Earth Capital',
  'Global impact investment firm backed by Partners Group, one of the world''s largest private markets managers. Founded in 2015 as PG Impact Investments, rebranded to Blue Earth Capital in 2021. Originated from Partners Group''s employee-backed foundation created after the 2004 Asian Tsunami. ~55 employees. All profits transferred to the PG Impact Investments Foundation for philanthropic activities.',
  'https://blueearth.capital/',
  'Baar, Switzerland',
  '2015',
  'A unique case of a top-tier PE firm (Partners Group) institutionalizing its impact investing. The all-profits-to-foundation model is distinctive. Shows how mainstream private markets expertise can be channeled toward impact at institutional scale.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '51-200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Blue Earth Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Blue Earth Capital'
  AND ca.name IN ('Climate & Energy', 'Global Health', 'Education')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Blue Earth Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Blue Earth Capital' AND r.name IN ('Global')
ON CONFLICT DO NOTHING;

-- -- 35. Obviam ----------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Obviam',
  'Independent impact investment advisor based in Bern, Switzerland. Served as investment advisor to SIFEM, the Swiss government''s development finance institution, until 2023. Specializes in long-term PE investments across emerging and frontier markets in Africa, Asia, Latin America, Europe, and MENA. Manages $551M+ across sectors including financial services, healthcare, agriculture, renewable energy, and infrastructure.',
  'https://www.obviam.ch/',
  'Bern, Switzerland',
  '2005',
  'Served as the Swiss government''s DFI investment advisor  -  a case in how small countries can punch above their weight in development finance through specialized advisory models. Covers an exceptionally wide range of frontier markets. Good for students interested in DFI advisory, fund-of-funds, or Swiss development policy.',
  'Claude Barras (Founder)',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing / Foundation'
  AND er.label = '11-50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Obviam');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Obviam'
  AND ca.name IN ('Economic Development', 'Climate & Energy', 'Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Obviam' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Obviam' AND r.name IN ('Global', 'Sub-Saharan Africa', 'South Asia', 'Latin America', 'Middle East & North Africa')
ON CONFLICT DO NOTHING;

COMMIT;

-- -- VERIFY ---------------------------------------------------
SELECT name, hq, year_established, hbs_note
FROM organizations
WHERE name IN (
  'Generation Investment Management', 'Acumen', 'FMO', 'LeapFrog Investments',
  'Accion', 'Bain Capital Double Impact', 'Aavishkaar Capital', 'IGNIA Partners',
  'Adobe Capital', 'Vox Capital', 'Co-Creation Hub (CcHUB)', 'Novastar Ventures',
  'Secha Capital', 'Swedfund', 'BlueOrchard Finance', 'GAWA Capital',
  'Omnivore', 'Caspian Impact Investments', 'Turner Impact Capital',
  'NewSchools Venture Fund', 'EcoEnterprises Fund', 'Boston Community Capital',
  'Capital Impact Partners', 'SEAF', 'Calvert Impact', 'Creation Investments',
  'AlphaMundi Group', 'Grassroots Business Fund', 'Media Development Investment Fund',
  'Global Environment Fund', 'Agora Partnerships', 'Asian Development Bank',
  'Flint Atlantic Capital', 'Blue Earth Capital', 'Obviam'
);
