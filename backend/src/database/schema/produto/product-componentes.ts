import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './products';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_COMPONENTES
// Array `componentes` embutido em Produto (produtos do tipo KIT/COMPOSTO).
// `componenteProductId` aponta para o produto-componente na mesma tabela.
// ─────────────────────────────────────────────────────────────────────────────

export const productComponentes = sqliteTable(
  'product_componentes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products (produto pai — o kit/composto)
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    // external id do componente (productId da API)
    componenteExternalId: integer('componente_external_id').notNull(),

    quantidade: real('quantidade').notNull(),
    preco1:     real('preco_1').notNull(),
    preco2:     real('preco_2').notNull(),
    preco3:     real('preco_3').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId:   index('idx_prod_comp_product_id').on(t.productId),
    idxComponente:  index('idx_prod_comp_ext_id').on(t.componenteExternalId),
  }),
);

export type ProductComponente    = typeof productComponentes.$inferSelect;
export type NewProductComponente = typeof productComponentes.$inferInsert;
