-- ============================================================
-- HBS SE Explorer — Saves Counter + HBS Badges
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Add saves counter to organizations ───────────────────
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS saves INTEGER DEFAULT 0;

-- ── 2. Add HBS badge columns ────────────────────────────────
-- Admin-toggled on the org record; high signal, low noise.
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS badge_alumni_work_here   BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS badge_fellowship_partner BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS badge_hbs_founder        BOOLEAN DEFAULT false;

-- ── 3. Atomic saves RPC ─────────────────────────────────────
-- Prevents race conditions when multiple users save concurrently.
-- delta = +1 when saving, -1 when un-saving (floor at 0).
CREATE OR REPLACE FUNCTION increment_saves(org_id UUID, delta INTEGER DEFAULT 1)
RETURNS void LANGUAGE SQL SECURITY DEFINER AS $$
  UPDATE organizations
  SET saves = GREATEST(0, COALESCE(saves, 0) + delta)
  WHERE id = org_id;
$$;

-- Grant anon access so the client-side anon key can call it
GRANT EXECUTE ON FUNCTION increment_saves(UUID, INTEGER) TO anon, authenticated;
