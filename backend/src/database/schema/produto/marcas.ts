import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MARCAS — /v1/produto/marcas
// ─────────────────────────────────────────────────────────────────────────────

export const marcas = sqliteTable(
  'marcas',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao: text('descricao').notNull(),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
  }),
);

export type Marca    = typeof marcas.$inferSelect;
export type NewMarca = typeof marcas.$inferInsert;
