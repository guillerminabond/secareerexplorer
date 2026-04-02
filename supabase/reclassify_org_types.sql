-- ============================================================
-- Reclassify "Impact Investing / Foundation" into two distinct types
-- Run in Supabase SQL Editor
-- ============================================================

-- Step 1: Add the two new org types
INSERT INTO org_types (name) VALUES ('Impact Investing') ON CONFLICT (name) DO NOTHING;
INSERT INTO org_types (name) VALUES ('Foundation')       ON CONFLICT (name) DO NOTHING;

-- Step 2: Reclassify — Impact Investing orgs
-- (venture capital, patient capital, investment funds, DFIs, catalytic finance)
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Impact Investing')
WHERE name IN (
  'Acumen',
  'Allied Climate Partners',
  'Calvert Impact Capital',
  'Camelback Ventures',
  'Charter School Growth Fund',
  'Clean Energy Ventures',
  'Generation Investment Management',
  'Global Energy Alliance for People and Planet (GEAPP)',
  'Grassroots Business Fund',
  'IDB Lab',
  'International Finance Corporation (IFC)',
  'Jasmine Social Investments',
  'LeapFrog Investments',
  'Living Cities',
  'New Profit',
  'NewSchools Venture Fund',
  'Omidyar Network',
  'Prime Coalition',
  'Quona Capital',
  'REDF',
  'Rethink Education',
  'Rippleworks',
  'Root Capital',
  'Village Capital'
);

-- Step 3: Reclassify — Foundation orgs
-- (traditional grant-making and philanthropic foundations)
UPDATE organizations
SET org_type_id = (SELECT id FROM org_types WHERE name = 'Foundation')
WHERE name IN (
  'A Better Chicago',
  'Annie E. Casey Foundation',
  'Arnold Ventures',
  'Bezos Earth Fund',
  'Bloomberg Philanthropies',
  'Blue Meridian Partners',
  'Carnegie Corporation of New York',
  'Children''s Investment Fund Foundation (CIFF)',
  'CityBridge Education',
  'Conrad N. Hilton Foundation',
  'Cystic Fibrosis Foundation',
  'Dasra',
  'Deshpande Foundation',
  'Draper Richards Kaplan Foundation',
  'Echoing Green',
  'ECMC Foundation',
  'Ellen MacArthur Foundation',
  'Ford Foundation',
  'Fundação Lemann',
  'Gates Foundation',
  'George Kaiser Family Foundation',
  'GHR Foundation',
  'Gordon and Betty Moore Foundation',
  'Grantham Foundation for the Protection of the Environment',
  'Hevolution Foundation',
  'Howard G. Buffett Foundation',
  'Howard Hughes Medical Institute',
  'J. Paul Getty Trust',
  'Jacobs Foundation',
  'James Irvine Foundation',
  'John S. and James L. Knight Foundation',
  'Joyce Foundation',
  'Kaiser Family Foundation',
  'Kresge Foundation',
  'LEGO Foundation',
  'Lumina Foundation',
  'MacArthur Foundation',
  'Markle Foundation',
  'Mastercard Foundation',
  'McKnight Foundation',
  'Michael & Susan Dell Foundation',
  'Misk Foundation',
  'Mulago Foundation',
  'Multiple Myeloma Research Foundation (MMRF)',
  'Open Philanthropy',
  'Open Society Foundations',
  'Patrick J. McGovern Foundation',
  'Pershing Square Foundation',
  'Peter G. Peterson Foundation',
  'Pew Charitable Trusts',
  'Pharo Foundation',
  'Robin Hood Foundation',
  'Rockefeller Foundation',
  'Sandberg Goldberg Bernthal Family Foundation',
  'Simons Foundation',
  'Skoll Foundation',
  'The Boston Foundation',
  'The Families and Workers Fund',
  'Wallace Foundation',
  'Walton Family Foundation',
  'Wellcome Trust',
  'WHO Foundation',
  'William and Flora Hewlett Foundation'
);

-- Step 4: Remove the old combined type (optional — only if no orgs still use it)
-- DELETE FROM org_types WHERE name = 'Impact Investing / Foundation';
-- ^ Uncomment only after verifying the count below is 0

-- Step 5: Verify
SELECT ot.name AS org_type, COUNT(o.id) AS count
FROM org_types ot
LEFT JOIN organizations o ON o.org_type_id = ot.id
GROUP BY ot.name
ORDER BY count DESC;

-- Check any orgs still on old type:
SELECT name FROM organizations
WHERE org_type_id = (SELECT id FROM org_types WHERE name = 'Impact Investing / Foundation');
