import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// NOTAS_COMPRA — /v1/compra/notas-fiscais
// NF-e / CT-e de entrada (classificacao = COMPRA).
// Itens em `nota-fiscal-compra-itens.ts`.
// ─────────────────────────────────────────────────────────────────────────────

const SITUACAO_ENUM = [
  'INCONSISTENTE', 'RECUSADA', 'PRE_EFETIVADA', 'EFETIVADA', 'COM_ERRO',
  'INUTILIZADA', 'DENEGADA', 'PRE_CANCELADA', 'CANCELADA', 'PRE_ESTORNADA',
  'ESTORNADA', 'PENDENTE', 'PENDENTE_ATENDIMENTO', 'PENDENTE_CONFERENCIA',
  'PENDENTE_RECEPCAO', 'PENDENTE_INCONFORME', 'EXCLUIDA', 'PRE_INUTILIZADA',
  'CANCELADA_EXTEMPORANEO', 'PENDENTE_ENTREGA',
] as const;

const TIPO_DOC_FISCAL_ENUM = [
  'NF', 'NFVC', 'CUPOM_FISCAL', 'CUPOM_FISCAL_BILHETE_PASSAGEM', 'NFP',
  'NFEnergia', 'NFST', 'CTRC', 'CTRCA', 'CTRA', 'CTA', 'CTRFC', 'BPR',
  'BPA', 'BPNB', 'BPF', 'DT', 'RMD', 'NFCOM', 'NFTEL', 'CTMC', 'NFSTFC',
  'NFFG', 'NFFA', 'NFA', 'NFE', 'CTE', 'MDFE', 'CFE', 'CF', 'NFCE', 'O',
] as const;

export const notasCompra = sqliteTable(
  'notas_compra',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    // ── Partes envolvidas ─────────────────────────────────────────────────────
    lojaId:                 integer('loja_id').notNull(),
    fornecedorId:           integer('fornecedor_id').notNull(),
    clienteId:              integer('cliente_id').notNull(),
    operacaoId:             integer('operacao_id').notNull(),
    cfopId:                 integer('cfop_id').notNull(),
    localId:                integer('local_id'),
    funcionarioEmissorId:   integer('funcionario_emissor_id'),
    funcionarioCompradorId: integer('funcionario_comprador_id'),

    // ── Identificação da nota ─────────────────────────────────────────────────
    numeroNota:  text('numero_nota').notNull(),
    serie:       text('serie'),
    chaveDaNfe:  text('chave_da_nfe'),

    // ── Datas ────────────────────────────────────────────────────────────────
    dataEmissao:     text('data_emissao').notNull(),
    dataOperacao:    text('data_operacao'),
    dataAlteracao:   text('data_alteracao'),
    dataExclusao:    text('data_exclusao'),
    dataPostoFiscal: text('data_posto_fiscal'),

    // ── Situação / tipo ───────────────────────────────────────────────────────
    situacao: text('situacao', { enum: SITUACAO_ENUM }).notNull(),

    tipoDeOperacao: text('tipo_de_operacao', {
      enum: ['ENTRADA', 'SAIDA'],
    }).notNull(),

    tipoDeDocumentoFiscal: text('tipo_de_documento_fiscal', {
      enum: TIPO_DOC_FISCAL_ENUM,
    }).notNull(),

    modalidade: text('modalidade', {
      enum: ['SIMPLIFICADA', 'ESTORNO', 'DEVOLUCAO', 'TRANSFERENCIA', 'NORMAL', 'COMPLEMENTAR', 'CUPOM'],
    }),

    classificacao: text('classificacao', {
      enum: ['COMPRA', 'VENDA'],
    }).default('COMPRA'),

    tipoDeGeracao: text('tipo_de_geracao', {
      enum: ['IMPORTADA', 'IMPORTADA_AUTOMATICAMENTE', 'MANUAL', 'IMPORTADA_PDV', 'IMPORTADA_AUTOMATICAMENTE_PDV'],
    }),

    processoDeEmissao: text('processo_de_emissao', {
      enum: ['APLICATIVO_CONTRIBUINTE', 'AVULSA_FISCO', 'AVULSA_CERTIFICADO_SITE_FISCO', 'APLICATIVO_FISCO'],
    }),

    condicaoDePagamento: text('condicao_de_pagamento', {
      enum: ['A_VISTA', 'A_PRAZO', 'OUTROS', 'NAO_INFORMADO'],
    }).notNull(),

    tipoDeFrete: text('tipo_de_frete', {
      enum: ['EMITENTE', 'DESTINATARIO', 'TERCEIRO', 'EMITENTE_PROPRIO', 'DESTINATARIO_PROPRIO', 'SEM_FRETE'],
    }),

    // ── Valores totais ────────────────────────────────────────────────────────
    valorDoDocumento:    real('valor_do_documento').notNull(),
    valorTotalDosItens:  real('valor_total_dos_itens').notNull(),
    valorDoDesconto:     real('valor_do_desconto'),
    valorDeOutrasDespesas: real('valor_de_outras_despesas'),
    valorDoFrete:        real('valor_do_frete'),
    valorDoSeguro:       real('valor_do_seguro'),
    valorDoDAE:          real('valor_do_dae'),
    observacao:          text('observacao'),

    // ── Impostos totais ───────────────────────────────────────────────────────
    valorDoICMS:                               real('valor_do_icms'),
    valorDoICMSSubstituicaoTributaria:         real('valor_do_icms_substituicao_tributaria'),
    valorDoICMSDesonerado:                     real('valor_do_icms_desonerado'),
    valorDoIPI:                                real('valor_do_ipi'),
    valorDoPIS:                                real('valor_do_pis'),
    valorDoCOFINS:                             real('valor_do_cofins'),
    valorFecop:                                real('valor_fecop'),
    valorFecopSubstituicaoTributaria:          real('valor_fecop_substituicao_tributaria'),
    baseDeCalculoDoICMS:                       real('base_de_calculo_do_icms'),
    baseDeCalculoDoICMSSubstituicaoTributaria: real('base_de_calculo_do_icms_substituicao_tributaria'),
    baseDeCalculoFecop:                        real('base_de_calculo_fecop'),
    baseDeCalculoFecopSubstituicaoTributaria:  real('base_de_calculo_fecop_substituicao_tributaria'),

    // ── Flags ─────────────────────────────────────────────────────────────────
    geraFiscal:      integer('gera_fiscal',      { mode: 'boolean' }),
    atualizaEstoque: integer('atualiza_estoque', { mode: 'boolean' }),
    atualizaCusto:   integer('atualiza_custo',   { mode: 'boolean' }),
    compoeABC:       integer('compoe_abc',        { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId:  index('idx_nf_compra_external_id').on(t.externalId),
    idxChaveNfe:    index('idx_nf_compra_chave_nfe').on(t.chaveDaNfe),
    idxDataEmissao: index('idx_nf_compra_data_emissao').on(t.dataEmissao),
    idxSituacao:    index('idx_nf_compra_situacao').on(t.situacao),
    idxLojaId:      index('idx_nf_compra_loja_id').on(t.lojaId),
    idxFornecedor:  index('idx_nf_compra_fornecedor_id').on(t.fornecedorId),
    idxOperacao:    index('idx_nf_compra_operacao_id').on(t.operacaoId),
  }),
);

export type NotaCompra    = typeof notasCompra.$inferSelect;
export type NewNotaCompra = typeof notasCompra.$inferInsert;
