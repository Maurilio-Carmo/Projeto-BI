import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVOS_DEVOLUCAO — /v1/financeiro/motivos-devolucao
// ─────────────────────────────────────────────────────────────────────────────

export const motivosDevolucao = sqliteTable(
  'motivos_devolucao',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao: text('descricao'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
  }),
);

export type MotivoDevolucao    = typeof motivosDevolucao.$inferSelect;
export type NewMotivoDevolucao = typeof motivosDevolucao.$inferInsert;
