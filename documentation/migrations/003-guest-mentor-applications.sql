-- ============================================================================
-- 003 - Guest mentor application foundation
--
-- Run through the normal reviewed migration process. This migration deliberately
-- aborts if users contain case-insensitive duplicate emails; it never guesses
-- which identity should survive.
-- ============================================================================

BEGIN;

-- --------------------------------------------------------------------------
-- 1. Strengthen the canonical user-email invariant before application linking.
-- --------------------------------------------------------------------------

DO $$
DECLARE
  duplicate_emails TEXT;
BEGIN
  SELECT string_agg(normalized_email, ', ' ORDER BY normalized_email)
    INTO duplicate_emails
  FROM (
    SELECT lower(btrim(email)) AS normalized_email
    FROM users
    GROUP BY lower(btrim(email))
    HAVING count(*) > 1
    ORDER BY lower(btrim(email))
    LIMIT 10
  ) duplicates;

  IF duplicate_emails IS NOT NULL THEN
    RAISE EXCEPTION USING
      MESSAGE = 'Cannot create canonical users email index: case-insensitive duplicates exist.',
      DETAIL = 'Examples: ' || duplicate_emails,
      HINT = 'Resolve each duplicate user identity explicitly, then rerun migration 003.';
  END IF;
END $$;

UPDATE users
SET email_verified = FALSE
WHERE email_verified IS NULL;

ALTER TABLE users
  ALTER COLUMN email_verified SET DEFAULT FALSE,
  ALTER COLUMN email_verified SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_normalized_email_unique
  ON users (lower(btrim(email)));

-- --------------------------------------------------------------------------
-- 2. Enums.
-- --------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE mentor_application_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'IN_REVIEW',
    'CHANGES_REQUESTED',
    'RESUBMITTED',
    'APPROVED',
    'REJECTED',
    'WITHDRAWN'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE mentor_application_source AS ENUM (
    'GUEST',
    'AUTHENTICATED',
    'MIGRATED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE email_otp_purpose AS ENUM (
    'ACCOUNT_EMAIL_VERIFICATION',
    'MENTOR_APPLICATION_ACCESS',
    'MENTOR_APPLICATION_CLAIM'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE mentor_application_file_kind AS ENUM (
    'PROFILE_IMAGE',
    'RESUME'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE mentor_application_file_scan_status AS ENUM (
    'PENDING',
    'CLEAN',
    'INFECTED',
    'FAILED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE mentor_application_event_type AS ENUM (
    'CREATED',
    'EMAIL_VERIFIED',
    'DRAFT_SAVED',
    'FILE_UPLOADED',
    'FILE_SCAN_UPDATED',
    'SUBMITTED',
    'REVIEW_STARTED',
    'CHANGES_REQUESTED',
    'RESUBMITTED',
    'APPROVED',
    'REJECTED',
    'WITHDRAWN',
    'LINKED',
    'LINK_CONFLICT',
    'PROMOTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Keep reruns/partial deployments compatible when the enum predates the scan
-- callback event.
ALTER TYPE mentor_application_event_type
  ADD VALUE IF NOT EXISTS 'FILE_SCAN_UPDATED';

-- --------------------------------------------------------------------------
-- 3. Applications. A guest record is not a user or a mentor.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mentor_applications (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                      TEXT NOT NULL,
  normalized_email           TEXT NOT NULL,
  email_verified_at          TIMESTAMPTZ NOT NULL,
  linked_user_id             TEXT REFERENCES users(id) ON DELETE SET NULL,
  mentor_id                  UUID REFERENCES mentors(id) ON DELETE SET NULL,
  source                     mentor_application_source NOT NULL DEFAULT 'GUEST',
  status                     mentor_application_status NOT NULL DEFAULT 'DRAFT',

  full_name                  TEXT,
  phone                      TEXT,
  country_id                 TEXT,
  country                    TEXT,
  state_id                   TEXT,
  state                      TEXT,
  city_id                    TEXT,
  city                       TEXT,
  title                      TEXT,
  normalized_title           TEXT,
  company                    TEXT,
  industry                   TEXT,
  normalized_industry        TEXT,
  expertise                  JSONB,
  experience_years           INTEGER,
  requested_hourly_rate      DECIMAL(10,2),
  currency                   TEXT NOT NULL DEFAULT 'USD',
  availability               JSONB,
  about                      TEXT,
  linkedin_url               TEXT,

  application_schema_version INTEGER NOT NULL DEFAULT 1,
  current_revision           INTEGER NOT NULL DEFAULT 0,
  submitted_at               TIMESTAMPTZ,
  reviewed_at                TIMESTAMPTZ,
  decided_at                 TIMESTAMPTZ,
  linked_at                  TIMESTAMPTZ,
  promoted_at                TIMESTAMPTZ,
  applicant_visible_notes    TEXT,
  internal_review_notes      TEXT,
  reviewed_by                TEXT REFERENCES users(id) ON DELETE SET NULL,
  last_saved_at              TIMESTAMPTZ,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mentor_applications_normalized_email_canonical_check CHECK (
    normalized_email = lower(btrim(email))
    AND length(normalized_email) BETWEEN 3 AND 254
  ),
  CONSTRAINT mentor_applications_email_not_blank_check CHECK (
    length(btrim(email)) BETWEEN 3 AND 254
  ),
  CONSTRAINT mentor_applications_experience_range_check CHECK (
    experience_years IS NULL OR experience_years BETWEEN 0 AND 80
  ),
  CONSTRAINT mentor_applications_requested_hourly_rate_check CHECK (
    requested_hourly_rate IS NULL OR requested_hourly_rate > 0
  ),
  CONSTRAINT mentor_applications_schema_version_check CHECK (
    application_schema_version > 0
  ),
  CONSTRAINT mentor_applications_revision_check CHECK (current_revision >= 0),
  CONSTRAINT mentor_applications_expertise_json_check CHECK (
    expertise IS NULL OR jsonb_typeof(expertise) = 'array'
  ),
  CONSTRAINT mentor_applications_availability_json_check CHECK (
    availability IS NULL OR jsonb_typeof(availability) = 'object'
  ),
  CONSTRAINT mentor_applications_currency_check CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT mentor_applications_link_timestamp_check CHECK (
    linked_user_id IS NULL OR linked_at IS NOT NULL
  ),
  CONSTRAINT mentor_applications_promotion_timestamp_check CHECK (
    mentor_id IS NULL OR promoted_at IS NOT NULL
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_applications_normalized_email_unique
  ON mentor_applications(normalized_email);

-- PostgreSQL permits multiple NULLs in these unique indexes. Non-null links are
-- one-to-one, preventing duplicate claims or duplicate mentor promotion.
CREATE UNIQUE INDEX IF NOT EXISTS mentor_applications_linked_user_unique
  ON mentor_applications(linked_user_id);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_applications_mentor_unique
  ON mentor_applications(mentor_id);

CREATE INDEX IF NOT EXISTS mentor_applications_review_queue_idx
  ON mentor_applications(status, submitted_at);

CREATE INDEX IF NOT EXISTS mentor_applications_promotion_queue_idx
  ON mentor_applications(status, linked_user_id, promoted_at);

-- --------------------------------------------------------------------------
-- 4. Purpose-bound, single-use OTP challenges. Only digests are persisted.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS email_otp_challenges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  normalized_email TEXT NOT NULL,
  purpose          email_otp_purpose NOT NULL,
  application_id   UUID REFERENCES mentor_applications(id) ON DELETE CASCADE,
  code_digest      TEXT NOT NULL,
  digest_key_id    TEXT NOT NULL,
  attempt_count    INTEGER NOT NULL DEFAULT 0,
  max_attempts     INTEGER NOT NULL DEFAULT 5,
  send_count       INTEGER NOT NULL DEFAULT 1,
  last_sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ NOT NULL,
  consumed_at      TIMESTAMPTZ,
  revoked_at       TIMESTAMPTZ,
  request_ip       TEXT,
  user_agent       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT email_otp_challenges_normalized_email_canonical_check CHECK (
    normalized_email = lower(btrim(normalized_email))
    AND length(normalized_email) BETWEEN 3 AND 254
  ),
  CONSTRAINT email_otp_challenges_attempt_count_check CHECK (
    attempt_count >= 0 AND max_attempts > 0 AND attempt_count <= max_attempts
  ),
  CONSTRAINT email_otp_challenges_send_count_check CHECK (send_count > 0),
  CONSTRAINT email_otp_challenges_expiry_check CHECK (expires_at > created_at),
  CONSTRAINT email_otp_challenges_terminal_state_check CHECK (
    NOT (consumed_at IS NOT NULL AND revoked_at IS NOT NULL)
  ),
  CONSTRAINT email_otp_challenges_claim_application_check CHECK (
    purpose <> 'MENTOR_APPLICATION_CLAIM' OR application_id IS NOT NULL
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS email_otp_challenges_active_email_purpose_unique
  ON email_otp_challenges(normalized_email, purpose)
  WHERE consumed_at IS NULL AND revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS email_otp_challenges_email_purpose_created_idx
  ON email_otp_challenges(normalized_email, purpose, created_at);

CREATE INDEX IF NOT EXISTS email_otp_challenges_application_idx
  ON email_otp_challenges(application_id);

CREATE INDEX IF NOT EXISTS email_otp_challenges_expires_at_idx
  ON email_otp_challenges(expires_at);

-- --------------------------------------------------------------------------
-- 5. Application-only sessions. These do not grant platform authentication.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mentor_application_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  token_digest     TEXT NOT NULL,
  expires_at       TIMESTAMPTZ NOT NULL,
  last_used_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at       TIMESTAMPTZ,
  request_ip       TEXT,
  user_agent       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mentor_application_sessions_expiry_check CHECK (expires_at > created_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_application_sessions_token_digest_unique
  ON mentor_application_sessions(token_digest);

CREATE INDEX IF NOT EXISTS mentor_application_sessions_application_expires_idx
  ON mentor_application_sessions(application_id, expires_at);

CREATE INDEX IF NOT EXISTS mentor_application_sessions_expires_at_idx
  ON mentor_application_sessions(expires_at);

-- --------------------------------------------------------------------------
-- 6. Private application file metadata.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mentor_application_files (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id     UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  kind               mentor_application_file_kind NOT NULL,
  storage_bucket     TEXT NOT NULL,
  storage_path       TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  media_type         TEXT NOT NULL,
  size_bytes         INTEGER NOT NULL,
  checksum_sha256    TEXT,
  scan_status        mentor_application_file_scan_status NOT NULL DEFAULT 'PENDING',
  scan_provider      TEXT,
  scanned_at         TIMESTAMPTZ,
  rejection_reason   TEXT,
  is_current         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mentor_application_files_size_check CHECK (size_bytes > 0),
  CONSTRAINT mentor_application_files_bucket_not_blank_check CHECK (
    length(btrim(storage_bucket)) > 0
  ),
  CONSTRAINT mentor_application_files_path_not_blank_check CHECK (
    length(btrim(storage_path)) > 0
  ),
  CONSTRAINT mentor_application_files_checksum_check CHECK (
    checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$'
  ),
  CONSTRAINT mentor_application_files_scan_timestamp_check CHECK (
    (scan_status = 'PENDING' AND scanned_at IS NULL)
    OR (scan_status <> 'PENDING' AND scanned_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_application_files_storage_object_unique
  ON mentor_application_files(storage_bucket, storage_path);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_application_files_current_kind_unique
  ON mentor_application_files(application_id, kind)
  WHERE is_current = TRUE;

CREATE INDEX IF NOT EXISTS mentor_application_files_application_created_idx
  ON mentor_application_files(application_id, created_at);

CREATE INDEX IF NOT EXISTS mentor_application_files_scan_queue_idx
  ON mentor_application_files(scan_status, created_at);

-- Older pre-release schemas exposed SKIPPED. Fail migration validation rather
-- than allowing those files to bypass quarantine.
ALTER TABLE mentor_application_files
  DROP CONSTRAINT IF EXISTS mentor_application_files_scan_status_not_skipped_check;
ALTER TABLE mentor_application_files
  ADD CONSTRAINT mentor_application_files_scan_status_not_skipped_check
  CHECK (scan_status::text <> 'SKIPPED');

-- --------------------------------------------------------------------------
-- 7. Immutable submission revisions and append-only lifecycle events.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mentor_application_revisions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  revision         INTEGER NOT NULL,
  idempotency_key  TEXT NOT NULL,
  status           mentor_application_status NOT NULL,
  snapshot         JSONB NOT NULL,
  consent_snapshot JSONB NOT NULL,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mentor_application_revisions_revision_check CHECK (revision > 0),
  CONSTRAINT mentor_application_revisions_snapshot_json_check CHECK (
    jsonb_typeof(snapshot) = 'object'
  ),
  CONSTRAINT mentor_application_revisions_consent_snapshot_json_check CHECK (
    jsonb_typeof(consent_snapshot) = 'object'
  ),
  CONSTRAINT mentor_application_revisions_submission_status_check CHECK (
    status IN ('SUBMITTED', 'RESUBMITTED')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_application_revisions_application_revision_unique
  ON mentor_application_revisions(application_id, revision);

CREATE UNIQUE INDEX IF NOT EXISTS mentor_application_revisions_idempotency_key_unique
  ON mentor_application_revisions(idempotency_key);

CREATE INDEX IF NOT EXISTS mentor_application_revisions_application_submitted_idx
  ON mentor_application_revisions(application_id, submitted_at);

CREATE TABLE IF NOT EXISTS mentor_application_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  actor_user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  event_type       mentor_application_event_type NOT NULL,
  from_status      mentor_application_status,
  to_status        mentor_application_status,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT mentor_application_events_metadata_json_check CHECK (
    jsonb_typeof(metadata) = 'object'
  )
);

CREATE INDEX IF NOT EXISTS mentor_application_events_application_created_idx
  ON mentor_application_events(application_id, created_at);

CREATE INDEX IF NOT EXISTS mentor_application_events_type_created_idx
  ON mentor_application_events(event_type, created_at);

CREATE INDEX IF NOT EXISTS mentor_application_events_actor_created_idx
  ON mentor_application_events(actor_user_id, created_at);

-- --------------------------------------------------------------------------
-- 8. Bind legal consent records to the exact guest application.
-- --------------------------------------------------------------------------

ALTER TABLE consent_events
  ADD COLUMN IF NOT EXISTS mentor_application_id UUID;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'consent_events_mentor_application_id_fkey'
      AND conrelid = 'consent_events'::regclass
  ) THEN
    ALTER TABLE consent_events
      ADD CONSTRAINT consent_events_mentor_application_id_fkey
      FOREIGN KEY (mentor_application_id)
      REFERENCES mentor_applications(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS consent_events_application_type_created_idx
  ON consent_events(mentor_application_id, consent_type, created_at);

-- --------------------------------------------------------------------------
-- 9. Supabase/PostgREST hardening. Server-side PostgreSQL access remains the
--    application boundary; no anon/authenticated policies are intentionally added.
-- --------------------------------------------------------------------------

ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_application_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_application_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_application_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE mentor_applications IS
  'Staging and review records for guest or authenticated mentor applicants; not platform users.';
COMMENT ON COLUMN mentor_applications.normalized_email IS
  'Canonical trim-and-lowercase email used only after ownership verification.';
COMMENT ON TABLE mentor_application_sessions IS
  'Scoped application capabilities; never platform authentication sessions.';
COMMENT ON COLUMN email_otp_challenges.code_digest IS
  'Keyed digest of an OTP. A plaintext OTP must never be persisted.';

COMMIT;
