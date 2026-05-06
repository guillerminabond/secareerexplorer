-- ============================================================
-- Update AUM Ranges & Investor Type for Impact Investors + Foundations
-- Source: PII 456 SEI Tool (4.28.26 v2)
--
-- STRUCTURAL CHANGES:
--   1. Creates aum_ranges lookup table (5 tiers)
--   2. Adds aum_range_id FK on organizations (replaces text aum column)
--   3. Creates investor_types lookup table (6 values)
--   4. Creates organization_investor_types junction table
--   5. Drops old investor_type text[] column and aum text column
--   6. Assigns AUM ranges for 54 Impact Investors + 3 Foundations
--   7. Classifies all Impact Investing orgs by investor type
--
-- AUM priority: HC AUM (primary), PB AUM (fallback)
-- Classification: PitchBook description + CapIQ firm type
-- SAFE TO RE-RUN: uses IF NOT EXISTS / ON CONFLICT DO NOTHING
-- ============================================================

BEGIN;

-- ── 0a. REFERENCE TABLE: aum_ranges ────────────────────────

CREATE TABLE IF NOT EXISTS aum_ranges (
  id         SERIAL PRIMARY KEY,
  label      TEXT UNIQUE NOT NULL,
  sort_order INTEGER
);

INSERT INTO aum_ranges (label, sort_order) VALUES
  ('< $50M',        1),
  ('$50M – $250M',  2),
  ('$250M – $1B',   3),
  ('$1B – $10B',    4),
  ('$10B+',         5)
ON CONFLICT DO NOTHING;

ALTER TABLE aum_ranges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read aum_ranges" ON aum_ranges;
CREATE POLICY "Public read aum_ranges"
  ON aum_ranges FOR SELECT USING (true);

-- Add FK column on organizations (replaces old text aum column)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS aum_range_id INTEGER REFERENCES aum_ranges(id);

-- Drop old text column
ALTER TABLE organizations DROP COLUMN IF EXISTS aum;


-- ── 0b. REFERENCE TABLE: investor_types ─────────────────────

CREATE TABLE IF NOT EXISTS investor_types (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO investor_types (name) VALUES
  ('VC'),
  ('Accelerator/Incubator'),
  ('Growth/PE'),
  ('Investment Bank'),
  ('Debt'),
  ('Multi-type')
ON CONFLICT DO NOTHING;

ALTER TABLE investor_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read investor_types" ON investor_types;
CREATE POLICY "Public read investor_types"
  ON investor_types FOR SELECT USING (true);


-- ── 1. JUNCTION TABLE: organization_investor_types ──────────

CREATE TABLE IF NOT EXISTS organization_investor_types (
  organization_id  UUID    REFERENCES organizations(id) ON DELETE CASCADE,
  investor_type_id INTEGER REFERENCES investor_types(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, investor_type_id)
);

ALTER TABLE organization_investor_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read org_investor_types" ON organization_investor_types;
CREATE POLICY "Public read org_investor_types"
  ON organization_investor_types FOR SELECT USING (true);


-- ── 2. DROP OLD TEXT ARRAY COLUMN ───────────────────────────

ALTER TABLE organizations DROP COLUMN IF EXISTS investor_type;


-- ── 3. AUM RANGE ASSIGNMENTS — IMPACT INVESTORS ─────────────
-- 54 orgs with AUM data from PII 456
-- Ranges: <$50M | $50M–$250M | $250M–$1B | $1B–$10B | $10B+

-- ─── $10B+ ──────────────────────────────────────────────────
-- Generation Investment Management  $19.8B
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$10B+')
WHERE name = 'Generation Investment Management';

-- ─── $1B – $10B ─────────────────────────────────────────────
-- FMO $4.1B | BlueOrchard $3.5B | Turner Impact $1.3B | Global Env Fund $1.0B
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$1B – $10B')
WHERE name IN (
  'FMO',
  'BlueOrchard Finance',
  'Turner Impact Capital',
  'Global Environment Fund'
);

-- ─── $250M – $1B ────────────────────────────────────────────
-- AP Moller $982M | Boston Community $860M | Creation $707M
-- Capital Impact $592M | Obviam $551M | SEAF $550M
-- Lyme Timber $550M | Triple Jump $539M | TriLinc $538M
-- Bain Capital DI $390M | Forest Co $355M | Accion $335M
-- Swedfund $324M | Root Capital $300M | Grassroots $300M
-- Low Income IF $281M
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name IN (
  'Boston Community Capital',
  'Creation Investments',
  'Capital Impact Partners',
  'Obviam',
  'SEAF',
  'Bain Capital Double Impact',
  'Accion',
  'Root Capital',
  'Grassroots Business Fund'
);
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'AP M%ller Capital%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'Lyme Timber%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'Triple Jump%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'TriLinc%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'Forest Company%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name = 'Swedfund' OR name = 'Swedfund International AB';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$250M – $1B')
WHERE name ILIKE 'Low Income Investment Fund%';

-- ─── $50M – $250M ───────────────────────────────────────────
-- PG Impact $210M | Acumen $196M | Nat'l Community IF $176M
-- SPARK $166M | Calvert $126M | Caspian $110M
-- Native Am VF $110M | Alter Equity $109M | MDIF $105M
-- Aiim $100M | Moringa $92M | LGT Impact $82M
-- GAWA $78M | DRK Foundation $65M | Greenmont $63M
-- Adobe Capital $61M | Vermont Works $50M
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name IN (
  'Acumen',
  'Caspian Impact Investments',
  'Media Development Investment Fund',
  'GAWA Capital',
  'Adobe Capital'
);
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'PG Impact%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'National Community Investment Fund%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'SPARK Ventures%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name = 'Calvert Impact' OR name ILIKE 'Calvert Impact Capital%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Native American Venture Fund%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Alter Equity%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Aiim Partners%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Moringa%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'LGT Impact%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Draper Richards Kaplan%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Greenmont Capital%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$50M – $250M')
WHERE name ILIKE 'Vermont Works%';

-- ─── < $50M ─────────────────────────────────────────────────
-- Oikocredit $37M | MCE Social $37M | Green Canopy $37M
-- EcoEnterprises $35M | Osiris $30M | 3Sisters $25M
-- LISC $24M | University VF $22M | Aravaipa $20M
-- Ignite $15M | Dev Equity $12M | SustainVC $12M
-- Secha $5M | Reinvestment Fund $4M | Treetops $1M | WaterEquity $1M
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name IN (
  'EcoEnterprises Fund',
  'The Osiris Group',
  'Secha Capital'
);
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Oikocredit%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'MCE Social Capital%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Green Canopy%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE '3Sisters%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Local Initiatives Support%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'University Venture Fund%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Aravaipa%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Ignite Fund%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Dev Equity%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'SustainVC%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'The Reinvestment Fund%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name ILIKE 'Treetops Capital%';
UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name = 'WaterEquity' OR name ILIKE 'WaterEquity%';


-- ── 4. AUM RANGE ASSIGNMENTS — FOUNDATIONS ──────────────────
-- Good Ventures ~$7.8B → $1B – $10B
-- Coefficient Giving ~$4B+ cumulative grants → $1B – $10B
-- Grameen Foundation $21M → < $50M

UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '$1B – $10B')
WHERE name IN ('Good Ventures', 'Coefficient Giving');

UPDATE organizations SET aum_range_id = (SELECT id FROM aum_ranges WHERE label = '< $50M')
WHERE name = 'Grameen Foundation';


-- ── 5. INVESTOR TYPE CLASSIFICATIONS ────────────────────────
-- Maps every Impact Investing org to one of the 6 investor types.
-- Classification rationale in comments.
--
-- Helper: reusable INSERT pattern
--   INSERT INTO organization_investor_types (organization_id, investor_type_id)
--   SELECT o.id, it.id FROM organizations o, investor_types it
--   WHERE o.name = '...' AND it.name = '...'
--   ON CONFLICT DO NOTHING;

-- ─── VC ─────────────────────────────────────────────────────
-- Early-stage / venture-style equity investors

-- Accion — seed-stage fintech VC (Accion Venture Lab)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Accion' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Acumen — nonprofit venture capital (patient capital, equity + debt)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Acumen' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Adobe Capital — mezzanine/growth capital for LatAm social enterprises
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Adobe Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Aavishkaar Capital — pioneer VC in India, early-stage impact
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Aavishkaar Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Ankur Capital — early-stage deep-tech VC, India
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Ankur Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Aravaipa Ventures — early-stage impact VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Aravaipa%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- DBL Partners — double bottom line VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'DBL Partners' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Dev Equity — early-stage impact VC in low-income countries
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Dev Equity%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Draper Richards Kaplan Foundation — venture philanthropy, early-stage
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Draper Richards Kaplan%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- EcoEnterprises Fund — venture fund for biodiversity businesses
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'EcoEnterprises Fund' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Elevar Equity — venture capital for financial inclusion
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Elevar Equity' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Greenmont Capital Partners — impact VC, health/energy/food
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Greenmont Capital%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- IGNIA Partners — VC for base-of-pyramid in Mexico
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'IGNIA Partners' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Ignite Fund — impact VC, Austin/Philippines
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Ignite Fund%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Media Development Investment Fund — venture capital for independent media
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Media Development Investment Fund' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Native American Venture Fund — VC for Native communities
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Native American Venture Fund%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- NewSchools Venture Fund — education VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'NewSchools Venture Fund' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Novastar Ventures — early-stage VC in Africa
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Novastar Ventures' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Omnivore — agritech VC, India
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Omnivore' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Quona Capital — fintech VC for emerging markets
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Quona Capital Management' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Secha Capital — patient capital VC, African SMEs
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Secha Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- SJF Ventures — impact VC, growth-stage
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'SJF Ventures' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- SustainVC — early-stage impact VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'SustainVC%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- The Impact Engine — impact VC, Chicago
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'The Impact Engine' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- The Lightsmith Group — climate adaptation VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'The Lightsmith Group' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- The Osiris Group — impact VC, climate/agriculture
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'The Osiris Group' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Treetops Capital — impact VC, microfinance equity
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Treetops Capital%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- University Venture Fund — university-linked impact VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'University Venture Fund%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Vermont Works Management — VC for Vermont businesses
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Vermont Works%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Vox Capital — impact VC, Brazil
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Vox Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Flint Atlantic Capital — impact VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Flint Atlantic Capital' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- Aiim Partners — climate tech VC
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Aiim Partners%' AND it.name = 'VC' ON CONFLICT DO NOTHING;

-- AlphaMundi Group — impact VC/debt (classify as VC — primarily equity)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'AlphaMundi Group' AND it.name = 'VC' ON CONFLICT DO NOTHING;


-- ─── GROWTH/PE ──────────────────────────────────────────────
-- Later-stage PE, buyout, growth equity, infrastructure

-- Actis — emerging market PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Actis' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Alter Equity — PE fund, social/environmental companies
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Alter Equity%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- AP Moller Capital — infrastructure/PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'AP M%ller Capital%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Arctaris Impact Investors — growth equity, US opportunity zones
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Arctaris Impact Investors' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Bain Capital Double Impact — PE, mission-driven companies
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Bain Capital Double Impact' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Bridges Fund Management — PE for underserved markets
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Bridges Fund Management' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Caspian Impact Investments — PE/debt in India
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Caspian Impact Investments' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- CIM Group — real estate / infrastructure PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'CIM Group' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Closed Loop Partners — circular economy PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Closed Loop Partners' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Creation Investments — PE/private credit, financial services
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Creation Investments' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Forest Company — PE, forest plantations
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Forest Company%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- GAWA Capital — PE, social entrepreneurs in EM
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'GAWA Capital' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Global Environment Fund — PE, energy/environment/sustainability
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Global Environment Fund' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Grassroots Business Fund — growth capital for SMEs
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Grassroots Business Fund' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Illumen Capital — fund of funds, PE-style
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Illumen Capital' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- KKR Global Impact — PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'KKR Global Impact' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- LGT Impact — growth capital for social enterprises
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'LGT Impact%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Lyme Timber Company — PE, timberland/conservation real estate
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Lyme Timber%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Meridiam — infrastructure PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Meridiam' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Moringa Partnership — PE, agroforestry
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Moringa%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- National Community Investment Fund — PE, mission-oriented banking
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'National Community Investment Fund%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Obviam — PE/fund of funds, development finance
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Obviam' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- PG Impact Investments — PE
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'PG Impact%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- SEAF — growth capital for SMEs in emerging markets
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'SEAF' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- TPG Rise — PE, large-scale impact
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'TPG Rise' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Turner Impact Capital — PE, real estate (education/health/housing)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Turner Impact Capital' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Wolfensohn Fund Management — PE/advisory
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Wolfensohn Fund Management' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Blue Earth Capital — growth equity, sustainability
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Blue Earth Capital' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Green Canopy — real estate impact investing
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Green Canopy%' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- Breakthrough Energy — climate PE/growth
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Breakthrough Energy' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;

-- LeapFrog Investments — growth equity, financial inclusion
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'LeapFrog Investments' AND it.name = 'Growth/PE' ON CONFLICT DO NOTHING;


-- ─── DEBT ───────────────────────────────────────────────────
-- CDFIs, microfinance lenders, credit funds, note issuers

-- BlueOrchard Finance — debt/microfinance asset manager
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'BlueOrchard Finance' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Boston Community Capital — CDFI, community lending
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Boston Community Capital' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Calvert Impact — community investment notes
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Calvert Impact' OR o.name ILIKE 'Calvert Impact Capital%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Capital Impact Partners — CDFI
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Capital Impact Partners' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Local Initiatives Support Corporation — CDFI
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Local Initiatives Support%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Low Income Investment Fund — CDFI
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Low Income Investment Fund%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- MCE Social Capital — loan guarantee model
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'MCE Social Capital%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Oikocredit — cooperative credit/microfinance
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Oikocredit%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Root Capital — agricultural lending
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Root Capital' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- SunFunder — solar energy debt
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'SunFunder' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- The Reinvestment Fund — CDFI
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'The Reinvestment Fund%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- Triple Jump — microfinance debt fund manager
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'Triple Jump%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- WaterEquity — water/sanitation debt
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'WaterEquity' OR o.name ILIKE 'WaterEquity%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;

-- SPARK Ventures — community development lending (nonprofit)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'SPARK Ventures%' AND it.name = 'Debt' ON CONFLICT DO NOTHING;


-- ─── ACCELERATOR/INCUBATOR ──────────────────────────────────

-- Agora Partnerships — LatAm impact accelerator
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Agora Partnerships' AND it.name = 'Accelerator/Incubator' ON CONFLICT DO NOTHING;

-- Co-Creation Hub (CcHUB) — tech innovation hub, Nigeria
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Co-Creation Hub (CcHUB)' AND it.name = 'Accelerator/Incubator' ON CONFLICT DO NOTHING;

-- SELCO Solar — incubator + enterprise builder
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'SELCO Solar' AND it.name = 'Accelerator/Incubator' ON CONFLICT DO NOTHING;


-- ─── INVESTMENT BANK ────────────────────────────────────────
-- Large financial institutions with dedicated impact arms

-- BlackRock — asset manager with impact strategies
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'BlackRock' AND it.name = 'Investment Bank' ON CONFLICT DO NOTHING;

-- Credit Suisse — impact advisory & investing (now UBS)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Credit Suisse' AND it.name = 'Investment Bank' ON CONFLICT DO NOTHING;

-- Morgan Stanley — Institute for Sustainable Investing
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Morgan Stanley' AND it.name = 'Investment Bank' ON CONFLICT DO NOTHING;

-- UBS Group — sustainable finance / impact
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'UBS Group' AND it.name = 'Investment Bank' ON CONFLICT DO NOTHING;

-- Asian Development Bank — multilateral development bank
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Asian Development Bank' AND it.name = 'Investment Bank' ON CONFLICT DO NOTHING;


-- ─── MULTI-TYPE ─────────────────────────────────────────────
-- DFIs, diversified platforms, public + private equity, fund of funds

-- FMO — Dutch DFI: equity + debt + guarantees + fund of funds
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'FMO' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- Generation Investment Management — public equity + PE + land restoration
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Generation Investment Management' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- Swedfund — DFI: equity + loans + fund of funds
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Swedfund' OR o.name = 'Swedfund International AB' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- Big Society Capital — social investment wholesaler: equity + debt
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Big Society Capital' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- 3Sisters Sustainable Management — hedge fund / multi-strategy
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE '3Sisters%' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- TriLinc Global — multi-asset class (trade finance + PE + real assets)
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name ILIKE 'TriLinc%' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- AXA Investment Managers — diversified asset manager
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'AXA Investment Managers' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;

-- Women's World Banking Asset Management — diversified: funds + advisory
INSERT INTO organization_investor_types (organization_id, investor_type_id)
SELECT o.id, it.id FROM organizations o, investor_types it
WHERE o.name = 'Women''s World Banking Asset Management' AND it.name = 'Multi-type' ON CONFLICT DO NOTHING;


-- ── 6. VERIFICATION QUERIES ─────────────────────────────────
-- Run after COMMIT to confirm:
--
-- AUM range distribution:
--   SELECT ar.label, ar.sort_order, COUNT(o.id)
--   FROM aum_ranges ar
--   LEFT JOIN organizations o ON o.aum_range_id = ar.id
--   GROUP BY ar.label, ar.sort_order
--   ORDER BY ar.sort_order;
--
-- Investor type distribution:
--   SELECT it.name, COUNT(*) FROM organization_investor_types oit
--   JOIN investor_types it ON it.id = oit.investor_type_id
--   GROUP BY it.name ORDER BY count DESC;
--
-- Orgs with AUM range:
--   SELECT o.name, ar.label FROM organizations o
--   JOIN aum_ranges ar ON ar.id = o.aum_range_id
--   ORDER BY ar.sort_order DESC, o.name;
--
-- Impact orgs missing investor type classification:
--   SELECT o.name FROM organizations o
--   JOIN org_types ot ON ot.id = o.org_type_id
--   LEFT JOIN organization_investor_types oit ON oit.organization_id = o.id
--   WHERE ot.name = 'Impact Investing' AND oit.organization_id IS NULL;

COMMIT;
