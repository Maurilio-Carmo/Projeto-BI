import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { operacoesFiscais } from './operacoes-fiscais';

// ─────────────────────────────────────────────────────────────────────────────
// OPERACOES_CFOPS
// Array `cfops` da operação fiscal — lista de CFOPs vinculados.
// ─────────────────────────────────────────────────────────────────────────────

export const operacoesCfops = sqliteTable(
  'operacoes_cfops',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    operacaoId: integer('operacao_id')
      .notNull()
      .references(() => operacoesFiscais.id, { onDelete: 'cascade' }),

    cfop: integer('cfop').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxOperacao: index('idx_op_fisc_cfop_operacao_id').on(t.operacaoId),
    idxCfop:     index('idx_op_fisc_cfop_cfop').on(t.cfop),
  }),
);

export type OperacaoCfop    = typeof operacoesCfops.$inferSelect;
export type NewOperacaoCfop = typeof operacoesCfops.$inferInsert;
