import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { mentorRegistrationDrafts } from './mentor-registration-drafts'
import { mentorRegistrationFileKindEnum } from './mentor-registration-enums'
import { mentors } from './mentors'

export const mentorRegistrationFiles = pgTable(
  'mentor_registration_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    registrationDraftId: uuid('registration_draft_id')
      .references(() => mentorRegistrationDrafts.id, { onDelete: 'restrict' })
      .notNull(),
    mentorId: uuid('mentor_id').references(() => mentors.id, {
      onDelete: 'set null',
    }),
    kind: mentorRegistrationFileKindEnum('kind').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    storagePath: text('storage_path').notNull(),
    originalFileName: text('original_file_name').notNull(),
    mediaType: text('media_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    checksumSha256: text('checksum_sha256').notNull(),
    isCurrent: boolean('is_current').default(true).notNull(),
    supersededAt: timestamp('superseded_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    storageObjectUnique: uniqueIndex(
      'mentor_registration_files_storage_object_unique',
    ).on(table.storageBucket, table.storagePath),
    oneCurrentKindPerDraft: uniqueIndex(
      'mentor_registration_files_current_kind_unique',
    )
      .on(table.registrationDraftId, table.kind)
      .where(sql`${table.isCurrent} = true`),
    draftCreatedIdx: index('mentor_registration_files_draft_created_idx').on(
      table.registrationDraftId,
      table.createdAt,
    ),
    mentorKindIdx: index('mentor_registration_files_mentor_kind_idx').on(
      table.mentorId,
      table.kind,
    ).where(sql`${table.mentorId} is not null`),
    sizeCheck: check(
      'mentor_registration_files_size_check',
      sql`${table.sizeBytes} > 0`,
    ),
    checksumCheck: check(
      'mentor_registration_files_checksum_check',
      sql`${table.checksumSha256} ~ '^[0-9a-f]{64}$'`,
    ),
  }),
)

export const mentorRegistrationFilesRelations = relations(
  mentorRegistrationFiles,
  ({ one }) => ({
    draft: one(mentorRegistrationDrafts, {
      fields: [mentorRegistrationFiles.registrationDraftId],
      references: [mentorRegistrationDrafts.id],
    }),
    mentor: one(mentors, {
      fields: [mentorRegistrationFiles.mentorId],
      references: [mentors.id],
    }),
  }),
)

export type MentorRegistrationFile = typeof mentorRegistrationFiles.$inferSelect
export type NewMentorRegistrationFile = typeof mentorRegistrationFiles.$inferInsert
