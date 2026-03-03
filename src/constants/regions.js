/**
 * Canonical region hierarchy for the SE Career Explorer.
 *
 * Key   = parent region name  (top-level filter option, also a valid DB row)
 * Value = sub-region names    (leaf nodes — the level at which orgs are tagged)
 *
 * "Global" has no sub-regions; it is both a parent and a taggable value.
 *
 * Filtering rule: selecting a parent matches ALL its sub-regions (via expandRegions).
 * Tagging rule:   orgs are always tagged at the most specific (leaf) level.
 */
export const REGION_HIERARCHY = {
  "Global":                     [],
  "North America":              ["US National", "Canada"],
  "Latin America & Caribbean":  ["Mexico & Central America", "South America", "Caribbean"],
  "Europe":                     ["Western Europe", "Eastern Europe"],
  "Africa":                     ["Sub-Saharan Africa", "East Africa", "West Africa", "Southern Africa", "Central Africa"],
  "Middle East & North Africa": ["North Africa", "Levant & Middle East", "Gulf States"],
  "Asia":                       ["South Asia", "Southeast Asia", "East Asia", "Central Asia"],
};

/** Ordered list of top-level parent region names */
export const PARENT_REGIONS = Object.keys(REGION_HIERARCHY);

/** All sub-region leaf names across all parents */
export const ALL_SUB_REGIONS = Object.values(REGION_HIERARCHY).flat();

/**
 * All valid region names for tagging orgs.
 * = "Global" (standalone) + every sub-region leaf.
 * Parent names (Africa, Asia …) are NOT in this list — they are filter-only.
 */
export const TAGGABLE_REGIONS = ["Global", ...ALL_SUB_REGIONS];

/**
 * Expand a single filter selection to all DB values it should match.
 *   "Africa"     → ["Africa", "Sub-Saharan Africa", "East Africa", …]
 *   "East Africa" → ["East Africa"]
 *   "Global"     → ["Global"]
 */
export function expandRegion(region) {
  const children = REGION_HIERARCHY[region];
  if (children !== undefined && children.length > 0) {
    return [region, ...children];
  }
  return [region];
}

/**
 * Expand a list of selected regions (may mix parents + sub-regions)
 * to the full set of DB values that should match.
 */
export function expandRegions(selectedRegions) {
  return [...new Set(selectedRegions.flatMap(expandRegion))];
}

/**
 * Return the parent region name for a given sub-region, or null if
 * the region is a parent itself or unrecognised.
 */
export function getParent(region) {
  for (const [parent, children] of Object.entries(REGION_HIERARCHY)) {
    if (children.includes(region)) return parent;
  }
  return null;
}
