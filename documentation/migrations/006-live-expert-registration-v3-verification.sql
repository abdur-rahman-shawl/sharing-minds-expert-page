-- Read-only verification for migration 006.

SELECT
  to_regclass('public.mentor_registration_drafts') AS drafts_table,
  to_regclass('public.mentor_registration_files') AS files_table,
  to_regclass('public.campaign_visits') AS campaign_visits_table;

SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('mentor_registration_drafts', 'mentor_registration_files')
ORDER BY c.relname;

SELECT column_name, data_type, udt_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'mentors'
  AND column_name IN (
    'registration_source',
    'registration_auth_method',
    'registration_schema_version',
    'registration_draft_id',
    'registration_submitted_at',
    'country_id',
    'state_id',
    'city_id',
    'other_industry',
    'other_expertise',
    'other_language',
    'attribution_visit_id',
    'attribution_captured_at'
  )
ORDER BY column_name;

SELECT COUNT(*) AS legacy_application_count
FROM mentor_applications;

SELECT
  COUNT(*) FILTER (WHERE registration_source IS NULL) AS existing_unclassified_mentors,
  COUNT(*) FILTER (
    WHERE registration_source = 'LIVE_EXPERT_REGISTRATION'
  ) AS live_v3_mentors
FROM mentors;

SELECT
  conname,
  conrelid::regclass AS table_name
FROM pg_constraint
WHERE conname IN (
  'mentors_attribution_visit_fk',
  'mentors_attribution_timestamp_check',
  'mentor_registration_drafts_completion_check',
  'mentor_registration_drafts_attribution_timestamp_check',
  'consent_events_mentor_id_fkey'
)
ORDER BY conname;
