-- ============================================================
-- PII 456: Add/update HBS notes for impact investing firms
-- Source: PII 456 - SEI Tool - 4.28.26 v2.xlsx (HBS Affiliation sheet)
-- ============================================================

BEGIN;

-- ============================================================
-- PART 0: Add new org_types (idempotent)
-- ============================================================

INSERT INTO org_types (name) VALUES ('Impact Investing') ON CONFLICT DO NOTHING;
INSERT INTO org_types (name) VALUES ('Foundation') ON CONFLICT DO NOTHING;

-- ============================================================
-- PART 1: UPDATE hbs_note for existing organizations
-- ============================================================

UPDATE organizations SET hbs_note = 'Featured in multiple HBS case studies on microfinance/impact investing in India; Vineet Rai (founder) has HBS ties' WHERE name = 'Aavishkaar Capital';
UPDATE organizations SET hbs_note = 'HBS case study exists; Harvard-affiliated origins; leadership and staff has HBS alumni' WHERE name = 'Accion';
UPDATE organizations SET hbs_note = 'HBS case studies exists; Jacqueline Novogratz (founder) featured in HBS curriculum; strong HBS alumni network. Brian Trelstad (faculty) and Sasha Dichter (MBA, then founded 60decibels) were part of leadership team.' WHERE name = 'Acumen';
UPDATE organizations SET hbs_note = 'Bain Capital widely has HBS alumni; Double Impact team includes HBS graduates' WHERE name = 'Bain Capital Double Impact';
UPDATE organizations SET hbs_note = 'Endeavor Global/Catalyst has strong HBS alumni ties; 4x HBS case studies on Endeavor''s model' WHERE name = 'Endeavor';
UPDATE organizations SET hbs_note = 'Al Gore (co-founder) is Harvard alum; David Blood (co-founder) has HBS connections; HBS case study on Generation IM''s sustainability thesis' WHERE name = 'Generation Investment Management';
UPDATE organizations SET hbs_note = 'HBS case study exists on Habitat for Humanity''s financing model and social enterprise' WHERE name = 'Habitat for Humanity';
UPDATE organizations SET hbs_note = 'Founder Alvaro Rodriguez Arregui (MBA) is now HBS Exec Fellow' WHERE name = 'IGNIA Partners';
UPDATE organizations SET hbs_note = 'HBS case study on LeapFrog Investments; Andrew Kuper (founder) won Henry Fellowship at Harvard; featured in HBS impact curriculum' WHERE name = 'LeapFrog Investments';
UPDATE organizations SET hbs_note = 'HBS case study on NewSchools and education-focused venture philanthropy' WHERE name = 'NewSchools Venture Fund';
UPDATE organizations SET hbs_note = 'HBS case study on Root Capital; featured prominently in HBS impact investing curriculum. Mike McCreless (ImpactFrontiers, ex-Root Capital) is an HBS alum' WHERE name = 'Root Capital';
UPDATE organizations SET hbs_note = 'Bobby Turner (founder) has Harvard ties; founded Turner-MIINT competition' WHERE name = 'Turner Impact Capital';
UPDATE organizations SET hbs_note = 'Vox Capital featured in HBS Brazil impact investing discussions' WHERE name = 'Vox Capital';
UPDATE organizations SET hbs_note = 'Tracy Palandjian (founder) and Kirstin Hill (COO) are Harvard alums. Tracy serves on Harvard Corporation. HBS case on Social Finance.' WHERE name = 'Social Finance';
UPDATE organizations SET hbs_note = 'HBS case studies on TNC''s conservation finance; senior leadership includes HBS alumni; prominent in HBS curriculum' WHERE name = 'The Nature Conservancy';
UPDATE organizations SET hbs_note = 'Has hosted HBS MBA students as interns' WHERE name = 'Calvert Impact Capital';
UPDATE organizations SET hbs_note = 'HBS case studies on IFC; World Bank Group arm featured extensively in HBS development finance curriculum' WHERE name = 'International Finance Corporation';
UPDATE organizations SET hbs_note = 'Rob Kaplan (faculty emeritus) is chair of DRK and HBS alum.' WHERE name = 'Draper Richards Kaplan Foundation';

-- ============================================================
-- PART 2: INSERT new organizations with HBS notes
-- ============================================================

-- -- 1. AXA Investment Managers ---------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'AXA Investment Managers',
  'AXA Investment Managers is a multi-expert asset management company within the AXA Group. The firm is based in Puteaux, France and was founded in 1994.',
  '',
  'Puteaux, France',
  '1994',
  'AXA IM has HBS alumni in leadership; major institutional ESG/impact investor covered in HBS cases',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'AXA Investment Managers');

-- -- 2. Actis ---------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Actis',
  'Founded in 2004, Actis is a private equity firm based in London, United Kingdom. The firm prefers to invest in the consumer, energy, infrastructure, financial services, healthcare, industrial and real estate sectors.',
  '',
  'London, United Kingdom',
  '2004',
  'Actis has HBS alumni in senior roles; featured in HBS emerging markets private equity discussions',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '201–500'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Actis');

-- -- 3. Ankur Capital -------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Ankur Capital',
  'Ankur Capital is an early stage venture capital fund that invests in opportunities created by rising aspirations and digital access for the next billion Indians. The firm invests in technologies and product innovations in agriculture, healthcare, education and other areas with the potential to create large-scale impact. The in-house team partners with portfolio companies to accelerate their growth. The firm has invested in fourteen companies across these sectors. It is based in Mumbai, India ...',
  '',
  'Mumbai, India',
  '2012',
  'Rema Subramanian (co-founder) is HBS alumna',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Ankur Capital');

-- -- 4. Arctaris Impact Investors -------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Arctaris Impact Investors',
  '',
  '',
  'Massachusetts, MA',
  '',
  'Jonathan Tower (co-founder) is HBS alumnus; Opportunity Zone investing',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Arctaris Impact Investors');

-- -- 5. Big Society Capital -------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Big Society Capital',
  'Big Society Capital is a banking institution based at London, United Kingdom. This is an independent social investment institution that provides finance to organizations that support frontline social sector entities tackling social issues to help them grow. The investment committee board is responsible for making investments and for the performance of Big Society Capital''s portfolio of investments and reports its activities to the Board.',
  '',
  'London, United Kingdom',
  '2011',
  'Nick O''Donohoe (HKS Fellow) was CEO for 5 yrs',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Big Society Capital');

-- -- 6. BlackRock -----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'BlackRock',
  'Founded in 1988, BlackRock is an asset manager and private equity firm based in New York, New York. The firm provides a wide range of services such as investment banking, risk management, advisory, equity, fixed income, balanced portfolios, and asset management. The firm seeks to invest in real estate, education, retail, energy, healthcare, materials, financial services, software, and information technology sectors.',
  '',
  'New York, NY',
  '1988',
  'Larry Fink has spoken at HBS; BlackRock''s Larry Fink letters on ESG featured in HBS curriculum; HBS alumni throughout leadership',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'BlackRock');

-- -- 7. Breakthrough Energy -------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Breakthrough Energy',
  'Breakthrough Energy Ventures is an angel group. The firm is an investment vehicle that The Breakthrough Energy Coalition has created that aims to provide flexible capital to cleantech companies.',
  '',
  'Kirkland, WA',
  '2016',
  'Bill Gates-founded; HBS faculty advisory involvement; HBS alumni on staff',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Breakthrough Energy');

-- -- 8. Bridges Fund Management ---------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Bridges Fund Management',
  'Bridges Fund Management is a asset manager that is dedicated to using an impact-driven investment approach to create returns for both investors and society at large. The firm was founded in 2002 and is based in London, United Kingdom. It seeks to invest in the healthcare, education, living and market sectors.',
  '',
  'London, United Kingdom',
  '2002',
  'HBS case study exists on Bridges Fund Management; founders have UK/Harvard ties. Brian Trelstad (facultly) is partner.',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Bridges Fund Management');

-- -- 9. CIM Group -----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'CIM Group',
  'Founded in 1994, CIM Group is a real estate investment firm based in Los Angeles, California. The firm prefers to invest in the multifamily, office, retail, hotel and leisure sectors. The firm follows value add, opportunistic, and debt risk strategy.',
  '',
  'Los Angeles, CA',
  '1994',
  'Leadership team includes HBS alumni: Jason Schreiber (MBA)',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'CIM Group');

-- -- 10. Closed Loop Partners ------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Closed Loop Partners',
  'Closed Loop Partners is an investment firm that has been formed with invested capital from manufacturers, consumer goods companies, retailers and recyclers who are committed to help cities in North America in order to achieve high recycling rates. The firm will provide loans to municipalities to build recycling infrastructure for their communities which will, in turn, provide more recycled content to companies'' manufacturing supply chain and reduce the economic and environmental costs of the ...',
  '',
  'New York, NY',
  '2014',
  'Featured on Climate Rising podcast and several HBS op-eds',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Closed Loop Partners');

-- -- 11. Credit Suisse -------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Credit Suisse',
  'Credit Suisse is an investment banking and asset management firm that provides a wide range of services such as private banking, wealth management, portfolio management and financial advisory to private and corporate clients. The firm was founded in 1856 and is headquartered in Zurich, Switzerland. It also manages hedge funds.',
  '',
  'Zurich, Switzerland',
  '1997',
  'Credit Suisse has extensive HBS alumni in leadership; CS impact investing unit featured in HBS cases',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Credit Suisse');

-- -- 12. DBL Partners --------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'DBL Partners',
  'DBL Partners is a venture capital firm. The firm is based in San Francisco, California and was founded in 2015. DBL uses venture capital to accelerate innovation in a way that affects an organization''s social impact as well as its financial success. It prefers to invest in the clean tech, information technology, sustainable products and services and healthcare sectors.',
  '',
  'San Francisco, CA',
  '2003',
  'Nancy Pfund (founder) widely covered in Harvard impact investing curriculum; HBS case study on DBL',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'DBL Partners');

-- -- 13. Elevar Equity -------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Elevar Equity',
  'Founded in 2008, Elevar Equity is a venture capital firm based in Seattle, Washington. The firm invests in companies at various stages of its growth for the long term.',
  '',
  'Seattle, WA',
  '2006',
  'Maya Chorengel (MBA, founder) is an alum who now leads TPG Rise funds',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Elevar Equity');

-- -- 15. Grameen Foundation --------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Grameen Foundation',
  'Grameen Foundation is a non-commercial organization which intends to help the world''s poor address their own unique needs. It focuses on harnessing the underappreciated strengths of the poor. The firm was founded in 1997 and is based in Washington, District of Columbia with additional offices in The United States, Africa, Asia, and Latin America and the Caribbean.',
  '',
  'Washington, DC',
  '1997',
  'Several Grameen-related orgs are HBS case study subjects',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Foundation'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Grameen Foundation');

-- -- 16. Illumen Capital -----------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Illumen Capital',
  'Illumen Capital is an impact investment firm that combines cutting-edge research and immersive place-based experiences to generate financial returns and systems-level impact. The firm is based in Oakland, California.',
  '',
  'Oakland, CA',
  '',
  'HBS case study on Illumen Capital and bias in investing',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Illumen Capital');

-- -- 17. KKR Global Impact ---------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'KKR Global Impact',
  '',
  '',
  'New York, NY',
  '',
  'KKR has numerous HBS alumni; Global Impact fund team includes HBS graduates; HBS case studies on KKR',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'KKR Global Impact');

-- -- 19. Meridiam ------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Meridiam',
  'Founded in 2005, Meridiam Infrastructure is an infrastructure investor based in Paris, France. The firm seeks to invest in mobility, energy transition and environment and social sectors.',
  '',
  'Paris, France',
  '',
  'HBS case by Shawn Cole',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '51–200'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Meridiam');

-- -- 20. Morgan Stanley ------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Morgan Stanley',
  'Morgan Stanley is a global financial services provider and an investment bank that serves a diversified group of corporations, governments, financial institutions and individuals. The firm operates in three segments: Institutional Securities, Global Wealth Management Group and Asset Management.',
  '',
  'New York, NY',
  '1924',
  'Morgan Stanley Investing with Impact featured in HBS cases; Audrey Choi (former CSO) is HBS alumna; extensive HBS alumni leadership',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Morgan Stanley');

-- -- 21. Quona Capital Management --------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Quona Capital Management',
  'Quona Capital is a financial technology venture capital firm that prefers to invest in entrepreneurs and growth-oriented businesses. The firm focuses on investments in the Sub-Saharan Africa, Latin America, and Asia.It is based in Washington DC, District of Columbia and was founded in 2014.',
  '',
  'Washington, DC',
  '2015',
  'Team includes HBS alum; Takafumi Yamada',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Quona Capital Management');

-- -- 22. SELCO Solar ---------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'SELCO Solar',
  '',
  '',
  'Bengaluru, India',
  '1995',
  'SELCO featured in HBS social enterprise case studies',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'SELCO Solar');

-- -- 23. SJF Ventures --------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'SJF Ventures',
  'SJF Ventures is an expansion-stage venture capital firm that focuses on the clean energy and efficiency, asset recovery and recycling, food and sustainable agriculture, education, health and wellness, consumer and enterprise software sectors. The firm was established in 1999 and is based in Durham, North Carolina.',
  '',
  'Durham, NC',
  '1999',
  'HBS case by Shawn Cole',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'SJF Ventures');

-- -- 23. SunFunder -----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'SunFunder',
  'SunFunder is a debt financing partner for solar companies active in off-grid residential, commercial and industrial and other solar opportunities in emerging and frontier markets. The firm is also an energy finance business with a mission to provide financing for solar assets in emerging economies, including inventory, working capital, construction and structured finance loans. It was founded in 2012 and is based in Nairobi, Kenya.',
  '',
  'San Francisco, CA',
  '2012',
  'Ryan Levinson (co-founder) is HBS alumnus; solar financing in Africa featured in HBS impact cases',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'SunFunder');

-- -- 26. TPG Rise ------------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'TPG Rise',
  '',
  '',
  'San Francisco, CA',
  '2016',
  'TPG Rise (TPG''s impact platform) has HBS alumni leadership; featured in HBS discussions on mainstreaming impact investing',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'TPG Rise');

-- -- 27. The Impact Engine ---------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'The Impact Engine',
  'Impact Engine is a venture capital and private equity investment firm focused on growing companies that generate positive outcomes in education, health, economic empowerment and environmental sustainability. Women-owned and led, Impact Engine began as an accelerator for social entrepreneurs in 2012. The firm shifted to managing venture capital funds in 2015 and expanded into private equity in 2018. Impact Engine Ventures invests in seed and series A stage software companies with products that...',
  '',
  'Chicago, IL',
  '2012',
  'Priya Parrish and Jessica Droste Yagan (co-founders) have HBS faculty connections; Chicago-based impact VC with HBS alumni',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'The Impact Engine');

-- -- 28. The Lightsmith Group ------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'The Lightsmith Group',
  'The Lightsmith Group is a private equity firm that pursues superior financial returns along with measurable social and environmental impacts by investing in companies that address major societal needs. The firm seeks to invest in the technology-enabled business services and solutions in the areas of energy, water, food and agriculture, and climate resilience solutions.',
  '',
  'San Francisco, CA',
  '',
  'Jay Koh (co-founder/managing partner) is Harvard alumnus; climate resilience investing',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'The Lightsmith Group');

-- -- 28. UBS Group -----------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'UBS Group',
  'UBS is a global firm providing financial services to private, corporate and institutional clients. The company provides wealth management services, personal and corporate banking services, asset management services and investment banking services. The company employs about 60,000 people and has nearly 900 offices in more than 50 countries. The firm seeks to expand its operations globally through mergers and acquisitions.',
  '',
  'Zurich, Switzerland',
  '1862',
  'UBS has HBS alumni in leadership; Andrew Lee (Harvard College)',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1000+'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'UBS Group');

-- -- 31. WaterEquity ---------------------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'WaterEquity',
  'WaterEquity is an impact investment manager that is dedicated to ending the water crisis, with an exclusive focus on raising and deploying capital to financial institutions and water and sanitation enterprises in emerging markets. The firm based in Kansas City, Missouri and was founded in 2016.',
  '',
  'Kansas City, MO',
  '',
  'WaterEquity featured in HBS case on water access finance',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '1–10'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'WaterEquity');

-- -- 32. Wolfensohn Fund Management ------------------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Wolfensohn Fund Management',
  'Wolfensohn Fund Management was a private equity firm that primarily invested in the financial service sector. The firm was founded in 2008 and had offices in New York, London and New Delhi.',
  '',
  'New York, NY',
  '2007',
  'James Wolfensohn was an HBS alum; World Bank connections; HBS case study material',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Wolfensohn Fund Management');

-- -- 33. Womens World Banking Asset Management -------------
INSERT INTO organizations (name, description, website, hq, year_established,
  hbs_note, notable_alumni, org_type_id, employee_range_id)
SELECT
  'Women''s World Banking Asset Management',
  'Provider of financial services for women power development. The company provides financial tools and resources essential for the security and prosperity of low-income women. It provides market research to learn what financial products and information low-income women need and develop innovative, practical ways for institutions to do business with women.',
  '',
  'New York, NY',
  '1976',
  'HBS case study on Women''s World Banking; featured in HBS gender lens investing curriculum',
  '',
  ot.id, er.id
FROM org_types ot, employee_ranges er
WHERE ot.name = 'Impact Investing'
  AND er.label = '11–50'
  AND NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Women''s World Banking Asset Management');

COMMIT;