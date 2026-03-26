-- ─────────────────────────────────────────────────────────────────────────────
-- Combined: full RLS + admin columns setup for site_feedback
--
-- Safe to run multiple times (all statements are idempotent).
--
-- Policies created:
--   • Public INSERT  — anyone can submit feedback (no login required)
--   • Auth   SELECT  — only admins can read submissions
--   • Auth   UPDATE  — only admins can star / archive / add notes
--   • Auth   DELETE  — only admins can delete entries
--
-- Columns added (if not already present):
--   • starred       boolean  DEFAULT false
--   • archived      boolean  DEFAULT false
--   • admin_comment text
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Ensure RLS is enabled
ALTER TABLE site_feedback ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies so this is safe to re-run
DROP POLICY IF EXISTS "Public insert feedback" ON site_feedback;
DROP POLICY IF EXISTS "Auth read feedback"     ON site_feedback;
DROP POLICY IF EXISTS "Auth delete feedback"   ON site_feedback;
DROP POLICY IF EXISTS "Auth update feedback"   ON site_feedback;

-- 3. Recreate all four policies
CREATE POLICY "Public insert feedback"
  ON site_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth read feedback"
  ON site_feedback FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth update feedback"
  ON site_feedback FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete feedback"
  ON site_feedback FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. Add admin columns (safe if already present)
ALTER TABLE site_feedback
  ADD COLUMN IF NOT EXISTS starred       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_comment text;
