import { sqliteTable, integer, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { encartes } from './encartes';

// ─────────────────────────────────────────────────────────────────────────────
// ENCARTE_LOJAS
// Array `lojasIds` — lojas participantes do encarte.
// ─────────────────────────────────────────────────────────────────────────────

export const encarteLojas = sqliteTable(
  'encarte_lojas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    encarteId: integer('encarte_id')
      .notNull()
      .references(() => encartes.id, { onDelete: 'cascade' }),

    lojaId: integer('loja_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEncarteId:    index('idx_enc_lj_encarte_id').on(t.encarteId),
    idxLojaId:       index('idx_enc_lj_loja_id').on(t.lojaId),
    uniqEncarteLoja: unique('uq_enc_lj_encarte_loja').on(t.encarteId, t.lojaId),
  }),
);

export type EncarteLojaItem    = typeof encarteLojas.$inferSelect;
export type NewEncarteLojaItem = typeof encarteLojas.$inferInsert;
