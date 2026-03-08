import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// ESTOQUE_SALDOS — /v1/estoque/saldos
// Saldo real de estoque por produto × loja × local.
// ─────────────────────────────────────────────────────────────────────────────

export const estoqueSaldos = sqliteTable(
  'estoque_saldos',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    lojaId:    integer('loja_id').notNull(),
    produtoId: integer('produto_id').notNull(), // external_id do produto
    localId:   integer('local_id').notNull(),

    saldo: real('saldo'),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId:     index('idx_estq_sald_external_id').on(t.externalId),
    idxProduto:        index('idx_estq_sald_produto_id').on(t.produtoId),
    idxLoja:           index('idx_estq_sald_loja_id').on(t.lojaId),
    idxLocal:          index('idx_estq_sald_local_id').on(t.localId),
    uniqProdLojaLocal: unique('uq_estq_sald_prod_loja_local').on(t.produtoId, t.lojaId, t.localId),
  }),
);

export type EstoqueSaldo    = typeof estoqueSaldos.$inferSelect;
export type NewEstoqueSaldo = typeof estoqueSaldos.$inferInsert;
