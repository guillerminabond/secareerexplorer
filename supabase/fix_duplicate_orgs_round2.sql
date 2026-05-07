-- ============================================================
-- FIX: Duplicate org records found by near-name audit
-- Date: 2026-04-08
--
-- 5 issues:
--   1. GiveWell — exact duplicate
--   2. Root Capital — exact duplicate
--   3. Partners in Health / Partners In Health — case mismatch
--   4. Injaz Al-Arab / Injaz al-Arab — case mismatch
--   5. Aga Khan Development Network / ...Network (AKDN) — name variant
--
-- Strategy: keep the older record (MIN id), migrate junction rows,
--           delete the newer duplicate.
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: all operations are idempotent
-- ============================================================

BEGIN;

-- ── Helper: generic merge function ───────────────────────────────────────
-- Accepts two org IDs; migrates junction rows from v_drop to v_keep,
-- then deletes v_drop.

CREATE OR REPLACE FUNCTION _merge_org(v_keep UUID, v_drop UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF v_keep IS NULL OR v_drop IS NULL OR v_keep = v_drop THEN
    RETURN;
  END IF;

  -- Migrate junction rows (skip conflicts via NOT EXISTS)
  INSERT INTO organization_cause_areas (organization_id, cause_area_id)
    SELECT v_keep, cause_area_id FROM organization_cause_areas WHERE organization_id = v_drop
    ON CONFLICT DO NOTHING;

  INSERT INTO organization_role_types (organization_id, role_type_id)
    SELECT v_keep, role_type_id FROM organization_role_types WHERE organization_id = v_drop
    ON CONFLICT DO NOTHING;

  INSERT INTO organization_regions (organization_id, region_id)
    SELECT v_keep, region_id FROM organization_regions WHERE organization_id = v_drop
    ON CONFLICT DO NOTHING;

  INSERT INTO organization_target_populations (organization_id, target_population_id)
    SELECT v_keep, target_population_id FROM organization_target_populations WHERE organization_id = v_drop
    ON CONFLICT DO NOTHING;

  INSERT INTO organization_cause_subtopics (organization_id, cause_subtopic_id)
    SELECT v_keep, cause_subtopic_id FROM organization_cause_subtopics WHERE organization_id = v_drop
    ON CONFLICT DO NOTHING;

  -- Delete orphaned junction rows
  DELETE FROM organization_cause_areas       WHERE organization_id = v_drop;
  DELETE FROM organization_role_types        WHERE organization_id = v_drop;
  DELETE FROM organization_regions           WHERE organization_id = v_drop;
  DELETE FROM organization_target_populations WHERE organization_id = v_drop;
  DELETE FROM organization_cause_subtopics   WHERE organization_id = v_drop;

  -- Delete the duplicate org
  DELETE FROM organizations WHERE id = v_drop;
END;
$$;


-- ── 1. GiveWell — exact duplicate ────────────────────────────────────────
DO $$
DECLARE
  v_keep UUID;
  v_drop UUID;
BEGIN
  SELECT id INTO v_keep FROM organizations WHERE name = 'GiveWell' ORDER BY created_date ASC LIMIT 1;
  SELECT id INTO v_drop FROM organizations WHERE name = 'GiveWell' ORDER BY created_date DESC LIMIT 1;
  IF v_keep IS NOT NULL AND v_drop IS NOT NULL AND v_keep <> v_drop THEN
    PERFORM _merge_org(v_keep, v_drop);
    RAISE NOTICE 'Merged duplicate GiveWell';
  END IF;
END $$;


-- ── 2. Root Capital — exact duplicate ────────────────────────────────────
DO $$
DECLARE
  v_keep UUID;
  v_drop UUID;
BEGIN
  SELECT id INTO v_keep FROM organizations WHERE name = 'Root Capital' ORDER BY created_date ASC LIMIT 1;
  SELECT id INTO v_drop FROM organizations WHERE name = 'Root Capital' ORDER BY created_date DESC LIMIT 1;
  IF v_keep IS NOT NULL AND v_drop IS NOT NULL AND v_keep <> v_drop THEN
    PERFORM _merge_org(v_keep, v_drop);
    RAISE NOTICE 'Merged duplicate Root Capital';
  END IF;
END $$;


-- ── 3. Partners in Health / Partners In Health — case mismatch ───────────
-- Official spelling: "Partners In Health" (capital I)
DO $$
DECLARE
  v_keep UUID;
  v_drop UUID;
BEGIN
  SELECT id INTO v_keep FROM organizations WHERE name = 'Partners In Health' LIMIT 1;
  SELECT id INTO v_drop FROM organizations WHERE name = 'Partners in Health' LIMIT 1;
  IF v_keep IS NOT NULL AND v_drop IS NOT NULL AND v_keep <> v_drop THEN
    PERFORM _merge_org(v_keep, v_drop);
    RAISE NOTICE 'Merged "Partners in Health" → "Partners In Health"';
  ELSIF v_drop IS NOT NULL AND v_keep IS NULL THEN
    -- Only lowercase version exists; just fix the name
    UPDATE organizations SET name = 'Partners In Health' WHERE id = v_drop;
    RAISE NOTICE 'Renamed to "Partners In Health"';
  ELSE
    RAISE NOTICE 'Partners In Health: nothing to do';
  END IF;
END $$;


-- ── 4. Injaz Al-Arab / Injaz al-Arab — case mismatch ────────────────────
-- Standardize to "Injaz Al-Arab" (capital A, matching official branding)
DO $$
DECLARE
  v_keep UUID;
  v_drop UUID;
BEGIN
  SELECT id INTO v_keep FROM organizations WHERE name = 'Injaz Al-Arab' LIMIT 1;
  SELECT id INTO v_drop FROM organizations WHERE name = 'Injaz al-Arab' LIMIT 1;
  IF v_keep IS NOT NULL AND v_drop IS NOT NULL AND v_keep <> v_drop THEN
    PERFORM _merge_org(v_keep, v_drop);
    RAISE NOTICE 'Merged "Injaz al-Arab" → "Injaz Al-Arab"';
  ELSIF v_drop IS NOT NULL AND v_keep IS NULL THEN
    UPDATE organizations SET name = 'Injaz Al-Arab' WHERE id = v_drop;
    RAISE NOTICE 'Renamed to "Injaz Al-Arab"';
  ELSE
    RAISE NOTICE 'Injaz Al-Arab: nothing to do';
  END IF;
END $$;


-- ── 5. Aga Khan Development Network (AKDN) → merge into Aga Khan Development Network
DO $$
DECLARE
  v_keep UUID;
  v_drop UUID;
BEGIN
  SELECT id INTO v_keep FROM organizations WHERE name = 'Aga Khan Development Network' LIMIT 1;
  SELECT id INTO v_drop FROM organizations WHERE name = 'Aga Khan Development Network (AKDN)' LIMIT 1;
  IF v_keep IS NOT NULL AND v_drop IS NOT NULL AND v_keep <> v_drop THEN
    PERFORM _merge_org(v_keep, v_drop);
    RAISE NOTICE 'Merged "...Network (AKDN)" → "Aga Khan Development Network"';
  ELSIF v_drop IS NOT NULL AND v_keep IS NULL THEN
    UPDATE organizations SET name = 'Aga Khan Development Network' WHERE id = v_drop;
    RAISE NOTICE 'Renamed to "Aga Khan Development Network"';
  ELSE
    RAISE NOTICE 'Aga Khan: nothing to do';
  END IF;
END $$;


-- ── Cleanup: drop the helper function ────────────────────────────────────
DROP FUNCTION IF EXISTS _merge_org(UUID, UUID);

COMMIT;


-- ════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ════════════════════════════════════════════════════════════════

-- Should return 0 rows (no more exact-name duplicates)
SELECT name, COUNT(*) AS cnt
FROM organizations
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY cnt DESC;
