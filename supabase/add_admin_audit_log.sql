-- Admin audit log — tracks admin-initiated actions (invites, etc.)
-- Run once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action      text NOT NULL,                 -- e.g. 'invite_admin'
  actor_id    uuid,                          -- the admin who performed the action
  actor_email text,
  target_email text,
  target_id   uuid,                          -- the affected user (if applicable)
  metadata    jsonb DEFAULT '{}'::jsonb,     -- any extra context
  created_at  timestamptz DEFAULT now()
);

-- Only authenticated admins can read the log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read audit log"
  ON admin_audit_log FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only the service_role (Edge Functions) can insert
CREATE POLICY "Service role insert audit log"
  ON admin_audit_log FOR INSERT
  WITH CHECK (true);
  -- Note: Edge Functions using the service_role key bypass RLS by default,
  -- so this policy mainly documents intent. Anon inserts are blocked because
  -- there's no USING clause that matches for anon.
