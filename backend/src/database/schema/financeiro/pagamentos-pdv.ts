import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// PAGAMENTOS_PDV — /v1/financeiro/pagamentos-pdv
// Formas de pagamento disponíveis no PDV.
// Lojas vinculadas em `pagamentos-pdv-lojas.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const pagamentosPdv = sqliteTable(
  'pagamentos_pdv',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao:   text('descricao').notNull(),
    categoriaId: integer('categoria_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_pag_pdv_external_id').on(t.externalId),
    idxCategoria:  index('idx_pag_pdv_categoria_id').on(t.categoriaId),
  }),
);

export type PagamentoPdv    = typeof pagamentosPdv.$inferSelect;
export type NewPagamentoPdv = typeof pagamentosPdv.$inferInsert;
