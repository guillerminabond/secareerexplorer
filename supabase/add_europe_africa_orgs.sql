-- ============================================================
-- Europe & Africa-focused organizations
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: org inserts skip if name already exists;
-- junction inserts use ON CONFLICT DO NOTHING.
-- ============================================================

BEGIN;

-- ── 1. Tony Elumelu Foundation ────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Tony Elumelu Foundation',
  'African foundation empowering entrepreneurs across all 54 African countries through training, mentorship, and $5,000 seed capital grants. Has committed $100M+ to over 18,000 entrepreneurs.',
  'https://www.tonyelumelufoundation.org', 'Lagos, Nigeria', 2010,
  'Featured in an HBS case study by Professor Paul Gompers titled "Democratizing Luck Across Africa." A leading model of African-led philanthropy applying business principles to development.',
  ot.id FROM org_types ot WHERE ot.name = 'Foundation'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Tony Elumelu Foundation');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Tony Elumelu Foundation'
  AND ca.name IN ('Economic Development','Poverty Alleviation','Gender & Social Justice')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Tony Elumelu Foundation' AND rt.name IN ('Funder','Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Tony Elumelu Foundation' AND r.name IN ('Africa','Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Tony Elumelu Foundation' AND tp.name IN ('People in Poverty','Women & Girls')
ON CONFLICT DO NOTHING;


-- ── 2. Root Capital ───────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Root Capital',
  'Social investment fund providing patient capital to small and growing agricultural businesses in Africa and Latin America — enterprises too large for microfinance but too risky for commercial banks.',
  'https://rootcapital.org', 'Cambridge, MA, USA', 1999,
  'Affiliated with the Skoll Foundation network and frequently cited in HBS social enterprise curriculum as an exemplar of agricultural impact investing and the "missing middle" financing model.',
  ot.id FROM org_types ot WHERE ot.name = 'Impact Investing'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Root Capital');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Root Capital'
  AND ca.name IN ('Economic Development','Poverty Alleviation','Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Root Capital' AND rt.name IN ('Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Root Capital' AND r.name IN ('Africa','Latin America')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Root Capital' AND tp.name IN ('People in Poverty','Smallholder Farmers')
ON CONFLICT DO NOTHING;


-- ── 3. Luminos Fund ───────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Luminos Fund',
  'Nonprofit providing accelerated foundational education to out-of-school children in Sub-Saharan Africa and the Middle East — enabling vulnerable children to complete 3 years of learning in 10 months.',
  'https://luminosfund.org', 'Boston, MA, USA', 2016,
  'Boston-based nonprofit supported by Legatum, with strong ties to the Harvard University community. Strong track record of rigorous impact measurement and program scale-up.',
  ot.id FROM org_types ot WHERE ot.name = 'Nonprofit'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Luminos Fund');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Luminos Fund' AND ca.name IN ('Education','Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Luminos Fund' AND rt.name IN ('Operator','Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Luminos Fund' AND r.name IN ('Africa')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Luminos Fund' AND tp.name IN ('Children','People in Poverty')
ON CONFLICT DO NOTHING;


-- ── 4. Yunus Social Business ──────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Yunus Social Business',
  'Berlin-based global initiative founded by Nobel Laureate Muhammad Yunus to scale social business models that address poverty while remaining financially self-sustaining — operating across Africa and Europe.',
  'https://www.yunussb.com', 'Berlin, Germany', 2011,
  'Muhammad Yunus has spoken at HBS and Harvard Kennedy School. HKS has produced case studies on the Grameen Bank model; Yunus Social Business extends this work internationally.',
  ot.id FROM org_types ot WHERE ot.name = 'Hybrid'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Yunus Social Business');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Yunus Social Business'
  AND ca.name IN ('Poverty Alleviation','Economic Development','Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Yunus Social Business' AND rt.name IN ('Funder','Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Yunus Social Business' AND r.name IN ('Africa','Europe','Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Yunus Social Business' AND tp.name IN ('People in Poverty','Women & Girls')
ON CONFLICT DO NOTHING;


-- ── 5. IDH — The Sustainable Trade Initiative ─────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'IDH — The Sustainable Trade Initiative',
  'Dutch nonprofit facilitating partnerships across governments, companies, and NGOs to improve sustainability of global commodity supply chains (coffee, cocoa, palm oil) across 23+ countries.',
  'https://www.idhsustainabletrade.com', 'Utrecht, Netherlands', 2008,
  'Valued in HBS social enterprise education as a model for market transformation through multi-stakeholder partnerships. Backed by governments of the Netherlands, UK, and Switzerland.',
  ot.id FROM org_types ot WHERE ot.name = 'Hybrid'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'IDH — The Sustainable Trade Initiative');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'IDH — The Sustainable Trade Initiative'
  AND ca.name IN ('Economic Development','Climate & Energy','Financial Inclusion')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'IDH — The Sustainable Trade Initiative' AND rt.name IN ('Enabler','Advocacy & Policy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'IDH — The Sustainable Trade Initiative' AND r.name IN ('Africa','Asia','Europe','Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'IDH — The Sustainable Trade Initiative' AND tp.name IN ('Smallholder Farmers')
ON CONFLICT DO NOTHING;


-- ── 6. Fairtrade International ────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Fairtrade International',
  'Bonn-based multi-stakeholder association certifying fair trade products globally — working with 684+ producer organizations across Africa and the Middle East to ensure fair prices and market access for smallholder farmers.',
  'https://www.fairtrade.net', 'Bonn, Germany', 1997,
  'Recognized in HBS social enterprise curriculum as a foundational model for fair and inclusive value chains. Increasingly studied for its intersection of certification, impact measurement, and corporate partnerships.',
  ot.id FROM org_types ot WHERE ot.name = 'Hybrid'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Fairtrade International');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Fairtrade International'
  AND ca.name IN ('Economic Development','Poverty Alleviation','Gender & Social Justice')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Fairtrade International' AND rt.name IN ('Enabler','Advocacy & Policy')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Fairtrade International' AND r.name IN ('Africa','Asia','Latin America','Europe','Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Fairtrade International' AND tp.name IN ('Smallholder Farmers','People in Poverty','Women & Girls')
ON CONFLICT DO NOTHING;


-- ── 7. Ashden ─────────────────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'Ashden',
  'UK-based climate charity that funds and recognizes sustainable energy solutions, particularly in Africa and Asia. The Ashden Awards program supports organizations bringing renewable energy and clean cooking to underserved communities.',
  'https://ashden.org', 'London, United Kingdom', 2001,
  'Ashden Award winners are frequently cited in HBS social enterprise discussions of scalable climate solutions. Strong model for catalytic philanthropy in the climate-energy-poverty nexus.',
  ot.id FROM org_types ot WHERE ot.name = 'Foundation'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Ashden');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Ashden' AND ca.name IN ('Climate & Energy','Poverty Alleviation')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Ashden' AND rt.name IN ('Funder','Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Ashden' AND r.name IN ('Africa','Asia','Europe')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Ashden' AND tp.name IN ('People in Poverty')
ON CONFLICT DO NOTHING;


-- ── 8. FINCA International ────────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established, hbs_note, org_type_id)
SELECT
  'FINCA International',
  'Pioneer of village banking microfinance serving 2M+ clients globally. FINCA Ventures supports early-stage social enterprises in energy, WASH, education, health, and fintech across Africa, Eurasia, and Latin America.',
  'https://finca.org', 'Washington, DC, USA', 1984,
  'Recognized as a microfinance pioneer in HBS social enterprise MBA programs. FINCA''s hybrid model combining nonprofit mission with social enterprise subsidiaries is studied as a case in financial inclusion at scale.',
  ot.id FROM org_types ot WHERE ot.name = 'Nonprofit'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'FINCA International');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'FINCA International'
  AND ca.name IN ('Financial Inclusion','Poverty Alleviation','Economic Development','Global Health','Education')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'FINCA International' AND rt.name IN ('Operator','Funder')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'FINCA International' AND r.name IN ('Africa','Asia','Latin America','Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'FINCA International' AND tp.name IN ('People in Poverty','Women & Girls','Families')
ON CONFLICT DO NOTHING;


COMMIT;
