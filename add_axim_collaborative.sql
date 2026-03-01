-- ============================================================
-- Add: Axim Collaborative
-- Notable alumni: Stephanie Khurana (MBA/MPP), SECON 2026 speaker
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Insert organization
INSERT INTO organizations (
  name, description, website,
  org_type_id, employee_range_id,
  size, hq, year_established, hbs_note, notable_alumni
)
VALUES (
  'Axim Collaborative',
  'Nonprofit collaborative founded by MIT and Harvard using proceeds from the edX acquisition to fund and accelerate innovation in online learning — expanding access to high-quality education globally.',
  'https://axim.org',
  (SELECT id FROM org_types WHERE name = 'Nonprofit'),
  (SELECT id FROM employee_ranges WHERE label = '11–50'),
  'Small',
  'Cambridge, USA',
  '2021',
  'Stephanie Khurana (MBA/MPP) is a notable HBS alumna and SECON 2026 speaker. Strong fit for candidates interested in edtech, online learning, and philanthropic strategy.',
  'Stephanie Khurana (MBA/MPP), SECON 2026 Speaker'
);

-- 2. Cause areas
INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Axim Collaborative' AND ca.name = 'Education'
ON CONFLICT DO NOTHING;

-- 3. Role types
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Axim Collaborative' AND rt.name = 'Funder'
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Axim Collaborative' AND rt.name = 'Enabler'
ON CONFLICT DO NOTHING;

-- 4. Region
INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Axim Collaborative' AND r.name = 'Global'
ON CONFLICT DO NOTHING;

-- 5. Target populations
INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Axim Collaborative' AND tp.name = 'Youth & Teenagers'
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Axim Collaborative' AND tp.name = 'People in Poverty'
ON CONFLICT DO NOTHING;

-- 6. Verify
SELECT name, hbs_note, notable_alumni FROM organizations WHERE name = 'Axim Collaborative';
