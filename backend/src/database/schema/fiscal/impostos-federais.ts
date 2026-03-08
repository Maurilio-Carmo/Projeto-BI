import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// IMPOSTOS_FEDERAIS — /v1/fiscal/impostos-federais
// PIS, COFINS, IRPJ, CSLL e outros.
// Sub-objeto `impostoFederalGeral` em `impostos-federais-geral.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const impostosFederais = sqliteTable(
  'impostos_federais',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao:  text('descricao').notNull(),
    retencao:   real('retencao'),
    observacao: text('observacao'),

    tipoImposto: text('tipo_imposto', {
      enum: ['PIS', 'COFINS', 'IRPJ', 'CSLL', 'OUTROS'],
    }).notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxTipo:       index('idx_imp_fed_tipo').on(t.tipoImposto),
  }),
);

export type ImpostoFederal    = typeof impostosFederais.$inferSelect;
export type NewImpostoFederal = typeof impostosFederais.$inferInsert;
