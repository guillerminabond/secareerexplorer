import { useState, useCallback, useSyncExternalStore } from "react";
import { updateSavesCount } from "@/api/organizationsApi";

const STORAGE_KEY = "hbs_saved_orgs";

// ── Shared external store so all components stay in sync ─────
// When one component saves an org, other mounted components
// see the change immediately without prop drilling.

let _savedIds = [];
try {
  _savedIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
} catch {
  _savedIds = [];
}

const listeners = new Set();

function emitChange() {
  listeners.forEach(fn => fn());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return _savedIds;
}

function persist(next) {
  _savedIds = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  emitChange();
}

/**
 * Shared hook for managing saved organization IDs.
 *
 * Returns { savedIds, toggleSave, isSaved }
 *
 * toggleSave(id) also fires the server-side saves counter update.
 */
export function useSavedOrgs() {
  const savedIds = useSyncExternalStore(subscribe, getSnapshot);

  const toggleSave = useCallback((id) => {
    const isCurrentlySaved = _savedIds.includes(id);
    const delta = isCurrentlySaved ? -1 : 1;
    const next = isCurrentlySaved
      ? _savedIds.filter(i => i !== id)
      : [..._savedIds, id];
    persist(next);
    // Fire-and-forget server-side counter update
    updateSavesCount(id, delta);
    return delta;
  }, []);

  const isSaved = useCallback((id) => _savedIds.includes(id), [savedIds]);

  return { savedIds, toggleSave, isSaved };
}
