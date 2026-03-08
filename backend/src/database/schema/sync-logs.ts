// backend/src/database/schema/sync-logs.ts
import {
  mysqlTable,
  int,
  bigint,
  mysqlEnum,
  text,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela de Logs de Execução de Sincronização.
 * Registra cada execução (manual ou automática) de cada entidade.
 */
export const syncLogs = mysqlTable(
  'sync_logs',
  {
    id: int('id').autoincrement().primaryKey(),

    entity_type: mysqlEnum('entity_type', ['nota_venda', 'nota_compra', 'cupom']).notNull(),

    status: mysqlEnum('status', ['success', 'error', 'running']).notNull().default('running'),

    /** ID de início da faixa importada (start_id passado para a API) */
    start_id: bigint('start_id', { mode: 'number' }),

    /** Maior ID recebido na resposta (novo last_sync_id salvo) */
    end_id: bigint('end_id', { mode: 'number' }),

    /** Quantidade de registros importados/atualizados nesta execução */
    records_imported: int('records_imported').notNull().default(0),

    /** Mensagem de erro, se houver */
    error_message: text('error_message'),

    started_at: timestamp('started_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    finished_at: timestamp('finished_at'),
  },
  (table) => ({
    entityTypeIdx: index('idx_sl_entity_type').on(table.entity_type),
    statusIdx: index('idx_sl_status').on(table.status),
    startedAtIdx: index('idx_sl_started_at').on(table.started_at),
  }),
);

export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
