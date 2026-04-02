-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: add RLS policies for site_feedback
--
-- The table was created with RLS enabled but no policies, which blocks every
-- operation.  This migration adds:
--   • Public INSERT  — anyone (including anonymous visitors) can submit feedback
--   • Auth   SELECT  — only authenticated users (admins) can read submissions
--   • Auth   DELETE  — only authenticated users can delete entries
-- ─────────────────────────────────────────────────────────────────────────────

-- Make sure RLS is on (idempotent)
ALTER TABLE site_feedback ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist so this script is safe to re-run
DROP POLICY IF EXISTS "Public insert feedback"  ON site_feedback;
DROP POLICY IF EXISTS "Auth read feedback"      ON site_feedback;
DROP POLICY IF EXISTS "Auth delete feedback"    ON site_feedback;

-- Allow any visitor to submit feedback (no auth required)
CREATE POLICY "Public insert feedback"
  ON site_feedback
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can read feedback submissions
CREATE POLICY "Auth read feedback"
  ON site_feedback
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can delete feedback entries
CREATE POLICY "Auth delete feedback"
  ON site_feedback
  FOR DELETE
  USING (auth.role() = 'authenticated');
