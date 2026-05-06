/**
 * organizationsApi.js
 *
 * All database operations for organizations, handling the normalized
 * schema (lookup tables + junction tables) while presenting a simple
 * flat object interface to the rest of the app.
 *
 * The rest of the app uses orgs that look like:
 *   { id, name, org_type: "Nonprofit", cause_areas: ["Education", ...], ... }
 *
 * This module handles the join/transform complexity internally.
 */

import { supabase } from './supabaseClient'

// ── Supabase select string with all joins ────────────────────
const ORG_SELECT = `
  id,
  name,
  description,
  website,
  size,
  hq,
  industry,
  year_established,
  hbs_note,
  notable_alumni,
  created_date,
  saves,
  badge_alumni_work_here,
  badge_fellowship_partner,
  badge_hbs_founder,
  org_type:org_types(id, name),
  employee_range:employee_ranges(id, label),
  aum_range:aum_ranges(id, label, sort_order),
  org_cause_areas:organization_cause_areas(cause_area:cause_areas(id, name)),
  org_role_types:organization_role_types(role_type:role_types(id, name)),
  org_regions:organization_regions(region:regions(id, name)),
  org_target_populations:organization_target_populations(target_population:target_populations(id, name)),
  org_cause_subtopics:organization_cause_subtopics(cause_subtopic:cause_subtopics(id, name)),
  org_investor_types:organization_investor_types(investor_type:investor_types(id, name))
`

// ── Transform joined row → flat app-friendly object ─────────
function transformOrg(row) {
  return {
    ...row,
    org_type:               row.org_type?.name        ?? '',
    org_type_id:            row.org_type?.id           ?? null,
    employees:              row.employee_range?.label  ?? '',
    employee_range_id:      row.employee_range?.id     ?? null,
    aum_range:              row.aum_range?.label       ?? '',
    aum_range_id:           row.aum_range?.id          ?? null,
    cause_areas:            (row.org_cause_areas        ?? []).map(x => x.cause_area.name),
    role_types:             (row.org_role_types         ?? []).map(x => x.role_type.name),
    regions:                (row.org_regions            ?? []).map(x => x.region.name),
    target_populations:     (row.org_target_populations ?? []).map(x => x.target_population.name),
    cause_subtopics:        (row.org_cause_subtopics    ?? []).map(x => x.cause_subtopic.name),
    investor_types:         (row.org_investor_types     ?? []).map(x => x.investor_type.name),
    industry:               row.industry               ?? '',
    // scalar fields — passed through as-is
    saves:                  row.saves                  ?? 0,
    badge_alumni_work_here:  row.badge_alumni_work_here  ?? false,
    badge_fellowship_partner: row.badge_fellowship_partner ?? false,
    badge_hbs_founder:       row.badge_hbs_founder       ?? false,
    // remove raw join fields
    org_cause_areas: undefined,
    org_role_types: undefined,
    org_regions: undefined,
    org_target_populations: undefined,
    org_cause_subtopics: undefined,
    org_investor_types: undefined,
    employee_range: undefined,
    aum_range: undefined,
  }
}

// ── Lookup: name → id for any lookup table ───────────────────
async function lookupId(table, name, column = 'name') {
  if (!name) return null
  const { data } = await supabase.from(table).select('id').eq(column, name).single()
  return data?.id ?? null
}

async function lookupIds(table, names = []) {
  if (!names.length) return []
  const { data } = await supabase.from(table).select('id, name').in('name', names)
  return data ?? []
}

// ── Upsert junction table records ────────────────────────────
//
// WARNING: This is a non-atomic two-step operation (delete then insert).
// If the insert fails after a successful delete, the junction rows are lost
// until the user saves again.  A safer approach is to wrap both statements
// in a single Supabase RPC transaction.  Refactor to use TanStack Query +
// an RPC when time allows.
async function replaceJunction(junctionTable, orgId, fkColumn, ids) {
  const { error: deleteError } = await supabase
    .from(junctionTable)
    .delete()
    .eq('organization_id', orgId)
  if (deleteError) throw deleteError

  if (ids.length === 0) return

  const rows = ids.map(id => ({ organization_id: orgId, [fkColumn]: id }))
  const { error: insertError } = await supabase.from(junctionTable).insert(rows)
  if (insertError) {
    // Delete already ran — junction rows are gone.  Log loudly so the caller
    // can surface the error and prompt the user to save again.
    console.error(
      `[replaceJunction] Insert failed for ${junctionTable} (org ${orgId}) after delete. ` +
      'Data may be in an inconsistent state. Re-save to recover.',
      insertError
    )
    throw insertError
  }
}

// ── In-memory cache ──────────────────────────────────────────
// Shared across all components for the lifetime of the browser session.
// Invalidated automatically after every mutation (create / update / delete).
//
// ⚠️  KNOWN RISKS — do not expand this pattern; prefer TanStack Query instead:
//   1. Stale across HMR: Vite hot-module replacement does NOT reset module-level
//      variables, so during development _orgsCache persists across file saves and
//      can serve stale data until a full page reload.
//   2. Breaks tests: unit/integration tests that import this module in the same
//      process will share cache state across test cases, causing flaky failures.
//   3. No React Suspense / error-boundary integration.
//
// TODO: Replace with TanStack Query's cache (useQuery / QueryClient) when
//       refactoring.  TanStack handles deduplication, background revalidation,
//       TTL, and test isolation automatically.
let _orgsCache  = null   // { data: Org[], ts: number } | null
let _orgsFlight = null   // in-flight Promise (deduplicate simultaneous callers)
const ORGS_TTL  = 3 * 60 * 1000  // 3 minutes

/** Force the next fetchOrgs() call to hit the database */
export function invalidateOrgsCache() {
  _orgsCache  = null
  _orgsFlight = null
}

// ── PUBLIC API ───────────────────────────────────────────────

/**
 * Fetch all organizations (flat, app-friendly format).
 * Results are cached for 3 minutes.  Concurrent callers within the same
 * tick share one in-flight request instead of issuing duplicate queries.
 */
export async function fetchOrgs() {
  // 1. Serve from cache if still fresh
  if (_orgsCache && (Date.now() - _orgsCache.ts) < ORGS_TTL) {
    return _orgsCache.data
  }
  // 2. Deduplicate: if another caller already fired the request, piggyback
  if (_orgsFlight) return _orgsFlight

  // 3. Fire the request and cache the result
  _orgsFlight = supabase
    .from('organizations')
    .select(ORG_SELECT)
    .order('name', { ascending: true })
    .then(({ data, error }) => {
      _orgsFlight = null
      if (error) throw error
      const result = (data ?? []).map(transformOrg)
      _orgsCache = { data: result, ts: Date.now() }
      return result
    })
    .catch(err => {
      _orgsFlight = null   // don't cache errors
      throw err
    })

  return _orgsFlight
}

/** Create a new organization */
export async function createOrg(form) {
  const orgTypeId       = await lookupId('org_types',       form.org_type)
  const employeeRangeId = await lookupId('employee_ranges', form.employees)
  const aumRangeId      = await lookupId('aum_ranges',      form.aum_range, 'label')

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name:                    form.name,
      description:             form.description,
      website:                 form.website,
      org_type_id:             orgTypeId,
      employee_range_id:       employeeRangeId,
      aum_range_id:            aumRangeId,
      size:                    form.size,
      hq:                      form.hq,
      industry:                form.industry || null,
      year_established:        form.year_established,
      hbs_note:                form.hbs_note,
      notable_alumni:          form.notable_alumni,
      created_date:            new Date().toISOString(),
      badge_alumni_work_here:  form.badge_alumni_work_here  || false,
      badge_fellowship_partner: form.badge_fellowship_partner || false,
      badge_hbs_founder:       form.badge_hbs_founder       || false,
    })
    .select('id')
    .single()
  if (error) throw error

  const orgId = data.id
  await _saveJunctions(orgId, form)
  invalidateOrgsCache()
  return orgId
}

/** Update an existing organization */
export async function updateOrg(id, form) {
  const orgTypeId       = await lookupId('org_types',       form.org_type)
  const employeeRangeId = await lookupId('employee_ranges', form.employees)
  const aumRangeId      = await lookupId('aum_ranges',      form.aum_range, 'label')

  const { error } = await supabase
    .from('organizations')
    .update({
      name:                    form.name,
      description:             form.description,
      website:                 form.website,
      org_type_id:             orgTypeId,
      employee_range_id:       employeeRangeId,
      aum_range_id:            aumRangeId,
      size:                    form.size,
      hq:                      form.hq,
      industry:                form.industry || null,
      year_established:        form.year_established,
      hbs_note:                form.hbs_note,
      notable_alumni:          form.notable_alumni,
      badge_alumni_work_here:  form.badge_alumni_work_here  || false,
      badge_fellowship_partner: form.badge_fellowship_partner || false,
      badge_hbs_founder:       form.badge_hbs_founder       || false,
    })
    .eq('id', id)
  if (error) throw error

  await _saveJunctions(id, form)
  invalidateOrgsCache()
}

/**
 * Atomically increment (+1) or decrement (-1) the saves counter for an org.
 * Requires the `increment_saves` RPC to be deployed in Supabase.
 * Fails silently so a missing RPC doesn't break the save UX.
 */
export async function updateSavesCount(orgId, delta) {
  const { error } = await supabase.rpc('increment_saves', { org_id: orgId, delta })
  if (error) console.warn('updateSavesCount failed (run add_saves_and_badges.sql):', error.message)
}

/** Delete an organization (junction rows cascade automatically) */
export async function deleteOrg(id) {
  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) throw error
  invalidateOrgsCache()
}

/** Fetch all lookup table options (for dropdowns / filters) */
export async function fetchLookups() {
  const [orgTypes, causeAreas, roleTypes, regionsList, populations, empRanges, causeSubtopics, aumRanges, investorTypes] =
    await Promise.all([
      supabase.from('org_types').select('id, name').order('name'),
      supabase.from('cause_areas').select('id, name').order('name'),
      supabase.from('role_types').select('id, name').order('name'),
      supabase.from('regions').select('id, name').order('name'),
      supabase.from('target_populations').select('id, name').order('name'),
      supabase.from('employee_ranges').select('id, label, sort_order').order('sort_order'),
      supabase.from('cause_subtopics').select('id, name, cause_area_id, cause_area:cause_areas(name)').order('name'),
      supabase.from('aum_ranges').select('id, label, sort_order').order('sort_order'),
      supabase.from('investor_types').select('id, name').order('name'),
    ])
  return {
    org_types:          (orgTypes.data     ?? []).map(r => r.name),
    cause_areas:        (causeAreas.data   ?? []).map(r => r.name),
    role_types:         (roleTypes.data    ?? []).map(r => r.name),
    regions:            (regionsList.data  ?? []).map(r => r.name),
    target_populations: (populations.data  ?? []).map(r => r.name),
    employee_ranges:    (empRanges.data    ?? []).map(r => r.label),
    aum_ranges:         (aumRanges.data    ?? []).map(r => r.label),
    investor_types:     (investorTypes.data ?? []).map(r => r.name),
    // cause_subtopics grouped by cause area name for easy lookup in forms/filters
    cause_subtopics_by_cause: (causeSubtopics.data ?? []).reduce((acc, r) => {
      const cause = r.cause_area?.name;
      if (!cause) return acc;
      if (!acc[cause]) acc[cause] = [];
      acc[cause].push(r.name);
      return acc;
    }, {}),
  }
}

// ── Internal: save junction tables for an org ────────────────
async function _saveJunctions(orgId, form) {
  const [caRows, rtRows, rRows, tpRows, csRows, itRows] = await Promise.all([
    lookupIds('cause_areas',        form.cause_areas        ?? []),
    lookupIds('role_types',         form.role_types         ?? []),
    lookupIds('regions',            form.regions            ?? []),
    lookupIds('target_populations', form.target_populations ?? []),
    lookupIds('cause_subtopics',    form.cause_subtopics    ?? []),
    lookupIds('investor_types',     form.investor_types     ?? []),
  ])

  await Promise.all([
    replaceJunction('organization_cause_areas',        orgId, 'cause_area_id',         caRows.map(r => r.id)),
    replaceJunction('organization_role_types',         orgId, 'role_type_id',           rtRows.map(r => r.id)),
    replaceJunction('organization_regions',            orgId, 'region_id',              rRows.map(r => r.id)),
    replaceJunction('organization_target_populations', orgId, 'target_population_id',   tpRows.map(r => r.id)),
    replaceJunction('organization_cause_subtopics',    orgId, 'cause_subtopic_id',      csRows.map(r => r.id)),
    replaceJunction('organization_investor_types',     orgId, 'investor_type_id',       itRows.map(r => r.id)),
  ])
}
