/**
 * organizationsApi.js
 *
 * Mutation operations for organizations (create, update, delete).
 * Read/fetch operations have moved to src/hooks/useOrganizations.js
 * which uses TanStack Query for caching and deduplication.
 *
 * After any mutation, callers should call invalidateOrgs() (from
 * the useInvalidateOrgs hook) to refresh the TanStack Query cache.
 */

import { supabase } from './supabaseClient'

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
// in a single Supabase RPC transaction.
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
    console.error(
      `[replaceJunction] Insert failed for ${junctionTable} (org ${orgId}) after delete. ` +
      'Data may be in an inconsistent state. Re-save to recover.',
      insertError
    )
    throw insertError
  }
}

// ── PUBLIC API ───────────────────────────────────────────────

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
