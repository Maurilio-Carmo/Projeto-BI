import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_PRECOS — /v1/produto/precos
// Preços de venda / oferta por produto × loja.
// Múltiplas tabelas de preço (1, 2, 3) e preços de oferta.
// ─────────────────────────────────────────────────────────────────────────────

export const productPrecos = sqliteTable(
  'product_precos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → products
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

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
        'PROGRAMADO',
        'NOTA_FISCAL',
        'ASSISTENTE_COMPRA',
        'ESPELHAMENTO',
        'SIMULADOR',
      ],
    }).notNull(),

    incentivoEmZonaFranca: text('incentivo_em_zona_franca'),

    // ── Datas dos últimos reajustes ──────────────────────────────────────────
    dataUltimoReajustePreco1: text('data_ultimo_reajuste_preco_1'),
    dataUltimoReajustePreco2: text('data_ultimo_reajuste_preco_2'),
    dataUltimoReajustePreco3: text('data_ultimo_reajuste_preco_3'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId: index('idx_prod_preco_product_id').on(t.productId),
    idxLojaId:    index('idx_prod_preco_loja_id').on(t.lojaId),
    uniqProductLoja: unique('uq_prod_preco_product_loja').on(t.productId, t.lojaId),
  }),
);

export type ProductPreco    = typeof productPrecos.$inferSelect;
export type NewProductPreco = typeof productPrecos.$inferInsert;
