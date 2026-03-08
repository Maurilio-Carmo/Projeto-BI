import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVOS_DEVOLUCAO — /v1/financeiro/motivos-devolucao
// ─────────────────────────────────────────────────────────────────────────────

export const motivosDevolucao = sqliteTable(
  'motivos_devolucao',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_mot_dev_external_id').on(t.externalId),
  }),
);

export type MotivoDevolucao    = typeof motivosDevolucao.$inferSelect;
export type NewMotivoDevolucao = typeof motivosDevolucao.$inferInsert;
