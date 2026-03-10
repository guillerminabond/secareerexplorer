/**
 * security.js
 *
 * Shared utilities for input validation, URL sanitization, and rate limiting.
 * Import these helpers in any component or API module that handles user input.
 */

// ── Field length limits ───────────────────────────────────────
export const LIMITS = {
  NAME:        255,
  DESCRIPTION: 3000,
  URL:         500,
  SHORT_TEXT:  500,
  MESSAGE:     5000,
  EMAIL:       255,
};

// ── URL safety ────────────────────────────────────────────────

/**
 * Returns true only if the URL uses http: or https: protocol.
 * Rejects javascript:, data:, vbscript:, and other dangerous schemes.
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length > LIMITS.URL) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Returns the URL string if it is safe, otherwise returns null.
 * Use this before putting any user-submitted URL into an href attribute.
 */
export function sanitizeUrl(url) {
  return isSafeUrl(url) ? url.trim() : null;
}

// ── Text validation ───────────────────────────────────────────

/**
 * Validates a text field. Returns { valid: true, value } on success,
 * or { valid: false, error } on failure.
 */
export function validateText(value, maxLength, required = false) {
  if (!value || !value.trim()) {
    if (required) return { valid: false, error: 'This field is required.' };
    return { valid: true, value: null };
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Must be ${maxLength} characters or fewer (currently ${trimmed.length}).` };
  }
  return { valid: true, value: trimmed };
}

/**
 * Validates an email address format. Returns true for empty/null (field is optional).
 */
export function isValidEmail(email) {
  if (!email || !email.trim()) return true; // optional
  if (email.trim().length > LIMITS.EMAIL) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ── Client-side rate limiting ─────────────────────────────────
// Uses sessionStorage so limits reset when the tab is closed.

const RATE_WINDOW_MS  = 60 * 1000; // 1-minute window
const RATE_MAX_CALLS  = 5;         // max submissions per window per action

/**
 * Checks whether the given action key has exceeded the rate limit.
 *
 * @param {string} actionKey  A short identifier, e.g. "nominate" or "feedback"
 * @returns {{ allowed: boolean, retryAfter?: number }}
 *          retryAfter is in seconds if allowed === false
 */
export function checkRateLimit(actionKey) {
  const storageKey = `hbsse_rl_${actionKey}`;
  const now = Date.now();

  let timestamps = [];
  try {
    const raw = sessionStorage.getItem(storageKey);
    timestamps = raw ? JSON.parse(raw) : [];
  } catch {
    timestamps = [];
  }

  // Keep only timestamps within the current window
  const recent = timestamps.filter(t => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_MAX_CALLS) {
    const oldestInWindow = recent[0];
    const retryAfter = Math.ceil((oldestInWindow + RATE_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  try {
    sessionStorage.setItem(storageKey, JSON.stringify([...recent, now]));
  } catch {
    // sessionStorage unavailable — allow the action but don't track
  }

  return { allowed: true };
}
