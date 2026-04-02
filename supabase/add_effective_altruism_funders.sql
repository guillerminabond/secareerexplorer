-- ============================================================
-- Add: Good Ventures, GiveWell, Coefficient Giving
-- Three interconnected EA-aligned philanthropic organizations
-- Run in Supabase SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. GOOD VENTURES
-- ────────────────────────────────────────────────────────────

INSERT INTO organizations (
  name, description, website,
  org_type_id, employee_range_id,
  size, hq, year_established, hbs_note, notable_alumni
)
VALUES (
  'Good Ventures',
  'Private philanthropic foundation founded by Cari Tuna and Dustin Moskovitz (co-founder of Facebook and Asana) with a mission to improve as many lives as possible, as much as possible. Good Ventures operates without full-time staff and distributes grants through recommendations from Coefficient Giving. The foundation has donated over $4 billion across global health, AI safety, scientific research, climate, and economic opportunity — guided by principles of effective altruism.',
  'https://goodventures.org',
  (SELECT id FROM org_types WHERE name = 'Impact Investing / Foundation'),
  (SELECT id FROM employee_ranges WHERE label = '1–10'),
  'Small',
  'San Francisco, USA',
  '2011',
  'A major funder in the effective altruism ecosystem. Strong fit for HBS students interested in philanthropic strategy, evidence-based giving, and long-term impact. Close ties to Open Philanthropy / Coefficient Giving.',
  'Dustin Moskovitz (Facebook co-founder, funder)'
);

-- Cause areas
INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Good Ventures' AND ca.name = 'Global Health'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Good Ventures' AND ca.name = 'Poverty Alleviation'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Good Ventures' AND ca.name = 'Climate & Energy'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Good Ventures' AND ca.name = 'Economic Development'
ON CONFLICT DO NOTHING;

-- Role type
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Good Ventures' AND rt.name = 'Funder'
ON CONFLICT DO NOTHING;

-- Region
INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Good Ventures' AND r.name = 'Global'
ON CONFLICT DO NOTHING;

-- Target populations
INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Good Ventures' AND tp.name = 'People in Poverty'
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 2. GIVEWELL
-- ────────────────────────────────────────────────────────────

INSERT INTO organizations (
  name, description, website,
  org_type_id, employee_range_id,
  size, hq, year_established, hbs_note, notable_alumni
)
VALUES (
  'GiveWell',
  'Independent nonprofit charity evaluator founded in 2007 by Holden Karnofsky and Elie Hassenfeld. GiveWell conducts rigorous, evidence-based research to identify the highest-impact giving opportunities — measuring cost-effectiveness in terms of lives saved or improved per dollar. More than 150,000 donors have relied on GiveWell recommendations to direct over $2.6 billion to top-rated global health and poverty charities. Devotes over 70,000 research hours annually to evaluation.',
  'https://www.givewell.org',
  (SELECT id FROM org_types WHERE name = 'Nonprofit'),
  (SELECT id FROM employee_ranges WHERE label = '51–200'),
  'Medium',
  'Oakland, USA',
  '2007',
  'GiveWell is the gold standard in evidence-based philanthropy. Excellent for HBS students exploring the intersection of finance rigor and social impact — the founders applied hedge fund analytics to charity evaluation. Strong recruiting interest from EA-aligned students.',
  'Holden Karnofsky (co-founder), Elie Hassenfeld (co-founder)'
);

-- Cause areas
INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'GiveWell' AND ca.name = 'Global Health'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'GiveWell' AND ca.name = 'Poverty Alleviation'
ON CONFLICT DO NOTHING;

-- Role types
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'GiveWell' AND rt.name = 'Enabler'
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'GiveWell' AND rt.name = 'Funder'
ON CONFLICT DO NOTHING;

-- Region
INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'GiveWell' AND r.name = 'Global'
ON CONFLICT DO NOTHING;

-- Target populations
INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'GiveWell' AND tp.name = 'People in Poverty'
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'GiveWell' AND tp.name = 'Children'
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'GiveWell' AND tp.name = 'Families'
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 3. COEFFICIENT GIVING (formerly Open Philanthropy)
-- ────────────────────────────────────────────────────────────

INSERT INTO organizations (
  name, description, website,
  org_type_id, employee_range_id,
  size, hq, year_established, hbs_note, notable_alumni
)
VALUES (
  'Coefficient Giving',
  'Formerly Open Philanthropy (rebranded November 2025), Coefficient Giving is one of the largest and most influential effective altruism-aligned philanthropic organizations in the world. It advises Good Ventures and operates multi-donor funds across 13 cause areas including global health, scientific research, pandemic preparedness, AI safety, farm animal welfare, and economic development. Since inception, the organization has directed over $4 billion in grants — including more than $1 billion in 2025 alone.',
  'https://coefficientgiving.org',
  (SELECT id FROM org_types WHERE name = 'Impact Investing / Foundation'),
  (SELECT id FROM employee_ranges WHERE label = '51–200'),
  'Medium',
  'San Francisco, USA',
  '2011',
  'Formerly Open Philanthropy. A premier destination for analytically rigorous, high-impact careers in philanthropy. HBS candidates interested in EA, cause prioritization, or philanthropic strategy should closely follow their work. Closely linked to Good Ventures and GiveWell.',
  'Holden Karnofsky (co-founder, former CEO)'
);

-- Cause areas
INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Coefficient Giving' AND ca.name = 'Global Health'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Coefficient Giving' AND ca.name = 'Poverty Alleviation'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Coefficient Giving' AND ca.name = 'Climate & Energy'
ON CONFLICT DO NOTHING;

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Coefficient Giving' AND ca.name = 'Economic Development'
ON CONFLICT DO NOTHING;

-- Role types
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Coefficient Giving' AND rt.name = 'Funder'
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Coefficient Giving' AND rt.name = 'Enabler'
ON CONFLICT DO NOTHING;

-- Region
INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Coefficient Giving' AND r.name = 'Global'
ON CONFLICT DO NOTHING;

-- Target populations
INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Coefficient Giving' AND tp.name = 'People in Poverty'
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Coefficient Giving' AND tp.name = 'Smallholder Farmers'
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- VERIFY
-- ────────────────────────────────────────────────────────────

SELECT name, hq, year_established, hbs_note
FROM organizations
WHERE name IN ('Good Ventures', 'GiveWell', 'Coefficient Giving');
