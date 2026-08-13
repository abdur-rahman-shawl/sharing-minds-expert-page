-- SharingMinds live expert registration v3
-- Additive only. Apply after migrations 003, 004, and 005.
-- This migration does not modify or delete existing mentor application data.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.campaign_visits') IS NULL THEN
    RAISE EXCEPTION 'campaign_visits is missing; apply migration 005 first';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mentor_registration_source') THEN
    CREATE TYPE mentor_registration_source AS ENUM (
      'LIVE_EXPERT_REGISTRATION',
      'LEGACY_POC',
      'LEGACY_APPLICATION_MIGRATION',
      'MAIN_PLATFORM',
      'ADMIN_CREATED'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'mentor_registration_auth_method'
  ) THEN
    CREATE TYPE mentor_registration_auth_method AS ENUM (
      'GOOGLE',
      'LINKEDIN',
      'EMAIL_PASSWORD',
      'EXISTING_SESSION'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'mentor_registration_draft_status'
  ) THEN
    CREATE TYPE mentor_registration_draft_status AS ENUM (
      'DRAFT',
      'READY_FOR_AUTH',
      'AUTHENTICATED',
      'FINALIZING',
      'COMPLETED',
      'EXPIRED',
      'ABANDONED'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'mentor_registration_file_kind'
  ) THEN
    CREATE TYPE mentor_registration_file_kind AS ENUM (
      'PROFILE_IMAGE',
      'RESUME',
      'PORTFOLIO',
      'CASE_STUDY',
      'PRESENTATION',
      'AWARDS_CERTIFICATIONS'
    );
  END IF;
END
$$;

ALTER TABLE mentors
  ADD COLUMN IF NOT EXISTS registration_source mentor_registration_source,
  ADD COLUMN IF NOT EXISTS registration_auth_method mentor_registration_auth_method,
  ADD COLUMN IF NOT EXISTS registration_schema_version integer,
  ADD COLUMN IF NOT EXISTS registration_draft_id uuid,
  ADD COLUMN IF NOT EXISTS registration_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS country_id text,
  ADD COLUMN IF NOT EXISTS state_id text,
  ADD COLUMN IF NOT EXISTS city_id text,
  ADD COLUMN IF NOT EXISTS other_industry text,
  ADD COLUMN IF NOT EXISTS other_expertise text,
  ADD COLUMN IF NOT EXISTS other_language text,
  ADD COLUMN IF NOT EXISTS attribution_visit_id uuid,
  ADD COLUMN IF NOT EXISTS attribution_captured_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS mentors_registration_draft_unique
  ON mentors(registration_draft_id)
  WHERE registration_draft_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS mentors_registration_source_submitted_idx
  ON mentors(registration_source, registration_submitted_at DESC);

CREATE INDEX IF NOT EXISTS mentors_attribution_visit_idx
  ON mentors(attribution_visit_id)
  WHERE attribution_visit_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentors_registration_schema_version_check'
  ) THEN
    ALTER TABLE mentors
      ADD CONSTRAINT mentors_registration_schema_version_check
      CHECK (registration_schema_version IS NULL OR registration_schema_version > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentors_attribution_visit_fk'
  ) THEN
    ALTER TABLE mentors
      ADD CONSTRAINT mentors_attribution_visit_fk
      FOREIGN KEY (attribution_visit_id)
      REFERENCES campaign_visits(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mentors_attribution_timestamp_check'
  ) THEN
    ALTER TABLE mentors
      ADD CONSTRAINT mentors_attribution_timestamp_check
      CHECK (attribution_visit_id IS NULL OR attribution_captured_at IS NOT NULL);
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS mentor_registration_drafts (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token_digest     text NOT NULL,
  status                  mentor_registration_draft_status NOT NULL DEFAULT 'DRAFT',
  schema_version          integer NOT NULL DEFAULT 3,
  form_payload            jsonb NOT NULL DEFAULT '{}'::jsonb,
  consent_snapshot        jsonb,
  attribution_visit_id    uuid REFERENCES campaign_visits(id) ON DELETE SET NULL,
  attribution_captured_at timestamptz,
  legacy_application_id   uuid REFERENCES mentor_applications(id) ON DELETE SET NULL,
  user_id                 text REFERENCES users(id) ON DELETE SET NULL,
  mentor_id               uuid REFERENCES mentors(id) ON DELETE SET NULL,
  auth_method              mentor_registration_auth_method,
  expires_at              timestamptz NOT NULL,
  auth_started_at         timestamptz,
  completed_at            timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentor_registration_drafts_schema_version_check
    CHECK (schema_version > 0),
  CONSTRAINT mentor_registration_drafts_completion_check
    CHECK (
      (status = 'COMPLETED' AND user_id IS NOT NULL
        AND mentor_id IS NOT NULL AND completed_at IS NOT NULL)
      OR status <> 'COMPLETED'
    ),
  CONSTRAINT mentor_registration_drafts_attribution_timestamp_check
    CHECK (attribution_visit_id IS NULL OR attribution_captured_at IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_registration_drafts_access_token_digest_unique
  ON mentor_registration_drafts(access_token_digest);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_registration_drafts_mentor_unique
  ON mentor_registration_drafts(mentor_id)
  WHERE mentor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS mentor_registration_drafts_status_expiry_idx
  ON mentor_registration_drafts(status, expires_at);

CREATE INDEX IF NOT EXISTS mentor_registration_drafts_user_created_idx
  ON mentor_registration_drafts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS mentor_registration_drafts_attribution_idx
  ON mentor_registration_drafts(attribution_visit_id)
  WHERE attribution_visit_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS mentor_registration_files (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_draft_id uuid NOT NULL
    REFERENCES mentor_registration_drafts(id) ON DELETE RESTRICT,
  mentor_id             uuid REFERENCES mentors(id) ON DELETE SET NULL,
  kind                  mentor_registration_file_kind NOT NULL,
  storage_bucket        text NOT NULL,
  storage_path          text NOT NULL,
  original_file_name    text NOT NULL,
  media_type            text NOT NULL,
  size_bytes            integer NOT NULL,
  checksum_sha256       text NOT NULL,
  is_current            boolean NOT NULL DEFAULT true,
  superseded_at         timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentor_registration_files_size_check CHECK (size_bytes > 0),
  CONSTRAINT mentor_registration_files_checksum_check
    CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_registration_files_storage_object_unique
  ON mentor_registration_files(storage_bucket, storage_path);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_registration_files_current_kind_unique
  ON mentor_registration_files(registration_draft_id, kind)
  WHERE is_current = true;

CREATE INDEX IF NOT EXISTS mentor_registration_files_draft_created_idx
  ON mentor_registration_files(registration_draft_id, created_at DESC);

CREATE INDEX IF NOT EXISTS mentor_registration_files_mentor_kind_idx
  ON mentor_registration_files(mentor_id, kind)
  WHERE mentor_id IS NOT NULL;

ALTER TABLE consent_events
  ADD COLUMN IF NOT EXISTS mentor_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'consent_events_mentor_id_fkey'
  ) THEN
    ALTER TABLE consent_events
      ADD CONSTRAINT consent_events_mentor_id_fkey
      FOREIGN KEY (mentor_id)
      REFERENCES mentors(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS consent_events_mentor_type_created_idx
  ON consent_events(mentor_id, consent_type, created_at)
  WHERE mentor_id IS NOT NULL;

ALTER TABLE mentor_registration_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_registration_files ENABLE ROW LEVEL SECURITY;

COMMIT;
