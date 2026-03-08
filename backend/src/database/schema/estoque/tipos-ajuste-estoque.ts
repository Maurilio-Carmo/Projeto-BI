import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS_AJUSTE_ESTOQUE — /v1/estoque/tipos-ajuste
// ─────────────────────────────────────────────────────────────────────────────

export const tiposAjusteEstoque = sqliteTable(
  'tipos_ajuste_estoque',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao').notNull(),

    tipoDeOperacao: text('tipo_de_operacao', {
      enum: ['ENTRADA', 'SAIDA'],
    }),

    tipoReservado: text('tipo_reservado', {
      enum: [
        'REQUISICAO', 'ESTORNO_DE_TRANSFERENCIA', 'INVENTARIO',
        'NOTA_FISCAL', 'NOTA_FISCAL_CANCELAMENTO', 'NOTA_FISCAL_ESTORNO',
        'NOTA_FISCAL_DEVOLUCAO', 'NOTA_FISCAL_TRANSFERENCIA', 'NOTA_FISCAL_EXCLUIR',
        'VENDA', 'CANCELAMENTO', 'PRODUCAO', 'TROCA_E_DEVOLUCAO_DE_CUPOM',
        'RENDIMENTO', 'RENDIMENTO_ESTORNO', 'AJUSTE_CUSTO', 'AJUSTE_MIGRACAO',
        'MOVIMENTACAO_INICIAL', 'ZERA_ESTOQUE',
      ],
    }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_tipo_ajuste_external_id').on(t.externalId),
    idxTipo:       index('idx_tipo_ajuste_tipo').on(t.tipoDeOperacao),
  }),
);

export type TipoAjusteEstoque    = typeof tiposAjusteEstoque.$inferSelect;
export type NewTipoAjusteEstoque = typeof tiposAjusteEstoque.$inferInsert;
