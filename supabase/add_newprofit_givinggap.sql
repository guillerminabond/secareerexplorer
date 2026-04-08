-- ============================================================
-- Add: New Profit Portfolio, Giving Gap
-- Target: site_content table → general_resources JSONB array
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: each UPDATE checks the array for the title
-- before appending, so duplicates are never created.
-- ============================================================

BEGIN;

-- Ensure the general_resources key exists (no-op if already present)
INSERT INTO site_content (key, value)
VALUES ('general_resources', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── 1. New Profit Portfolio ──────────────────────────────────
UPDATE site_content
SET value = value || jsonb_build_array(jsonb_build_object(
  'emoji',    '🚀',
  'title',    'New Profit Portfolio',
  'subtitle', 'Venture Philanthropy Portfolio',
  'desc',     'Explore 275+ high-impact organizations backed by New Profit, one of America''s leading venture philanthropy funds. Portfolio spans education, economic mobility, civic engagement, and public health — a curated pipeline of proven social enterprises.',
  'tips',     '["Browse by issue area to find orgs aligned with your interests", "Research portfolio orgs as potential employers or case study subjects", "Look at the fund''s approach as a model for venture philanthropy careers"]'::jsonb,
  'url',      'https://newprofit.org/portfolio/',
  'cta',      'Browse Portfolio',
  'tags',     '["Nonprofit", "Foundation", "Funding", "North America"]'::jsonb,
  'featured', false,
  'dateAdded','2026-04-07'
))
WHERE key = 'general_resources'
  AND NOT (value @> '[{"title": "New Profit Portfolio"}]'::jsonb);

-- ── 2. Giving Gap ────────────────────────────────────────────
UPDATE site_content
SET value = value || jsonb_build_array(jsonb_build_object(
  'emoji',    '🤝',
  'title',    'Giving Gap',
  'subtitle', 'Black-Founded Nonprofit Directory',
  'desc',     'The largest searchable database of 2,000+ Black-founded nonprofits in the U.S. Addresses a stark funding gap — only ~$1B of $450B+ in annual giving reaches Black-led organizations. Use it to discover orgs, research the equity landscape, or direct your own philanthropy.',
  'tips',     '["Search by cause area to find Black-founded orgs in your sector of interest", "Use as a research tool for papers on philanthropic equity", "Explore the Community Fund for donor-advised giving models"]'::jsonb,
  'url',      'https://givinggap.org/',
  'cta',      'Explore Directory',
  'tags',     '["Nonprofit", "North America", "Thought Leadership"]'::jsonb,
  'featured', false,
  'dateAdded','2026-04-07'
))
WHERE key = 'general_resources'
  AND NOT (value @> '[{"title": "Giving Gap"}]'::jsonb);

COMMIT;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT
  elem->>'title' AS title,
  elem->>'url'   AS url,
  elem->>'tags'  AS tags
FROM site_content,
     jsonb_array_elements(value) AS elem
WHERE key = 'general_resources'
  AND elem->>'title' IN (
    'New Profit Portfolio',
    'Giving Gap'
  );
