import { supabase } from './supabaseClient'

export async function submitNomination(nomination) {
  const { error } = await supabase
    .from('org_nominations')
    .insert(nomination)
  if (error) throw error
}

export async function fetchNominations(status = null) {
  let query = supabase
    .from('org_nominations')
    .select('*')
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
