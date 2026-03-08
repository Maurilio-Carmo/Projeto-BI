import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// OPERACOES_FISCAIS — /v1/fiscal/operacoes
// Tipos de operação fiscal. CFOPs vinculados em `operacoes-fiscais-cfops.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const operacoesFiscais = sqliteTable(
  'operacoes_fiscais',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    descricao:  text('descricao'),
    observacao: text('observacao'),

    // ── CFOPs principais ─────────────────────────────────────────────────────
    cfopNoEstado:     integer('cfop_no_estado'),
    cfopForaDoEstado: integer('cfop_fora_do_estado'),
    cfopExterior:     integer('cfop_exterior'),

    codigoDoCst: text('codigo_do_cst'),

    // ── Tipos / modalidade ───────────────────────────────────────────────────
    tipoDeOperacao:            text('tipo_de_operacao'),
    tipoDocumentoNaOperacao:   text('tipo_documento_na_operacao'),
    origemDaNota:              text('origem_da_nota'),
    modalidade:                text('modalidade'),
    tipoDeGeracaoDeFinanceiro: text('tipo_de_geracao_de_financeiro'),

    // ── Flags ────────────────────────────────────────────────────────────────
    geraFiscal:                    integer('gera_fiscal',                     { mode: 'boolean' }),
    atualizaEstoque:               integer('atualiza_estoque',                { mode: 'boolean' }),
    atualizaCustos:                integer('atualiza_custos',                 { mode: 'boolean' }),
    destaca_icms:                  integer('destaca_icms',                    { mode: 'boolean' }),
    destaca_ipi:                   integer('destaca_ipi_na_venda',            { mode: 'boolean' }),
    incideImpostosFederais:        integer('incide_impostos_federais',        { mode: 'boolean' }),
    ipiCompoeBasePisCofins:        integer('ipi_compoe_base_pis_cofins',      { mode: 'boolean' }),
    outrasDespesasBasePisCofins:   integer('outras_despesas_base_pis_cofins', { mode: 'boolean' }),
    outrasDespesasBaseIcms:        integer('outras_despesas_base_icms',       { mode: 'boolean' }),
    imprimeDescricaoEmNfe:         integer('imprime_descricao_em_nfe',        { mode: 'boolean' }),
    enviaObservacaoNaNf:           integer('envia_observacao_na_nf',          { mode: 'boolean' }),
    utilizaConferencia:            integer('utiliza_conferencia',             { mode: 'boolean' }),
    compoeAbc:                     integer('compoe_abc',                      { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxTipo:       index('idx_op_fisc_tipo').on(t.tipoDeOperacao),
  }),
);

export type OperacaoFiscal    = typeof operacoesFiscais.$inferSelect;
export type NewOperacaoFiscal = typeof operacoesFiscais.$inferInsert;
