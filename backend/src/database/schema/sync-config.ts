// backend/src/database/schema/sync-config.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • mysqlTable / mysqlEnum → sqliteTable / text({ enum: [...] })
//   • int / bigint           → integer
//   • boolean                → integer({ mode: 'boolean' })
//   • timestamp              → integer({ mode: 'timestamp' })
//   • ON UPDATE CURRENT_TIMESTAMP removido (sem suporte no SQLite)
// ─────────────────────────────────────────────────────────────────────────────
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const syncConfig = sqliteTable('sync_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /** Tipo da entidade que esta configuração controla */
  entity_type: text('entity_type', {
    enum: ['nota_venda', 'nota_compra', 'cupom'],
  })
    .notNull()
    .unique(),

  /** FK para tabela credencial */
  credencial_id: integer('credencial_id').notNull(),

  /** Intervalo de sincronização em horas */
  interval_hours: text('interval_hours', {
    enum: ['1', '2', '4', '6', '12', '24'],
  })
    .notNull()
    .default('6'),

  /** Se a sincronização automática está habilitada (1 = true, 0 = false) */
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(true),

  /**
   * Último ID importado com sucesso (cursor incremental).
   * Na próxima execução, busca registros com id > last_sync_id.
   */
  last_sync_id: integer('last_sync_id').notNull().default(0),

  /** Timestamp da última sincronização bem-sucedida */
  last_sync_at: integer('last_sync_at', { mode: 'timestamp' }),

  created_at: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),

  updated_at: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type SyncConfig    = typeof syncConfig.$inferSelect;
export type NewSyncConfig = typeof syncConfig.$inferInsert;

export type EntityType = 'nota_venda' | 'nota_compra' | 'cupom';
