-- ============================================================
-- PII 456 Impact Investors - Batch 3 of 3
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: uses NOT EXISTS and ON CONFLICT DO NOTHING
-- ============================================================

BEGIN;

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
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
  AND er.label = '11–50'
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
  AND er.label = '11–50'
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
  AND er.label = '11–50'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
  AND er.label = '1–10'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
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
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
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
