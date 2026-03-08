import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// SYNC_LOGS
// Histórico de cada execução de sincronização.
// ─────────────────────────────────────────────────────────────────────────────

export const syncLogs = sqliteTable(
  'sync_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    entityType: text('entity_type').notNull(),

    status: text('status', {
      enum: ['RUNNING', 'SUCCESS', 'ERROR', 'PARTIAL'],
    }).notNull(),

    recordsImported: integer('records_imported').default(0),
    recordsUpdated:  integer('records_updated').default(0),
    recordsSkipped:  integer('records_skipped').default(0),

    startId:      integer('start_id'),
    endId:        integer('end_id'),

    errorMessage: text('error_message'),
    stackTrace:   text('stack_trace'),

    durationMs: integer('duration_ms'),

    startedAt:  text('started_at').notNull(),
    finishedAt: text('finished_at'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEntityType: index('idx_sync_log_entity_type').on(t.entityType),
    idxStatus:     index('idx_sync_log_status').on(t.status),
    idxStartedAt:  index('idx_sync_log_started_at').on(t.startedAt),
  }),
);

export type SyncLog    = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
