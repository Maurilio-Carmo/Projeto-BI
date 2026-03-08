import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { recebimentosPdv } from './recebimentos-pdv';

// ─────────────────────────────────────────────────────────────────────────────
// RECEBIMENTOS_PDV_LOJAS
// Array `lojas` — configurações de recebimento por loja.
// ─────────────────────────────────────────────────────────────────────────────

export const recebimentosPdvLojas = sqliteTable(
  'recebimentos_pdv_lojas',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    recebimentoPdvId: integer('recebimento_pdv_id')
      .notNull()
      .references(() => recebimentosPdv.id, { onDelete: 'cascade' }),

    lojaId: integer('loja_id').notNull(),

    tipoRecebimento: text('tipo_recebimento', {
      enum: ['PROPRIO', 'TERCEIRO', 'TAXA'],
    }),

    qtdAutenticacoes: integer('qtd_autenticacoes'),
    imprimeDoc:       integer('imprime_doc', { mode: 'boolean' }),
    qtdImpressoes:    integer('qtd_impressoes'),
    valorRecebimento: real('valor_recebimento'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxRecebimento: index('idx_rec_pdv_lj_recebimento_id').on(t.recebimentoPdvId),
    idxLoja:        index('idx_rec_pdv_lj_loja_id').on(t.lojaId),
    uniqRecLoja:    unique('uq_rec_pdv_lj').on(t.recebimentoPdvId, t.lojaId),
  }),
);

export type RecebimentoPdvLoja    = typeof recebimentosPdvLojas.$inferSelect;
export type NewRecebimentoPdvLoja = typeof recebimentosPdvLojas.$inferInsert;
