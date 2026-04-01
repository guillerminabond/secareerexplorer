-- ═════════════════════════════════════════════════════════════════════════════
-- tag_cause_subtopics.sql
--
-- Assigns cause sub-segments to all Operator-type organizations using
-- keyword matching on org name + description.
--
-- Prerequisites: add_cause_subtopics.sql must have been run first.
--
-- Scope: Nonprofit, Hybrid, B Corporation, Government / Public Sector,
--        Cooperative — intentionally excludes Impact Investing, Foundation,
--        and Impact Investing / Foundation orgs (too broad to tag precisely).
--
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO organization_cause_subtopics (organization_id, cause_subtopic_id)
SELECT DISTINCT o.id, cs.id
FROM organizations o
JOIN org_types          ot  ON ot.id  = o.org_type_id
JOIN organization_cause_areas oca ON oca.organization_id = o.id
JOIN cause_areas        ca  ON ca.id  = oca.cause_area_id
JOIN cause_subtopics    cs  ON cs.cause_area_id = ca.id
WHERE ot.name NOT IN ('Impact Investing', 'Foundation', 'Impact Investing / Foundation')
  AND (

  -- ──────────────────────────────────────────────────────────────────────────
  -- EDUCATION
  -- ──────────────────────────────────────────────────────────────────────────

    (ca.name = 'Education' AND cs.name = 'K–12 Reform' AND (
      o.description ILIKE '%K-12%' OR o.description ILIKE '%K–12%'
      OR o.description ILIKE '%charter school%' OR o.name ILIKE '%charter%'
      OR o.description ILIKE '%elementary school%'
      OR o.description ILIKE '%middle school%' OR o.description ILIKE '%high school%'
      OR o.description ILIKE '%secondary school%' OR o.description ILIKE '%grade school%'
      OR o.description ILIKE '%out-of-school children%'
      OR o.description ILIKE '%accelerated%education%'
      OR o.name ILIKE '%KIPP%' OR o.name ILIKE '%Uncommon Schools%'
      OR o.name ILIKE '%Success Academy%' OR o.name ILIKE '%Teach For%'
      OR o.name ILIKE '%Bridge International%' OR o.name ILIKE '%Luminos%'
      OR o.name ILIKE '%TaRL%' OR o.name ILIKE '%Teach at the Right Level%'
    ))

  OR (ca.name = 'Education' AND cs.name = 'Early Childhood' AND (
      o.description ILIKE '%early childhood%' OR o.description ILIKE '%preschool%'
      OR o.description ILIKE '%pre-K%' OR o.description ILIKE '%pre-school%'
      OR o.description ILIKE '%kindergarten%' OR o.description ILIKE '%ECD%'
      OR o.description ILIKE '%ECE%' OR o.description ILIKE '%ages 0%'
      OR o.description ILIKE '%birth to%' OR o.description ILIKE '%foundational literacy%'
      OR o.name ILIKE '%Early%Learning%'
    ))

  OR (ca.name = 'Education' AND cs.name = 'Higher Ed Access' AND (
      o.description ILIKE '%college access%' OR o.description ILIKE '%higher education%'
      OR o.description ILIKE '%university%' OR o.description ILIKE '%post-secondary%'
      OR o.description ILIKE '%undergraduate%' OR o.description ILIKE '%first-generation college%'
      OR o.description ILIKE '%college completion%' OR o.description ILIKE '%college readiness%'
      OR o.description ILIKE '%college students%'
      OR o.name ILIKE '%College%' OR o.name ILIKE '%University%'
      OR o.name ILIKE '%UNCF%' OR o.name ILIKE '%Braven%'
    ))

  OR (ca.name = 'Education' AND cs.name = 'EdTech & Digital Learning' AND (
      o.description ILIKE '%edtech%' OR o.description ILIKE '%ed tech%'
      OR o.description ILIKE '%digital learning%' OR o.description ILIKE '%online learning%'
      OR o.description ILIKE '%online education%' OR o.description ILIKE '%e-learning%'
      OR o.description ILIKE '%educational technology%' OR o.description ILIKE '%learning platform%'
      OR o.description ILIKE '%learning app%' OR o.description ILIKE '%digital education%'
      OR o.description ILIKE '%technology%' AND o.description ILIKE '%education%'
      OR o.name ILIKE '%Khan Academy%' OR o.name ILIKE '%Axim%'
      OR o.name ILIKE '%Rethink Education%' OR o.name ILIKE '%WGBH%'
    ))

  OR (ca.name = 'Education' AND cs.name = 'Workforce Training' AND (
      o.description ILIKE '%workforce%' OR o.description ILIKE '%job training%'
      OR o.description ILIKE '%skills training%' OR o.description ILIKE '%vocational%'
      OR o.description ILIKE '%upskilling%' OR o.description ILIKE '%reskilling%'
      OR o.description ILIKE '%career readiness%' OR o.description ILIKE '%job placement%'
      OR o.description ILIKE '%career pathway%' OR o.description ILIKE '%apprenticeship%'
      OR o.name ILIKE '%Year Up%' OR o.name ILIKE '%Generation%'
      OR o.name ILIKE '%Braven%'
    ))

  OR (ca.name = 'Education' AND cs.name = 'Girls'' Education' AND (
      o.description ILIKE '%girls%' AND o.description ILIKE '%education%'
      OR o.description ILIKE '%girls'' education%' OR o.description ILIKE '%girls education%'
      OR o.description ILIKE '%female student%' OR o.description ILIKE '%women''s education%'
      OR o.description ILIKE '%gender parity%' AND o.description ILIKE '%education%'
      OR o.name ILIKE '%Room to Read%' OR o.name ILIKE '%Girl%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- ECONOMIC DEVELOPMENT
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Economic Development' AND cs.name = 'Workforce Development' AND (
      o.description ILIKE '%workforce development%'
      OR o.description ILIKE '%skills development%'
      OR o.description ILIKE '%employment training%' OR o.description ILIKE '%job training%'
      OR o.description ILIKE '%vocational training%' OR o.description ILIKE '%job placement%'
      OR o.description ILIKE '%labor market%' OR o.description ILIKE '%apprenticeship%'
      OR o.name ILIKE '%Year Up%' OR o.name ILIKE '%Generation%'
      OR o.name ILIKE '%Junior Achievement%'
    ))

  OR (ca.name = 'Economic Development' AND cs.name = 'Small Business Lending' AND (
      o.description ILIKE '%small business%' OR o.description ILIKE '%SME%'
      OR o.description ILIKE '%MSME%' OR o.description ILIKE '%micro-enterprise%'
      OR o.description ILIKE '%microenterprise%' OR o.description ILIKE '%microloan%'
      OR o.description ILIKE '%small and growing business%'
    ))

  OR (ca.name = 'Economic Development' AND cs.name = 'Rural Entrepreneurship' AND (
      o.description ILIKE '%rural entrepreneur%'
      OR o.description ILIKE '%smallholder farmer%' AND o.description ILIKE '%business%'
      OR o.description ILIKE '%rural business%' OR o.description ILIKE '%agri-business%'
      OR o.description ILIKE '%agricultural business%' OR o.description ILIKE '%agricultural enterprise%'
      OR o.name ILIKE '%TechnoServe%' OR o.name ILIKE '%Root Capital%'
    ))

  OR (ca.name = 'Economic Development' AND cs.name = 'Supply Chain Inclusion' AND (
      o.description ILIKE '%supply chain%' OR o.description ILIKE '%value chain%'
      OR o.description ILIKE '%sustainable sourcing%' OR o.description ILIKE '%supplier%'
      OR o.description ILIKE '%commodity%' OR o.description ILIKE '%procurement%'
      OR o.name ILIKE '%IDH%' OR o.name ILIKE '%Fairtrade%'
    ))

  OR (ca.name = 'Economic Development' AND cs.name = 'Trade & Market Access' AND (
      o.description ILIKE '%market access%' OR o.description ILIKE '%fair trade%'
      OR o.description ILIKE '%export market%' OR o.description ILIKE '%market linkage%'
      OR o.description ILIKE '%trade finance%' OR o.description ILIKE '%commodity market%'
      OR o.name ILIKE '%Fairtrade%' OR o.name ILIKE '%IDH%'
    ))

  OR (ca.name = 'Economic Development' AND cs.name = 'Job Creation' AND (
      o.description ILIKE '%job creation%' OR o.description ILIKE '%employment creation%'
      OR o.description ILIKE '%create jobs%' OR o.description ILIKE '%job opportunities%'
      OR o.description ILIKE '%job growth%'
      OR o.name ILIKE '%Endeavor%' OR o.name ILIKE '%TechnoServe%'
      OR o.name ILIKE '%Generation%' OR o.name ILIKE '%Year Up%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- GLOBAL HEALTH
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Global Health' AND cs.name = 'Infectious Disease' AND (
      o.description ILIKE '%HIV%' OR o.description ILIKE '%AIDS%'
      OR o.description ILIKE '%malaria%' OR o.description ILIKE '%tuberculosis%'
      OR o.description ILIKE '% TB %' OR o.description ILIKE '%neglected tropical%'
      OR o.description ILIKE '%infectious disease%' OR o.description ILIKE '%sleeping sickness%'
      OR o.description ILIKE '%vaccine%' AND o.description ILIKE '%disease%'
      OR o.description ILIKE '%epidemic%' OR o.description ILIKE '%outbreak%'
      OR o.name ILIKE '%IAVI%' OR o.name ILIKE '%Evidence Action%'
      OR o.name ILIKE '%PATH%'
    ))

  OR (ca.name = 'Global Health' AND cs.name = 'Maternal & Child Health' AND (
      o.description ILIKE '%maternal%' OR o.description ILIKE '%child health%'
      OR o.description ILIKE '%maternal mortality%' OR o.description ILIKE '%newborn%'
      OR o.description ILIKE '%infant%' OR o.description ILIKE '%pediatric%'
      OR o.description ILIKE '%child nutrition%' OR o.description ILIKE '%under-five%'
      OR o.description ILIKE '%mother and child%' OR o.description ILIKE '%neonatal%'
      OR o.name ILIKE '%Embrace%'
    ))

  OR (ca.name = 'Global Health' AND cs.name = 'Mental Health' AND (
      o.description ILIKE '%mental health%' OR o.description ILIKE '%psychiatric%'
      OR o.description ILIKE '%depression%' OR o.description ILIKE '%anxiety%'
      OR o.description ILIKE '%PTSD%' OR o.description ILIKE '%behavioral health%'
      OR o.description ILIKE '%psychosocial%' OR o.description ILIKE '%counseling%'
      OR o.description ILIKE '%trauma%' AND o.description ILIKE '%health%'
    ))

  OR (ca.name = 'Global Health' AND cs.name = 'Health Systems Strengthening' AND (
      o.description ILIKE '%health system%' OR o.description ILIKE '%primary care%'
      OR o.description ILIKE '%community health worker%' OR o.description ILIKE '%health worker%'
      OR o.description ILIKE '%clinic%' OR o.description ILIKE '%hospital%'
      OR o.description ILIKE '%healthcare delivery%' OR o.description ILIKE '%health infrastructure%'
      OR o.description ILIKE '%primary health%' OR o.description ILIKE '%health capacity%'
      OR o.name ILIKE '%Partners in Health%' OR o.name ILIKE '%Living Goods%'
      OR o.name ILIKE '%D-Rev%' OR o.name ILIKE '%Health Leads%'
    ))

  OR (ca.name = 'Global Health' AND cs.name = 'Access to Medicines' AND (
      o.description ILIKE '%access to medicine%' OR o.description ILIKE '%access to drug%'
      OR o.description ILIKE '%pharmaceutical%' OR o.description ILIKE '%essential medicine%'
      OR o.description ILIKE '%treatment access%' OR o.description ILIKE '%medical supply%'
      OR o.description ILIKE '%drug pricing%' OR o.description ILIKE '%diagnostics%'
      OR o.name ILIKE '%mPharma%' OR o.name ILIKE '%Clinton Health%'
      OR o.name ILIKE '%Sight and Life%' OR o.name ILIKE '%PATH%'
    ))

  OR (ca.name = 'Global Health' AND cs.name = 'Pandemic Preparedness' AND (
      o.description ILIKE '%pandemic%' OR o.description ILIKE '%epidemic preparedness%'
      OR o.description ILIKE '%biosecurity%' OR o.description ILIKE '%global health security%'
      OR o.description ILIKE '%outbreak preparedness%' OR o.description ILIKE '%pandemic preparedness%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- POVERTY ALLEVIATION
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Cash Transfers' AND (
      o.description ILIKE '%cash transfer%' OR o.description ILIKE '%direct cash%'
      OR o.description ILIKE '%unconditional cash%' OR o.description ILIKE '%cash grant%'
      OR o.description ILIKE '%basic income%' OR o.description ILIKE '%guaranteed income%'
      OR o.name ILIKE '%GiveDirectly%'
    ))

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Food Security' AND (
      o.description ILIKE '%food security%' OR o.description ILIKE '%hunger%'
      OR o.description ILIKE '%malnutrition%' OR o.description ILIKE '%food access%'
      OR o.description ILIKE '%nutrition%' OR o.description ILIKE '%food insecurity%'
      OR o.description ILIKE '%food distribution%' OR o.description ILIKE '%feeding%'
      OR o.name ILIKE '%Food%' OR o.name ILIKE '%FoodCloud%'
      OR o.name ILIKE '%Robin Hood Army%'
    ))

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Water & Sanitation' AND (
      o.description ILIKE '%water%' AND (
        o.description ILIKE '%sanitation%' OR o.description ILIKE '%WASH%'
        OR o.description ILIKE '%clean water%' OR o.description ILIKE '%safe water%'
      )
      OR o.description ILIKE '%WASH%' OR o.description ILIKE '%water access%'
      OR o.description ILIKE '%drinking water%' OR o.description ILIKE '%latrine%'
      OR o.name ILIKE '%Sanergy%'
    ))

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Refugee Support' AND (
      o.description ILIKE '%refugee%' OR o.description ILIKE '%displaced%'
      OR o.description ILIKE '%asylum seeker%' OR o.description ILIKE '%forcibly displaced%'
      OR o.name ILIKE '%IRC%' OR o.name ILIKE '%International Rescue%'
      OR o.name ILIKE '%Basmeh%' OR o.name ILIKE '%UNHCR%'
      OR o.name ILIKE '%Mercy Corps%'
    ))

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Rural Livelihoods' AND (
      o.description ILIKE '%rural livelihood%' OR o.description ILIKE '%rural community%'
      OR o.description ILIKE '%rural household%' OR o.description ILIKE '%subsistence farmer%'
      OR o.description ILIKE '%smallholder%' OR o.description ILIKE '%pastoral%'
      OR o.description ILIKE '%rural poor%'
      OR o.name ILIKE '%TechnoServe%' OR o.name ILIKE '%SunCulture%'
    ))

  OR (ca.name = 'Poverty Alleviation' AND cs.name = 'Safety Nets' AND (
      o.description ILIKE '%safety net%' OR o.description ILIKE '%social protection%'
      OR o.description ILIKE '%social safety%' OR o.description ILIKE '%welfare program%'
      OR o.description ILIKE '%emergency assistance%' OR o.description ILIKE '%basic needs%'
      OR o.name ILIKE '%Single Stop%' OR o.name ILIKE '%Propel%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- FINANCIAL INCLUSION
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'Microfinance' AND (
      o.description ILIKE '%microfinance%' OR o.description ILIKE '%microloan%'
      OR o.description ILIKE '%microcredit%' OR o.description ILIKE '%village bank%'
      OR o.description ILIKE '%micro-finance%' OR o.description ILIKE '%micro loan%'
      OR o.name ILIKE '%Grameen%' OR o.name ILIKE '%FINCA%'
      OR o.name ILIKE '%Accion%' OR o.name ILIKE '%Kiva%'
    ))

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'Mobile Banking' AND (
      o.description ILIKE '%mobile banking%' OR o.description ILIKE '%mobile money%'
      OR o.description ILIKE '%mobile financial%' OR o.description ILIKE '%digital finance%'
      OR o.description ILIKE '%mobile payment%' OR o.description ILIKE '%fintech%'
      OR o.description ILIKE '%digital wallet%' OR o.description ILIKE '%agent banking%'
    ))

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'Savings & Insurance' AND (
      o.description ILIKE '%microsavings%' OR o.description ILIKE '%micro-savings%'
      OR o.description ILIKE '%savings group%' OR o.description ILIKE '%microinsurance%'
      OR o.description ILIKE '%micro-insurance%' OR o.description ILIKE '%savings product%'
      OR o.description ILIKE '%insurance product%' AND o.description ILIKE '%low-income%'
      OR o.description ILIKE '%health insurance%' AND o.description ILIKE '%underserved%'
    ))

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'Credit Scoring' AND (
      o.description ILIKE '%credit score%' OR o.description ILIKE '%credit bureau%'
      OR o.description ILIKE '%creditworthiness%' OR o.description ILIKE '%alternative credit%'
      OR o.description ILIKE '%credit access%' OR o.description ILIKE '%credit data%'
      OR o.description ILIKE '%credit history%'
    ))

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'Remittances' AND (
      o.description ILIKE '%remittance%' OR o.description ILIKE '%money transfer%'
      OR o.description ILIKE '%diaspora%' AND o.description ILIKE '%financial%'
      OR o.description ILIKE '%international transfer%'
    ))

  OR (ca.name = 'Financial Inclusion' AND cs.name = 'MSME Lending' AND (
      o.description ILIKE '%MSME%' OR o.description ILIKE '%SME lending%'
      OR o.description ILIKE '%small business loan%' OR o.description ILIKE '%small business capital%'
      OR o.description ILIKE '%enterprise loan%' OR o.description ILIKE '%business financing%'
      OR o.description ILIKE '%missing middle%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- CLIMATE & ENERGY
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Renewable Energy' AND (
      o.description ILIKE '%renewable energy%' OR o.description ILIKE '%solar%'
      OR o.description ILIKE '%wind energy%' OR o.description ILIKE '%clean energy%'
      OR o.description ILIKE '%clean power%' OR o.description ILIKE '%off-grid%'
      OR o.description ILIKE '%electricity access%' OR o.description ILIKE '%clean cooking%'
      OR o.description ILIKE '%cookstove%' OR o.description ILIKE '%biogas%'
      OR o.description ILIKE '%hydropower%' OR o.description ILIKE '%geothermal%'
      OR o.name ILIKE '%BioLite%' OR o.name ILIKE '%SunCulture%'
    ))

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Carbon Markets' AND (
      o.description ILIKE '%carbon market%' OR o.description ILIKE '%carbon offset%'
      OR o.description ILIKE '%emissions trading%' OR o.description ILIKE '%carbon credit%'
      OR o.description ILIKE '%voluntary carbon%' OR o.description ILIKE '%carbon trading%'
      OR o.description ILIKE '%carbon removal%' OR o.description ILIKE '%net zero%'
    ))

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Sustainable Agriculture' AND (
      o.description ILIKE '%sustainable agriculture%' OR o.description ILIKE '%regenerative%'
      OR o.description ILIKE '%agroforestry%' OR o.description ILIKE '%organic farming%'
      OR o.description ILIKE '%sustainable farming%' OR o.description ILIKE '%land use%'
      OR o.description ILIKE '%deforestation%' OR o.description ILIKE '%food system%'
      OR o.description ILIKE '%agricultural sustainability%'
    ))

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Climate Adaptation' AND (
      o.description ILIKE '%climate adaptation%' OR o.description ILIKE '%climate resilience%'
      OR o.description ILIKE '%climate risk%' OR o.description ILIKE '%flood%'
      OR o.description ILIKE '%drought%' OR o.description ILIKE '%sea level%'
      OR o.description ILIKE '%climate-vulnerable%' OR o.description ILIKE '%climate impact%'
      OR o.description ILIKE '%extreme weather%' OR o.description ILIKE '%disaster risk%'
      OR o.name ILIKE '%Probable Futures%' OR o.name ILIKE '%Megafire%'
    ))

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Circular Economy' AND (
      o.description ILIKE '%circular economy%' OR o.description ILIKE '%circular%'
      OR o.description ILIKE '%waste%' AND o.description ILIKE '%climate%'
      OR o.description ILIKE '%recycling%' OR o.description ILIKE '%e-waste%'
      OR o.description ILIKE '%zero waste%' OR o.description ILIKE '%resource efficiency%'
      OR o.description ILIKE '%plastic%' AND o.description ILIKE '%environment%'
    ))

  OR (ca.name = 'Climate & Energy' AND cs.name = 'Green Finance' AND (
      o.description ILIKE '%green finance%' OR o.description ILIKE '%sustainable finance%'
      OR o.description ILIKE '%ESG%' OR o.description ILIKE '%climate finance%'
      OR o.description ILIKE '%green bond%' OR o.description ILIKE '%climate investment%'
      OR o.description ILIKE '%clean energy finance%' OR o.description ILIKE '%impact investing%'
      AND o.description ILIKE '%climate%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- GENDER & SOCIAL JUSTICE
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'Women''s Economic Empowerment' AND (
      o.description ILIKE '%women''s economic%' OR o.description ILIKE '%female entrepreneur%'
      OR o.description ILIKE '%women''s livelihood%' OR o.description ILIKE '%women-owned%'
      OR o.description ILIKE '%women''s financial%' OR o.description ILIKE '%gender lens%'
      OR o.description ILIKE '%economic empowerment%' AND o.description ILIKE '%women%'
      OR o.description ILIKE '%women''s income%' OR o.description ILIKE '%income generation%'
      AND o.description ILIKE '%women%'
    ))

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'Gender-Based Violence' AND (
      o.description ILIKE '%gender-based violence%' OR o.description ILIKE '% GBV %'
      OR o.description ILIKE '%domestic violence%' OR o.description ILIKE '%sexual violence%'
      OR o.description ILIKE '%intimate partner%' OR o.description ILIKE '%gender violence%'
      OR o.description ILIKE '%violence against women%'
    ))

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'Reproductive Health' AND (
      o.description ILIKE '%reproductive health%' OR o.description ILIKE '%reproductive rights%'
      OR o.description ILIKE '%family planning%' OR o.description ILIKE '%contraception%'
      OR o.description ILIKE '%sexual and reproductive%' OR o.description ILIKE '%abortion%'
      OR o.name ILIKE '%Planned Parenthood%'
    ))

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'Pay Equity' AND (
      o.description ILIKE '%pay equity%' OR o.description ILIKE '%wage gap%'
      OR o.description ILIKE '%equal pay%' OR o.description ILIKE '%pay parity%'
      OR o.description ILIKE '%compensation equity%' OR o.description ILIKE '%gender pay%'
    ))

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'LGBTQ+ Rights' AND (
      o.description ILIKE '%LGBTQ%' OR o.description ILIKE '%LGBT%'
      OR o.description ILIKE '%queer%' OR o.description ILIKE '%transgender%'
      OR o.description ILIKE '%sexual orientation%' OR o.description ILIKE '%gender identity%'
      OR o.description ILIKE '%same-sex%'
    ))

  OR (ca.name = 'Gender & Social Justice' AND cs.name = 'Racial Justice' AND (
      o.description ILIKE '%racial justice%' OR o.description ILIKE '%racial equity%'
      OR o.description ILIKE '%anti-racism%' OR o.description ILIKE '%civil rights%'
      OR o.description ILIKE '%racial disparity%' OR o.description ILIKE '%systemic racism%'
      OR o.description ILIKE '%racial discrimination%' OR o.description ILIKE '%race equity%'
      OR o.name ILIKE '%Equal Justice%' OR o.name ILIKE '%ACLU%'
      OR o.name ILIKE '%OneTen%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- HOUSING & COMMUNITY
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Housing & Community' AND cs.name = 'Affordable Housing' AND (
      o.description ILIKE '%affordable housing%' OR o.description ILIKE '%low-income housing%'
      OR o.description ILIKE '%housing affordability%' OR o.description ILIKE '%subsidized housing%'
      OR o.description ILIKE '%public housing%' OR o.description ILIKE '%workforce housing%'
      OR o.description ILIKE '%mixed-income housing%' OR o.description ILIKE '%rental housing%'
      AND o.description ILIKE '%affordable%'
      OR o.name ILIKE '%Habitat for Humanity%' OR o.name ILIKE '%Mercy Housing%'
      OR o.name ILIKE '%Phipps Houses%'
    ))

  OR (ca.name = 'Housing & Community' AND cs.name = 'CDFIs' AND (
      o.description ILIKE '%CDFI%' OR o.description ILIKE '%community development finance%'
      OR o.description ILIKE '%community development financial institution%'
      OR o.name ILIKE '%Boston Community Capital%' OR o.name ILIKE '%Harbor Bank%'
      OR o.name ILIKE '%Nonprofit Finance Fund%'
    ))

  OR (ca.name = 'Housing & Community' AND cs.name = 'Neighborhood Revitalization' AND (
      o.description ILIKE '%neighborhood revitalization%' OR o.description ILIKE '%community revitalization%'
      OR o.description ILIKE '%community development%' OR o.description ILIKE '%urban renewal%'
      OR o.description ILIKE '%place-based%' OR o.description ILIKE '%distressed community%'
      OR o.description ILIKE '%opportunity zone%'
      OR o.name ILIKE '%ICIC%' OR o.name ILIKE '%Living Cities%'
    ))

  OR (ca.name = 'Housing & Community' AND cs.name = 'Homelessness' AND (
      o.description ILIKE '%homeless%' OR o.description ILIKE '%housing first%'
      OR o.description ILIKE '%emergency shelter%' OR o.description ILIKE '%chronically homeless%'
      OR o.description ILIKE '%unhoused%' OR o.description ILIKE '%transitional housing%'
      OR o.name ILIKE '%Shelter%'
    ))

  OR (ca.name = 'Housing & Community' AND cs.name = 'Tenant Advocacy' AND (
      o.description ILIKE '%tenant%' OR o.description ILIKE '%renter%'
      OR o.description ILIKE '%housing rights%' OR o.description ILIKE '%eviction%'
      OR o.description ILIKE '%housing stability%' OR o.description ILIKE '%rent%'
      AND o.description ILIKE '%advocacy%'
    ))

  OR (ca.name = 'Housing & Community' AND cs.name = 'Mixed-Income Communities' AND (
      o.description ILIKE '%mixed-income%' OR o.description ILIKE '%mixed income%'
      OR o.description ILIKE '%economic integration%' OR o.description ILIKE '%inclusive neighborhood%'
      OR o.description ILIKE '%income-diverse%'
    ))

  -- ──────────────────────────────────────────────────────────────────────────
  -- ARTS & CULTURE
  -- ──────────────────────────────────────────────────────────────────────────

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Performing Arts' AND (
      o.description ILIKE '%performing arts%' OR o.description ILIKE '%theater%'
      OR o.description ILIKE '%theatre%' OR o.description ILIKE '%dance%'
      OR o.description ILIKE '%orchestra%' OR o.description ILIKE '%ballet%'
      OR o.description ILIKE '%opera%' OR o.description ILIKE '%symphony%'
      OR o.description ILIKE '%concert%' OR o.description ILIKE '%musical performance%'
      OR o.name ILIKE '%Ballet%' OR o.name ILIKE '%Symphony%'
      OR o.name ILIKE '%Lincoln Center%' OR o.name ILIKE '%Carnegie%'
    ))

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Arts Education' AND (
      o.description ILIKE '%arts education%' OR o.description ILIKE '%music education%'
      OR o.description ILIKE '%arts program%' AND o.description ILIKE '%youth%'
      OR o.description ILIKE '%arts in school%' OR o.description ILIKE '%arts curriculum%'
      OR o.description ILIKE '%youth arts%' OR o.description ILIKE '%arts access%'
      AND o.description ILIKE '%student%'
      OR o.name ILIKE '%WGBH%' OR o.name ILIKE '%LA''s BEST%'
      OR o.name ILIKE '%KaBOOM%'
    ))

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Community Arts' AND (
      o.description ILIKE '%community arts%' OR o.description ILIKE '%public art%'
      OR o.description ILIKE '%arts access%' OR o.description ILIKE '%arts for all%'
      OR o.description ILIKE '%arts engagement%' OR o.description ILIKE '%artist community%'
      OR o.description ILIKE '%community engagement%' AND o.description ILIKE '%art%'
      OR o.name ILIKE '%Brooklyn Museum%' OR o.name ILIKE '%Whitney%'
    ))

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Cultural Preservation' AND (
      o.description ILIKE '%cultural preservation%' OR o.description ILIKE '%cultural heritage%'
      OR o.description ILIKE '%heritage preservation%' OR o.description ILIKE '%historic preservation%'
      OR o.description ILIKE '%indigenous culture%' OR o.description ILIKE '%cultural identity%'
      OR o.name ILIKE '%National Trust%' OR o.name ILIKE '%Governors Island%'
    ))

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Creative Economy' AND (
      o.description ILIKE '%creative economy%' OR o.description ILIKE '%creative industry%'
      OR o.description ILIKE '%creative sector%' OR o.description ILIKE '%artist employment%'
      OR o.description ILIKE '%creative workforce%' OR o.description ILIKE '%arts sector%'
    ))

  OR (ca.name = 'Arts & Culture' AND cs.name = 'Social Practice Art' AND (
      o.description ILIKE '%social practice%' AND o.description ILIKE '%art%'
      OR o.description ILIKE '%art for social change%' OR o.description ILIKE '%art therapy%'
      OR o.description ILIKE '%artivism%' OR o.description ILIKE '%art as advocacy%'
      OR o.description ILIKE '%healing%' AND o.description ILIKE '%art%'
    ))

)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification: count of org-subtopic assignments by cause area
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
  ca.name       AS cause_area,
  cs.name       AS subtopic,
  COUNT(ocs.organization_id) AS orgs_tagged
FROM cause_subtopics cs
JOIN cause_areas ca ON ca.id = cs.cause_area_id
LEFT JOIN organization_cause_subtopics ocs ON ocs.cause_subtopic_id = cs.id
GROUP BY ca.name, cs.name
ORDER BY ca.name, orgs_tagged DESC;
