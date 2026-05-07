-- ============================================================
-- Reclassify nonprofit role_types
-- Audit of 354 nonprofits: fix over-assigned Enabler roles,
-- add missing Operator roles for direct-service organizations
-- 
-- Changes: 71 removals, 47 additions across 87 orgs
-- Net: Enabler -63, Operator +38, Funder -3, Advocacy +4
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: DELETEs are idempotent, INSERTs use ON CONFLICT DO NOTHING
-- ============================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- PART 1: REMOVE INCORRECT ROLE ASSIGNMENTS
-- ═══════════════════════════════════════════════════════════════

-- Remove 'Enabler' from 63 nonprofits
DELETE FROM organization_role_types
WHERE role_type_id = (SELECT id FROM role_types WHERE name = 'Enabler')
  AND organization_id IN (
    SELECT id FROM organizations WHERE name IN (
      'AARP',
      'Acumen Academy',
      'Al Jisr Association',
      'Association of Latino Professionals For America (ALPFA)',
      'Braven',
      'Build Change',
      'Centre for Humanitarian Dialogue',
      'Civic Builders',
      'Climate Leadership Council',
      'Coalition for Queens',
      'Common Sense Media',
      'Community Solutions',
      'Consumer Reports',
      'Cuso International',
      'Detroit Economic Growth Corporation',
      'Education Pioneers',
      'Equal Justice Initiative',
      'Evidence Action',
      'Facing History and Ourselves',
      'Fundación Avina',
      'G-10 Favelas',
      'Girls Who Code',
      'Gold House',
      'Gramhal Foundation',
      'Health Leads',
      'INROADS',
      'Inspiring Capital',
      'Instituto Sonho Grande',
      'Junior Achievement Worldwide',
      'Khan Academy',
      'Khoj International Artists'' Association',
      'Kuona Trust',
      'Lead for America',
      'Lincoln Center for the Performing Arts',
      'Match Education',
      'Megafire Action',
      'Mercy Corps',
      'Michael J. Fox Foundation for Parkinson''s Research',
      'Natural Resources Defense Council (NRDC)',
      'New Leaders for New Schools',
      'New Sector Alliance',
      'New York City Economic Development Corporation',
      'Omega Healthcare Investors',
      'One Acre Fund',
      'One Young World',
      'OneGoal',
      'Potential Energy Coalition',
      'ProPublica',
      'Right To Play International',
      'SEO (Sponsors for Educational Opportunity)',
      'SHOFCO',
      'Single Stop',
      'Teach For India',
      'The College Board',
      'The Jed Foundation',
      'TupuToa',
      'UNCF (United Negro College Fund)',
      'Upstream USA',
      'Venture for America',
      'Village Enterprise',
      'Vital Voices Global Partnership',
      'Women''s Educational and Industrial Union',
      'Zearn'
    )
  );

-- Remove 'Funder' from 6 nonprofits
DELETE FROM organization_role_types
WHERE role_type_id = (SELECT id FROM role_types WHERE name = 'Funder')
  AND organization_id IN (
    SELECT id FROM organizations WHERE name IN (
      'Clinton Foundation',
      'International Center for Research on Women (ICRW)',
      'One for the World',
      'Results for Development (R4D)',
      'Sight and Life',
      'Stop TB Partnership'
    )
  );

-- Remove 'Advocacy & Policy' from 2 nonprofits
DELETE FROM organization_role_types
WHERE role_type_id = (SELECT id FROM role_types WHERE name = 'Advocacy & Policy')
  AND organization_id IN (
    SELECT id FROM organizations WHERE name IN (
      'FSG',
      'NCAA'
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- PART 2: ADD CORRECT ROLE ASSIGNMENTS
-- ═══════════════════════════════════════════════════════════════

-- Add 'Operator' to 38 nonprofits
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id
FROM organizations o, role_types rt
WHERE rt.name = 'Operator'
  AND o.name IN (
    'AARP',
    'Achievement Network (ANet)',
    'Acumen Academy',
    'Agora Partnerships',
    'American Foundation for the Blind',
    'Association of Latino Professionals For America (ALPFA)',
    'Bloomberg Center for Cities at Harvard',
    'Centre for Humanitarian Dialogue',
    'Civic Builders',
    'Clinton Foundation',
    'Common Sense Media',
    'Consumer Reports',
    'Cuso International',
    'Education Pioneers',
    'Endeavor',
    'Equal Justice Initiative',
    'Fast Forward (Tech Nonprofits)',
    'Gold House',
    'Initiative for a Competitive Inner City (ICIC)',
    'Inspiring Capital',
    'International AIDS Vaccine Initiative (IAVI)',
    'Jain Family Institute',
    'Khoj International Artists'' Association',
    'Kuona Trust',
    'Local Initiatives Support Corporation (LISC)',
    'NCAA',
    'Natural Resources Defense Council (NRDC)',
    'New Sector Alliance',
    'One Young World',
    'One for the World',
    'OneTen Coalition',
    'Partnership for Public Service',
    'ProPublica',
    'Results for Development (R4D)',
    'Stop TB Partnership',
    'TupuToa',
    'UNCF (United Negro College Fund)',
    'United Way Worldwide'
  )
ON CONFLICT DO NOTHING;

-- Add 'Advocacy & Policy' to 6 nonprofits
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id
FROM organizations o, role_types rt
WHERE rt.name = 'Advocacy & Policy'
  AND o.name IN (
    'Change.org',
    'Gold House',
    'International Center for Research on Women (ICRW)',
    'Murmuration',
    'ProPublica',
    'Sight and Life'
  )
ON CONFLICT DO NOTHING;

-- Add 'Funder' to 3 nonprofits
INSERT INTO organization_role_types (organization_id, role_type_id)
SELECT o.id, rt.id
FROM organizations o, role_types rt
WHERE rt.name = 'Funder'
  AND o.name IN (
    'Bridges Outcomes Partnerships',
    'G-10 Favelas',
    'Omega Healthcare Investors'
  )
ON CONFLICT DO NOTHING;

COMMIT;

-- ── VERIFY ───────────────────────────────────────────────────
-- Expected after running: Nonprofits should have ~264 Operator,
-- ~126 Enabler, ~77 Advocacy & Policy, ~59 Funder
SELECT rt.name AS role_type, COUNT(*) AS nonprofit_count
FROM organization_role_types ort
JOIN organizations o ON o.id = ort.organization_id
JOIN role_types rt ON rt.id = ort.role_type_id
JOIN org_types ot ON ot.id = o.org_type_id
WHERE ot.name = 'Nonprofit'
GROUP BY rt.name
ORDER BY nonprofit_count DESC;
