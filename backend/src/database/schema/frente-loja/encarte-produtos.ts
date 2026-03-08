import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { encartes } from './encartes';

// ─────────────────────────────────────────────────────────────────────────────
// ENCARTE_PRODUTOS
// Array `produtos` — produtos com preços de oferta por encarte.
// ─────────────────────────────────────────────────────────────────────────────

export const encarteProdutos = sqliteTable(
  'encarte_produtos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    encarteId: integer('encarte_id')
      .notNull()
      .references(() => encartes.id, { onDelete: 'cascade' }),

    externalId: integer('external_id'), // id do ProdutoEncarte

    produtoId: integer('produto_id').notNull(), // external_id do produto

    valorOfertaPreco1: real('valor_oferta_preco_1'),
    valorOfertaPreco2: real('valor_oferta_preco_2'),
    valorOfertaPreco3: real('valor_oferta_preco_3'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEncarteId:      index('idx_enc_prod_encarte_id').on(t.encarteId),
    idxProdutoId:      index('idx_enc_prod_produto_id').on(t.produtoId),
    uniqEncarteProduto: unique('uq_enc_prod_encarte_produto').on(t.encarteId, t.produtoId),
  }),
);

export type EncarteProduto    = typeof encarteProdutos.$inferSelect;
export type NewEncarteProduto = typeof encarteProdutos.$inferInsert;
