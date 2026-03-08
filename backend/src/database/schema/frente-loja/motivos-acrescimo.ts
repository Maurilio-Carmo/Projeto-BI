import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVOS_ACRESCIMO — /v1/motivos-acrescimo
// ─────────────────────────────────────────────────────────────────────────────

export const motivosAcrescimo = sqliteTable(
  'motivos_acrescimo',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao: text('descricao'),

    tipoAplicacaoAcrescimo: text('tipo_aplicacao_acrescimo', {
      enum: ['ITEM', 'CUPOM'],
    }),

    solicitaJustificativa: integer('solicita_justificativa', { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
  }),
);

export type MotivoAcrescimo    = typeof motivosAcrescimo.$inferSelect;
export type NewMotivoAcrescimo = typeof motivosAcrescimo.$inferInsert;
