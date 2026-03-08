import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_COMPONENTES
// Array `componentes` embutido em Produto (produtos do tipo KIT/COMPOSTO).
// `componenteProductId` aponta para o produto-componente na mesma tabela.
// ─────────────────────────────────────────────────────────────────────────────

export const productComponentes = sqliteTable(
  'product_componentes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    quantidade: real('quantidade').notNull(),
    preco1:     real('preco_1').notNull(),
    preco2:     real('preco_2').notNull(),
    preco3:     real('preco_3').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId:   index('idx_prod_comp_product_id').on(t.productId),
  }),
);

export type ProductComponente    = typeof productComponentes.$inferSelect;
export type NewProductComponente = typeof productComponentes.$inferInsert;
