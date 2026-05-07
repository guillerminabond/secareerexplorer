-- ============================================================
-- PII 456 Impact Investors - Batch 2 of 3
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: uses NOT EXISTS and ON CONFLICT DO NOTHING
-- ============================================================

BEGIN;

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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '201–500'
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
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
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
  AND er.label = '51–200'
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
  AND er.label = '201–500'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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


COMMIT;
