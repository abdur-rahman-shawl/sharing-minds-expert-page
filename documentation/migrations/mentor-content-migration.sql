-- ============================================================
-- Mentor Content Schema Migration
-- Run in Supabase SQL Editor. Idempotent (safe to re-run).
-- ============================================================

-- ── 1. Enums ──

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('COURSE','FILE','URL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_item_type AS ENUM ('VIDEO','PDF','DOCUMENT','URL','TEXT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE course_difficulty AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. mentor_content ──

CREATE TABLE IF NOT EXISTS mentor_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id     UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  type          content_type NOT NULL,
  status        content_status NOT NULL DEFAULT 'DRAFT',
  file_url      TEXT,
  file_name     TEXT,
  file_size     INTEGER,
  mime_type     TEXT,
  url           TEXT,
  url_title     TEXT,
  url_description TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. courses ──

CREATE TABLE IF NOT EXISTS courses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id        UUID NOT NULL UNIQUE REFERENCES mentor_content(id) ON DELETE CASCADE,
  difficulty        course_difficulty NOT NULL,
  duration_minutes  INTEGER,
  price             DECIMAL(10,2),
  currency          TEXT DEFAULT 'USD',
  thumbnail_url     TEXT,
  category          TEXT,
  tags              TEXT,
  prerequisites     TEXT,
  learning_outcomes TEXT,
  enrollment_count  INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. course_modules ──

CREATE TABLE IF NOT EXISTS course_modules (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id                  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title                      TEXT NOT NULL,
  description                TEXT,
  order_index                INTEGER NOT NULL,
  learning_objectives        TEXT,
  estimated_duration_minutes INTEGER,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. course_sections ──

CREATE TABLE IF NOT EXISTS course_sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. section_content_items ──

CREATE TABLE IF NOT EXISTS section_content_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id       UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  type             content_item_type NOT NULL,
  order_index      INTEGER NOT NULL,
  content          TEXT,
  file_url         TEXT,
  file_name        TEXT,
  file_size        INTEGER,
  mime_type        TEXT,
  duration_seconds INTEGER,
  is_preview       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 7. Indexes ──

CREATE INDEX IF NOT EXISTS idx_mentor_content_mentor    ON mentor_content(mentor_id);
CREATE INDEX IF NOT EXISTS idx_courses_content          ON courses(content_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course    ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order     ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_sections_module   ON course_sections(module_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_order    ON course_sections(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_section_items_section    ON section_content_items(section_id);
CREATE INDEX IF NOT EXISTS idx_section_items_order      ON section_content_items(section_id, order_index);
