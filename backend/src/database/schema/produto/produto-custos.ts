import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_CUSTOS — /v1/produto/custos
// Custos de reposição (reposição, médio, fiscal) por produto × loja.
// ─────────────────────────────────────────────────────────────────────────────

export const productCustos = sqliteTable(
  'product_custos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    lojaId: integer('loja_id').notNull(),

    custoReposicao: real('custo_reposicao').notNull(),
    custoMedio:     real('custo_medio').notNull(),
    custoFiscal:    real('custo_fiscal').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_custo_product_id').on(t.productId),
    idxLojaId:    index('idx_prod_custo_loja_id').on(t.lojaId),
    uniqProductLoja: unique('uq_prod_custo_product_loja').on(t.productId, t.lojaId),
  }),
);

export type ProductCusto    = typeof productCustos.$inferSelect;
export type NewProductCusto = typeof productCustos.$inferInsert;
