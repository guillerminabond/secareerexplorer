import { supabase } from './supabaseClient'
import { validateText, isValidEmail, checkRateLimit, LIMITS } from '@/lib/security'

/**
 * Save feedback to Supabase and optionally send an email via EmailJS REST API.
 * Email is best-effort — a failed send does NOT throw; the DB record is always saved.
 */
export async function submitFeedback({ name, email, type, message }) {
  // ── Rate limiting ──────────────────────────────────────────
  const rateCheck = checkRateLimit('feedback')
  if (!rateCheck.allowed) {
    throw new Error(`Too many submissions. Please wait ${rateCheck.retryAfter} seconds.`)
  }

  // ── Validation ─────────────────────────────────────────────
  const msgCheck = validateText(message, LIMITS.MESSAGE, true)
  if (!msgCheck.valid) throw new Error(`Message: ${msgCheck.error}`)

  if (name && name.trim().length > LIMITS.SHORT_TEXT) {
    throw new Error(`Name must be ${LIMITS.SHORT_TEXT} characters or fewer.`)
  }
  if (email && !isValidEmail(email)) {
    throw new Error('Please enter a valid email address.')
  }

  // Whitelist allowed feedback types to prevent injection via the type field
  const ALLOWED_TYPES = ['General', 'Bug', 'Feature Request', 'Missing Org', 'Other']
  const safeType = ALLOWED_TYPES.includes(type) ? type : 'General'

  // ── 1. Save to Supabase ────────────────────────────────────
  const { error } = await supabase.from('site_feedback').insert({
    name:    name?.trim()  || null,
    email:   email?.trim() || null,
    type:    safeType,
    message: msgCheck.value,
  })
  if (error) throw error

  // ── 2. Fire email notification (best-effort) ───────────────
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
            from_name:     name?.trim()  || 'Anonymous',
            from_email:    email?.trim() || 'Not provided',
            feedback_type: safeType,
            message:       msgCheck.value,
          },
        }),
      })
    } catch (err) {
      // Email failure is silent — feedback is already in DB
      if (import.meta.env.DEV) console.warn('[Feedback] Email notification failed:', err)
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
