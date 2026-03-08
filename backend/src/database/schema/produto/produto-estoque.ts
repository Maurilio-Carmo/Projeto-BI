import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_ESTOQUE
// Array `estoqueDoProduto` embutido em Produto — parâmetros de estoque
// mínimo/máximo por loja.  Saldo real está em `estoque_saldos`.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoEstoque = sqliteTable(
  'produto_estoque',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    lojaId:        integer('loja_id').notNull(),
    estoqueMinimo: real('estoque_minimo').notNull(),
    estoqueMaximo: real('estoque_maximo').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:    index('idx_prod_estq_produto_id').on(t.produtoId),
    idxLojaId:       index('idx_prod_estq_loja_id').on(t.lojaId),
    uniqProdutoLoja: unique('uq_prod_estq_produto_loja').on(t.produtoId, t.lojaId),
  }),
);

export type ProdutoEstoque    = typeof produtoEstoque.$inferSelect;
export type NewProdutoEstoque = typeof produtoEstoque.$inferInsert;
