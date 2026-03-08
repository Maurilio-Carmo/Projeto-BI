import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// RECEBIMENTOS_PDV — /v1/financeiro/recebimentos-pdv
// Formas de recebimento disponíveis no PDV.
// Lojas vinculadas em `recebimentos-pdv-lojas.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const recebimentosPdv = sqliteTable(
  'recebimentos_pdv',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:   text('descricao').notNull(),
    categoriaId: integer('categoria_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_rec_pdv_external_id').on(t.externalId),
    idxCategoria:  index('idx_rec_pdv_categoria_id').on(t.categoriaId),
  }),
);

export type RecebimentoPdv    = typeof recebimentosPdv.$inferSelect;
export type NewRecebimentoPdv = typeof recebimentosPdv.$inferInsert;
