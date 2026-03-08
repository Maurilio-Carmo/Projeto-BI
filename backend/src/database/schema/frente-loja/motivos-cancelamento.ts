import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVOS_CANCELAMENTO — /v1/motivos-cancelamento
// ─────────────────────────────────────────────────────────────────────────────

export const motivosCancelamento = sqliteTable(
  'motivos_cancelamento',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao'),

    solicitaJustificativa: integer('solicita_justificativa', { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_mot_can_external_id').on(t.externalId),
  }),
);

export type MotivoCancelamento    = typeof motivosCancelamento.$inferSelect;
export type NewMotivoCancelamento = typeof motivosCancelamento.$inferInsert;
