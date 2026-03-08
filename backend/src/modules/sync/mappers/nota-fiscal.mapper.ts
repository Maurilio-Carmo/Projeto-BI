// backend/src/modules/sync/mappers/nota-fiscal.mapper.ts
//
// Converte objetos da API VarejoFácil para as tabelas nota_venda / nota_compra.
//
// ── CORREÇÃO SQLite ──────────────────────────────────────────────────────────
// O helper d() retornava string | null (adequado para MySQL DECIMAL).
// SQLite usa real (number), então o helper foi renomeado para n() e agora
// retorna number | null. Campos que eram String(...) também passam por Number().
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Converte valor para number ou null — compatível com colunas `real` do SQLite */
const n = (v: unknown): number | null => (v != null ? Number(v) : null);

// ─── Mapper principal da Nota Fiscal ─────────────────────────────────────────

export function mapNotaFiscalToDb(item: any, classificacao: 'VENDA' | 'COMPRA') {
  return {
    external_id:                               Number(item.id),
    numero_nota:                               String(item.numeroNota ?? ''),
    serie:                                     item.serie ?? null,
    chave_nfe:                                 item.chaveDaNfe ?? null,
    situacao:                                  item.situacao ?? 'PENDENTE',
    tipo_documento_fiscal:                     item.tipoDeDocumentoFiscal ?? null,
    tipo_de_operacao:                          item.tipoDeOperacao ?? null,
    modalidade:                                item.modalidade ?? null,
    processo_de_emissao:                       item.processoDeEmissao ?? null,
    tipo_de_geracao:                           item.tipoDeGeracao ?? null,
    classificacao,
    data_emissao:                              item.dataEmissao ? new Date(item.dataEmissao) : new Date(),
    data_operacao:                             item.dataOperacao ? new Date(item.dataOperacao) : null,
    data_exclusao:                             item.dataExclusao ? new Date(item.dataExclusao) : null,
    data_alteracao:                            item.dataAlteracao ? new Date(item.dataAlteracao) : null,
    data_posto_fiscal:                         item.dataPostoFiscal ? new Date(item.dataPostoFiscal) : null,
    // Valores financeiros — n() em vez de String()
    valor_do_documento:                        Number(item.valorDoDocumento ?? 0),
    valor_total_dos_itens:                     n(item.valorTotalDosItens),
    valor_do_desconto:                         n(item.valorDoDesconto),
    valor_de_outras_despesas:                  n(item.valorDeOutrasDespesas),
    valor_do_frete:                            n(item.valorDoFrete),
    valor_do_seguro:                           n(item.valorDoSeguro),
    valor_do_icms:                             n(item.valorDoICMS),
    valor_do_icms_substituicao_tributaria:     n(item.valorDoICMSSubstituicaoTributaria),
    valor_do_icms_desonerado:                  n(item.valorDoICMSDesonerado),
    valor_do_ipi:                              n(item.valorDoIPI),
    valor_do_pis:                              n(item.valorDoPIS),
    valor_do_cofins:                           n(item.valorDoCOFINS),
    valor_do_dae:                              n(item.valorDoDAE),
    valor_fecop:                               n(item.valorFecop),
    valor_fecop_substituicao_tributaria:       n(item.valorFecopSubstituicaoTributaria),
    base_de_calculo_do_icms:                   n(item.baseDeCalculoDoICMS),
    base_de_calculo_do_icms_substituicao_tributaria: n(item.baseDeCalculoDoICMSSubstituicaoTributaria),
    base_de_calculo_fecop:                     n(item.baseDeCalculoFecop),
    base_de_calculo_fecop_substituicao_tributaria: n(item.baseDeCalculoFecopSubstituicaoTributaria),
    // IDs relacionados
    loja_id:                                   item.lojaId ? Number(item.lojaId) : null,
    cliente_id:                                item.clienteId ? Number(item.clienteId) : null,
    fornecedor_id:                             item.fornecedorId ? Number(item.fornecedorId) : null,
    local_id:                                  item.localId ? Number(item.localId) : null,
    operacao_id:                               item.operacaoId ? Number(item.operacaoId) : null,
    cfop_id:                                   item.cfopId ? Number(item.cfopId) : null,
    funcionario_emissor_id:                    item.funcionarioEmissorId ? Number(item.funcionarioEmissorId) : null,
    funcionario_comprador_id:                  item.funcionarioCompradorId ? Number(item.funcionarioCompradorId) : null,
    tipo_de_frete:                             item.tipoDeFrete ?? null,
    condicao_de_pagamento:                     item.condicaoDePagamento ?? null,
    atualiza_estoque:                          item.atualizaEstoque ?? null,
    atualiza_custo:                            item.atualizaCusto ?? null,
    gera_fiscal:                               item.geraFiscal ?? null,
    compoe_abc:                                item.compoeABC ?? null,
    observacao:                                item.observacao ?? null,
  };
}

// ─── Mapper de Item da Nota Fiscal ────────────────────────────────────────────

export function mapItemNotaFiscalToDb(item: any, _notaExternalId: number) {
  return {
    external_item_id:                                   item.id ? Number(item.id) : null,
    sequencial:                                         item.sequencial ? Number(item.sequencial) : null,
    produto_id:                                         item.produtoId ? Number(item.produtoId) : null,
    ncm:                                                item.ncm ?? null,
    cest:                                               item.cest ?? null,
    cfop_id:                                            item.cfopId ? Number(item.cfopId) : null,
    unidade_de_medida:                                  item.unidadeDeMedida ?? null,
    numero_pedido:                                      item.numeroPedido ?? null,
    sequencial_item_pedido:                             item.sequencialItemPedido ?? null,
    // Quantidades e valores — n() em vez de d()
    quantidade:                                         n(item.quantidade),
    quantidade_de_itens_na_unidade:                     n(item.quantidadeDeItensNaUnidade),
    quantidade_completa:                                n(item.quantidadeCompleta),
    valor_da_embalagem:                                 n(item.valorDaEmbalagem),
    valor_total_do_item:                                n(item.valorTotalDoItem),
    valor_do_frete:                                     n(item.valorDoFrete),
    valor_do_seguro:                                    n(item.valorDoSeguro),
    valor_outras_despesas:                              n(item.valorOutrasDespesas),
    // Desconto
    percentual_do_desconto:                             n(item.percentualDoDesconto),
    valor_do_desconto_tributado:                        n(item.valorDoDescontoTributado),
    valor_do_desconto_nao_tributado:                    n(item.valorDoDescontoNaoTributado),
    // ICMS
    tributacao:                                         item.tributacao ?? null,
    csosn:                                              item.csosn ?? null,
    aliquota_do_icms:                                   n(item.aliquotaDoICMS),
    aliquota_no_simples:                                n(item.aliquotaNoSimples),
    aliquota_estadual:                                  n(item.aliquotaEstadual),
    aliquota_nacional:                                  n(item.aliquotaNacional),
    aliquota_importado:                                 n(item.aliquotaImportado),
    aliquota_do_icms_de_venda:                          n(item.aliquotaDoICMSDeVenda),
    base_de_calculo_do_icms:                            n(item.baseDeCalculoDoICMS),
    valor_do_icms:                                      n(item.valorDoICMS),
    valor_do_icms_no_simples:                           n(item.valorDoICMSNoSimples),
    valor_do_icms_desonerado:                           n(item.valorDoICMSDesonerado),
    // ICMS ST
    aliquota_do_icms_substituicao_tributaria:              n(item.aliquotaDoICMSComSubstituicaoTributaria),
    base_de_calculo_do_icms_substituicao_tributaria:       n(item.baseDeCalculoDoICMSComSubstituicaoTributaria),
    valor_do_icms_substituicao_tributaria:                 n(item.valorDoICMSComSubstituicaoTributaria),
    percentual_de_reducao_do_icms_substituicao_tributaria: n(item.percentualDeReducaoDASubstituicaoTributaria),
    percentual_de_margem_de_valor_agregado:                n(item.percentualDeAgregacao),
    // FECOP
    aliquota_fecop:                                     n(item.aliquotaDoFecop),
    base_de_calculo_fecop:                              n(item.baseDeCalculoDoFecop),
    valor_fecop:                                        n(item.valorDoFecop),
    base_de_calculo_fecop_st:                           n(item.baseDeCalculoDoFecopSubstituto),
    valor_fecop_st:                                     n(item.valorDoFecopSubstituto),
    // IPI
    cst_do_ipi_id:                                      item.cstDoIPI ? Number(item.cstDoIPI) : null,
    aliquota_do_ipi:                                    n(item.aliquotaDoIPI),
    base_de_calculo_ipi:                                n(item.baseDeCalculoDoIPI),
    valor_do_ipi:                                       n(item.valorDoIPI),
    // PIS
    cst_do_pis_id:                                      item.cstDoPISId ? Number(item.cstDoPISId) : null,
    aliquota_do_pis:                                    n(item.aliquotaDoPIS),
    base_de_calculo_do_pis:                             n(item.baseDeCalculoDoPIS),
    valor_do_pis:                                       n(item.valorDoPIS),
    // COFINS
    cst_do_cofins_id:                                   item.cstDoCOFINSId ? Number(item.cstDoCOFINSId) : null,
    aliquota_do_cofins:                                 n(item.aliquotaDoCOFINS),
    base_de_calculo_do_cofins:                          n(item.baseDeCalculoDoCOFINS),
    valor_do_cofins:                                    n(item.valorDoCOFINS),
    // DAE
    percentual_do_dae:                                  n(item.percentualDoDAE),
    tipo_de_entrada_dae:                                item.tipoDeEntradaDAE ?? null,
    valor_do_dae:                                       n(item.valorDoDAE),
    // Custo
    custo_fiscal:                                       n(item.custoFiscal),
    custo_medio:                                        n(item.custoMedio),
    custo_reposicao:                                    n(item.custoReposicao),
    percentual_icms_de_compra:                          n(item.percentualICMSDeCompra),
    // Extras
    modalidade_da_base_de_calculo:                      item.modalidadeDaBaseDeCalculo ?? null,
    situacao_fiscal_id:                                 item.situacaoFiscalId ? Number(item.situacaoFiscalId) : null,
    codigo_natureza_de_imposto_federal:                 item.codigoNaturezaDeImpostoFederal ? Number(item.codigoNaturezaDeImpostoFederal) : null,
    compoe_total_da_nota:                               item.compoeTotalDaNota ?? null,
    data_validade:                                      item.dataValidade ? new Date(item.dataValidade) : null,
  };
}
