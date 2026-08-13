-- SharingMinds first-party campaign attribution
-- Additive migration. Apply after 003 and 004, before enabling attribution.

BEGIN;

CREATE TABLE IF NOT EXISTS campaign_visits (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id            uuid NOT NULL,
  channel               text NOT NULL DEFAULT 'DIRECT',
  source                text NOT NULL DEFAULT 'direct',
  medium                text NOT NULL DEFAULT 'none',
  campaign              text,
  content               text,
  term                   text,
  landing_path          text NOT NULL,
  referrer_host         text,
  click_id_type         text,
  click_id              text,
  page_view_count       integer NOT NULL DEFAULT 1,
  application_viewed_at timestamptz,
  otp_requested_at      timestamptz,
  started_at            timestamptz NOT NULL DEFAULT now(),
  last_seen_at          timestamptz NOT NULL DEFAULT now(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_visits_page_view_count_check
    CHECK (page_view_count > 0),
  CONSTRAINT campaign_visits_channel_check
    CHECK (
      channel IN (
        'DIRECT',
        'PAID',
        'EMAIL',
        'SOCIAL',
        'ORGANIC',
        'REFERRAL',
        'OTHER'
      )
    ),
  CONSTRAINT campaign_visits_activity_timestamp_check
    CHECK (last_seen_at >= started_at),
  CONSTRAINT campaign_visits_source_length_check
    CHECK (length(source) BETWEEN 1 AND 200),
  CONSTRAINT campaign_visits_medium_length_check
    CHECK (length(medium) BETWEEN 1 AND 200),
  CONSTRAINT campaign_visits_landing_path_check
    CHECK (
      left(landing_path, 1) = '/'
      AND length(landing_path) BETWEEN 1 AND 500
    )
);

CREATE INDEX IF NOT EXISTS campaign_visits_started_at_idx
  ON campaign_visits(started_at);

CREATE INDEX IF NOT EXISTS campaign_visits_visitor_started_idx
  ON campaign_visits(visitor_id, started_at);

CREATE INDEX IF NOT EXISTS campaign_visits_campaign_started_idx
  ON campaign_visits(source, medium, campaign, started_at);

ALTER TABLE mentor_applications
  ADD COLUMN IF NOT EXISTS attribution_visit_id uuid,
  ADD COLUMN IF NOT EXISTS attribution_captured_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'mentor_applications_attribution_visit_fk'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_attribution_visit_fk
      FOREIGN KEY (attribution_visit_id)
      REFERENCES campaign_visits(id)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'mentor_applications_attribution_timestamp_check'
  ) THEN
    ALTER TABLE mentor_applications
      ADD CONSTRAINT mentor_applications_attribution_timestamp_check
      CHECK (
        attribution_visit_id IS NULL
        OR attribution_captured_at IS NOT NULL
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS mentor_applications_attribution_visit_idx
  ON mentor_applications(attribution_visit_id);

COMMIT;
