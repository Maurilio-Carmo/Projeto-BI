import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_CUSTOS — /v1/produto/custos
// Custos de reposição (reposição, médio, fiscal) por produto × loja.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoCustos = sqliteTable(
  'produto_custos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    lojaId: integer('loja_id').notNull(),

    custoReposicao: real('custo_reposicao').notNull(),
    custoMedio:     real('custo_medio').notNull(),
    custoFiscal:    real('custo_fiscal').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:    index('idx_prod_custo_produto_id').on(t.produtoId),
    idxLojaId:       index('idx_prod_custo_loja_id').on(t.lojaId),
    uniqProdutoLoja: unique('uq_prod_custo_produto_loja').on(t.produtoId, t.lojaId),
  }),
);

export type ProdutoCusto    = typeof produtoCustos.$inferSelect;
export type NewProdutoCusto = typeof produtoCustos.$inferInsert;
