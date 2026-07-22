import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { mentorApplications } from './mentor-applications';

export const mentorApplicationFileKindEnum = pgEnum('mentor_application_file_kind', [
  'PROFILE_IMAGE',
  'RESUME',
  'PORTFOLIO',
  'CASE_STUDY',
  'PRESENTATION',
  'AWARDS_CERTIFICATIONS',
]);

export const mentorApplicationFileScanStatusEnum = pgEnum(
  'mentor_application_file_scan_status',
  ['PENDING', 'CLEAN', 'INFECTED', 'FAILED'],
);

export const mentorApplicationFiles = pgTable(
  'mentor_application_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    applicationId: uuid('application_id')
      .references(() => mentorApplications.id, { onDelete: 'cascade' })
      .notNull(),
    kind: mentorApplicationFileKindEnum('kind').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    storagePath: text('storage_path').notNull(),
    originalFileName: text('original_file_name').notNull(),
    mediaType: text('media_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    checksumSha256: text('checksum_sha256'),
    scanStatus: mentorApplicationFileScanStatusEnum('scan_status')
      .default('PENDING')
      .notNull(),
    scanProvider: text('scan_provider'),
    scannedAt: timestamp('scanned_at', { withTimezone: true }),
    rejectionReason: text('rejection_reason'),
    isCurrent: boolean('is_current').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    storageObjectUnique: uniqueIndex('mentor_application_files_storage_object_unique').on(
      table.storageBucket,
      table.storagePath,
    ),
    oneCurrentKindPerApplication: uniqueIndex(
      'mentor_application_files_current_kind_unique',
    )
      .on(table.applicationId, table.kind)
      .where(sql`${table.isCurrent} = true`),
    applicationCreatedIdx: index('mentor_application_files_application_created_idx').on(
      table.applicationId,
      table.createdAt,
    ),
    scanQueueIdx: index('mentor_application_files_scan_queue_idx').on(
      table.scanStatus,
      table.createdAt,
    ),
    sizeCheck: check(
      'mentor_application_files_size_check',
      sql`${table.sizeBytes} > 0`,
    ),
    bucketNotBlankCheck: check(
      'mentor_application_files_bucket_not_blank_check',
      sql`length(btrim(${table.storageBucket})) > 0`,
    ),
    pathNotBlankCheck: check(
      'mentor_application_files_path_not_blank_check',
      sql`length(btrim(${table.storagePath})) > 0`,
    ),
    checksumCheck: check(
      'mentor_application_files_checksum_check',
      sql`${table.checksumSha256} is null
        or ${table.checksumSha256} ~ '^[0-9a-f]{64}$'`,
    ),
    scanTimestampCheck: check(
      'mentor_application_files_scan_timestamp_check',
      sql`(${table.scanStatus} = 'PENDING' and ${table.scannedAt} is null)
        or (${table.scanStatus} <> 'PENDING' and ${table.scannedAt} is not null)`,
    ),
    scanStatusNotSkippedCheck: check(
      'mentor_application_files_scan_status_not_skipped_check',
      sql`${table.scanStatus}::text <> 'SKIPPED'`,
    ),
  }),
);

export const mentorApplicationFilesRelations = relations(
  mentorApplicationFiles,
  ({ one }) => ({
    application: one(mentorApplications, {
      fields: [mentorApplicationFiles.applicationId],
      references: [mentorApplications.id],
    }),
  }),
);

export type MentorApplicationFile = typeof mentorApplicationFiles.$inferSelect;
export type NewMentorApplicationFile = typeof mentorApplicationFiles.$inferInsert;
export type MentorApplicationFileKind =
  (typeof mentorApplicationFileKindEnum.enumValues)[number];
export type MentorApplicationFileScanStatus =
  (typeof mentorApplicationFileScanStatusEnum.enumValues)[number];
