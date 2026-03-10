import { supabase } from './supabaseClient'

/** Fields safe to return to admin reviewers (excludes nothing here since
 *  nominations are now RLS-protected and only accessible when authenticated). */
const NOMINATION_SELECT = `
  id,
  name,
  website,
  description,
  org_type,
  cause_areas,
  regions,
  hbs_connection,
  submitted_by,
  status,
  admin_notes,
  created_at
`

export async function submitNomination(nomination) {
  const { error } = await supabase
    .from('org_nominations')
    .insert(nomination)
  if (error) throw error
}

export async function fetchNominations(status = null) {
  let query = supabase
    .from('org_nominations')
    .select(NOMINATION_SELECT)
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateNominationStatus(id, status, adminNotes = '') {
  const { error } = await supabase
    .from('org_nominations')
    .update({ status, admin_notes: adminNotes })
    .eq('id', id)
  if (error) throw error
}
