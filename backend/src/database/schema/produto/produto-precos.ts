import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_PRECOS — /v1/produto/precos
// Preços de venda / oferta por produto × loja.
// Múltiplas tabelas de preço (1, 2, 3) e preços de oferta.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoPrecos = sqliteTable(
  'produto_precos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    lojaId: integer('loja_id').notNull(),

    // ── Preços de venda ──────────────────────────────────────────────────────
    precoVenda1: real('preco_venda_1').notNull(),
    precoVenda2: real('preco_venda_2').notNull(),
    precoVenda3: real('preco_venda_3').notNull(),

    // ── Preços de oferta ─────────────────────────────────────────────────────
    precoOferta1: real('preco_oferta_1').notNull(),
    precoOferta2: real('preco_oferta_2').notNull(),
    precoOferta3: real('preco_oferta_3').notNull(),

    // ── Quantidades mínimas para preço 2 / 3 ─────────────────────────────────
    quantidadeMinimaPreco2: real('quantidade_minima_preco_2').notNull(),
    quantidadeMinimaPreco3: real('quantidade_minima_preco_3').notNull(),

    // ── Margens ───────────────────────────────────────────────────────────────
    margemPreco1: real('margem_preco_1').notNull(),
    margemPreco2: real('margem_preco_2').notNull(),
    margemPreco3: real('margem_preco_3').notNull(),

    // ── Custos de referência ─────────────────────────────────────────────────
    precoMedioDeReposicao:  real('preco_medio_de_reposicao'),
    precoFiscalDeReposicao: real('preco_fiscal_de_reposicao'),
    custoProduto:           real('custo_produto'),

    // ── Desconto ─────────────────────────────────────────────────────────────
    descontoMaximo:  real('desconto_maximo').notNull(),
    permiteDesconto: integer('permite_desconto', { mode: 'boolean' }).notNull(),

    // ── Origem do último reajuste ────────────────────────────────────────────
    origem: text('origem', {
      enum: [
        'CADASTRO',
        'REAJUSTE_INDIVIDUAL',
        'REAJUSTE_GERAL',
        'REAJUSTE_LOTE',
        'ENCARTE',
        'IMPORTACAO',
      ],
    }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:    index('idx_prod_preco_produto_id').on(t.produtoId),
    idxLojaId:       index('idx_prod_preco_loja_id').on(t.lojaId),
    uniqProdutoLoja: unique('uq_prod_preco_produto_loja').on(t.produtoId, t.lojaId),
  }),
);

export type ProdutoPreco    = typeof produtoPrecos.$inferSelect;
export type NewProdutoPreco = typeof produtoPrecos.$inferInsert;
