import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICOS_PADRAO — /v1/financeiro/historicos-padrao
// Históricos padrões de lançamento financeiro (crédito / débito).
// ─────────────────────────────────────────────────────────────────────────────

export const historicosPadrao = sqliteTable(
  'historicos_padrao',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao: text('descricao').notNull(),

    tipo: text('tipo', { enum: ['CREDITO', 'DEBITO'] }).notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxTipo:       index('idx_hist_pad_tipo').on(t.tipo),
  }),
);

export type HistoricoPadrao    = typeof historicosPadrao.$inferSelect;
export type NewHistoricoPadrao = typeof historicosPadrao.$inferInsert;
