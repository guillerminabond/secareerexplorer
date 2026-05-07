-- ============================================================
-- PII 456 Impact Investors - Batch 1 of 3
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: uses NOT EXISTS and ON CONFLICT DO NOTHING
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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
  AND er.label = '201–500'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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


COMMIT;
