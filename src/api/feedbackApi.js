import { supabase } from './supabaseClient'

/**
 * Save feedback to Supabase and optionally send an email via EmailJS REST API.
 * Email is best-effort — a failed send does NOT throw; the DB record is always saved.
 */
export async function submitFeedback({ name, email, type, message }) {
  // 1. Save to Supabase
  const { error } = await supabase.from('site_feedback').insert({
    name:    name    || null,
    email:   email   || null,
    type:    type    || 'General',
    message: message.trim(),
  })
  if (error) throw error

  // 2. Fire email notification (best-effort, requires env vars to be set)
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (serviceId && templateId && publicKey) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  serviceId,
          template_id: templateId,
          user_id:     publicKey,
          template_params: {
            from_name: name  || 'Anonymous',
            from_email: email || 'Not provided',
            feedback_type: type || 'General',
            message,
          },
        }),
      })
    } catch (_) {
      // Email failure is silent — feedback is already in DB
    }
  }
}

/** Fetch all feedback entries (admin only) */
export async function fetchFeedback() {
  const { data, error } = await supabase
    .from('site_feedback')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
