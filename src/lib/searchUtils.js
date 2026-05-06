// ── Shared search utilities ────────────────────────────────────────────────────
// Single source of truth for smart search parsing, keyword scoring, and synonym
// normalization. Used by QuizExplore, Home (Database tab), and AllOrgs.

// ── Smart search parser ───────────────────────────────────────────────────────
// Extracts structured conditions like "founded after 2003" from free-text input,
// returns the remaining keyword text + an array of filter conditions.

export const SEARCH_PATTERNS = [
  { regex: /(?:founded|established)\s+after\s+(\d{4})/i,                                      build: (m) => ({ field: "year_established", op: ">",       value: parseInt(m[1]),                          label: `Founded after ${m[1]}` }) },
  { regex: /(?:founded|established)\s+before\s+(\d{4})/i,                                     build: (m) => ({ field: "year_established", op: "<",       value: parseInt(m[1]),                          label: `Founded before ${m[1]}` }) },
  { regex: /(?:founded|established)\s+in\s+(\d{4})/i,                                         build: (m) => ({ field: "year_established", op: "=",       value: parseInt(m[1]),                          label: `Founded in ${m[1]}` }) },
  { regex: /(?:founded|established)\s+between\s+(\d{4})\s+(?:and|to|-)\s+(\d{4})/i,           build: (m) => ({ field: "year_established", op: "between", value: [parseInt(m[1]), parseInt(m[2])],        label: `Founded ${m[1]}–${m[2]}` }) },
  { regex: /older\s+than\s+(\d+)\s+years?/i,                                                  build: (m) => ({ field: "year_established", op: "<",       value: new Date().getFullYear() - parseInt(m[1]), label: `Older than ${m[1]} years` }) },
  { regex: /(?:newer|younger)\s+than\s+(\d+)\s+years?/i,                                      build: (m) => ({ field: "year_established", op: ">",       value: new Date().getFullYear() - parseInt(m[1]), label: `Newer than ${m[1]} years` }) },
];

export function parseSearch(raw) {
  let remaining = raw;
  const conditions = [];
  for (const { regex, build } of SEARCH_PATTERNS) {
    const match = remaining.match(regex);
    if (match) {
      conditions.push(build(match));
      remaining = remaining.replace(match[0], "").trim();
    }
  }
  remaining = remaining.replace(/^\s*(and|,)\s*/i, "").replace(/\s*(and|,)\s*$/i, "").trim();
  return { keyword: remaining, conditions };
}

export function matchesCondition(org, cond) {
  if (cond.field === "year_established") {
    const year = parseInt(org.year_established);
    if (isNaN(year)) return false;
    if (cond.op === ">")       return year > cond.value;
    if (cond.op === "<")       return year < cond.value;
    if (cond.op === "=")       return year === cond.value;
    if (cond.op === "between") return year >= cond.value[0] && year <= cond.value[1];
  }
  return true;
}

/**
 * Remove a single smart-filter condition from the raw search string.
 * Returns the cleaned string with the matched pattern stripped out.
 */
export function removeCondition(rawSearch, conditionLabel) {
  let cleaned = rawSearch;
  for (const p of SEARCH_PATTERNS) {
    const m = cleaned.match(p.regex);
    if (m && p.build(m).label === conditionLabel) {
      cleaned = cleaned.replace(p.regex, "").replace(/\s+/g, " ").trim();
      break;
    }
  }
  return cleaned;
}

// ── Synonym normalization ─────────────────────────────────────────────────────
const SYNONYMS = [
  [/\binvestors?\b/gi, "investing"],
  [/\bnon-?profits?\b/gi, "nonprofit"],
  [/\bngos?\b/gi, "nonprofit"],
  [/\bcorps?\b/gi, "corporation"],
  [/\bgovt?\b/gi, "government"],
];

function normalize(text) {
  let out = text;
  for (const [pattern, replacement] of SYNONYMS) out = out.replace(pattern, replacement);
  return out;
}

// ── Term scoring ──────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "in", "for", "the", "and", "or", "a", "an", "with", "of", "at", "to", "by",
  "that", "is", "are", "was", "on", "about", "from", "i", "my", "me", "want",
  "looking", "find", "work", "job", "career", "focused", "based", "working",
]);

function termScore(org, term) {
  const t = normalize(term);
  const fields = [
    { text: normalize((org.name || "").toLowerCase()),                         weight: 5 },
    { text: normalize((org.org_type || "").toLowerCase()),                     weight: 3 },
    { text: normalize((org.industry || "").toLowerCase()),                     weight: 3 },
    { text: normalize((org.cause_areas || []).join(" ").toLowerCase()),        weight: 3 },
    { text: normalize((org.regions || []).join(" ").toLowerCase()),            weight: 3 },
    { text: normalize((org.role_types || []).join(" ").toLowerCase()),         weight: 2 },
    { text: normalize((org.target_populations || []).join(" ").toLowerCase()), weight: 2 },
    { text: normalize((org.description || "").toLowerCase()),                  weight: 1 },
  ];
  let score = 0;
  for (const { text, weight } of fields) {
    if (text.includes(t)) score += weight;
  }
  return score;
}

// ── Main search function ──────────────────────────────────────────────────────
// Returns { mode, results, terms, conditions, matchedCount, totalTerms, missing }
//   mode: "idle" | "full" | "partial" | "none"

export function searchOrgs(orgs, query) {
  const raw = query?.trim() ?? "";
  if (raw.length < 2) return { mode: "idle" };

  // 1. Extract structured conditions
  const { keyword, conditions } = parseSearch(raw);

  // 2. Pre-filter by structured conditions
  let pool = orgs;
  if (conditions.length > 0) {
    pool = orgs.filter(org => conditions.every(c => matchesCondition(org, c)));
  }

  // 3. No keywords — return all condition-matched orgs
  if (!keyword && conditions.length > 0) {
    return { mode: "full", results: pool, terms: [], conditions };
  }

  // 4. Tokenize remaining keywords
  const terms = keyword.toLowerCase().split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t));
  if (!terms.length && !conditions.length) return { mode: "idle" };
  if (!terms.length && conditions.length) return { mode: "full", results: pool, terms: [], conditions };

  // 5. Score each org against each term
  const scored = pool.map(org => {
    const perTerm   = terms.map(t => ({ term: t, score: termScore(org, t) }));
    const matched   = perTerm.filter(r => r.score > 0);
    const unmatched = perTerm.filter(r => r.score === 0);
    return { org, matched, unmatched, totalScore: matched.reduce((s, r) => s + r.score, 0) };
  });

  // 6. Full matches first
  const full = scored.filter(s => s.unmatched.length === 0)
    .sort((a, b) => b.totalScore - a.totalScore).map(s => s.org);
  if (full.length > 0) return { mode: "full", results: full, terms, conditions };

  // 7. Partial matches
  const maxMatched = Math.max(0, ...scored.map(s => s.matched.length));
  if (maxMatched === 0) return { mode: "none", terms, conditions };

  const partials = scored.filter(s => s.matched.length === maxMatched)
    .sort((a, b) => b.totalScore - a.totalScore);
  const unmatchedFreq = {};
  partials.forEach(p => p.unmatched.forEach(r => {
    unmatchedFreq[r.term] = (unmatchedFreq[r.term] || 0) + 1;
  }));
  const missing = Object.entries(unmatchedFreq).sort((a, b) => b[1] - a[1]).map(([t]) => t);

  return {
    mode: "partial",
    results: partials.map(s => s.org),
    terms,
    matchedCount: maxMatched,
    totalTerms: terms.length,
    missing,
    conditions,
  };
}
