import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIAS_FINANCEIRAS — /v1/financeiro/categorias
// Plano de contas financeiro (receita / despesa), hierárquico.
// ─────────────────────────────────────────────────────────────────────────────

export const categoriasFinanceiras = sqliteTable(
  'categorias_financeiras',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:             text('descricao'),
    codigoContabilExterno: integer('codigo_contabil_externo'),
    codigoDaCategoriaPai:  integer('codigo_da_categoria_pai'),
    posicao:               integer('posicao'),
    inativa:               integer('inativa', { mode: 'boolean' }),

    classificacaoDaCategoria: text('classificacao_da_categoria', {
      enum: ['DESPESA', 'RECEITA'],
    }),

    tipoDeCategoria: text('tipo_de_categoria', {
      enum: ['SINTETICA', 'ANALITICA'],
    }),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_cat_fin_external_id').on(t.externalId),
    idxPai:        index('idx_cat_fin_pai').on(t.codigoDaCategoriaPai),
    idxClassif:    index('idx_cat_fin_classif').on(t.classificacaoDaCategoria),
  }),
);

export type CategoriaFinanceira    = typeof categoriasFinanceiras.$inferSelect;
export type NewCategoriaFinanceira = typeof categoriasFinanceiras.$inferInsert;
