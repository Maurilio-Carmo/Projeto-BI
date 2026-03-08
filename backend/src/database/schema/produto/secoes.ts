import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// SECOES — /v1/produto/secoes
export const secoes = sqliteTable('secoes', {
  id:        integer('secao_id').primaryKey(),
  descricao: text('descricao').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

export type Secao    = typeof secoes.$inferSelect;
export type NewSecao = typeof secoes.$inferInsert;