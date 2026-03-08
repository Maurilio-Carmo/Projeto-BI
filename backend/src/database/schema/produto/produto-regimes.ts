import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_REGIMES
// Array `regimesDoProduto` embutido em Produto.
// Regime estadual tributário específico do produto por loja.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoRegimes = sqliteTable(
  'produto_regimes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    lojaId:           integer('loja_id').notNull(),
    regimeEstadualId: integer('regime_estadual_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:         index('idx_prod_regime_produto_id').on(t.produtoId),
    idxLojaId:            index('idx_prod_regime_loja_id').on(t.lojaId),
    uniqProdutoLojaRegime: unique('uq_prod_regime_produto_loja').on(t.produtoId, t.lojaId),
  }),
);

export type ProdutoRegime    = typeof produtoRegimes.$inferSelect;
export type NewProdutoRegime = typeof produtoRegimes.$inferInsert;
