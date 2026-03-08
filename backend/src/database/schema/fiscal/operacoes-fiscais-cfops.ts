import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { operacoesFiscais } from '../operacoes-fiscais';

// ─────────────────────────────────────────────────────────────────────────────
// OPERACOES_FISCAIS_CFOPS
// Array `cfops` da operação fiscal — lista de CFOPs vinculados.
// ─────────────────────────────────────────────────────────────────────────────

export const operacoesFiscaisCfops = sqliteTable(
  'operacoes_fiscais_cfops',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    operacaoFiscalId: integer('operacao_fiscal_id')
      .notNull()
      .references(() => operacoesFiscais.id, { onDelete: 'cascade' }),

    cfop: integer('cfop').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxOperacao: index('idx_op_fisc_cfop_operacao_id').on(t.operacaoFiscalId),
    idxCfop:     index('idx_op_fisc_cfop_cfop').on(t.cfop),
  }),
);

export type OperacaoFiscalCfop    = typeof operacoesFiscaisCfops.$inferSelect;
export type NewOperacaoFiscalCfop = typeof operacoesFiscaisCfops.$inferInsert;
