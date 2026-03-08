import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { cenariosFiscaisNcm } from '../cenarios-fiscais-ncm';

// ─────────────────────────────────────────────────────────────────────────────
// CENARIO_FISCAL_NCM_NCMS
// Array `ncms` — NCMs vinculados a um cenário fiscal.
// ─────────────────────────────────────────────────────────────────────────────

export const cenarioFiscalNcmNcms = sqliteTable(
  'cenario_fiscal_ncm_ncms',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cenarioFiscalId: integer('cenario_fiscal_id')
      .notNull()
      .references(() => cenariosFiscaisNcm.id, { onDelete: 'cascade' }),

    codigoNcm:          integer('codigo_ncm').notNull(),
    descricaoNcm:       text('descricao_ncm'),
    quantidadeProdutos: integer('quantidade_produtos'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxCenario:     index('idx_cen_fisc_ncm_ncms_cenario').on(t.cenarioFiscalId),
    idxNcm:         index('idx_cen_fisc_ncm_ncms_ncm').on(t.codigoNcm),
    uniqCenarioNcm: unique('uq_cen_fisc_ncm_ncms').on(t.cenarioFiscalId, t.codigoNcm),
  }),
);

export type CenarioFiscalNcmNcm    = typeof cenarioFiscalNcmNcms.$inferSelect;
export type NewCenarioFiscalNcmNcm = typeof cenarioFiscalNcmNcms.$inferInsert;
