import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './products';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_REGIMES
// Array `regimesDoProduto` embutido em Produto.
// Regime estadual tributário específico do produto por loja.
// ─────────────────────────────────────────────────────────────────────────────

export const productRegimes = sqliteTable(
  'product_regimes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    lojaId:           integer('loja_id').notNull(),
    regimeEstadualId: integer('regime_estadual_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_regime_product_id').on(t.productId),
    idxLojaId:    index('idx_prod_regime_loja_id').on(t.lojaId),
    uniqProductLojaRegime: unique('uq_prod_regime_product_loja').on(t.productId, t.lojaId),
  }),
);

export type ProductRegime    = typeof productRegimes.$inferSelect;
export type NewProductRegime = typeof productRegimes.$inferInsert;
