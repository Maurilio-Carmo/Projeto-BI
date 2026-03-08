import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { notasVenda } from './notas-venda';

// ─────────────────────────────────────────────────────────────────────────────
// NOTA_VENDA_ITENS
// Array `itens` — linhas de produto da Nota Fiscal de Venda.
// ─────────────────────────────────────────────────────────────────────────────

const CSOSN_ENUM = [
  'TRIBUTACAO_COM_PERMISSAO_DE_CREDITO_101', 'TRIBUTACAO_SEM_PERMISSAO_DE_CREDITO_102',
  'ISENCAO_DO_ICSM_PARA_FAIXA_DE_RECEITA_BRUTA', 'TRIBUTACAO_COM_PERMISSAO_DE_CREDITO_201',
  'TRIBUTACAO_SEM_PERMISSAO_DE_CREDITO_202', 'ISENCAO_DO_ICMS', 'IMUNE',
  'NAO_TRIBUTADO', 'ICMS_COBRADO_ANTERIORMENTE_POR_SUBSTITUICAO_TRIBUTARIA', 'OUTROS',
] as const;

const MOTIVO_DESONERACAO_ENUM = [
  'TAXI', 'DEFICIENTE_FISICO', 'PRODUTOR_AGROPECUARI', 'FROTISTA_OU_LOCADORA',
  'DIPLOMATICO_CONSULAR', 'UTILITARIOS', 'SUFRAMA', 'VENDA_ORGAO_PUBLICO',
  'OUTROS', 'DEFICIENTE_CONDUTOR', 'DEFICIENTE_NAO_COND', 'FOMENTO_AGRO_PECU',
] as const;

const TIPO_ENTRADA_ENUM = ['VALOR', 'PERCENTUAL'] as const;

export const notasVendaItens = sqliteTable(
  'notas_venda_itens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    notaFiscalVendaId: integer('nota_venda_id')
      .notNull()
      .references(() => notasVenda.id, { onDelete: 'cascade' }),

    sequencial:  integer('sequencial'),

    produtoId:        integer('produto_id').notNull(),
    situacaoFiscalId: integer('situacao_fiscal_id').notNull(),
    cfopId:           integer('cfop_id').notNull(),
    cstDoPISId:       integer('cst_do_pis_id'),
    cstDoCOFINSId:    integer('cst_do_cofins_id'),
    cstDoIPI:         integer('cst_do_ipi'),
    codigoNaturezaDeImpostoFederal: integer('codigo_natureza_de_imposto_federal'),

    // ── Identificação do item ─────────────────────────────────────────────────
    ncm:              text('ncm'),
    cest:             text('cest'),
    tributacao:       text('tributacao'),
    csosn:            text('csosn', { enum: CSOSN_ENUM }),
    unidadeDeMedida:  text('unidade_de_medida').notNull(),
    numeroPedido:     text('numero_pedido'),
    sequencialItemPedido: text('sequencial_item_pedido'),
    codigoBeneficioFiscal: text('codigo_beneficio_fiscal'),
    motivoDesoneracao: text('motivo_desoneracao', { enum: MOTIVO_DESONERACAO_ENUM }),
    modalidadeDaBaseDeCalculo: text('modalidade_da_base_de_calculo'),

    // ── Quantidades ───────────────────────────────────────────────────────────
    quantidade:                 real('quantidade').notNull(),
    quantidadeDeItensNaUnidade: real('quantidade_de_itens_na_unidade').notNull(),
    quantidadeCompleta:         real('quantidade_completa'),

    // ── Valores do item ───────────────────────────────────────────────────────
    valorDaEmbalagem:            real('valor_da_embalagem').notNull(),
    valorTotalDoItem:            real('valor_total_do_item'),
    valorDoDesconto:             real('valor_do_desconto'),
    valorDoDescontoTributado:    real('valor_do_desconto_tributado'),
    valorDoDescontoNaoTributado: real('valor_do_desconto_nao_tributado'),
    valorDoFrete:                real('valor_do_frete'),
    valorDoSeguro:               real('valor_do_seguro'),
    valorDoDAE:                  real('valor_do_dae'),
    valorOutrasDespesas:         real('valor_outras_despesas'),

    // ── Custos ────────────────────────────────────────────────────────────────
    custoReposicao: real('custo_reposicao'),
    custoMedio:     real('custo_medio'),
    custoFiscal:    real('custo_fiscal'),

    // ── Percentuais de rateio ─────────────────────────────────────────────────
    percentualDoDesconto:    real('percentual_do_desconto'),
    percentualDoFrete:       real('percentual_do_frete'),
    percentualDoSeguro:      real('percentual_do_seguro'),
    percentualDoDAE:         real('percentual_do_dae'),
    percentualOutrasDespesas: real('percentual_outras_despesas'),
    percentualTributado:     real('percentual_tributado'),
    percentualDiferimento:   real('percentual_diferimento'),
    percentualICMSDeCompra:  real('percentual_icms_de_compra'),
    percentualDeAgregacao:   real('percentual_de_agregacao'),
    percentualDeReducaoDASubstituicaoTributaria: real('percentual_de_reducao_da_substituicao_tributaria'),
    percentualDoIPI:         real('percentual_do_ipi'),

    // ── Tipos de entrada ──────────────────────────────────────────────────────
    tipoDeEntradaIPI:           text('tipo_de_entrada_ipi',           { enum: TIPO_ENTRADA_ENUM }),
    tipoDeEntradaFrete:         text('tipo_de_entrada_frete',         { enum: TIPO_ENTRADA_ENUM }),
    tipoDeEntradaDesconto:      text('tipo_de_entrada_desconto',      { enum: TIPO_ENTRADA_ENUM }),
    tipoDeEntradaSeguro:        text('tipo_de_entrada_seguro',        { enum: TIPO_ENTRADA_ENUM }),
    tipoDeEntradaDAE:           text('tipo_de_entrada_dae',           { enum: TIPO_ENTRADA_ENUM }),
    tipoDeEntradaOutrasDespesas: text('tipo_de_entrada_outras_despesas', { enum: TIPO_ENTRADA_ENUM }),

    // ── ICMS ──────────────────────────────────────────────────────────────────
    aliquotaDoICMS:                          real('aliquota_do_icms'),
    aliquotaNoSimples:                       real('aliquota_no_simples'),
    aliquotaDoICMSAntecipado:                real('aliquota_do_icms_antecipado'),
    aliquotaDoICMSComSubstituicaoTributaria: real('aliquota_do_icms_com_substituicao_tributaria'),
    aliquotaDoICMSDeVenda:                   real('aliquota_do_icms_de_venda'),
    aliquotaEstadual:                        real('aliquota_estadual'),
    aliquotaNacional:                        real('aliquota_nacional'),
    aliquotaImportado:                       real('aliquota_importado'),
    baseDeCalculoDoICMS:                     real('base_de_calculo_do_icms'),
    baseDeCalculoDoICMSComSubstituicaoTributaria: real('base_de_calculo_do_icms_com_substituicao_tributaria'),
    valorDoICMS:                             real('valor_do_icms'),
    valorDoICMSNoSimples:                    real('valor_do_icms_no_simples'),
    valorDoICMSAntecipado:                   real('valor_do_icms_antecipado'),
    valorDoICMSComSubstituicaoTributaria:    real('valor_do_icms_com_substituicao_tributaria'),
    valorDoICMSDesonerado:                   real('valor_do_icms_desonerado'),
    valorICMSDiferimento:                    real('valor_icms_diferimento'),

    // ── FECOP ─────────────────────────────────────────────────────────────────
    aliquotaDoFecop:                real('aliquota_do_fecop'),
    aliquotaDoFecopSubstituto:      real('aliquota_do_fecop_substituto'),
    baseDeCalculoDoFecop:           real('base_de_calculo_do_fecop'),
    baseDeCalculoDoFecopSubstituto: real('base_de_calculo_do_fecop_substituto'),
    valorDoFecop:                   real('valor_do_fecop'),
    valorDoFecopSubstituto:         real('valor_do_fecop_substituto'),

    // ── IPI ───────────────────────────────────────────────────────────────────
    aliquotaDoIPI:      real('aliquota_do_ipi'),
    baseDeCalculoDoIPI: real('base_de_calculo_do_ipi'),
    valorDoIPI:         real('valor_do_ipi'),

    // ── PIS ───────────────────────────────────────────────────────────────────
    aliquotaDoPIS:      real('aliquota_do_pis'),
    baseDeCalculoDoPIS: real('base_de_calculo_do_pis'),
    valorDoPIS:         real('valor_do_pis'),

    // ── COFINS ────────────────────────────────────────────────────────────────
    aliquotaDoCOFINS:      real('aliquota_do_cofins'),
    baseDeCalculoDoCOFINS: real('base_de_calculo_do_cofins'),
    valorDoCOFINS:         real('valor_do_cofins'),

    // ── Flags ────────────────────────────────────────────────────────────────
    compoeTotalDaNota: integer('compoe_total_da_nota', { mode: 'boolean' }).notNull(),

    dataValidade: text('data_validade'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxNotaFiscal: index('idx_nf_venda_it_nota_id').on(t.notaFiscalVendaId),
    idxProduto:    index('idx_nf_venda_it_produto_id').on(t.produtoId),
    idxNcm:        index('idx_nf_venda_it_ncm').on(t.ncm),
  }),
);

export type NotaVendaItem    = typeof notasVendaItens.$inferSelect;
export type NewNotaVendaItem = typeof notasVendaItens.$inferInsert;
