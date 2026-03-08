import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVOS_DESCONTO — /v1/motivos-desconto
// ─────────────────────────────────────────────────────────────────────────────

export const motivosDesconto = sqliteTable(
  'motivos_desconto',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao'),

    tipoAplicacaoDesconto: text('tipo_aplicacao_desconto', {
      enum: ['ITEM', 'SUB_TOTAL', 'AMBOS'],
    }),

    solicitaJustificativa: integer('solicita_justificativa', { mode: 'boolean' }),
    descontoFidelidade:    integer('desconto_fidelidade',    { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_mot_desc_external_id').on(t.externalId),
  }),
);

export type MotivoDesconto    = typeof motivosDesconto.$inferSelect;
export type NewMotivoDesconto = typeof motivosDesconto.$inferInsert;
