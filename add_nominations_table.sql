-- ============================================================
-- Org Nominations Table
-- Lets users nominate organizations for review.
-- Admin can approve (pre-filling OrgForm) or reject.
-- ============================================================

CREATE TABLE IF NOT EXISTS org_nominations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  website       TEXT,
  description   TEXT,
  org_type      TEXT,
  cause_areas   TEXT,   -- comma-separated, e.g. "Education, Global Health"
  regions       TEXT,   -- comma-separated
  hbs_connection TEXT,  -- why is this HBS-relevant?
  submitted_by  TEXT,   -- optional name or email from nominator
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes   TEXT,   -- optional note when approving/rejecting
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE org_nominations ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a nomination
CREATE POLICY "Public insert nominations"
  ON org_nominations FOR INSERT
  WITH CHECK (true);

-- Anyone can read nominations (admin controls via password in UI)
CREATE POLICY "Anon read nominations"
  ON org_nominations FOR SELECT
  USING (true);

-- Allow status updates (admin password-gated in UI)
CREATE POLICY "Anon update nominations"
  ON org_nominations FOR UPDATE
  USING (true)
  WITH CHECK (true);
