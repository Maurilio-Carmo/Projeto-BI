import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// TABELAS_TRIBUTARIAS — /v1/fiscal/tabelas-tributarias
// Tabelas de tributação estadual por UF, regime e figura fiscal.
// Itens em `tabelas-tributarias-itens.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const tabelasTributarias = sqliteTable(
  'tabelas_tributarias',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    situacaoFiscalId: integer('situacao_fiscal_id'),
    figuraFiscalId:   integer('figura_fiscal_id'),
    regimeEstadualId: integer('regime_estadual_id'),

    uf:      text('uf'),
    decreto: text('decreto'),

    tipoDeOperacao: text('tipo_de_operacao', {
      enum: ['ENTRADA', 'SAIDA'],
    }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_tab_trib_external_id').on(t.externalId),
    idxUf:         index('idx_tab_trib_uf').on(t.uf),
    idxTipo:       index('idx_tab_trib_tipo').on(t.tipoDeOperacao),
    idxRegime:     index('idx_tab_trib_regime').on(t.regimeEstadualId),
  }),
);

export type TabelaTributaria    = typeof tabelasTributarias.$inferSelect;
export type NewTabelaTributaria = typeof tabelasTributarias.$inferInsert;
