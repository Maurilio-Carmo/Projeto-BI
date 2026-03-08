import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// CONTAS_CORRENTES — /v1/financeiro/contas-correntes
// Caixas e contas bancárias por loja.
// ─────────────────────────────────────────────────────────────────────────────

export const contasCorrentes = sqliteTable(
  'contas_correntes',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:        text('descricao').notNull(),
    agencia:          text('agencia'),
    conta:            text('conta'),
    localDePagamento: text('local_de_pagamento'),

    tipo: text('tipo', { enum: ['CAIXA', 'BANCARIA'] }).notNull(),

    lojaId:             integer('loja_id').notNull(),
    agenteFinanceiroId: integer('agente_financeiro_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_cont_corr_external_id').on(t.externalId),
    idxLoja:       index('idx_cont_corr_loja_id').on(t.lojaId),
    idxAgente:     index('idx_cont_corr_agente_id').on(t.agenteFinanceiroId),
  }),
);

export type ContaCorrente    = typeof contasCorrentes.$inferSelect;
export type NewContaCorrente = typeof contasCorrentes.$inferInsert;
