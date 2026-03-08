import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './products';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_ESTOQUE
// Array `estoqueDoProduto` embutido em Produto — parâmetros de estoque
// mínimo/máximo por loja.  Saldo real está em `estoque_saldos`.
// ─────────────────────────────────────────────────────────────────────────────

export const productEstoque = sqliteTable(
  'product_estoque',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    lojaId:        integer('loja_id').notNull(),
    estoqueMinimo: real('estoque_minimo').notNull(),
    estoqueMaximo: real('estoque_maximo').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_estq_product_id').on(t.productId),
    idxLojaId:    index('idx_prod_estq_loja_id').on(t.lojaId),
    uniqProductLoja: unique('uq_prod_estq_product_loja').on(t.productId, t.lojaId),
  }),
);

export type ProductEstoque    = typeof productEstoque.$inferSelect;
export type NewProductEstoque = typeof productEstoque.$inferInsert;
