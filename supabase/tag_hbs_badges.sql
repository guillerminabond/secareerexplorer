-- ============================================================
-- HBS SE Explorer — Badge Tagging Script
-- Generated automatically from organizations_rows.csv analysis
--
-- badge_hbs_founder:           5 orgs
-- badge_alumni_work_here:     26 orgs  (11 from hbs_note/notable_alumni + 15 LinkedIn-verified)
-- badge_fellowship_partner:  189 orgs
--
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 0. Reset all three badge columns to false (clean slate) ──────────────
-- (safe to re-run; this script is idempotent)
UPDATE organizations SET
  badge_hbs_founder        = false,
  badge_alumni_work_here   = false,
  badge_fellowship_partner = false;

-- ── 1. badge_hbs_founder ──────────────────────────────────────────────────
--    Criteria: organization was founded by an HBS alumnus/alumna or HBS faculty
--    Sources:  hbs_note contains explicit founder + HBS credential language,
--              or is a known HBS faculty-founded org (e.g. ICIC / Michael Porter)

UPDATE organizations
SET badge_hbs_founder = true
WHERE id IN (
  '33f2af13-4b3d-405c-8ac2-274fc2117f2b',  -- Initiative for a Competitive Inner City (ICIC)
  '9a1fdf33-be43-4ee0-a26e-372f2f26e901',  -- Nova Pioneer
  'b2b9999b-faa0-4b3d-8a80-da7b852978aa',  -- Wellthy
  '748bdd17-ddb9-45be-b033-0540b8a380a0',  -- Year Up
  '46457dd5-caee-41f1-893a-453466b410ca'  -- mPharma
);

-- ── 2. badge_alumni_work_here ─────────────────────────────────────────────
--    Criteria: confirmed HBS alumni currently working/in leadership at the org
--    Sources:
--      (A) notable_alumni column has a named HBS graduate, OR
--          hbs_note explicitly states alumni presence/network/leadership
--      (B) LinkedIn-verified: searched HBS school alumni page filtered by org,
--          tagged where 3+ alumni currently show the org as their employer
--    Excluded: orgs tagged badge_hbs_founder (founder badge implies alumni)

UPDATE organizations
SET badge_alumni_work_here = true
WHERE id IN (

  -- ── (A) hbs_note / notable_alumni sources ─────────────────────────────
  '053f9330-0e91-4d0e-8714-f4acadd6a455',  -- Aga Khan Development Network
  'f94ac8a0-d7e4-4ac6-9d48-0e22276472b2',  -- Axim Collaborative
  'a9f1c1c8-0778-4435-a9d2-a372167ceb83',  -- CARE USA
  '10b57a88-8369-4b66-9642-7a32bc55974b',  -- City Year
  '976fdd66-95a5-4969-8c5c-f6c03341e97e',  -- Dalberg Global Development Advisors
  'ac59a410-9fba-4d58-bcb8-5ef6d37623a8',  -- Echoing Green
  '785eed8c-9f9e-4f5a-8cab-19c6e088ebb8',  -- Endeavor
  '5ca8b812-49e1-484b-87d7-7bdef1d1eb98',  -- Harlem Children's Zone
  '7f4664a5-39db-4ac3-864a-6c8510d0d513',  -- Living Goods
  '725f8d01-3cd0-4f22-83e7-44b28f674f13',  -- Room to Read
  '62c75169-9ae0-40e9-aad1-edaaad4d5e0b',  -- Skoll Foundation

  -- ── (B) LinkedIn-verified (3+ current HBS alumni confirmed) ───────────
  '857f9b3c-1f64-4552-89fa-40be3ce54783',  -- The Nature Conservancy      (16 alumni)
  '48cdc3da-4608-44cc-b887-7cf8dde0f6c3',  -- Teach for America            (15 alumni)
  '00626205-7f04-49e3-bb93-a48176791b27',  -- Rockefeller Foundation        (6 alumni)
  '3646e7c5-5289-4231-bd00-e745c2a4245a',  -- Clinton Health Access Init.   (6 alumni)
  'f97c392d-d2aa-4001-9eed-f94abbacb689',  -- Ford Foundation               (6 alumni)
  'a93c127b-0f45-4dad-96a3-ab9870f5dbfc',  -- Environmental Defense Fund    (5 alumni)
  '3231641a-fb81-4d34-a6f7-dd0932ab0c80',  -- Bloomberg Philanthropies      (5 alumni)
  '7f14bc9d-2119-435c-9e10-926a642e549b',  -- Conservation International    (4 alumni)
  'd2e9c84b-705a-408c-900f-8dd30501da3c',  -- Habitat for Humanity Intl.    (4 alumni)
  'e75dd88f-dee1-496e-91bc-cd99e44c2a75',  -- World Wildlife Fund (WWF)     (4 alumni)
  'd11d5205-989b-443c-99e1-fb877aa68064',  -- Khan Academy                  (4 alumni)
  '0961f68c-40bc-43ef-86e0-201abb9c4a8b',  -- KIPP Foundation               (3 alumni)
  'cf4d0b01-59a7-4c8c-a67d-2f7b2772a33f',  -- RMI (Rocky Mountain Inst.)   (3 alumni)
  '056815f7-2647-4ff5-b4c3-1c8340814a44',  -- Mercy Corps                   (3 alumni)
  'df2e4586-8e0c-476a-9f61-53246fa7970e'   -- Warby Parker                  (3 alumni)
);

-- ── 3. badge_fellowship_partner ───────────────────────────────────────────
--    Criteria: org is an HBS Leadership Fellowship or Summer Fellows partner
--    Detected via 'leadership fellowship' or 'summer fellow' in hbs_note

UPDATE organizations
SET badge_fellowship_partner = true
WHERE id IN (
  '2324605e-89e9-4817-97e2-98548d28b403',  -- Accion
  '737b5f3a-cbf8-4f58-9772-6bfd9cd25ff7',  -- Acumen
  'c8b318da-3b0d-4df3-b04a-f8df75c4b0e6',  -- Acumen Academy
  'fb29713e-ceea-48bb-82d1-225b9616b3cb',  -- African Comprehensive HIV/AIDS Partnerships (ACHAP)
  '2f22d985-d417-463f-b9d8-28b04bb92786',  -- African Development Bank
  '491c7ff4-b227-4d9a-a00d-dfd5048ad81d',  -- African Leadership Academy
  '162730d0-63a8-4e37-b24c-bc2e3e46f1f3',  -- Agora Partnerships
  '3d29652b-74e2-4ed0-865b-45ec6e1d4881',  -- Allied Climate Partners
  'b3a29cd4-03e9-42e5-8a5c-6e3e54a44ca8',  -- American Ballet Theatre
  '220265de-6565-4c62-a130-abfe0f7409c5',  -- American Civil Liberties Union (ACLU)
  '97bd578a-11c3-4a62-84b6-651acbdb55f4',  -- Ashoka
  'd57472a9-6ef2-47d5-bdad-530967008f60',  -- Asian Development Bank
  '9f0e7757-8398-4858-9d17-c463ef43b382',  -- Association of Latino Professionals For America (ALPFA)
  '5a2597ed-2961-497d-b48a-0f48ad89da10',  -- BRAC
  '40be22ea-72d0-4f3e-a021-5c1b1aed7b49',  -- Basmeh & Zeitooneh
  '915f4f95-92e9-421b-8aa6-91206d2fccd2',  -- Bellwether
  'a4b0a16a-b1da-45af-acdb-bb82e73557eb',  -- BioLite
  '2eaa408b-42da-433a-87d4-becc6cbb7e3d',  -- Bipartisan Policy Center
  'b65b2b69-d798-4a31-b098-0730cb6342ef',  -- Boston Children's Hospital
  '0d10ed07-13bb-4e57-ab2f-ee763d13ed8d',  -- Boston Community Capital
  'b2b41dad-e28b-480f-a6d3-83e05567bb75',  -- Boston Medical Center
  '3ed722fa-b6e4-4f92-83cd-10214a2d974d',  -- Boston Planning and Development Agency (BPDA)
  '8fa08c46-ab76-451a-9a66-b458f03a6d41',  -- Boston Symphony Orchestra
  'b34623ab-53d0-4a7c-9536-7c37a4aa1325',  -- Braven
  '404387f7-eeb8-45fb-81ab-ad644c2cf087',  -- Bridge International Academies
  'b65bd8df-02ef-4d40-bd79-db73b3b3b507',  -- Bridges Outcomes Partnerships
  '39a928de-9749-4c4d-b2b7-7840be02b170',  -- Brooklyn Museum
  'a9f1c1c8-0778-4435-a9d2-a372167ceb83',  -- CARE USA
  'ae8a95ad-e6eb-4fdf-9158-80f70c60f542',  -- Calvert Impact Capital
  'b8084fb2-f73e-4a95-814a-352cc66a600a',  -- Camelback Ventures
  '77bfc7c3-f2b3-44a2-b6db-1a350a11734e',  -- Centre for Humanitarian Dialogue
  '6b28b2e8-a122-4e17-9b99-4fae1155d41f',  -- Charter School Growth Fund
  'eba73e99-165c-4f71-8bf3-54b686a0309b',  -- Children's Investment Fund Foundation (CIFF)
  '0faa5b62-3c91-4171-9a3d-c872ff2cffb7',  -- Citizen Schools
  '9e741847-11f2-48ff-be29-bce606c65a69',  -- City of Boston Mayor's Office
  '396cebcf-aae6-4371-a522-ca0afbb37e45',  -- City of Cambridge
  'b34b8304-e84d-4134-8380-7e10d6283e84',  -- City of Chicago Mayor's Office
  '0db991ad-4477-4b79-95e8-a9b0d826dad3',  -- City of Detroit Mayor's Office
  '46594c27-3fad-40e4-9a5b-50017e1d25ba',  -- City of Sacramento Mayor's Office
  '9988eb8b-01ec-49d1-9f80-97cd21663dd2',  -- City of San Jose Mayor's Office
  '911a85e0-cac5-4eab-ace6-8626ac678ee1',  -- Civic Builders
  'ff21118c-5e37-4f9f-9359-9b9b1e470050',  -- Clean Energy Ventures
  '8f41289e-c1e4-490a-a4ee-df2c713bee2a',  -- Clinton Foundation
  '3646e7c5-5289-4231-bd00-e745c2a4245a',  -- Clinton Health Access Initiative (CHAI)
  '5ff58634-5ee7-4f27-8f89-9da239d76bc4',  -- Coalition for Queens
  '3aa21f3f-e6de-4d76-a3e5-343e0860e6b2',  -- Code for America
  '2ba40af0-3131-4212-b06b-c0e599fbec47',  -- Committee Encouraging Corporate Philanthropy (CECP)
  'cc592bad-2dc3-4157-b08d-5d8d2509d650',  -- Coney Island Prep
  '0c5b568e-ebda-4206-b172-6716dd3ce20f',  -- Connecticut Office of the Governor
  '7f14bc9d-2119-435c-9e10-926a642e549b',  -- Conservation International
  'b1a7a723-c4c2-4d52-807e-916f2abc6c8c',  -- Consumer Financial Protection Bureau
  'e0dd553d-18d2-4191-84c0-e6ecb222dea9',  -- CrossBoundary Group
  'b189ed73-a306-4d6c-8d8d-31ef8ad5edc0',  -- D-Rev: Design for the Other 90%
  '97884691-a0d0-4f7c-9471-745526bebbcb',  -- Dalberg Advisors
  '976fdd66-95a5-4969-8c5c-f6c03341e97e',  -- Dalberg Global Development Advisors
  '09f6ab52-6000-4b8d-b65a-3d67d757f563',  -- Dasra
  'd6c607ca-a4f7-4733-bf84-d1a44ea5a0b1',  -- Defending Digital Democracy
  '39212c04-c10e-4606-8144-c60c42405096',  -- Detroit Economic Growth Corporation
  'd79f0220-f9e4-452c-87bd-1340dd42fe99',  -- Dillard University
  '33c0f817-eab5-46c6-a554-b7820bdac65f',  -- Draper Richards Kaplan Foundation
  'fcaf6081-d69a-4c44-b5d2-06893ac39fee',  -- EARN (Earned Assets Resource Network)
  'ac59a410-9fba-4d58-bcb8-5ef6d37623a8',  -- Echoing Green
  'bb2360bb-c194-42fc-93f6-a95d361e9e21',  -- Education Pioneers
  'bb7dca63-8118-4a9e-a4d2-8c44bc3a0faf',  -- Embrace Global
  '785eed8c-9f9e-4f5a-8cab-19c6e088ebb8',  -- Endeavor
  'b7293f08-624d-470a-8272-16aba91e1cb6',  -- Endeavor (Insight Team)
  'a93c127b-0f45-4dad-96a3-ab9870f5dbfc',  -- Environmental Defense Fund
  '57e546cb-6378-46e0-b2fd-c918d7e23b2c',  -- Equal Justice Initiative
  'ee819b82-90c5-4ff0-bcff-1dfc8b8e4556',  -- Evidence Action
  '2145e00a-4f63-4242-b196-a92625427ccd',  -- Federal Bureau of Investigation
  '019013c9-4859-4e51-942e-58ccf09056af',  -- FoodCloud
  'f97c392d-d2aa-4001-9eed-f94abbacb689',  -- Ford Foundation
  '34654400-27aa-4344-8073-557e32243f1b',  -- Gates Foundation
  '718ab579-df97-42ae-ab4c-d4880bf1623a',  -- Generation
  '3ed9e955-c654-43cc-b540-633d7ad8f3ac',  -- Girl Scouts of the USA
  'f7b22b97-1459-4c92-8114-cc153e026e2c',  -- Grameen America
  'f278a78c-b578-4c34-a659-70b18fe29ba5',  -- Grassroots Business Fund
  '074edefc-a230-4c2b-a79c-58503823dbd9',  -- Habitat for Humanity
  'c55d26c4-d7e9-47f5-b6c6-d4b9e2666290',  -- Hack.Diversity
  'b91243da-2c6d-4cb3-b2e6-2bd27e6df92d',  -- Harbor Bank of Maryland
  '5ca8b812-49e1-484b-87d7-7bdef1d1eb98',  -- Harlem Children's Zone
  '904f87b5-3649-4496-9f35-7352a79a6932',  -- Health Leads
  '5d2d2aab-6da9-4b46-aa8a-3c4b1505688c',  -- Hebrew SeniorLife
  'b94c231a-feba-494f-8ed5-b01365613e32',  -- Hospital for Special Surgery
  'e3ce5c30-107d-42d0-ab73-6118551e93cd',  -- IDEO.org
  'e44c0978-de12-4827-9593-b11af4b8a0d2',  -- IDinsight
  '33f2af13-4b3d-405c-8ac2-274fc2117f2b',  -- Initiative for a Competitive Inner City (ICIC)
  '4824af40-e64e-4e42-9abe-6511c6471f85',  -- Innovations for Poverty Action (IPA)
  '06a3f223-51ae-498d-95ec-cc7303592573',  -- Inspiring Capital
  'd085e248-fc26-4810-b793-1cd4ec0e4164',  -- Instiglio
  '28e1f4a0-5889-43f4-930c-1737a425264e',  -- Instituto Sonho Grande
  '8ed4ca90-9f29-4303-938c-28b4d05a5744',  -- International AIDS Vaccine Initiative (IAVI)
  '2cbe5cda-e212-40db-a24c-5fe83277fe6a',  -- International Finance Corporation (IFC)
  '31157946-cd2c-44ac-a755-18db253de232',  -- International Rescue Committee (IRC)
  '8c98f250-5504-417b-a27c-8f0d91d0c94f',  -- Junior Achievement Worldwide
  '0961f68c-40bc-43ef-86e0-201abb9c4a8b',  -- KIPP Foundation
  '936e566c-3223-45e1-a8d2-34bfbbf217cc',  -- KaBOOM!
  'd11d5205-989b-443c-99e1-fb877aa68064',  -- Khan Academy
  '6259ffea-3654-49e6-b4e9-b81f56ea4cbb',  -- Kiva
  'de786e61-ddb4-4f90-9723-37199687512e',  -- Kresge Foundation
  '3d05e3ed-120e-4a85-8e47-95d847ec5dcf',  -- LA's BEST After School Enrichment Program
  '2099a734-93ac-4a63-ade5-410887fced03',  -- Latin American Leadership Academy (LALA)
  '7332199f-d6d3-4af2-b7ae-551524fc52a6',  -- LeapFrog Investments
  '0b839cae-b6b6-4693-8b48-8b6beb8990b1',  -- Lincoln Center for the Performing Arts
  '347ce9d5-3b24-423f-8a31-f018c45d22e1',  -- Living Cities
  '51c54561-8e02-4aa2-bd07-cc51a2b4ebe9',  -- Los Angeles Unified School District (LAUSD)
  'a3b1be7f-cc0f-4567-8d56-448b4f2029b5',  -- MassChallenge
  'df0305bf-7d1a-4aac-a112-f3dc6a959d95',  -- MassHealth
  'd9400b22-b989-457b-bd04-7e1a8de0c815',  -- MassIT
  '17ed46f5-0c79-4468-8483-cb065e11e04b',  -- Massachusetts Bay Transportation Authority (MBTA)
  '2138dc2d-e86b-4a88-b942-26f9a91c9240',  -- Megafire Action
  '056815f7-2647-4ff5-b4c3-1c8340814a44',  -- Mercy Corps
  'cfcb30dc-d4ba-4a12-a41c-db6763b6f5fc',  -- Mercy Housing
  '9d18f776-65d0-488e-86ac-1e3f93e0143f',  -- Michael J. Fox Foundation for Parkinson's Research
  'efdc14a7-a160-4336-961a-9acb66d2d47e',  -- Multidisciplinary Association for Psychedelic Studies (MAPS)
  '6b56a879-7c09-4a56-a56f-0a1718a47e89',  -- Murmuration
  'dd5c2063-35cb-41e8-bdca-ce2f8a7d1598',  -- National Trust for Historic Preservation
  'e5a9ccef-89fc-4ad2-96a2-4a1e25a44965',  -- New Profit
  '3335d689-2f17-444b-b582-0de5453540d7',  -- New Sector Alliance
  '2750a164-33a5-4159-96b1-28eb71664626',  -- New York City Ballet
  'd2816f6a-c955-4d68-9c74-e04140b0fbe7',  -- New York City Economic Development Corporation
  '31b561f7-387a-4171-9833-e9e6dfc98508',  -- New York City Public Schools
  'b0e54b1b-a6ab-4df1-8b2c-cab931418c9f',  -- New York Communities for Change
  '49099001-eeb5-4f0f-aa28-174840df9fc6',  -- New York Public Radio (WNYC)
  '32fc0fb7-1166-4c11-9d4f-a8aa4453946b',  -- NewSchools Venture Fund
  '6a669e0b-3661-4af4-bb49-0b178a67e978',  -- Nonprofit Finance Fund
  '65200685-acc9-4256-9829-8876ba8199a2',  -- Obama Foundation
  'd8fc9fa8-9927-44e7-8c94-af5ade2c39d6',  -- Omidyar Network
  '311f8f7e-d30e-46a9-a33d-21fc7a75ccda',  -- OneTen Coalition
  '0432911b-7504-48a1-a770-e60e58897174',  -- Ownership Works
  'a9c1a37e-d49e-4c6a-bcca-aa5d5f176ff4',  -- Oxfam
  'd93afcc3-4bec-45e8-a01c-f9b380b26b33',  -- PATH
  'fb590b30-06e5-48ae-afa7-71f9a8371a33',  -- Partners In Health
  '4349033b-28dd-4d21-b2f5-748d58d221ec',  -- Partnership for Public Service
  'e837e7dc-e2de-4416-8885-050ce7c91e16',  -- Patagonia
  '2c85157a-c04e-4b91-88dd-a342e16db8a6',  -- Pershing Square Foundation
  '7a7f9db0-33e3-4bb5-8f52-115ad145dd5a',  -- Phipps Houses
  'c5017fb9-3c7d-41da-9f5f-c7574739e210',  -- Planned Parenthood
  '8dbcdca1-ab37-4825-8b60-4be13cdecc97',  -- Points of Light
  '1fadb169-7da0-4314-9f56-14726b87664b',  -- Population Services International (PSI)
  '0e286668-ba4c-4d62-b4fa-2cc7a96f1973',  -- Prime Coalition
  '9ec1d884-a0b6-49d0-8a73-c031adbf34cd',  -- ProNicaragua
  '808fb625-fd8a-4c0a-afe0-3e79ce89b7db',  -- Probable Futures
  'ff1436e8-2657-48ff-8d8b-c9890d091b7d',  -- Propel
  '0820171d-f78c-49e3-abb7-7b6165b7d584',  -- Quantified Ventures
  '232d9cd0-5ec7-495d-ad1a-2ee3f78db2ac',  -- Quona Capital
  '51111ee5-102a-4176-bf27-7cb25b316735',  -- REDF
  'cf4d0b01-59a7-4c8c-a67d-2f7b2772a33f',  -- RMI (Rocky Mountain Institute)
  '9767532b-0acb-42d9-87b1-3748c3387643',  -- Rethink Education
  '9df7be4c-21ee-49a8-86d5-2723ab53874f',  -- Right To Play International
  'dd32980e-76d1-42ef-ad01-8b94b1d20622',  -- Robin Hood Foundation
  '00626205-7f04-49e3-bb93-a48176791b27',  -- Rockefeller Foundation
  'c1fff0c4-475c-462a-8944-2f3e0c4c820d',  -- Rocket Learning
  '51c490f6-f537-4b93-846d-ce9b5e87f0d7',  -- Root Capital
  '0e7a4733-284a-4928-b369-4bd486ad6738',  -- Sanergy
  '3bc6907c-08f0-4943-841b-b9d84dbbefbe',  -- Save the Children
  'a018c385-370c-4a91-9ebc-3e2a43841004',  -- Sight and Life
  '0f4cf0da-6b0f-4c96-9dc1-0416b5749aa3',  -- Single Stop
  'e2a0f3ca-caeb-4b1c-8738-57597f8c3d82',  -- Social Finance
  'b03d2539-5221-41ca-8940-4a821c9a782e',  -- Special Olympics
  '6795ca20-bf03-4359-8dc9-d3c360bd4024',  -- Success Academy Charter Schools
  'aa23f9e6-7862-4d5b-bee6-eeec221ef856',  -- SunCulture
  '64b2af72-2632-41c3-8e06-6d2fd59c7365',  -- Teach At the Right Level (TaRL Africa)
  '48cdc3da-4608-44cc-b887-7cf8dde0f6c3',  -- Teach for America
  '6301a630-0528-4e1d-82d4-02dc6b34add9',  -- TechnoServe
  '9c8897fd-0db7-4212-a954-929a56456be0',  -- The Boston Foundation
  'ee3518c1-1013-499b-80fd-ab68646fcb04',  -- The Families and Workers Fund
  '857f9b3c-1f64-4552-89fa-40be3ce54783',  -- The Nature Conservancy
  '1b5b83bc-df00-4137-a28f-6ab1bb564909',  -- The Robin Hood Army
  '10ca3e41-0b3e-473c-a580-cbe4f417a768',  -- The Shed
  'db5515e8-233e-450e-b0d1-17afa9062dff',  -- The Tony Blair Institute for Global Change
  'c8eb71b9-e688-4124-8eb7-17bab9fa5d16',  -- Third Sector Capital Partners
  '2a15031f-f4ae-43c1-8487-a7f7efdbaecd',  -- Trust for Governors Island
  '16458bd5-07d8-4de5-81e4-2cda4a1e8c4c',  -- U.S. Department of Education
  '765d3a7e-7f48-40a0-a5fc-f2b61fee987b',  -- UNCF (United Negro College Fund)
  '93efd671-03f3-43ca-925f-a91669679d77',  -- UNDP (United Nations Development Programme)
  'bfd37817-1990-4bff-a0aa-a6f9026b03d3',  -- UNICEF
  '5fda3fc9-b685-4a3f-af1e-1c8cc3d9925c',  -- Uncommon Schools
  '427a3058-88db-45f1-8563-b9f2c13f5ec5',  -- United Nations World Food Programme (WFP)
  '943e0051-460d-45ce-8090-305be8868b29',  -- WGBH Educational Foundation
  '094f57f7-8fc4-4ec7-990c-fc2e6d0256f2',  -- Whitney Museum of American Art
  'b0914fd7-2c4e-44bf-b865-fa163262d147',  -- Women's Educational and Industrial Union
  'b3b40958-188f-4ef9-b675-5f30aa1c0455',  -- World Bank Group
  '2308247f-8d1b-4abc-a023-95d4d41112ff',  -- World Economic Forum
  'e9c004bf-d83f-463e-ab2c-61359ee2147e',  -- World Health Organization (WHO)
  '0c3306ae-3efd-4252-b395-90f94280b0d1',  -- World Vision
  'e75dd88f-dee1-496e-91bc-cd99e44c2a75',  -- World Wildlife Fund (WWF)
  '748bdd17-ddb9-45be-b033-0540b8a380a0',  -- Year Up
  'f2ae2086-670f-4c18-8fd3-1fe889cb57c8'  -- Zipline
);

-- ── 4. Verification ───────────────────────────────────────────────────────
-- Run this SELECT after the UPDATEs to confirm expected counts:

SELECT
  COUNT(*) FILTER (WHERE badge_hbs_founder)        AS hbs_founder_count,        -- expect 5
  COUNT(*) FILTER (WHERE badge_alumni_work_here)   AS alumni_work_here_count,   -- expect 26
  COUNT(*) FILTER (WHERE badge_fellowship_partner) AS fellowship_partner_count  -- expect 189
FROM organizations;

-- To review individual tagged orgs:
SELECT id, name, badge_hbs_founder, badge_alumni_work_here, badge_fellowship_partner
FROM organizations
WHERE badge_hbs_founder OR badge_alumni_work_here OR badge_fellowship_partner
ORDER BY name;