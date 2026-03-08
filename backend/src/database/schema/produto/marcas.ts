import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// MARCAS — /v1/produto/marcas
export const marcas = sqliteTable('marcas', {
  id:        integer('marca_id').primaryKey(),
  descricao: text('descricao').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

export type Marca    = typeof marcas.$inferSelect;
export type NewMarca = typeof marcas.$inferInsert;