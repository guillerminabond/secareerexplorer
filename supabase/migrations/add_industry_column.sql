-- Add industry column to organizations table
-- This is a plain text column (not a lookup table) since industries are a flat, static list.
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS industry TEXT;

-- Optional: add a comment for documentation
COMMENT ON COLUMN organizations.industry IS 'Industry classification (e.g. Healthcare, Financial Services, Education). Stored as plain text from a fixed app-side list.';
