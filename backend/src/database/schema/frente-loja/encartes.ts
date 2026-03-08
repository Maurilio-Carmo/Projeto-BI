import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// ENCARTES — /v1/venda/promocao/encartes
// Promoções com período e lista de produtos com preços de oferta.
// Sub-tabelas:
//   • encarte-produtos.ts    (array `produtos`)
//   • encarte-historicos.ts  (array `historicos`)
//   • encarte-lojas.ts       (array `lojasIds`)
// ─────────────────────────────────────────────────────────────────────────────

export const encartes = sqliteTable(
  'encartes',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    descricao: text('descricao').notNull(),

    status: text('status', {
      enum: ['PROGRAMADO', 'ATIVO', 'INATIVO', 'EDICAO'],
    }).notNull(),

    periodoInicial: text('periodo_inicial').notNull(),
    periodoFinal:   text('periodo_final').notNull(),

    lojaId: integer('loja_id').notNull(),

    atualizaPreco1: integer('atualiza_preco_1', { mode: 'boolean' }),
    atualizaPreco2: integer('atualiza_preco_2', { mode: 'boolean' }),
    atualizaPreco3: integer('atualiza_preco_3', { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxStatus:        index('idx_encartes_status').on(t.status),
    idxLojaId:        index('idx_encartes_loja_id').on(t.lojaId),
    idxPeriodo:       index('idx_encartes_periodo').on(t.periodoInicial, t.periodoFinal),
  }),
);

export type Encarte    = typeof encartes.$inferSelect;
export type NewEncarte = typeof encartes.$inferInsert;
