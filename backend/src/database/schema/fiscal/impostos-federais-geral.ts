import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { impostosFederais } from './impostos-federais';

// ─────────────────────────────────────────────────────────────────────────────
// IMPOSTOS_FEDERAIS_GERAL
// Sub-objeto `impostoFederalGeral` — alíquotas e CSTs por regime.
// Relação 1-1 com impostos_federais.
// ─────────────────────────────────────────────────────────────────────────────

export const impostosFederaisGeral = sqliteTable(
  'impostos_federais_geral',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    impostoFederalId: integer('imposto_federal_id')
      .notNull()
      .unique()
      .references(() => impostosFederais.id, { onDelete: 'cascade' }),

    // ── CSTs ─────────────────────────────────────────────────────────────────
    cstEntrada:          text('cst_entrada'),
    cstSaida:            text('cst_saida'),
    cstEntradaPresumido: text('cst_entrada_presumido'),
    cstSaidaPresumido:   text('cst_saida_presumido'),
    cstEntradaSimples:   text('cst_entrada_simples'),
    cstSaidaSimples:     text('cst_saida_simples'),

    // ── Alíquotas ────────────────────────────────────────────────────────────
    aliquotaEntrada:          real('aliquota_entrada'),
    aliquotaSaida:            real('aliquota_saida'),
    aliquotaEntradaPresumido: real('aliquota_entrada_presumido'),
    aliquotaSaidaPresumido:   real('aliquota_saida_presumido'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxImpostoFederal: index('idx_imp_fed_ger_imposto_id').on(t.impostoFederalId),
  }),
);

export type ImpostoFederalGeral    = typeof impostosFederaisGeral.$inferSelect;
export type NewImpostoFederalGeral = typeof impostosFederaisGeral.$inferInsert;
