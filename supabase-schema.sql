-- ============================================================
-- HBS Social Enterprise Explorer — Normalized Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. LOOKUP TABLES ────────────────────────────────────────

CREATE TABLE org_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE cause_areas (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE role_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE target_populations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE employee_ranges (
  id SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL,
  sort_order INTEGER
);

-- ── 2. SEED LOOKUP TABLES ───────────────────────────────────

INSERT INTO org_types (name) VALUES
  ('Nonprofit'),
  ('Impact Investing / Foundation'),
  ('Hybrid'),
  ('Government / Public Sector'),
  ('B Corporation'),
  ('Cooperative');

INSERT INTO cause_areas (name) VALUES
  ('Poverty Alleviation'),
  ('Economic Development'),
  ('Global Health'),
  ('Education'),
  ('Climate & Energy'),
  ('Gender & Social Justice'),
  ('Financial Inclusion'),
  ('Housing & Community'),
  ('Arts & Culture');

INSERT INTO role_types (name) VALUES
  ('Operator'),
  ('Funder'),
  ('Enabler'),
  ('Advocacy & Policy');

INSERT INTO regions (name) VALUES
  ('Global'),
  ('North America'),
  ('US National'),
  ('Northeast'),
  ('Southeast'),
  ('Midwest'),
  ('West'),
  ('Sub-Saharan Africa'),
  ('East Africa'),
  ('West Africa'),
  ('Southern Africa'),
  ('South Asia'),
  ('East Asia'),
  ('Southeast Asia'),
  ('Middle East & North Africa'),
  ('Latin America'),
  ('Europe'),
  ('Central Asia');

INSERT INTO target_populations (name) VALUES
  ('People in Poverty'),
  ('Women & Girls'),
  ('Children'),
  ('Youth & Teenagers'),
  ('Smallholder Farmers'),
  ('Migrants & Refugees'),
  ('Families'),
  ('LGBTQ+'),
  ('People with Disabilities'),
  ('Indigenous Communities'),
  ('Elderly');

INSERT INTO employee_ranges (label, sort_order) VALUES
  ('1–10',    1),
  ('11–50',   2),
  ('51–200',  3),
  ('201–500', 4),
  ('501–1000',5),
  ('1000+',   6);

-- ── 3. ORGANIZATIONS TABLE ──────────────────────────────────

CREATE TABLE organizations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  website          TEXT,
  org_type_id      INTEGER REFERENCES org_types(id),
  employee_range_id INTEGER REFERENCES employee_ranges(id),
  hiring_status    TEXT,
  size             TEXT,
  hq               TEXT,
  year_established TEXT,
  hbs_note         TEXT,
  hbs_relevance    TEXT,
  notable_alumni   TEXT,
  created_date     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. JUNCTION TABLES (many-to-many) ───────────────────────

CREATE TABLE organization_cause_areas (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  cause_area_id   INTEGER REFERENCES cause_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, cause_area_id)
);

CREATE TABLE organization_role_types (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_type_id    INTEGER REFERENCES role_types(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, role_type_id)
);

CREATE TABLE organization_regions (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  region_id       INTEGER REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, region_id)
);

CREATE TABLE organization_target_populations (
  organization_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  target_population_id INTEGER REFERENCES target_populations(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, target_population_id)
);

-- ── 5. ROW LEVEL SECURITY ───────────────────────────────────

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE cause_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_populations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_cause_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_role_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_target_populations ENABLE ROW LEVEL SECURITY;

-- Public read on everything
CREATE POLICY "Public read" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read" ON org_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON cause_areas FOR SELECT USING (true);
CREATE POLICY "Public read" ON role_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON regions FOR SELECT USING (true);
CREATE POLICY "Public read" ON target_populations FOR SELECT USING (true);
CREATE POLICY "Public read" ON employee_ranges FOR SELECT USING (true);
CREATE POLICY "Public read" ON organization_cause_areas FOR SELECT USING (true);
CREATE POLICY "Public read" ON organization_role_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON organization_regions FOR SELECT USING (true);
CREATE POLICY "Public read" ON organization_target_populations FOR SELECT USING (true);

-- Full write via anon key (admin page uses password protection in app)
CREATE POLICY "All write" ON organizations FOR ALL USING (true);
CREATE POLICY "All write" ON organization_cause_areas FOR ALL USING (true);
CREATE POLICY "All write" ON organization_role_types FOR ALL USING (true);
CREATE POLICY "All write" ON organization_regions FOR ALL USING (true);
CREATE POLICY "All write" ON organization_target_populations FOR ALL USING (true);

-- ── 6. CSV IMPORT MIGRATION (run AFTER importing your CSV) ──
-- If you import your existing 400 records via CSV, run this to
-- populate the junction tables from any comma-separated columns.
-- Adjust column names to match your CSV import.

-- Example: if your CSV has org_type as text, link it:
-- UPDATE organizations o
-- SET org_type_id = ot.id
-- FROM org_types ot
-- WHERE o.org_type_text = ot.name;

-- For array fields exported as semicolons (e.g. "Education;Global Health"):
-- INSERT INTO organization_cause_areas (organization_id, cause_area_id)
-- SELECT o.id, ca.id
-- FROM organizations o,
--      unnest(string_to_array(o.cause_areas_text, ';')) AS tag,
--      cause_areas ca
-- WHERE trim(tag) = ca.name
-- ON CONFLICT DO NOTHING;
