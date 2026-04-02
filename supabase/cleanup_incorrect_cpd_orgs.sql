-- ============================================================
-- Cleanup: Remove incorrectly created CPD org entries
-- These were added to the organizations table in error;
-- they belong in site_content → hbs_resources instead.
-- Run in Supabase SQL Editor
-- ============================================================

BEGIN;

-- Remove junction table entries first (FK constraints)
DELETE FROM organization_cause_areas
WHERE organization_id IN (
  SELECT id FROM organizations
  WHERE name IN (
    'HBS CPD AI Opportunities & Connections Platform',
    'HBS CPD Climate & Sustainability Resources'
  )
);

DELETE FROM organization_role_types
WHERE organization_id IN (
  SELECT id FROM organizations
  WHERE name IN (
    'HBS CPD AI Opportunities & Connections Platform',
    'HBS CPD Climate & Sustainability Resources'
  )
);

DELETE FROM organization_regions
WHERE organization_id IN (
  SELECT id FROM organizations
  WHERE name IN (
    'HBS CPD AI Opportunities & Connections Platform',
    'HBS CPD Climate & Sustainability Resources'
  )
);

DELETE FROM organization_target_populations
WHERE organization_id IN (
  SELECT id FROM organizations
  WHERE name IN (
    'HBS CPD AI Opportunities & Connections Platform',
    'HBS CPD Climate & Sustainability Resources'
  )
);

-- Remove the org rows themselves
DELETE FROM organizations
WHERE name IN (
  'HBS CPD AI Opportunities & Connections Platform',
  'HBS CPD Climate & Sustainability Resources'
);

COMMIT;

-- ── VERIFY (should return 0 rows) ────────────────────────────
SELECT name FROM organizations
WHERE name IN (
  'HBS CPD AI Opportunities & Connections Platform',
  'HBS CPD Climate & Sustainability Resources'
);
