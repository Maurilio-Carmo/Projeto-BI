// backend/src/database/schema/sync-logs.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • mysqlTable / mysqlEnum → sqliteTable / text({ enum: [...] })
//   • int / bigint           → integer
//   • timestamp              → integer({ mode: 'timestamp' })
//   • index() — API idêntica, sem mudança
// ─────────────────────────────────────────────────────────────────────────────
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const syncLogs = sqliteTable(
  'sync_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    entity_type: text('entity_type', {
      enum: ['nota_venda', 'nota_compra', 'cupom'],
    }).notNull(),

    status: text('status', {
      enum: ['success', 'error', 'running'],
    })
      .notNull()
      .default('running'),

    /** ID de início da faixa importada (start_id passado para a API) */
    start_id: integer('start_id'),

    /** Maior ID recebido na resposta (novo last_sync_id salvo) */
    end_id: integer('end_id'),

    /** Quantidade de registros importados/atualizados nesta execução */
    records_imported: integer('records_imported').notNull().default(0),

    /** Mensagem de erro, se houver */
    error_message: text('error_message'),

    started_at: integer('started_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    finished_at: integer('finished_at', { mode: 'timestamp' }),
  },
  (table) => ({
    entityTypeIdx: index('idx_sl_entity_type').on(table.entity_type),
    statusIdx:     index('idx_sl_status').on(table.status),
    startedAtIdx:  index('idx_sl_started_at').on(table.started_at),
  }),
);

export type SyncLog    = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
