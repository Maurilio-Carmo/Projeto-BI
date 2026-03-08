import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './products';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_IMPOSTOS_FEDERAIS
// Array `itensImpostosFederais` embutido em Produto.
// Cada item referencia um ImpostoFederal pelo seu id (string).
// ─────────────────────────────────────────────────────────────────────────────

export const productImpostosFederais = sqliteTable(
  'product_impostos_federais',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    // Identificador do imposto federal (string, ex: "PIS_001")
    impostoFederalId: text('imposto_federal_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_imp_fed_product_id').on(t.productId),
    idxImposto:   index('idx_prod_imp_fed_imposto_id').on(t.impostoFederalId),
  }),
);

export type ProductImpostoFederal    = typeof productImpostosFederais.$inferSelect;
export type NewProductImpostoFederal = typeof productImpostosFederais.$inferInsert;
