/**
 * feedbackTypes.js
 *
 * Single source of truth for allowed feedback type values.
 * Import this constant in both FeedbackModal.jsx (UI) and feedbackApi.js
 * (server-side whitelist) to keep them in sync.
 */

export const FEEDBACK_TYPES = [
  'General',
  'Bug',
  'Feature Request',
  'Suggestion',
  'Content',
  'Missing Org',
  'Other',
];
