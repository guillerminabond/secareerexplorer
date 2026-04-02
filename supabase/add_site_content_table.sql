-- ============================================================
-- Site Content Table
-- Stores admin-editable content as key/value JSONB pairs.
-- Keys used by this app:
--   career_path_resources  → object mapping career path label → [{title, url, desc}]
--   general_resources      → array of general resource card objects
--   hbs_resources          → array of HBS-specific resource link objects
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read content
CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT
  USING (true);

-- Only authenticated admins can write site content
CREATE POLICY "Auth write site_content"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
