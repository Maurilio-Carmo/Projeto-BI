import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { cenariosFiscaisNcm } from '../cenarios-fiscais-ncm';

// ─────────────────────────────────────────────────────────────────────────────
// CENARIO_FISCAL_NCM_LOJAS
// Array `lojas` — Lojas vinculadas a um cenário fiscal.
// ─────────────────────────────────────────────────────────────────────────────

export const cenarioFiscalNcmLojas = sqliteTable(
  'cenario_fiscal_ncm_lojas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cenarioFiscalId: integer('cenario_fiscal_id')
      .notNull()
      .references(() => cenariosFiscaisNcm.id, { onDelete: 'cascade' }),

    codigoLoja:    integer('codigo_loja').notNull(),
    descricaoLoja: text('descricao_loja'),
    ufOrigem:      text('uf_origem'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxCenario:      index('idx_cen_fisc_ncm_lojas_cenario').on(t.cenarioFiscalId),
    idxLoja:         index('idx_cen_fisc_ncm_lojas_loja').on(t.codigoLoja),
    uniqCenarioLoja: unique('uq_cen_fisc_ncm_lojas').on(t.cenarioFiscalId, t.codigoLoja),
  }),
);

export type CenarioFiscalNcmLoja    = typeof cenarioFiscalNcmLojas.$inferSelect;
export type NewCenarioFiscalNcmLoja = typeof cenarioFiscalNcmLojas.$inferInsert;
