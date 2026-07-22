-- Read-only verification for 004-expert-application-v2.sql.
-- Expected result: both "missing" queries return zero rows.

WITH expected(table_name, column_name) AS (
  VALUES
    ('mentor_applications', 'professional_headline'),
    ('mentor_applications', 'website_url'),
    ('mentor_applications', 'employment_type'),
    ('mentor_applications', 'industries'),
    ('mentor_applications', 'other_industry'),
    ('mentor_applications', 'other_expertise'),
    ('mentor_applications', 'experience_band'),
    ('mentor_applications', 'challenge_solved'),
    ('mentor_applications', 'measurable_outcomes'),
    ('mentor_applications', 'guidance_value_proposition'),
    ('mentor_applications', 'credibility_signals'),
    ('mentor_applications', 'service_interests'),
    ('mentor_applications', 'preferred_session_mode'),
    ('mentor_applications', 'languages'),
    ('mentor_applications', 'other_language'),
    ('mentor_applications', 'weekly_availability_band'),
    ('mentor_applications', 'has_prior_mentoring_experience'),
    ('mentor_applications', 'has_professional_misconduct'),
    ('mentor_applications', 'misconduct_explanation'),
    ('mentors', 'industries'),
    ('mentors', 'experience_band'),
    ('mentors', 'employment_type'),
    ('mentors', 'weekly_availability_band'),
    ('mentors', 'preferred_session_mode'),
    ('mentors', 'service_interests'),
    ('mentors', 'languages'),
    ('mentors', 'challenge_solved'),
    ('mentors', 'measurable_outcomes'),
    ('mentors', 'guidance_value_proposition'),
    ('mentors', 'credibility_signals'),
    ('mentors', 'has_prior_mentoring_experience')
)
SELECT expected.table_name, expected.column_name
FROM expected
LEFT JOIN information_schema.columns actual
  ON actual.table_schema = 'public'
 AND actual.table_name = expected.table_name
 AND actual.column_name = expected.column_name
WHERE actual.column_name IS NULL
ORDER BY expected.table_name, expected.column_name;

WITH expected(value) AS (
  VALUES
    ('PORTFOLIO'),
    ('CASE_STUDY'),
    ('PRESENTATION'),
    ('AWARDS_CERTIFICATIONS')
)
SELECT expected.value AS missing_file_kind
FROM expected
LEFT JOIN pg_enum actual
  ON actual.enumlabel = expected.value
 AND actual.enumtypid = 'mentor_application_file_kind'::regtype
WHERE actual.enumlabel IS NULL
ORDER BY expected.value;

SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conname IN (
  'mentor_applications_industries_json_check',
  'mentor_applications_credibility_signals_json_check',
  'mentor_applications_service_interests_json_check',
  'mentor_applications_languages_json_check',
  'mentors_v2_arrays_json_check'
)
ORDER BY conname;

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'mentors_industries_gin_idx',
    'mentors_service_interests_gin_idx',
    'mentors_languages_gin_idx'
  )
ORDER BY indexname;
