-- SharingMinds expert application form v2
-- Additive migration. Apply only after 003-guest-mentor-applications.sql.

BEGIN;

ALTER TYPE mentor_application_file_kind ADD VALUE IF NOT EXISTS 'PORTFOLIO';
ALTER TYPE mentor_application_file_kind ADD VALUE IF NOT EXISTS 'CASE_STUDY';
ALTER TYPE mentor_application_file_kind ADD VALUE IF NOT EXISTS 'PRESENTATION';
ALTER TYPE mentor_application_file_kind ADD VALUE IF NOT EXISTS 'AWARDS_CERTIFICATIONS';

ALTER TABLE mentor_applications
  ADD COLUMN IF NOT EXISTS professional_headline text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS employment_type text,
  ADD COLUMN IF NOT EXISTS industries jsonb,
  ADD COLUMN IF NOT EXISTS other_industry text,
  ADD COLUMN IF NOT EXISTS other_expertise text,
  ADD COLUMN IF NOT EXISTS experience_band text,
  ADD COLUMN IF NOT EXISTS challenge_solved text,
  ADD COLUMN IF NOT EXISTS measurable_outcomes text,
  ADD COLUMN IF NOT EXISTS guidance_value_proposition text,
  ADD COLUMN IF NOT EXISTS credibility_signals jsonb,
  ADD COLUMN IF NOT EXISTS service_interests jsonb,
  ADD COLUMN IF NOT EXISTS preferred_session_mode text,
  ADD COLUMN IF NOT EXISTS languages jsonb,
  ADD COLUMN IF NOT EXISTS other_language text,
  ADD COLUMN IF NOT EXISTS weekly_availability_band text,
  ADD COLUMN IF NOT EXISTS has_prior_mentoring_experience boolean,
  ADD COLUMN IF NOT EXISTS has_professional_misconduct boolean,
  ADD COLUMN IF NOT EXISTS misconduct_explanation text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentor_applications_industries_json_check'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_industries_json_check
      CHECK (industries IS NULL OR jsonb_typeof(industries) = 'array');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentor_applications_credibility_signals_json_check'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_credibility_signals_json_check
      CHECK (
        credibility_signals IS NULL
        OR jsonb_typeof(credibility_signals) = 'array'
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentor_applications_service_interests_json_check'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_service_interests_json_check
      CHECK (
        service_interests IS NULL
        OR jsonb_typeof(service_interests) = 'array'
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentor_applications_languages_json_check'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_languages_json_check
      CHECK (languages IS NULL OR jsonb_typeof(languages) = 'array');
  END IF;
END
$$;

ALTER TABLE mentors
  ADD COLUMN IF NOT EXISTS industries jsonb,
  ADD COLUMN IF NOT EXISTS experience_band text,
  ADD COLUMN IF NOT EXISTS employment_type text,
  ADD COLUMN IF NOT EXISTS weekly_availability_band text,
  ADD COLUMN IF NOT EXISTS preferred_session_mode text,
  ADD COLUMN IF NOT EXISTS service_interests jsonb,
  ADD COLUMN IF NOT EXISTS languages jsonb,
  ADD COLUMN IF NOT EXISTS challenge_solved text,
  ADD COLUMN IF NOT EXISTS measurable_outcomes text,
  ADD COLUMN IF NOT EXISTS guidance_value_proposition text,
  ADD COLUMN IF NOT EXISTS credibility_signals jsonb,
  ADD COLUMN IF NOT EXISTS has_prior_mentoring_experience boolean;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentors_v2_arrays_json_check'
  ) THEN
    ALTER TABLE mentors
      ADD CONSTRAINT mentors_v2_arrays_json_check
      CHECK (
        (industries IS NULL OR jsonb_typeof(industries) = 'array')
        AND (service_interests IS NULL OR jsonb_typeof(service_interests) = 'array')
        AND (languages IS NULL OR jsonb_typeof(languages) = 'array')
        AND (credibility_signals IS NULL OR jsonb_typeof(credibility_signals) = 'array')
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS mentors_industries_gin_idx
  ON mentors USING gin (industries);

CREATE INDEX IF NOT EXISTS mentors_service_interests_gin_idx
  ON mentors USING gin (service_interests);

CREATE INDEX IF NOT EXISTS mentors_languages_gin_idx
  ON mentors USING gin (languages);

COMMENT ON COLUMN mentor_applications.has_professional_misconduct IS
  'Sensitive review-only answer. Never promote to mentors or expose publicly.';

COMMENT ON COLUMN mentor_applications.misconduct_explanation IS
  'Sensitive review-only detail. Never promote to mentors or expose publicly.';

COMMENT ON COLUMN mentor_applications.experience_band IS
  'Non-overlapping applicant-selected band; no ten-year minimum is enforced.';

COMMENT ON COLUMN mentors.experience_band IS
  'Promoted experience range. Do not infer an exact experience_years value from this band.';

COMMIT;
