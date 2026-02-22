-- ============================================================
-- Mentor Availability Schema Migration
-- Run this in the Supabase SQL editor (or any PostgreSQL client)
-- Order matters: dependent tables are created after parents.
-- ============================================================

-- ── 1. Enums ──

DO $$ BEGIN
  CREATE TYPE recurrence_pattern AS ENUM ('WEEKLY','BIWEEKLY','MONTHLY','CUSTOM');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE availability_type AS ENUM ('AVAILABLE','BREAK','BUFFER','BLOCKED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. mentor_availability_schedules ──

CREATE TABLE IF NOT EXISTS mentor_availability_schedules (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id                   UUID NOT NULL UNIQUE REFERENCES mentors(id) ON DELETE CASCADE,

  -- Global settings
  timezone                    TEXT NOT NULL DEFAULT 'UTC',
  default_session_duration    INTEGER NOT NULL DEFAULT 60,
  buffer_time                 INTEGER NOT NULL DEFAULT 15,

  -- Booking constraints
  min_advance_booking_hours   INTEGER NOT NULL DEFAULT 24,
  max_advance_booking_days    INTEGER NOT NULL DEFAULT 90,

  -- Business hours defaults
  default_start_time          TIME DEFAULT '09:00:00',
  default_end_time            TIME DEFAULT '17:00:00',

  -- Flags
  is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
  allow_instant_booking        BOOLEAN NOT NULL DEFAULT TRUE,
  require_confirmation        BOOLEAN NOT NULL DEFAULT FALSE,

  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. mentor_weekly_patterns ──

CREATE TABLE IF NOT EXISTS mentor_weekly_patterns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id  UUID NOT NULL REFERENCES mentor_availability_schedules(id) ON DELETE CASCADE,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  time_blocks  JSONB NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. mentor_availability_exceptions ──

CREATE TABLE IF NOT EXISTS mentor_availability_exceptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id  UUID NOT NULL REFERENCES mentor_availability_schedules(id) ON DELETE CASCADE,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ NOT NULL,
  type         availability_type NOT NULL DEFAULT 'BLOCKED',
  reason       TEXT,
  is_full_day  BOOLEAN NOT NULL DEFAULT TRUE,
  time_blocks  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. availability_templates ──

CREATE TABLE IF NOT EXISTS availability_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id     UUID REFERENCES mentors(id) ON DELETE CASCADE,  -- nullable = global
  name          TEXT NOT NULL,
  description   TEXT,
  is_global     BOOLEAN NOT NULL DEFAULT FALSE,
  configuration JSONB NOT NULL,
  usage_count   INTEGER NOT NULL DEFAULT 0,
  last_used_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. mentor_availability_rules ──

CREATE TABLE IF NOT EXISTS mentor_availability_rules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id  UUID NOT NULL REFERENCES mentor_availability_schedules(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  conditions   JSONB NOT NULL,
  actions      JSONB NOT NULL,
  priority     INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 7. Indexes ──

CREATE INDEX IF NOT EXISTS idx_availability_schedules_mentor
  ON mentor_availability_schedules(mentor_id);

CREATE INDEX IF NOT EXISTS idx_weekly_patterns_schedule
  ON mentor_weekly_patterns(schedule_id);

CREATE INDEX IF NOT EXISTS idx_weekly_patterns_day
  ON mentor_weekly_patterns(schedule_id, day_of_week);

CREATE INDEX IF NOT EXISTS idx_exceptions_schedule
  ON mentor_availability_exceptions(schedule_id);

CREATE INDEX IF NOT EXISTS idx_exceptions_dates
  ON mentor_availability_exceptions(schedule_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_templates_mentor
  ON availability_templates(mentor_id);

CREATE INDEX IF NOT EXISTS idx_rules_schedule
  ON mentor_availability_rules(schedule_id, priority);
