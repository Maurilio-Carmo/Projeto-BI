import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// LOCAIS_ESTOQUE — /v1/estoque/locais
// Locais físicos de armazenamento (próprios ou de terceiros).
// ─────────────────────────────────────────────────────────────────────────────

export const locaisEstoque = sqliteTable(
  'locais_estoque',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao: text('descricao').notNull(),
    bloqueio:  integer('bloqueio', { mode: 'boolean' }).notNull(),

    tipoDeEstoque: text('tipo_de_estoque', {
      enum: ['PROPRIO', 'TERCEIROS'],
    }).notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxTipo:       index('idx_loc_estq_tipo').on(t.tipoDeEstoque),
  }),
);

export type LocalEstoque    = typeof locaisEstoque.$inferSelect;
export type NewLocalEstoque = typeof locaisEstoque.$inferInsert;
