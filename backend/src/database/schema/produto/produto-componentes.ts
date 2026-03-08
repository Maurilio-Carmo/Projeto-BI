import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_COMPONENTES
// Array `componentes` embutido em Produto (produtos do tipo KIT/COMPOSTO).
// `componenteProdutoId` aponta para o produto-componente na mesma tabela.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoComponentes = sqliteTable(
  'produto_componentes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    quantidade: real('quantidade').notNull(),
    preco1:     real('preco_1').notNull(),
    preco2:     real('preco_2').notNull(),
    preco3:     real('preco_3').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId: index('idx_prod_comp_produto_id').on(t.produtoId),
  }),
);

export type ProdutoComponente    = typeof produtoComponentes.$inferSelect;
export type NewProdutoComponente = typeof produtoComponentes.$inferInsert;
