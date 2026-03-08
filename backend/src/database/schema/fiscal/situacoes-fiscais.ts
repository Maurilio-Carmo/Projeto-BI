import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// SITUACOES_FISCAIS — /v1/fiscal/situacoes
// CST / CSOSN cadastrados no sistema.
// ─────────────────────────────────────────────────────────────────────────────

export const situacoesFiscais = sqliteTable(
  'situacoes_fiscais',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:         text('descricao').notNull(),
    descricaoCompleta: text('descricao_completa').notNull(),
    substituto:        integer('substituto', { mode: 'boolean' }).notNull(),
    tributacaoRms:     text('tributacao_rms').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_sit_fisc_external_id').on(t.externalId),
  }),
);

export type SituacaoFiscal    = typeof situacoesFiscais.$inferSelect;
export type NewSituacaoFiscal = typeof situacoesFiscais.$inferInsert;
