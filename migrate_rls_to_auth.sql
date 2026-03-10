-- ============================================================
-- SECURITY MIGRATION: Replace anonymous write policies with
-- authenticated-only write policies.
--
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- AFTER creating your admin user in Authentication → Users.
-- ============================================================

-- ── 1. DROP old insecure "allow all" write policies ─────────

DROP POLICY IF EXISTS "All write" ON organizations;
DROP POLICY IF EXISTS "All write" ON organization_cause_areas;
DROP POLICY IF EXISTS "All write" ON organization_role_types;
DROP POLICY IF EXISTS "All write" ON organization_regions;
DROP POLICY IF EXISTS "All write" ON organization_target_populations;

DROP POLICY IF EXISTS "Anon update nominations" ON org_nominations;
DROP POLICY IF EXISTS "Anon read nominations"   ON org_nominations;

DROP POLICY IF EXISTS "Anon write site_content" ON site_content;

-- ── 2. ADD authenticated-only write policies ─────────────────
-- These require a valid Supabase Auth JWT (role = 'authenticated').
-- The admin app signs in with supabase.auth.signInWithPassword().

CREATE POLICY "Auth write" ON organizations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON organization_cause_areas FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON organization_role_types FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON organization_regions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON organization_target_populations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Nominations: public can INSERT (nominate), only admins can read/update
CREATE POLICY "Auth read nominations" ON org_nominations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth update nominations" ON org_nominations FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Site content: admin-only writes
CREATE POLICY "Auth write site_content" ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── 3. VERIFY: Run this query to confirm no open write policies remain ──
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND qual = 'true'
--   AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL');
-- Expected: 0 rows (only "Public insert nominations" and read policies remain open)
