-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Add admin-management columns to site_feedback
--
-- Adds:
--   • starred       — boolean flag so admins can mark important feedback
--   • archived      — boolean flag to move items out of the main inbox
--   • admin_comment — free-text note for internal admin use
--
-- Also adds an UPDATE policy so authenticated admins can update these fields.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE site_feedback
  ADD COLUMN IF NOT EXISTS starred       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_comment text;

-- Allow authenticated users (admins) to update feedback entries
DROP POLICY IF EXISTS "Auth update feedback" ON site_feedback;
CREATE POLICY "Auth update feedback"
  ON site_feedback
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
