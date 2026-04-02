-- ============================================================
-- Add: HBS CPD AI Opportunities & Connections Platform (OCP),
--      HBS CPD Climate & Sustainability Resources
-- Target: site_content table → hbs_resources JSONB array
-- Run in Supabase SQL Editor
-- SAFE TO RE-RUN: each UPDATE checks the array for the title
-- before appending, so duplicates are never created.
-- ============================================================

BEGIN;

-- Ensure the hbs_resources key exists (no-op if already present)
INSERT INTO site_content (key, value)
VALUES ('hbs_resources', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── 1. AI-Powered Opportunities & Connections Platform (OCP) ─
UPDATE site_content
SET value = value || jsonb_build_array(jsonb_build_object(
  'title',    'AI-Powered Opportunities & Connections Platform (OCP)',
  'url',      'https://cpd.dtxchat.org/',
  'desc',     'CPD''s 2025 AI-powered job search tool. Run a conversational search to find roles and surface HBS alumni at hiring companies — sorted by relevance, recency, alumni presence, or salary. Log in with HBS credentials.',
  'tags',     '["Job Board", "Mentorship"]'::jsonb,
  'featured', false
))
WHERE key = 'hbs_resources'
  AND NOT (value @> '[{"title": "AI-Powered Opportunities & Connections Platform (OCP)"}]'::jsonb);

-- ── 2. CPD Climate & Sustainability Resources ─────────────────
UPDATE site_content
SET value = value || jsonb_build_array(jsonb_build_object(
  'title',    'CPD Climate & Sustainability Resources',
  'url',      'https://my.hbs.edu/cpd/tools-resources/climate-sustainability-resources',
  'desc',     'CPD''s hub for climate, cleantech, energy, and sustainability careers — specialized coaching, curated job listings, alumni speed-networking events, and Baker Library research access. Co-built with the HBS Business & Environment Initiative.',
  'tags',     '["Job Board", "Thought Leadership"]'::jsonb,
  'featured', false
))
WHERE key = 'hbs_resources'
  AND NOT (value @> '[{"title": "CPD Climate & Sustainability Resources"}]'::jsonb);

COMMIT;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT
  elem->>'title' AS title,
  elem->>'url'   AS url,
  elem->>'tags'  AS tags
FROM site_content,
     jsonb_array_elements(value) AS elem
WHERE key = 'hbs_resources'
  AND elem->>'title' IN (
    'AI-Powered Opportunities & Connections Platform (OCP)',
    'CPD Climate & Sustainability Resources'
  );
