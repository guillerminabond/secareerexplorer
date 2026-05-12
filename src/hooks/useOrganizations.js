import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

// ── Supabase select string with all joins ────────────────────
const ORG_SELECT = `
  id,
  name,
  description,
  website,
  size,
  hq,
  industry,
  year_established,
  hbs_note,
  notable_alumni,
  created_date,
  saves,
  badge_alumni_work_here,
  badge_fellowship_partner,
  badge_hbs_founder,
  org_type:org_types(id, name),
  employee_range:employee_ranges(id, label),
  aum_range:aum_ranges(id, label, sort_order),
  org_cause_areas:organization_cause_areas(cause_area:cause_areas(id, name)),
  org_role_types:organization_role_types(role_type:role_types(id, name)),
  org_regions:organization_regions(region:regions(id, name)),
  org_target_populations:organization_target_populations(target_population:target_populations(id, name)),
  org_cause_subtopics:organization_cause_subtopics(cause_subtopic:cause_subtopics(id, name)),
  org_investor_types:organization_investor_types(investor_type:investor_types(id, name))
`;

// ── Transform joined row → flat app-friendly object ─────────
function transformOrg(row) {
  return {
    ...row,
    org_type:               row.org_type?.name        ?? "",
    org_type_id:            row.org_type?.id           ?? null,
    employees:              row.employee_range?.label  ?? "",
    employee_range_id:      row.employee_range?.id     ?? null,
    aum_range:              row.aum_range?.label       ?? "",
    aum_range_id:           row.aum_range?.id          ?? null,
    cause_areas:            (row.org_cause_areas        ?? []).map(x => x.cause_area.name),
    role_types:             (row.org_role_types         ?? []).map(x => x.role_type.name),
    regions:                (row.org_regions            ?? []).map(x => x.region.name),
    target_populations:     (row.org_target_populations ?? []).map(x => x.target_population.name),
    cause_subtopics:        (row.org_cause_subtopics    ?? []).map(x => x.cause_subtopic.name),
    investor_types:         (row.org_investor_types     ?? []).map(x => x.investor_type.name),
    industry:               row.industry               ?? "",
    saves:                  row.saves                  ?? 0,
    badge_alumni_work_here:  row.badge_alumni_work_here  ?? false,
    badge_fellowship_partner: row.badge_fellowship_partner ?? false,
    badge_hbs_founder:       row.badge_hbs_founder       ?? false,
    // remove raw join fields
    org_cause_areas: undefined,
    org_role_types: undefined,
    org_regions: undefined,
    org_target_populations: undefined,
    org_cause_subtopics: undefined,
    org_investor_types: undefined,
    employee_range: undefined,
    aum_range: undefined,
  };
}

async function fetchAllOrgs() {
  const { data, error } = await supabase
    .from("organizations")
    .select(ORG_SELECT)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(transformOrg);
}

export const ORGS_QUERY_KEY = ["organizations"];

/**
 * Shared hook for fetching organizations via TanStack Query.
 * All components that need orgs should use this — it deduplicates
 * concurrent requests, caches for 3 minutes, and background-revalidates.
 *
 * Returns { orgs, isLoading, error, refetch }
 */
export function useOrganizations() {
  const query = useQuery({
    queryKey: ORGS_QUERY_KEY,
    queryFn: fetchAllOrgs,
    staleTime: 3 * 60 * 1000,     // 3 minutes — matches the old TTL
    gcTime: 10 * 60 * 1000,       // keep in cache 10 min after last subscriber unmounts
  });

  return {
    orgs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Call this after mutations (create, update, delete) to
 * invalidate the cache and trigger a refetch in all mounted components.
 */
export function useInvalidateOrgs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ORGS_QUERY_KEY });
}
