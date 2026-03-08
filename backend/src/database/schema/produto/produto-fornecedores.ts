import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_FORNECEDORES — /v1/produto/produtos/{produtoId}/fornecedores
// Referências do produto no catálogo de cada fornecedor.
// ─────────────────────────────────────────────────────────────────────────────

export const productFornecedores = sqliteTable(
  'product_fornecedores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    // External id do fornecedor
    fornecedorId: integer('fornecedor_id').notNull(),

    referencia: text('referencia').notNull(),
    unidade:    text('unidade').notNull(),
    quantidade: real('quantidade').notNull(),

    nivel: text('nivel', {
      enum: ['PRINCIPAL', 'SECUNDARIO'],
    }).notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId:   index('idx_prod_forn_product_id').on(t.productId),
    idxFornecedor:  index('idx_prod_forn_fornecedor_id').on(t.fornecedorId),
    uniqProductForn: unique('uq_prod_forn_product_fornecedor').on(t.productId, t.fornecedorId, t.referencia),
  }),
);

export type ProductFornecedor    = typeof productFornecedores.$inferSelect;
export type NewProductFornecedor = typeof productFornecedores.$inferInsert;
