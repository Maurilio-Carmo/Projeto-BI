import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// FAMILIAS — /v1/produto/familias
export const familias = sqliteTable('familias', {
  familiaId: integer('familia_id').primaryKey(),
  descricao: text('descricao').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

export type Familia    = typeof familias.$inferSelect;
export type NewFamilia = typeof familias.$inferInsert;