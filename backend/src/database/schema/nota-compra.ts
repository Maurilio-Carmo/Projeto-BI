// backend/src/database/schema/nota-compra.ts
import {
  mysqlTable,
  int,
  bigint,
  varchar,
  decimal,
  date,
  boolean,
  timestamp,
  mysqlEnum,
  index,
  text,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * Tabela de Notas Fiscais de COMPRA
 * Campos mapeados diretamente da API: GET /v1/compra/notas-fiscais
 * A estrutura NotaFiscal é idêntica entre compra e venda,
 * mas separamos em tabelas distintas para clareza e performance.
 */
export const notaCompra = mysqlTable(
  'nota_compra',
  {
    id: int('id').autoincrement().primaryKey(),

    // ID original na API externa
    external_id: bigint('external_id', { mode: 'number' }).notNull().unique(),

    // Identificação do documento
    numero_nota: varchar('numero_nota', { length: 20 }).notNull(),
    serie: varchar('serie', { length: 10 }),
    chave_nfe: varchar('chave_nfe', { length: 44 }).unique(),

    // Situação
    situacao: mysqlEnum('situacao', [
      'INCONSISTENTE', 'RECUSADA', 'PRE_EFETIVADA', 'EFETIVADA', 'COM_ERRO',
      'INUTILIZADA', 'DENEGADA', 'PRE_CANCELADA', 'CANCELADA', 'PRE_ESTORNADA',
      'ESTORNADA', 'PENDENTE', 'PENDENTE_ATENDIMENTO', 'PENDENTE_CONFERENCIA',
      'PENDENTE_RECEPCAO', 'PENDENTE_INCONFORME', 'EXCLUIDA', 'PRE_INUTILIZADA',
      'CANCELADA_EXTEMPORANEO', 'PENDENTE_ENTREGA',
    ]).notNull().default('PENDENTE'),

    tipo_documento_fiscal: varchar('tipo_documento_fiscal', { length: 20 }),
    tipo_de_operacao: mysqlEnum('tipo_de_operacao', ['ENTRADA', 'SAIDA']),
    modalidade: varchar('modalidade', { length: 30 }),
    processo_de_emissao: varchar('processo_de_emissao', { length: 60 }),
    tipo_de_geracao: varchar('tipo_de_geracao', { length: 60 }),
    classificacao: mysqlEnum('classificacao', ['COMPRA', 'VENDA']).default('COMPRA'),

    // Datas
    data_emissao: date('data_emissao').notNull(),
    data_operacao: date('data_operacao'),
    data_exclusao: date('data_exclusao'),
    data_alteracao: date('data_alteracao'),
    data_posto_fiscal: date('data_posto_fiscal'),

    // Valores financeiros
    valor_do_documento: decimal('valor_do_documento', { precision: 15, scale: 4 }).notNull(),
    valor_total_dos_itens: decimal('valor_total_dos_itens', { precision: 15, scale: 4 }),
    valor_do_desconto: decimal('valor_do_desconto', { precision: 15, scale: 4 }),
    valor_de_outras_despesas: decimal('valor_de_outras_despesas', { precision: 15, scale: 4 }),
    valor_do_frete: decimal('valor_do_frete', { precision: 15, scale: 4 }),
    valor_do_seguro: decimal('valor_do_seguro', { precision: 15, scale: 4 }),

    // Tributação
    valor_do_icms: decimal('valor_do_icms', { precision: 15, scale: 4 }),
    valor_do_icms_substituicao_tributaria: decimal('valor_do_icms_substituicao_tributaria', { precision: 15, scale: 4 }),
    valor_do_icms_desonerado: decimal('valor_do_icms_desonerado', { precision: 15, scale: 4 }),
    valor_do_ipi: decimal('valor_do_ipi', { precision: 15, scale: 4 }),
    valor_do_pis: decimal('valor_do_pis', { precision: 15, scale: 4 }),
    valor_do_cofins: decimal('valor_do_cofins', { precision: 15, scale: 4 }),
    valor_do_dae: decimal('valor_do_dae', { precision: 15, scale: 4 }),
    valor_fecop: decimal('valor_fecop', { precision: 15, scale: 4 }),
    valor_fecop_substituicao_tributaria: decimal('valor_fecop_substituicao_tributaria', { precision: 15, scale: 4 }),

    // Base de cálculo
    base_de_calculo_do_icms: decimal('base_de_calculo_do_icms', { precision: 15, scale: 4 }),
    base_de_calculo_do_icms_substituicao_tributaria: decimal('base_de_calculo_do_icms_substituicao_tributaria', { precision: 15, scale: 4 }),
    base_de_calculo_fecop: decimal('base_de_calculo_fecop', { precision: 15, scale: 4 }),
    base_de_calculo_fecop_substituicao_tributaria: decimal('base_de_calculo_fecop_substituicao_tributaria', { precision: 15, scale: 4 }),

    // IDs relacionados
    loja_id: bigint('loja_id', { mode: 'number' }),
    cliente_id: bigint('cliente_id', { mode: 'number' }),
    fornecedor_id: bigint('fornecedor_id', { mode: 'number' }),
    local_id: bigint('local_id', { mode: 'number' }),
    operacao_id: bigint('operacao_id', { mode: 'number' }),
    cfop_id: bigint('cfop_id', { mode: 'number' }),
    funcionario_emissor_id: bigint('funcionario_emissor_id', { mode: 'number' }),
    funcionario_comprador_id: bigint('funcionario_comprador_id', { mode: 'number' }),

    tipo_de_frete: varchar('tipo_de_frete', { length: 30 }),
    condicao_de_pagamento: varchar('condicao_de_pagamento', { length: 20 }),

    atualiza_estoque: boolean('atualiza_estoque'),
    atualiza_custo: boolean('atualiza_custo'),
    gera_fiscal: boolean('gera_fiscal'),
    compoe_abc: boolean('compoe_abc'),

    observacao: text('observacao'),

    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    externalIdIdx: index('idx_nc_external_id').on(table.external_id),
    dataEmissaoIdx: index('idx_nc_data_emissao').on(table.data_emissao),
    situacaoIdx: index('idx_nc_situacao').on(table.situacao),
    lojaIdIdx: index('idx_nc_loja_id').on(table.loja_id),
    chaveNfeIdx: index('idx_nc_chave_nfe').on(table.chave_nfe),
  }),
);

export type NotaCompra = typeof notaCompra.$inferSelect;
export type NewNotaCompra = typeof notaCompra.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tabela de Itens das Notas Fiscais de COMPRA
 * Campos mapeados de ItemNotaFiscal na API: /v1/compra/notas-fiscais
 */
export const notaCompraItem = mysqlTable(
  'nota_compra_item',
  {
    id: int('id').autoincrement().primaryKey(),

    nota_compra_external_id: bigint('nota_compra_external_id', { mode: 'number' }).notNull(),
    external_item_id: bigint('external_item_id', { mode: 'number' }),
    sequencial: bigint('sequencial', { mode: 'number' }),

    // Produto
    produto_id: bigint('produto_id', { mode: 'number' }),
    ncm: varchar('ncm', { length: 8 }),
    cest: varchar('cest', { length: 8 }),
    cfop_id: bigint('cfop_id', { mode: 'number' }),
    unidade_de_medida: varchar('unidade_de_medida', { length: 3 }),
    numero_pedido: varchar('numero_pedido', { length: 50 }),
    sequencial_item_pedido: varchar('sequencial_item_pedido', { length: 20 }),

    // Quantidades
    quantidade: decimal('quantidade', { precision: 15, scale: 4 }),
    quantidade_de_itens_na_unidade: decimal('quantidade_de_itens_na_unidade', { precision: 15, scale: 4 }),
    quantidade_completa: decimal('quantidade_completa', { precision: 15, scale: 4 }),

    // Valores
    valor_da_embalagem: decimal('valor_da_embalagem', { precision: 15, scale: 4 }),
    valor_total_do_item: decimal('valor_total_do_item', { precision: 15, scale: 4 }),
    valor_do_frete: decimal('valor_do_frete', { precision: 15, scale: 4 }),
    valor_do_seguro: decimal('valor_do_seguro', { precision: 15, scale: 4 }),
    valor_outras_despesas: decimal('valor_outras_despesas', { precision: 15, scale: 4 }),

    // Desconto
    percentual_do_desconto: decimal('percentual_do_desconto', { precision: 10, scale: 4 }),
    valor_do_desconto_tributado: decimal('valor_do_desconto_tributado', { precision: 15, scale: 4 }),
    valor_do_desconto_nao_tributado: decimal('valor_do_desconto_nao_tributado', { precision: 15, scale: 4 }),

    // ICMS
    tributacao: varchar('tributacao', { length: 3 }),
    csosn: varchar('csosn', { length: 80 }),
    aliquota_do_icms: decimal('aliquota_do_icms', { precision: 10, scale: 4 }),
    aliquota_no_simples: decimal('aliquota_no_simples', { precision: 10, scale: 4 }),
    aliquota_estadual: decimal('aliquota_estadual', { precision: 10, scale: 4 }),
    aliquota_nacional: decimal('aliquota_nacional', { precision: 10, scale: 4 }),
    aliquota_importado: decimal('aliquota_importado', { precision: 10, scale: 4 }),
    aliquota_do_icms_de_venda: decimal('aliquota_do_icms_de_venda', { precision: 10, scale: 4 }),
    base_de_calculo_do_icms: decimal('base_de_calculo_do_icms', { precision: 15, scale: 4 }),
    valor_do_icms: decimal('valor_do_icms', { precision: 15, scale: 4 }),
    valor_do_icms_no_simples: decimal('valor_do_icms_no_simples', { precision: 15, scale: 4 }),
    valor_do_icms_desonerado: decimal('valor_do_icms_desonerado', { precision: 15, scale: 4 }),
    valor_icms_diferimento: decimal('valor_icms_diferimento', { precision: 15, scale: 4 }),
    percentual_diferimento: decimal('percentual_diferimento', { precision: 10, scale: 4 }),
    motivo_desoneracao: varchar('motivo_desoneracao', { length: 50 }),
    codigo_beneficio_fiscal: varchar('codigo_beneficio_fiscal', { length: 20 }),

    // ICMS ST
    aliquota_do_icms_com_substituicao_tributaria: decimal('aliquota_do_icms_com_substituicao_tributaria', { precision: 10, scale: 4 }),
    aliquota_do_icms_antecipado: decimal('aliquota_do_icms_antecipado', { precision: 10, scale: 4 }),
    percentual_de_agregacao: decimal('percentual_de_agregacao', { precision: 10, scale: 4 }),
    percentual_reducao_da_substituicao_tributaria: decimal('percentual_reducao_da_substituicao_tributaria', { precision: 10, scale: 4 }),
    base_de_calculo_do_icms_com_substituicao_tributaria: decimal('base_de_calculo_do_icms_com_substituicao_tributaria', { precision: 15, scale: 4 }),
    valor_do_icms_com_substituicao_tributaria: decimal('valor_do_icms_com_substituicao_tributaria', { precision: 15, scale: 4 }),
    valor_do_icms_antecipado: decimal('valor_do_icms_antecipado', { precision: 15, scale: 4 }),
    percentual_tributado: decimal('percentual_tributado', { precision: 10, scale: 4 }),

    // FECOP
    aliquota_do_fecop: decimal('aliquota_do_fecop', { precision: 10, scale: 4 }),
    aliquota_do_fecop_substituto: decimal('aliquota_do_fecop_substituto', { precision: 10, scale: 4 }),
    base_de_calculo_do_fecop: decimal('base_de_calculo_do_fecop', { precision: 15, scale: 4 }),
    base_de_calculo_do_fecop_substituto: decimal('base_de_calculo_do_fecop_substituto', { precision: 15, scale: 4 }),
    valor_do_fecop: decimal('valor_do_fecop', { precision: 15, scale: 4 }),
    valor_do_fecop_substituto: decimal('valor_do_fecop_substituto', { precision: 15, scale: 4 }),

    // IPI
    cst_do_ipi: bigint('cst_do_ipi', { mode: 'number' }),
    tipo_de_entrada_ipi: varchar('tipo_de_entrada_ipi', { length: 10 }),
    aliquota_do_ipi: decimal('aliquota_do_ipi', { precision: 10, scale: 4 }),
    percentual_do_ipi: decimal('percentual_do_ipi', { precision: 10, scale: 4 }),
    base_de_calculo_do_ipi: decimal('base_de_calculo_do_ipi', { precision: 15, scale: 4 }),
    valor_do_ipi: decimal('valor_do_ipi', { precision: 15, scale: 4 }),

    // PIS
    cst_do_pis_id: bigint('cst_do_pis_id', { mode: 'number' }),
    aliquota_do_pis: decimal('aliquota_do_pis', { precision: 10, scale: 4 }),
    base_de_calculo_do_pis: decimal('base_de_calculo_do_pis', { precision: 15, scale: 4 }),
    valor_do_pis: decimal('valor_do_pis', { precision: 15, scale: 4 }),

    // COFINS
    cst_do_cofins_id: bigint('cst_do_cofins_id', { mode: 'number' }),
    aliquota_do_cofins: decimal('aliquota_do_cofins', { precision: 10, scale: 4 }),
    base_de_calculo_do_cofins: decimal('base_de_calculo_do_cofins', { precision: 15, scale: 4 }),
    valor_do_cofins: decimal('valor_do_cofins', { precision: 15, scale: 4 }),

    // DAE
    percentual_do_dae: decimal('percentual_do_dae', { precision: 10, scale: 4 }),
    tipo_de_entrada_dae: varchar('tipo_de_entrada_dae', { length: 10 }),
    valor_do_dae: decimal('valor_do_dae', { precision: 15, scale: 4 }),

    // Custo
    custo_fiscal: decimal('custo_fiscal', { precision: 15, scale: 4 }),
    custo_medio: decimal('custo_medio', { precision: 15, scale: 4 }),
    custo_reposicao: decimal('custo_reposicao', { precision: 15, scale: 4 }),
    percentual_icms_de_compra: decimal('percentual_icms_de_compra', { precision: 10, scale: 4 }),

    modalidade_da_base_de_calculo: varchar('modalidade_da_base_de_calculo', { length: 30 }),
    situacao_fiscal_id: bigint('situacao_fiscal_id', { mode: 'number' }),
    codigo_natureza_de_imposto_federal: bigint('codigo_natureza_de_imposto_federal', { mode: 'number' }),
    compoe_total_da_nota: boolean('compoe_total_da_nota'),
    data_validade: date('data_validade'),

    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    notaCompraIdx: index('idx_nci_nota_compra_external_id').on(table.nota_compra_external_id),
    produtoIdx: index('idx_nci_produto_id').on(table.produto_id),
  }),
);

export type NotaCompraItem = typeof notaCompraItem.$inferSelect;
export type NewNotaCompraItem = typeof notaCompraItem.$inferInsert;
