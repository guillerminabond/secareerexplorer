-- ============================================================
-- Fix org_types for PII 456 HBS-affiliated orgs
-- Splits "Impact Investing / Foundation" into separate types
-- Run AFTER add_pii456_hbs_notes.sql
-- ============================================================

BEGIN;

-- Add new org_types (idempotent)
INSERT INTO org_types (name) VALUES ('Impact Investing') ON CONFLICT DO NOTHING;
INSERT INTO org_types (name) VALUES ('Foundation') ON CONFLICT DO NOTHING;

-- Reclassify the 28 investment-focused orgs to 'Impact Investing'
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Impact Investing')
WHERE name IN (
  'AXA Investment Managers',
  'Actis',
  'Ankur Capital',
  'Arctaris Impact Investors',
  'Big Society Capital',
  'BlackRock',
  'Breakthrough Energy',
  'Bridges Fund Management',
  'CIM Group',
  'Closed Loop Partners',
  'Credit Suisse',
  'DBL Partners',
  'Elevar Equity',
  'Illumen Capital',
  'KKR Global Impact',
  'Meridiam',
  'Morgan Stanley',
  'Quona Capital Management',
  'SELCO Solar',
  'SJF Ventures',
  'SunFunder',
  'TPG Rise',
  'The Impact Engine',
  'The Lightsmith Group',
  'UBS Group',
  'WaterEquity',
  'Wolfensohn Fund Management',
  'Women''s World Banking Asset Management'
);

-- Reclassify remaining "Impact Investing / Foundation" orgs to 'Impact Investing'
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Impact Investing')
WHERE id IN (
  '7bc5beff-1ee7-4a8e-81ac-058b32328509',  -- Adobe Capital
  '9f7acb29-4656-4b73-9de9-09b10aa00a98',  -- Novastar Ventures
  '80c2ab0f-bebd-44a2-8ec7-a5aa93eb749c',  -- Secha Capital
  '2bc80d26-566f-43e3-9b2d-ade33f33d05c',  -- BlueOrchard Finance
  'f5aad0cd-2fb5-4e43-bd04-bb3e6d7f65c1',  -- Vox Capital
  '64eedcf2-c8f7-4b7d-8634-4a8f36c0e7c6',  -- GAWA Capital
  'ba82296d-7633-4679-8367-9e0715b14c10',  -- Omnivore
  'f919e8f2-dd56-4933-8096-e13a806d90b8',  -- Caspian Impact Investments
  '6f796e9f-4fd8-4d04-b908-93732f59701e',  -- EcoEnterprises Fund
  '1c1c76d8-4240-4906-970c-6cd877c381e9',  -- SEAF
  '42030511-88e7-4c8c-9254-e5337665cd47',  -- Creation Investments
  '9f2a60ed-0680-4f38-a3fd-db9c0ef0889d',  -- Global Environment Fund
  'b37cc86e-8b78-42f3-8c5e-8b725afa03c3',  -- Flint Atlantic Capital
  '74f75503-2bc3-4b75-8140-142771e8ea05',  -- Blue Earth Capital
  'cca81fa0-294d-4141-8ddb-5e7ceca331a1',  -- Obviam
  'fe6af6a6-6750-4648-9536-80e9babcf1f0',  -- Aavishkaar Capital
  'c766f38f-afde-4acb-b94f-d05b04647625',  -- Bain Capital Double Impact
  'b9a7f71b-fa55-414a-b999-d27df6744b3c',  -- IGNIA Partners
  '323e196d-f280-4d42-a1f2-dccc2bf6c399'   -- Turner Impact Capital
);

-- Reclassify foundations (primarily grantmaking) to 'Foundation'
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Foundation')
WHERE id IN (
  '0b46dc51-cab0-41cd-90bf-aec6479d4ed4',  -- Good Ventures
  'baf8ea88-6254-41ce-8471-4131946b500f'   -- Coefficient Giving
);

-- Reclassify Grameen Foundation to 'Foundation'
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Foundation')
WHERE name = 'Grameen Foundation';

COMMIT;
