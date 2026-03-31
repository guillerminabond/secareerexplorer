-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: cause_subtopics
--
-- Adds a two-level taxonomy under cause areas.
-- Sub-segments are tagged on Operator-type orgs (Nonprofits, B Corps, etc.)
-- and are not required for Impact Investing or Foundation orgs.
--
-- Run this once in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Lookup table: one row per sub-segment, linked to its parent cause area
CREATE TABLE IF NOT EXISTS cause_subtopics (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  cause_area_id INT  NOT NULL REFERENCES cause_areas(id) ON DELETE CASCADE,
  UNIQUE (name, cause_area_id)
);

-- 2. Junction table: many-to-many between orgs and sub-segments
CREATE TABLE IF NOT EXISTS organization_cause_subtopics (
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  cause_subtopic_id INT  NOT NULL REFERENCES cause_subtopics(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, cause_subtopic_id)
);

-- 3. Seed all sub-segments (names come from the Learn More / CausesTab data)
INSERT INTO cause_subtopics (name, cause_area_id)
SELECT s.name, ca.id
FROM (VALUES
  -- Poverty Alleviation
  ('Cash Transfers',           'Poverty Alleviation'),
  ('Food Security',            'Poverty Alleviation'),
  ('Water & Sanitation',       'Poverty Alleviation'),
  ('Refugee Support',          'Poverty Alleviation'),
  ('Rural Livelihoods',        'Poverty Alleviation'),
  ('Safety Nets',              'Poverty Alleviation'),
  -- Economic Development
  ('Small Business Lending',   'Economic Development'),
  ('Workforce Development',    'Economic Development'),
  ('Supply Chain Inclusion',   'Economic Development'),
  ('Rural Entrepreneurship',   'Economic Development'),
  ('Trade & Market Access',    'Economic Development'),
  ('Job Creation',             'Economic Development'),
  -- Global Health
  ('Infectious Disease',              'Global Health'),
  ('Maternal & Child Health',         'Global Health'),
  ('Mental Health',                   'Global Health'),
  ('Health Systems Strengthening',    'Global Health'),
  ('Access to Medicines',             'Global Health'),
  ('Pandemic Preparedness',           'Global Health'),
  -- Education
  ('Early Childhood',          'Education'),
  ('K–12 Reform',              'Education'),
  ('Higher Ed Access',         'Education'),
  ('EdTech & Digital Learning','Education'),
  ('Workforce Training',       'Education'),
  ('Girls'' Education',        'Education'),
  -- Climate & Energy
  ('Renewable Energy',         'Climate & Energy'),
  ('Carbon Markets',           'Climate & Energy'),
  ('Sustainable Agriculture',  'Climate & Energy'),
  ('Climate Adaptation',       'Climate & Energy'),
  ('Circular Economy',         'Climate & Energy'),
  ('Green Finance',            'Climate & Energy'),
  -- Gender & Social Justice
  ('Women''s Economic Empowerment', 'Gender & Social Justice'),
  ('Gender-Based Violence',         'Gender & Social Justice'),
  ('Reproductive Health',           'Gender & Social Justice'),
  ('Pay Equity',                    'Gender & Social Justice'),
  ('LGBTQ+ Rights',                 'Gender & Social Justice'),
  ('Racial Justice',                'Gender & Social Justice'),
  -- Financial Inclusion
  ('Microfinance',             'Financial Inclusion'),
  ('Mobile Banking',           'Financial Inclusion'),
  ('Savings & Insurance',      'Financial Inclusion'),
  ('Credit Scoring',           'Financial Inclusion'),
  ('Remittances',              'Financial Inclusion'),
  ('MSME Lending',             'Financial Inclusion'),
  -- Housing & Community
  ('Affordable Housing',       'Housing & Community'),
  ('CDFIs',                    'Housing & Community'),
  ('Neighborhood Revitalization','Housing & Community'),
  ('Homelessness',             'Housing & Community'),
  ('Tenant Advocacy',          'Housing & Community'),
  ('Mixed-Income Communities', 'Housing & Community'),
  -- Arts & Culture
  ('Arts Education',           'Arts & Culture'),
  ('Community Arts',           'Arts & Culture'),
  ('Cultural Preservation',    'Arts & Culture'),
  ('Creative Economy',         'Arts & Culture'),
  ('Performing Arts',          'Arts & Culture'),
  ('Social Practice Art',      'Arts & Culture')
) AS s(name, cause_area)
JOIN cause_areas ca ON ca.name = s.cause_area
ON CONFLICT (name, cause_area_id) DO NOTHING;
