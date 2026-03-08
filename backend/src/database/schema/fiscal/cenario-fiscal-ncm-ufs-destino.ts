import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { cenariosFiscaisNcm } from './cenarios-fiscais-ncm';

// ─────────────────────────────────────────────────────────────────────────────
// CENARIO_FISCAL_NCM_UFS_DESTINO
// Array `ufsDestino` — UFs de destino vinculadas a um cenário fiscal.
// ─────────────────────────────────────────────────────────────────────────────

export const cenarioFiscalNcmUfsDestino = sqliteTable(
  'cenario_fiscal_ncm_ufs_destino',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cenarioFiscalId: integer('cenario_fiscal_id')
      .notNull()
      .references(() => cenariosFiscaisNcm.id, { onDelete: 'cascade' }),

    ufDestino: text('uf_destino').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxCenario:    index('idx_cen_fisc_ncm_uf_dest_cenario').on(t.cenarioFiscalId),
    uniqCenarioUf: unique('uq_cen_fisc_ncm_uf_dest').on(t.cenarioFiscalId, t.ufDestino),
  }),
);

export type CenarioFiscalNcmUfDestino    = typeof cenarioFiscalNcmUfsDestino.$inferSelect;
export type NewCenarioFiscalNcmUfDestino = typeof cenarioFiscalNcmUfsDestino.$inferInsert;
