import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// CENARIOS_FISCAIS_NCM — /v1/fiscal/cenarios-fiscais-ncm
// Sub-tabelas: cenario-fiscal-ncm-ncms, -lojas, -ufs-destino.
// ─────────────────────────────────────────────────────────────────────────────

export const cenariosFiscaisNcm = sqliteTable(
  'cenarios_fiscais_ncm',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:  text('descricao'),
    cst:        integer('cst'),
    cClassTrib: integer('c_class_trib'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_cen_fisc_ncm_external_id').on(t.externalId),
  }),
);

export type CenarioFiscalNcm    = typeof cenariosFiscaisNcm.$inferSelect;
export type NewCenarioFiscalNcm = typeof cenariosFiscaisNcm.$inferInsert;
