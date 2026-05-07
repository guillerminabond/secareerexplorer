-- Migration: Merge B Corporation, Hybrid, Cooperative → Social Enterprise
-- Run this in the Supabase SQL Editor AFTER deploying the frontend changes.
-- The frontend already has backward-compat logic, so order doesn't matter.

-- 1. Update org_type values
UPDATE organizations SET org_type = 'Social Enterprise' WHERE org_type IN ('B Corporation', 'Hybrid', 'Cooperative');

-- 2. Verify the merge
SELECT org_type, COUNT(*) FROM organizations GROUP BY org_type ORDER BY count DESC;
