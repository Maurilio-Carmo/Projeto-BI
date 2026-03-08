import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_CODIGOS_AUXILIARES — /v1/produto/codigos-auxiliares
// Códigos de barras / literais alternativos de um produto.
// ─────────────────────────────────────────────────────────────────────────────

export const produtoCodigosAuxiliares = sqliteTable(
  'produto_codigos_auxiliares',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    tipo: text('tipo', { enum: ['LITERAL', 'EAN'] }),

    fator:        real('fator'),
    eanTributado: integer('ean_tributado', { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId: index('idx_cod_aux_produto_id').on(t.produtoId),
    idxTipo:      index('idx_cod_aux_tipo').on(t.tipo),
  }),
);

export type ProdutoCodigoAuxiliar    = typeof produtoCodigosAuxiliares.$inferSelect;
export type NewProdutoCodigoAuxiliar = typeof produtoCodigosAuxiliares.$inferInsert;
