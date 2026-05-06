-- Add conditional fields for Impact Investing and Foundation orgs
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS aum text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS investor_type text[];

-- Optional: migrate legacy combined org_type values (review per-org before running)
-- UPDATE organizations SET org_type = 'Impact Investing' WHERE org_type = 'Impact Investing / Foundation';
