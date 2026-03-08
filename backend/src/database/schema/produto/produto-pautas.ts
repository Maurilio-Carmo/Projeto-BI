import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_PAUTAS
// Array `pautasDoProduto` embutido em Produto.
// Define base de cálculo de ST por UF quando tipoAgregacao = PAUTA.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoPautas = sqliteTable(
  'produto_pautas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    uf: text('uf').notNull(),

    tipoDePauta: text('tipo_de_pauta', {
      enum: ['FIXA', 'MINIMA'],
    }).notNull(),

    valorDePauta: real('valor_de_pauta'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:    index('idx_prod_pauta_produto_id').on(t.produtoId),
    uniqProdutoUf:   unique('uq_prod_pauta_produto_uf').on(t.produtoId, t.uf),
  }),
);

export type ProdutoPauta    = typeof produtoPautas.$inferSelect;
export type NewProdutoPauta = typeof produtoPautas.$inferInsert;
