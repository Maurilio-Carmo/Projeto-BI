import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// FAMILIAS — /v1/produto/familias
// Agrupamento de produtos para regras de preço por quantidade.
// ─────────────────────────────────────────────────────────────────────────────

export const familias = sqliteTable(
  'familias',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao'),

    utilizaPrecoPorQuantidade: integer('utiliza_preco_por_quantidade', { mode: 'boolean' }),

    quantidadeMinimaPreco2: real('quantidade_minima_preco_2'),
    quantidadeMinimaPreco3: real('quantidade_minima_preco_3'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_familias_external_id').on(t.externalId),
  }),
);

export type Familia    = typeof familias.$inferSelect;
export type NewFamilia = typeof familias.$inferInsert;
