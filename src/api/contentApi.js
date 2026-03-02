import { supabase } from './supabaseClient'

/**
 * Fetch a content value by key from the site_content table.
 * Returns null if not found or on error.
 */
export async function fetchContent(key) {
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single()
  if (error || !data) return null
  return data.value
}

/**
 * Upsert a content value by key. Throws on error.
 */
export async function upsertContent(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
  if (error) throw error
}
