-- ============================================================
-- AUDIT: Organization Redundancies & Updates
-- Date: 2026-04-08
--
-- Fixes:
--   (A) 3 redundant pairs → merge into single records
--   (B) 1 stale rebrand record → delete "Open Philanthropy" if
--       "Coefficient Giving" already exists
--   (C) 3 rebrands → update name, description, website
--
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: all operations are idempotent
-- ============================================================

BEGIN;

-- ════════════════════════════════════════════════════════════════
-- (A) REDUNDANCY FIXES — merge duplicate records
-- ════════════════════════════════════════════════════════════════


-- ── A1. Dalberg Global Development Advisors → merge into Dalberg Advisors ──
-- Both names refer to the same org (rebranded ~2018).
-- UUIDs in badges: 97884691 (Dalberg Advisors) and 976fdd66 (Dalberg GDA)
-- Strategy: migrate all junction rows from "Dalberg Global Development Advisors"
--           to "Dalberg Advisors", then delete the old record.

DO $$
DECLARE
  v_keep_id  UUID;
  v_drop_id  UUID;
BEGIN
  SELECT id INTO v_keep_id FROM organizations WHERE name = 'Dalberg Advisors';
  SELECT id INTO v_drop_id FROM organizations WHERE name = 'Dalberg Global Development Advisors';

  IF v_keep_id IS NOT NULL AND v_drop_id IS NOT NULL AND v_keep_id <> v_drop_id THEN
    -- Migrate junction table rows (skip conflicts)
    UPDATE organization_cause_areas      SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_areas      WHERE organization_id = v_keep_id AND cause_area_id      = organization_cause_areas.cause_area_id);
    UPDATE organization_role_types       SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_role_types       WHERE organization_id = v_keep_id AND role_type_id       = organization_role_types.role_type_id);
    UPDATE organization_regions          SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_regions          WHERE organization_id = v_keep_id AND region_id          = organization_regions.region_id);
    UPDATE organization_target_populations SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_target_populations WHERE organization_id = v_keep_id AND target_population_id = organization_target_populations.target_population_id);
    UPDATE organization_cause_subtopics  SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_subtopics  WHERE organization_id = v_keep_id AND cause_subtopic_id  = organization_cause_subtopics.cause_subtopic_id);

    -- Remove orphaned junction rows that had conflicts
    DELETE FROM organization_cause_areas       WHERE organization_id = v_drop_id;
    DELETE FROM organization_role_types        WHERE organization_id = v_drop_id;
    DELETE FROM organization_regions           WHERE organization_id = v_drop_id;
    DELETE FROM organization_target_populations WHERE organization_id = v_drop_id;
    DELETE FROM organization_cause_subtopics   WHERE organization_id = v_drop_id;

    -- Delete duplicate record
    DELETE FROM organizations WHERE id = v_drop_id;

    -- Update the kept record
    UPDATE organizations
    SET name    = 'Dalberg Advisors',
        website = 'https://dalberg.com'
    WHERE id = v_keep_id;

    RAISE NOTICE 'Merged Dalberg Global Development Advisors → Dalberg Advisors';
  ELSE
    RAISE NOTICE 'Dalberg merge: nothing to do (one or both records missing, or already same)';
  END IF;
END $$;


-- ── A2. Endeavor (Insight Team) → merge into Endeavor ────────────────────
-- Endeavor Insight is a research division within Endeavor, not a separate org.

DO $$
DECLARE
  v_keep_id  UUID;
  v_drop_id  UUID;
BEGIN
  SELECT id INTO v_keep_id FROM organizations WHERE name = 'Endeavor';
  SELECT id INTO v_drop_id FROM organizations WHERE name = 'Endeavor (Insight Team)';

  IF v_keep_id IS NOT NULL AND v_drop_id IS NOT NULL AND v_keep_id <> v_drop_id THEN
    UPDATE organization_cause_areas      SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_areas      WHERE organization_id = v_keep_id AND cause_area_id      = organization_cause_areas.cause_area_id);
    UPDATE organization_role_types       SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_role_types       WHERE organization_id = v_keep_id AND role_type_id       = organization_role_types.role_type_id);
    UPDATE organization_regions          SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_regions          WHERE organization_id = v_keep_id AND region_id          = organization_regions.region_id);
    UPDATE organization_target_populations SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_target_populations WHERE organization_id = v_keep_id AND target_population_id = organization_target_populations.target_population_id);
    UPDATE organization_cause_subtopics  SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_subtopics  WHERE organization_id = v_keep_id AND cause_subtopic_id  = organization_cause_subtopics.cause_subtopic_id);

    DELETE FROM organization_cause_areas       WHERE organization_id = v_drop_id;
    DELETE FROM organization_role_types        WHERE organization_id = v_drop_id;
    DELETE FROM organization_regions           WHERE organization_id = v_drop_id;
    DELETE FROM organization_target_populations WHERE organization_id = v_drop_id;
    DELETE FROM organization_cause_subtopics   WHERE organization_id = v_drop_id;

    DELETE FROM organizations WHERE id = v_drop_id;

    RAISE NOTICE 'Merged Endeavor (Insight Team) → Endeavor';
  ELSE
    RAISE NOTICE 'Endeavor merge: nothing to do';
  END IF;
END $$;


-- ── A3. Habitat for Humanity → merge into Habitat for Humanity International ─
-- "Habitat for Humanity" and "Habitat for Humanity Intl." are the same org.
-- The official name is "Habitat for Humanity International".

DO $$
DECLARE
  v_keep_id  UUID;
  v_drop_id  UUID;
BEGIN
  -- Keep whichever has the richer record; prefer the one with badges
  SELECT id INTO v_keep_id FROM organizations WHERE name = 'Habitat for Humanity';
  SELECT id INTO v_drop_id FROM organizations WHERE name ILIKE 'Habitat for Humanity Int%' AND name <> 'Habitat for Humanity';

  -- If the short-name record doesn't exist, try the other direction
  IF v_keep_id IS NULL AND v_drop_id IS NOT NULL THEN
    v_keep_id := v_drop_id;
    v_drop_id := NULL;
  END IF;

  IF v_keep_id IS NOT NULL AND v_drop_id IS NOT NULL AND v_keep_id <> v_drop_id THEN
    UPDATE organization_cause_areas      SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_areas      WHERE organization_id = v_keep_id AND cause_area_id      = organization_cause_areas.cause_area_id);
    UPDATE organization_role_types       SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_role_types       WHERE organization_id = v_keep_id AND role_type_id       = organization_role_types.role_type_id);
    UPDATE organization_regions          SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_regions          WHERE organization_id = v_keep_id AND region_id          = organization_regions.region_id);
    UPDATE organization_target_populations SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_target_populations WHERE organization_id = v_keep_id AND target_population_id = organization_target_populations.target_population_id);
    UPDATE organization_cause_subtopics  SET organization_id = v_keep_id WHERE organization_id = v_drop_id AND NOT EXISTS (SELECT 1 FROM organization_cause_subtopics  WHERE organization_id = v_keep_id AND cause_subtopic_id  = organization_cause_subtopics.cause_subtopic_id);

    DELETE FROM organization_cause_areas       WHERE organization_id = v_drop_id;
    DELETE FROM organization_role_types        WHERE organization_id = v_drop_id;
    DELETE FROM organization_regions           WHERE organization_id = v_drop_id;
    DELETE FROM organization_target_populations WHERE organization_id = v_drop_id;
    DELETE FROM organization_cause_subtopics   WHERE organization_id = v_drop_id;

    DELETE FROM organizations WHERE id = v_drop_id;
  END IF;

  -- Standardize the name on the kept record
  IF v_keep_id IS NOT NULL THEN
    UPDATE organizations
    SET name    = 'Habitat for Humanity International',
        website = 'https://www.habitat.org'
    WHERE id = v_keep_id;
    RAISE NOTICE 'Merged → Habitat for Humanity International';
  ELSE
    RAISE NOTICE 'Habitat merge: nothing to do';
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════════
-- (B) STALE REBRAND RECORD — Open Philanthropy
-- ════════════════════════════════════════════════════════════════
-- The reclassify_org_types.sql references "Open Philanthropy" by name,
-- meaning a record may exist under the old name alongside the newer
-- "Coefficient Giving" record from add_effective_altruism_funders.sql.
-- If both exist, delete the old one and migrate its junction rows.

DO $$
DECLARE
  v_new_id  UUID;
  v_old_id  UUID;
BEGIN
  SELECT id INTO v_new_id FROM organizations WHERE name = 'Coefficient Giving';
  SELECT id INTO v_old_id FROM organizations WHERE name = 'Open Philanthropy';

  IF v_new_id IS NOT NULL AND v_old_id IS NOT NULL AND v_new_id <> v_old_id THEN
    UPDATE organization_cause_areas      SET organization_id = v_new_id WHERE organization_id = v_old_id AND NOT EXISTS (SELECT 1 FROM organization_cause_areas      WHERE organization_id = v_new_id AND cause_area_id      = organization_cause_areas.cause_area_id);
    UPDATE organization_role_types       SET organization_id = v_new_id WHERE organization_id = v_old_id AND NOT EXISTS (SELECT 1 FROM organization_role_types       WHERE organization_id = v_new_id AND role_type_id       = organization_role_types.role_type_id);
    UPDATE organization_regions          SET organization_id = v_new_id WHERE organization_id = v_old_id AND NOT EXISTS (SELECT 1 FROM organization_regions          WHERE organization_id = v_new_id AND region_id          = organization_regions.region_id);
    UPDATE organization_target_populations SET organization_id = v_new_id WHERE organization_id = v_old_id AND NOT EXISTS (SELECT 1 FROM organization_target_populations WHERE organization_id = v_new_id AND target_population_id = organization_target_populations.target_population_id);
    UPDATE organization_cause_subtopics  SET organization_id = v_new_id WHERE organization_id = v_old_id AND NOT EXISTS (SELECT 1 FROM organization_cause_subtopics  WHERE organization_id = v_new_id AND cause_subtopic_id  = organization_cause_subtopics.cause_subtopic_id);

    DELETE FROM organization_cause_areas       WHERE organization_id = v_old_id;
    DELETE FROM organization_role_types        WHERE organization_id = v_old_id;
    DELETE FROM organization_regions           WHERE organization_id = v_old_id;
    DELETE FROM organization_target_populations WHERE organization_id = v_old_id;
    DELETE FROM organization_cause_subtopics   WHERE organization_id = v_old_id;

    DELETE FROM organizations WHERE id = v_old_id;
    RAISE NOTICE 'Deleted stale "Open Philanthropy" record; kept Coefficient Giving';
  ELSIF v_old_id IS NOT NULL AND v_new_id IS NULL THEN
    -- Only old record exists — just rename it
    UPDATE organizations
    SET name        = 'Coefficient Giving',
        description = 'Formerly Open Philanthropy (rebranded November 2025), Coefficient Giving is one of the largest and most influential effective altruism-aligned philanthropic organizations in the world. It advises Good Ventures and operates multi-donor funds across 13 cause areas including global health, scientific research, pandemic preparedness, AI safety, farm animal welfare, and economic development. Since inception, the organization has directed over $4 billion in grants.',
        website     = 'https://coefficientgiving.org',
        hbs_note    = 'Formerly Open Philanthropy. A premier destination for analytically rigorous, high-impact careers in philanthropy. HBS candidates interested in EA, cause prioritization, or philanthropic strategy should closely follow their work. Closely linked to Good Ventures and GiveWell.'
    WHERE id = v_old_id;
    RAISE NOTICE 'Renamed "Open Philanthropy" → "Coefficient Giving"';
  ELSE
    RAISE NOTICE 'Open Philanthropy cleanup: nothing to do';
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════════
-- (C) REBRAND UPDATES — name, website, description
-- ════════════════════════════════════════════════════════════════


-- ── C1. Coalition for Queens → Pursuit ───────────────────────────────────
-- Rebranded 2018; now operates nationally as "Pursuit".

UPDATE organizations
SET name        = 'Pursuit',
    description = 'Formerly Coalition for Queens — a workforce development nonprofit that trains adults from underserved communities in software engineering and places them in high-paying tech careers. Pursuit operates a rigorous, multi-year program combining technical training, professional mentorship, and income-share agreements.',
    website     = 'https://www.pursuit.org',
    hbs_note    = COALESCE(hbs_note, '') || ' (Formerly Coalition for Queens, rebranded 2018.)'
WHERE name = 'Coalition for Queens';


-- ── C2. EARN (Earned Assets Resource Network) → SaverLife ────────────────
-- Rebranded 2019; now "SaverLife".

UPDATE organizations
SET name        = 'SaverLife',
    description = 'Formerly EARN (Earned Assets Resource Network) — a fintech nonprofit helping working families build savings through prize-linked savings programs, direct cash rewards, and financial coaching. SaverLife has helped over 1 million members collectively save more than $3 billion.',
    website     = 'https://www.saverlife.org',
    hbs_note    = COALESCE(hbs_note, '') || ' (Formerly EARN, rebranded 2019.)'
WHERE name = 'EARN (Earned Assets Resource Network)';


-- ── C3. D-Rev: Design for the Other 90% → Equalize Health ───────────────
-- Rebranded end of 2020 to "Equalize Health".

UPDATE organizations
SET name        = 'Equalize Health',
    description = 'Formerly D-Rev: Design for the Other 90% — a nonprofit that designs, develops, and delivers affordable medical technologies for underserved populations in the Global South. Focuses on neonatal care (phototherapy for jaundice) and prosthetics (ReMotion Knee).',
    website     = 'https://www.equalizehealth.org',
    hbs_note    = COALESCE(hbs_note, '') || ' (Formerly D-Rev, rebranded 2020.)'
WHERE name = 'D-Rev: Design for the Other 90%';


COMMIT;


-- ════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ════════════════════════════════════════════════════════════════

-- 1. Confirm no stale names remain
SELECT name FROM organizations
WHERE name IN (
  'Dalberg Global Development Advisors',
  'Endeavor (Insight Team)',
  'Open Philanthropy',
  'Coalition for Queens',
  'EARN (Earned Assets Resource Network)',
  'D-Rev: Design for the Other 90%'
);
-- Expected: 0 rows

-- 2. Confirm updated names exist
SELECT name, website FROM organizations
WHERE name IN (
  'Dalberg Advisors',
  'Endeavor',
  'Habitat for Humanity International',
  'Coefficient Giving',
  'Pursuit',
  'SaverLife',
  'Equalize Health'
);
-- Expected: 7 rows

-- 3. Check for any remaining near-duplicates (manual review)
-- Look for orgs whose names share the same first 10 characters
SELECT a.name AS org_a, b.name AS org_b
FROM organizations a
JOIN organizations b ON a.id < b.id
WHERE left(lower(a.name), 10) = left(lower(b.name), 10)
ORDER BY a.name;
