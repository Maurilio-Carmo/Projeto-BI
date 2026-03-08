import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_FORNECEDORES — /v1/produto/produtos/{produtoId}/fornecedores
// Referências do produto no catálogo de cada fornecedor.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoFornecedores = sqliteTable(
  'produto_fornecedores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    // External id do fornecedor
    fornecedorId: integer('fornecedor_id').notNull(),

    referencia: text('referencia').notNull(),
    unidade:    text('unidade').notNull(),
    quantidade: real('quantidade').notNull(),

    nivel: text('nivel', {
      enum: ['PRINCIPAL', 'SECUNDARIO'],
    }).notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId:       index('idx_prod_forn_produto_id').on(t.produtoId),
    idxFornecedor:      index('idx_prod_forn_fornecedor_id').on(t.fornecedorId),
    uniqProdutoForn:    unique('uq_prod_forn_produto_fornecedor').on(t.produtoId, t.fornecedorId, t.referencia),
  }),
);

export type ProdutoFornecedor    = typeof produtoFornecedores.$inferSelect;
export type NewProdutoFornecedor = typeof produtoFornecedores.$inferInsert;
