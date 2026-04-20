import { supabase } from './supabaseClient'

/**
 * Fetch all resources for a given section ('general' or 'hbs').
 * Returns array sorted by sort_order.
 */
export async function fetchResources(section) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('section', section)
    .order('sort_order', { ascending: true })
  if (error) { console.error('Failed to fetch resources:', error); return null; }
  // Map DB columns to the shape the UI expects
  return data.map(row => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    emoji: row.emoji || '',
    url: row.url,
    cta: row.cta || '',
    desc: row.description || '',
    tips: row.tips || [],
    tags: row.tags || [],
    featured: row.featured || false,
    dateAdded: row.date_added || '',
    sortOrder: row.sort_order,
  }))
}

/**
 * Insert a new resource.
 */
export async function insertResource(section, resource) {
  // Find the max sort_order for this section
  const { data: maxRow } = await supabase
    .from('resources')
    .select('sort_order')
    .eq('section', section)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (maxRow?.sort_order || 0) + 1

  const { data, error } = await supabase
    .from('resources')
    .insert({
      section,
      title: resource.title,
      subtitle: resource.subtitle || '',
      emoji: resource.emoji || '',
      url: resource.url,
      cta: resource.cta || '',
      description: resource.desc || '',
      tips: resource.tips || [],
      tags: resource.tags || [],
      featured: resource.featured || false,
      sort_order: nextOrder,
      date_added: resource.dateAdded || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Update an existing resource by id.
 */
export async function updateResource(id, resource) {
  const { error } = await supabase
    .from('resources')
    .update({
      title: resource.title,
      subtitle: resource.subtitle || '',
      emoji: resource.emoji || '',
      url: resource.url,
      cta: resource.cta || '',
      description: resource.desc || '',
      tips: resource.tips || [],
      tags: resource.tags || [],
      featured: resource.featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

/**
 * Delete a resource by id.
 */
export async function deleteResource(id) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
  if (error) throw error
}

/**
 * Toggle featured status for a resource.
 */
export async function toggleResourceFeatured(id, featured) {
  const { error } = await supabase
    .from('resources')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
