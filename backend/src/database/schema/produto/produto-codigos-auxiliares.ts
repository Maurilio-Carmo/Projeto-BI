import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT_CODIGOS_AUXILIARES — /v1/produto/codigos-auxiliares
// Códigos de barras / literais alternativos de um produto.
// ─────────────────────────────────────────────────────────────────────────────

export const productCodigosAuxiliares = sqliteTable(
  'product_codigos_auxiliares',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    tipo: text('tipo', { enum: ['LITERAL', 'EAN'] }),

    fator:        real('fator'),
    eanTributado: integer('ean_tributado', { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProductId:  index('idx_cod_aux_product_id').on(t.productId),
    idxTipo:       index('idx_cod_aux_tipo').on(t.tipo),
  }),
);

export type ProductCodigoAuxiliar    = typeof productCodigosAuxiliares.$inferSelect;
export type NewProductCodigoAuxiliar = typeof productCodigosAuxiliares.$inferInsert;
