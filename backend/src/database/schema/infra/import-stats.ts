import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT_STATS
// Estatísticas agregadas de importação por entidade × dia.
// Evita varrer sync_logs para dashboards de desempenho.
// ─────────────────────────────────────────────────────────────────────────────

export const importStats = sqliteTable(
  'import_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    entityType: text('entity_type').notNull(),
    statDate:   text('stat_date').notNull(),   // ISO date YYYY-MM-DD

    totalRuns:    integer('total_runs').default(0),
    successRuns:  integer('success_runs').default(0),
    errorRuns:    integer('error_runs').default(0),

    totalImported: integer('total_imported').default(0),
    totalUpdated:  integer('total_updated').default(0),

    avgDurationMs: real('avg_duration_ms'),
    maxDurationMs: integer('max_duration_ms'),

    lastRunAt: text('last_run_at'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEntityDate: index('idx_imp_stats_entity_date').on(t.entityType, t.statDate),
    idxStatDate:   index('idx_imp_stats_date').on(t.statDate),
  }),
);

export type ImportStat    = typeof importStats.$inferSelect;
export type NewImportStat = typeof importStats.$inferInsert;
