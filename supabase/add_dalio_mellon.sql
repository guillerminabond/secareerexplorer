-- ============================================================
-- Add: Dalio Philanthropies, Andrew W. Mellon Foundation
-- Two major US foundations — one family-led (education/oceans),
-- one endowed (arts/humanities)
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: org inserts skip if name already exists;
-- junction inserts use ON CONFLICT DO NOTHING.
-- ============================================================

BEGIN;

-- ── 1. Dalio Philanthropies ──────────────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Dalio Philanthropies',
  'Philanthropic vehicle of the Dalio family, with over $7 billion deployed across three operating programs: Dalio Education (public education equity in Connecticut and beyond), OceanX (ocean exploration and conservation, including a $185M mapping partnership with Bloomberg Philanthropies), and Endless (expanding digital access). Combines large-scale grantmaking with hands-on operating programs.',
  'https://www.daliophilanthropies.org',
  'Westport, CT, USA',
  '2003',
  'Founded by Ray Dalio (HBS MBA 1973), recipient of the 2021 HBS Alumni Achievement Award. Strong fit for students interested in family philanthropy at scale, the operator-vs-funder tension, and how principles-driven management (Dalio''s signature framework) translates from hedge funds to social impact.',
  'Ray Dalio (HBS MBA 1973), Founder of Bridgewater Associates',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Foundation'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Dalio Philanthropies');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Dalio Philanthropies'
  AND ca.name IN ('Education', 'Climate & Energy', 'Economic Development')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Dalio Philanthropies' AND rt.name IN ('Funder', 'Operator')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Dalio Philanthropies' AND r.name IN ('US National', 'Global', 'Northeast')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Dalio Philanthropies' AND tp.name IN ('Children', 'Youth & Teenagers', 'People in Poverty')
ON CONFLICT DO NOTHING;


-- ── 2. Andrew W. Mellon Foundation ───────────────────────────
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Andrew W. Mellon Foundation',
  'One of the largest US foundations dedicated to arts and humanities, with a $7.7 billion endowment and ~$540 million in annual grantmaking (2024). Supports higher education, museums, libraries, and cultural organizations. In 2025, committed $15M in emergency funding to state humanities councils after federal cuts — a model of responsive, countercyclical philanthropy.',
  'https://www.mellon.org',
  'New York, NY, USA',
  '1969',
  'Named after Andrew Mellon; Mellon Hall sits on the HBS Executive Education campus. HBS published the case "Mellon Financial and The Bank of New York" (Case 208-129). Strong fit for students interested in arts-focused philanthropy, endowment management, and how foundations respond to shifting public funding landscapes.',
  NULL,
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Foundation'
  AND er.label = '51–200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Andrew W. Mellon Foundation');

INSERT INTO organization_cause_areas (organization_id, cause_area_id)
SELECT o.id, ca.id FROM organizations o, cause_areas ca
WHERE o.name = 'Andrew W. Mellon Foundation'
  AND ca.name IN ('Arts & Culture', 'Education')
ON CONFLICT DO NOTHING;

INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id FROM organizations o, role_types rt
WHERE o.name = 'Andrew W. Mellon Foundation' AND rt.name IN ('Funder', 'Enabler')
ON CONFLICT DO NOTHING;

INSERT INTO organization_regions (organization_id, region_id)
SELECT o.id, r.id FROM organizations o, regions r
WHERE o.name = 'Andrew W. Mellon Foundation' AND r.name IN ('US National', 'Global')
ON CONFLICT DO NOTHING;

INSERT INTO organization_target_populations (organization_id, target_population_id)
SELECT o.id, tp.id FROM organizations o, target_populations tp
WHERE o.name = 'Andrew W. Mellon Foundation' AND tp.name IN ('Indigenous Communities')
ON CONFLICT DO NOTHING;

COMMIT;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT name, hq, year_established, hbs_note
FROM organizations
WHERE name IN ('Dalio Philanthropies', 'Andrew W. Mellon Foundation');
