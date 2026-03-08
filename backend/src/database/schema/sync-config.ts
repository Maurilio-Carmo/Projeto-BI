// backend/src/database/schema/sync-config.ts
import {
  mysqlTable,
  int,
  bigint,
  mysqlEnum,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela de Configuração de Sincronização.
 *
 * Cada linha representa a configuração de uma das três entidades:
 *  - 'nota_venda'  → GET /v1/venda/notas-fiscais
 *  - 'nota_compra' → GET /v1/compra/notas-fiscais
 *  - 'cupom'       → GET /v1/venda/cupons-fiscais
 *
 * A credencial (api_url + api_token) é buscada da tabela `credencial`.
 */
export const syncConfig = mysqlTable('sync_config', {
  id: int('id').autoincrement().primaryKey(),

  /** Tipo da entidade que esta configuração controla */
  entity_type: mysqlEnum('entity_type', ['nota_venda', 'nota_compra', 'cupom'])
    .notNull()
    .unique(),

  /** FK para tabela credencial */
  credencial_id: int('credencial_id').notNull(),

  /** Intervalo de sincronização em horas */
  interval_hours: mysqlEnum('interval_hours', ['1', '2', '4', '6', '12', '24'])
    .notNull()
    .default('6'),

  /** Se a sincronização automática está habilitada */
  is_active: boolean('is_active').notNull().default(true),

  /**
   * Último ID importado com sucesso (cursor incremental).
   * Na próxima execução, busca registros com id > last_sync_id.
   */
  last_sync_id: bigint('last_sync_id', { mode: 'number' }).notNull().default(0),

  /** Timestamp da última sincronização bem-sucedida */
  last_sync_at: timestamp('last_sync_at'),

  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export type SyncConfig = typeof syncConfig.$inferSelect;
export type NewSyncConfig = typeof syncConfig.$inferInsert;

export type EntityType = 'nota_venda' | 'nota_compra' | 'cupom';
