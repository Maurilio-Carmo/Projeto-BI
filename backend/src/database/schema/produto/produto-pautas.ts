import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_PAUTAS
// Array `pautasDoProduto` embutido em Produto.
// Define base de cálculo de ST por UF quando tipoAgregacao = PAUTA.
// ─────────────────────────────────────────────────────────────────────────────

export const productPautas = sqliteTable(
  'product_pautas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    uf: text('uf').notNull(),

    tipoDePauta: text('tipo_de_pauta', {
      enum: ['FIXA', 'MINIMA'],
    }).notNull(),

    valorDePauta: real('valor_de_pauta'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_pauta_product_id').on(t.productId),
    uniqProductUf: unique('uq_prod_pauta_product_uf').on(t.productId, t.uf),
  }),
);

export type ProductPauta    = typeof productPautas.$inferSelect;
export type NewProductPauta = typeof productPautas.$inferInsert;
