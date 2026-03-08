import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { produtos } from './produto';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO_IMPOSTOS_FEDERAIS
// Array `itensImpostosFederais` embutido em Produto.
// Cada item referencia um ImpostoFederal pelo seu id (string).
// ─────────────────────────────────────────────────────────────────────────────

export const produtoImpostosFederais = sqliteTable(
  'produto_impostos_federais',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // FK → produtos
    produtoId: integer('produto_id')
      .notNull()
      .references(() => produtos.id, { onDelete: 'cascade' }),

    // Identificador do imposto federal (string, ex: "PIS_001")
    impostoFederalId: text('imposto_federal_id').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxProdutoId: index('idx_prod_imp_fed_produto_id').on(t.produtoId),
    idxImposto:   index('idx_prod_imp_fed_imposto_id').on(t.impostoFederalId),
  }),
);

export type ProdutoImpostoFederal    = typeof produtoImpostosFederais.$inferSelect;
export type NewProdutoImpostoFederal = typeof produtoImpostosFederais.$inferInsert;
