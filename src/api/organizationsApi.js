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
  hiring_status,
  size,
  hq,
  year_established,
  hbs_note,
  hbs_relevance,
  notable_alumni,
  created_date,
  org_type:org_types(id, name),
  employee_range:employee_ranges(id, label),
  org_cause_areas:organization_cause_areas(cause_area:cause_areas(id, name)),
  org_role_types:organization_role_types(role_type:role_types(id, name)),
  org_regions:organization_regions(region:regions(id, name)),
  org_target_populations:organization_target_populations(target_population:target_populations(id, name))
`

// ── Transform joined row → flat app-friendly object ─────────
function transformOrg(row) {
  return {
    ...row,
    org_type:           row.org_type?.name        ?? '',
    org_type_id:        row.org_type?.id           ?? null,
    employees:          row.employee_range?.label  ?? '',
    employee_range_id:  row.employee_range?.id     ?? null,
    cause_areas:        (row.org_cause_areas        ?? []).map(x => x.cause_area.name),
    role_types:         (row.org_role_types         ?? []).map(x => x.role_type.name),
    regions:            (row.org_regions            ?? []).map(x => x.region.name),
    target_populations: (row.org_target_populations ?? []).map(x => x.target_population.name),
    // remove raw join fields
    org_cause_areas: undefined,
    org_role_types: undefined,
    org_regions: undefined,
    org_target_populations: undefined,
    employee_range: undefined,
  }
}

// ── Lookup: name → id for any lookup table ───────────────────
async function lookupId(table, name) {
  if (!name) return null
  const { data } = await supabase.from(table).select('id').eq('name', name).single()
  return data?.id ?? null
}

async function lookupIds(table, names = []) {
  if (!names.length) return []
  const { data } = await supabase.from(table).select('id, name').in('name', names)
  return data ?? []
}

// ── Upsert junction table records ────────────────────────────
async function replaceJunction(junctionTable, orgId, fkColumn, ids) {
  await supabase.from(junctionTable).delete().eq('organization_id', orgId)
  if (ids.length === 0) return
  const rows = ids.map(id => ({ organization_id: orgId, [fkColumn]: id }))
  const { error } = await supabase.from(junctionTable).insert(rows)
  if (error) throw error
}

// ── PUBLIC API ───────────────────────────────────────────────

/** Fetch all organizations (flat, app-friendly format) */
export async function fetchOrgs() {
  const { data, error } = await supabase
    .from('organizations')
    .select(ORG_SELECT)
    .order('created_date', { ascending: false })
    .limit(200)
  if (error) throw error
  return (data ?? []).map(transformOrg)
}

/** Create a new organization */
export async function createOrg(form) {
  const orgTypeId      = await lookupId('org_types',       form.org_type)
  const employeeRangeId = await lookupId('employee_ranges', form.employees)

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name:              form.name,
      description:       form.description,
      website:           form.website,
      org_type_id:       orgTypeId,
      employee_range_id: employeeRangeId,
      hiring_status:     form.hiring_status,
      size:              form.size,
      hq:                form.hq,
      year_established:  form.year_established,
      hbs_note:          form.hbs_note,
      notable_alumni:    form.notable_alumni,
      created_date:      new Date().toISOString(),
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

  const { error } = await supabase
    .from('organizations')
    .update({
      name:              form.name,
      description:       form.description,
      website:           form.website,
      org_type_id:       orgTypeId,
      employee_range_id: employeeRangeId,
      hiring_status:     form.hiring_status,
      size:              form.size,
      hq:                form.hq,
      year_established:  form.year_established,
      hbs_note:          form.hbs_note,
      notable_alumni:    form.notable_alumni,
    })
    .eq('id', id)
  if (error) throw error

  await _saveJunctions(id, form)
}

/** Delete an organization (junction rows cascade automatically) */
export async function deleteOrg(id) {
  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) throw error
}

/** Fetch all lookup table options (for dropdowns / filters) */
export async function fetchLookups() {
  const [orgTypes, causeAreas, roleTypes, regionsList, populations, empRanges] =
    await Promise.all([
      supabase.from('org_types').select('id, name').order('name'),
      supabase.from('cause_areas').select('id, name').order('name'),
      supabase.from('role_types').select('id, name').order('name'),
      supabase.from('regions').select('id, name').order('name'),
      supabase.from('target_populations').select('id, name').order('name'),
      supabase.from('employee_ranges').select('id, label, sort_order').order('sort_order'),
    ])
  return {
    org_types:          (orgTypes.data     ?? []).map(r => r.name),
    cause_areas:        (causeAreas.data   ?? []).map(r => r.name),
    role_types:         (roleTypes.data    ?? []).map(r => r.name),
    regions:            (regionsList.data  ?? []).map(r => r.name),
    target_populations: (populations.data  ?? []).map(r => r.name),
    employee_ranges:    (empRanges.data    ?? []).map(r => r.label),
  }
}

// ── Internal: save junction tables for an org ────────────────
async function _saveJunctions(orgId, form) {
  const [caRows, rtRows, rRows, tpRows] = await Promise.all([
    lookupIds('cause_areas',        form.cause_areas        ?? []),
    lookupIds('role_types',         form.role_types         ?? []),
    lookupIds('regions',            form.regions            ?? []),
    lookupIds('target_populations', form.target_populations ?? []),
  ])

  await Promise.all([
    replaceJunction('organization_cause_areas',        orgId, 'cause_area_id',         caRows.map(r => r.id)),
    replaceJunction('organization_role_types',         orgId, 'role_type_id',           rtRows.map(r => r.id)),
    replaceJunction('organization_regions',            orgId, 'region_id',              rRows.map(r => r.id)),
    replaceJunction('organization_target_populations', orgId, 'target_population_id',   tpRows.map(r => r.id)),
  ])
}
