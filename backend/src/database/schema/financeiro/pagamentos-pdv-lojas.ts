import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { pagamentosPdv } from './pagamentos-pdv';

// ─────────────────────────────────────────────────────────────────────────────
// PAGAMENTOS_PDV_LOJAS
// Array `lojas` — limite por loja de cada forma de pagamento PDV.
// ─────────────────────────────────────────────────────────────────────────────

export const pagamentosPdvLojas = sqliteTable(
  'pagamentos_pdv_lojas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    pagamentoPdvId: integer('pagamento_pdv_id')
      .notNull()
      .references(() => pagamentosPdv.id, { onDelete: 'cascade' }),

    lojaId:      integer('loja_id').notNull(),
    valorMaximo: real('valor_maximo'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxPagamento: index('idx_pag_pdv_lj_pagamento_id').on(t.pagamentoPdvId),
    idxLoja:      index('idx_pag_pdv_lj_loja_id').on(t.lojaId),
    uniqPagLoja:  unique('uq_pag_pdv_lj').on(t.pagamentoPdvId, t.lojaId),
  }),
);

export type PagamentoPdvLoja    = typeof pagamentosPdvLojas.$inferSelect;
export type NewPagamentoPdvLoja = typeof pagamentosPdvLojas.$inferInsert;
