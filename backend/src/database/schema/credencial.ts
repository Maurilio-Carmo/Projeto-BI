// backend/src/database/schema/credencial.ts
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela de Credenciais de acesso à API VarejoFácil.
 * Autenticação via header: x-api-key: {api_key}
 */
export const credencial = mysqlTable('credencial', {
  id: int('id').autoincrement().primaryKey(),

  /** URL base da API, ex: https://mercado.varejofacil.com */
  api_url: varchar('api_url', { length: 500 }).notNull(),

  /** Chave enviada no header x-api-key */
  api_key: varchar('api_key', { length: 500 }).notNull(),

  created_at: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Credencial = typeof credencial.$inferSelect;
export type NewCredencial = typeof credencial.$inferInsert;
