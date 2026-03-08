// backend/src/database/schema/nota-compra.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Mesmas conversões de nota-venda.ts — estrutura NotaFiscal idêntica.
// ─────────────────────────────────────────────────────────────────────────────
import {
  sqliteTable,
  integer,
  real,
  text,
  index,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Nota Fiscal de COMPRA ───────────────────────────────────────────────────

export const notaCompra = sqliteTable(
  'nota_compra',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    external_id: integer('external_id').notNull().unique(),

    numero_nota:           text('numero_nota').notNull(),
    serie:                 text('serie'),
    chave_nfe:             text('chave_nfe').unique(),

    situacao: text('situacao', {
      enum: [
        'INCONSISTENTE','RECUSADA','PRE_EFETIVADA','EFETIVADA','COM_ERRO',
        'INUTILIZADA','DENEGADA','PRE_CANCELADA','CANCELADA','PRE_ESTORNADA',
        'ESTORNADA','PENDENTE','PENDENTE_ATENDIMENTO','PENDENTE_CONFERENCIA',
        'PENDENTE_RECEPCAO','PENDENTE_INCONFORME','EXCLUIDA','PRE_INUTILIZADA',
        'CANCELADA_EXTEMPORANEO','PENDENTE_ENTREGA',
      ],
    })
      .notNull()
      .default('PENDENTE'),

    tipo_documento_fiscal: text('tipo_documento_fiscal'),
    tipo_de_operacao:      text('tipo_de_operacao', { enum: ['ENTRADA', 'SAIDA'] }),
    modalidade:            text('modalidade'),
    processo_de_emissao:   text('processo_de_emissao'),
    tipo_de_geracao:       text('tipo_de_geracao'),
    classificacao:         text('classificacao', { enum: ['COMPRA', 'VENDA'] }).default('COMPRA'),

    // Datas
    data_emissao:      integer('data_emissao',      { mode: 'timestamp' }).notNull(),
    data_operacao:     integer('data_operacao',     { mode: 'timestamp' }),
    data_exclusao:     integer('data_exclusao',     { mode: 'timestamp' }),
    data_alteracao:    integer('data_alteracao',    { mode: 'timestamp' }),
    data_posto_fiscal: integer('data_posto_fiscal', { mode: 'timestamp' }),

    // Valores financeiros
    valor_do_documento:         real('valor_do_documento').notNull(),
    valor_total_dos_itens:      real('valor_total_dos_itens'),
    valor_do_desconto:          real('valor_do_desconto'),
    valor_de_outras_despesas:   real('valor_de_outras_despesas'),
    valor_do_frete:             real('valor_do_frete'),
    valor_do_seguro:            real('valor_do_seguro'),

    // Tributação na nota
    valor_do_icms:                                   real('valor_do_icms'),
    valor_do_icms_substituicao_tributaria:           real('valor_do_icms_substituicao_tributaria'),
    valor_do_icms_desonerado:                        real('valor_do_icms_desonerado'),
    valor_do_ipi:                                    real('valor_do_ipi'),
    valor_do_pis:                                    real('valor_do_pis'),
    valor_do_cofins:                                 real('valor_do_cofins'),
    valor_do_dae:                                    real('valor_do_dae'),
    valor_fecop:                                     real('valor_fecop'),
    valor_fecop_substituicao_tributaria:             real('valor_fecop_substituicao_tributaria'),

    // Base de cálculo
    base_de_calculo_do_icms:                                      real('base_de_calculo_do_icms'),
    base_de_calculo_do_icms_substituicao_tributaria:              real('base_de_calculo_do_icms_substituicao_tributaria'),
    base_de_calculo_fecop:                                        real('base_de_calculo_fecop'),
    base_de_calculo_fecop_substituicao_tributaria:                real('base_de_calculo_fecop_substituicao_tributaria'),

    // IDs relacionados
    loja_id:                  integer('loja_id'),
    cliente_id:               integer('cliente_id'),
    fornecedor_id:            integer('fornecedor_id'),
    local_id:                 integer('local_id'),
    operacao_id:              integer('operacao_id'),
    cfop_id:                  integer('cfop_id'),
    funcionario_emissor_id:   integer('funcionario_emissor_id'),
    funcionario_comprador_id: integer('funcionario_comprador_id'),

    tipo_de_frete:          text('tipo_de_frete'),
    condicao_de_pagamento:  text('condicao_de_pagamento'),

    atualiza_estoque: integer('atualiza_estoque', { mode: 'boolean' }),
    atualiza_custo:   integer('atualiza_custo',   { mode: 'boolean' }),
    gera_fiscal:      integer('gera_fiscal',      { mode: 'boolean' }),
    compoe_abc:       integer('compoe_abc',       { mode: 'boolean' }),

    observacao: text('observacao'),

    created_at: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    updated_at: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    externalIdIdx:  index('idx_nc_external_id').on(table.external_id),
    dataEmissaoIdx: index('idx_nc_data_emissao').on(table.data_emissao),
    situacaoIdx:    index('idx_nc_situacao').on(table.situacao),
    lojaIdIdx:      index('idx_nc_loja_id').on(table.loja_id),
    chaveNfeIdx:    index('idx_nc_chave_nfe').on(table.chave_nfe),
  }),
);

export type NotaCompra    = typeof notaCompra.$inferSelect;
export type NewNotaCompra = typeof notaCompra.$inferInsert;

// ─── Itens da Nota de COMPRA ─────────────────────────────────────────────────

export const notaCompraItem = sqliteTable(
  'nota_compra_item',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    nota_compra_external_id: integer('nota_compra_external_id').notNull(),
    external_item_id:        integer('external_item_id'),
    sequencial:              integer('sequencial'),

    // Produto
    produto_id:             integer('produto_id'),
    ncm:                    text('ncm'),
    cest:                   text('cest'),
    cfop_id:                integer('cfop_id'),
    unidade_de_medida:      text('unidade_de_medida'),
    numero_pedido:          text('numero_pedido'),
    sequencial_item_pedido: text('sequencial_item_pedido'),

    // Quantidades
    quantidade:                     real('quantidade'),
    quantidade_de_itens_na_unidade: real('quantidade_de_itens_na_unidade'),
    quantidade_completa:            real('quantidade_completa'),

    // Valores
    valor_da_embalagem:    real('valor_da_embalagem'),
    valor_total_do_item:   real('valor_total_do_item'),
    valor_do_frete:        real('valor_do_frete'),
    valor_do_seguro:       real('valor_do_seguro'),
    valor_outras_despesas: real('valor_outras_despesas'),

    // Desconto
    percentual_do_desconto:          real('percentual_do_desconto'),
    valor_do_desconto_tributado:     real('valor_do_desconto_tributado'),
    valor_do_desconto_nao_tributado: real('valor_do_desconto_nao_tributado'),

    // ICMS
    tributacao:                              text('tributacao'),
    csosn:                                   text('csosn'),
    aliquota_do_icms:                        real('aliquota_do_icms'),
    aliquota_no_simples:                     real('aliquota_no_simples'),
    aliquota_estadual:                       real('aliquota_estadual'),
    aliquota_nacional:                       real('aliquota_nacional'),
    aliquota_importado:                      real('aliquota_importado'),
    aliquota_do_icms_de_venda:               real('aliquota_do_icms_de_venda'),
    base_de_calculo_do_icms:                 real('base_de_calculo_do_icms'),
    valor_do_icms:                           real('valor_do_icms'),
    valor_do_icms_no_simples:                real('valor_do_icms_no_simples'),
    valor_do_icms_desonerado:                real('valor_do_icms_desonerado'),

    // ICMS ST
    aliquota_do_icms_substituicao_tributaria:              real('aliquota_do_icms_substituicao_tributaria'),
    base_de_calculo_do_icms_substituicao_tributaria:       real('base_de_calculo_do_icms_substituicao_tributaria'),
    valor_do_icms_substituicao_tributaria:                 real('valor_do_icms_substituicao_tributaria'),
    percentual_de_reducao_do_icms_substituicao_tributaria: real('percentual_de_reducao_do_icms_substituicao_tributaria'),
    percentual_de_margem_de_valor_agregado:                real('percentual_de_margem_de_valor_agregado'),

    // FECOP
    aliquota_fecop:       real('aliquota_fecop'),
    base_de_calculo_fecop: real('base_de_calculo_fecop'),
    valor_fecop:          real('valor_fecop'),
    base_de_calculo_fecop_st: real('base_de_calculo_fecop_st'),
    valor_fecop_st:       real('valor_fecop_st'),

    // IPI
    cst_do_ipi_id:        integer('cst_do_ipi_id'),
    aliquota_do_ipi:      real('aliquota_do_ipi'),
    base_de_calculo_ipi:  real('base_de_calculo_ipi'),
    valor_do_ipi:         real('valor_do_ipi'),

    // PIS
    cst_do_pis_id:          integer('cst_do_pis_id'),
    aliquota_do_pis:        real('aliquota_do_pis'),
    base_de_calculo_do_pis: real('base_de_calculo_do_pis'),
    valor_do_pis:           real('valor_do_pis'),

    // COFINS
    cst_do_cofins_id:          integer('cst_do_cofins_id'),
    aliquota_do_cofins:        real('aliquota_do_cofins'),
    base_de_calculo_do_cofins: real('base_de_calculo_do_cofins'),
    valor_do_cofins:           real('valor_do_cofins'),

    // DAE
    percentual_do_dae:   real('percentual_do_dae'),
    tipo_de_entrada_dae: text('tipo_de_entrada_dae'),
    valor_do_dae:        real('valor_do_dae'),

    // Custo
    custo_fiscal:               real('custo_fiscal'),
    custo_medio:                real('custo_medio'),
    custo_reposicao:            real('custo_reposicao'),
    percentual_icms_de_compra:  real('percentual_icms_de_compra'),

    // Extras
    modalidade_da_base_de_calculo:      text('modalidade_da_base_de_calculo'),
    situacao_fiscal_id:                 integer('situacao_fiscal_id'),
    codigo_natureza_de_imposto_federal: integer('codigo_natureza_de_imposto_federal'),
    compoe_total_da_nota:               integer('compoe_total_da_nota', { mode: 'boolean' }),
    data_validade:                      integer('data_validade', { mode: 'timestamp' }),

    created_at: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    updated_at: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    notaCompraIdx: index('idx_nci_nota_compra_external_id').on(table.nota_compra_external_id),
    produtoIdx:    index('idx_nci_produto_id').on(table.produto_id),
  }),
);

export type NotaCompraItem    = typeof notaCompraItem.$inferSelect;
export type NewNotaCompraItem = typeof notaCompraItem.$inferInsert;
