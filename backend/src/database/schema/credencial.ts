// backend/src/database/schema/credencial.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • mysqlTable        → sqliteTable
//   • int().autoincrement().primaryKey() → integer().primaryKey({ autoIncrement: true })
//   • varchar(x,{length}) → text(x)
//   • timestamp + "ON UPDATE CURRENT_TIMESTAMP" → integer({ mode: 'timestamp' })
//     (ON UPDATE não existe no SQLite; os services já passam updated_at: new Date())
// ─────────────────────────────────────────────────────────────────────────────
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela de Credenciais de acesso à API VarejoFácil.
 * Autenticação via header: x-api-key: {api_key}
 */
export const credencial = sqliteTable('credencial', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /** URL base da API, ex: https://mercado.varejofacil.com */
  api_url: text('api_url').notNull(),

  /** Chave enviada no header x-api-key */
  api_key: text('api_key').notNull(),

  created_at: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),

  updated_at: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type Credencial    = typeof credencial.$inferSelect;
export type NewCredencial = typeof credencial.$inferInsert;
