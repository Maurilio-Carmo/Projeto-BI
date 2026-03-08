// backend/src/modules/sync/mappers/cupom.mapper.ts
//
// Converte objetos da API VarejoFácil para as tabelas cupom, cupom_item, cupom_finalizacao.
//
// ── CORREÇÃO SQLite ──────────────────────────────────────────────────────────
// Helper d() retornava string | null (MySQL DECIMAL).
// SQLite usa real (number) → renomeado para n(), retorna number | null.
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Converte valor para number ou null — compatível com colunas `real` do SQLite */
const n = (v: unknown): number | null => (v != null ? Number(v) : null);

// ─── Mapper do Cupom principal ───────────────────────────────────────────────

export function mapCupomToDb(item: any) {
  return {
    external_id:                           Number(item.identificadorId),
    id_externo:                            item.id ?? null,
    coo:                                   item.coo ?? null,
    sequencial:                            item.sequencial ?? null,
    numero_caixa:                          item.numeroCaixa ?? null,
    numero_equipamento:                    item.numeroEquipamento ?? null,
    serie_equipamento:                     item.serieEquipamento ?? null,
    sequencial_operador:                   item.sequencialOperador ?? null,
    codigo_impressora:                     item.codigoImpressora ?? null,
    contador_documento:                    item.contadorDocumento ?? null,
    chave_eletronica:                      item.chaveEletronica ?? null,
    numero_do_protocolo:                   item.numeroDoProtocolo ?? null,
    status_xml_nota:                       item.statusXMLNota ?? null,
    data:                                  item.data ? new Date(item.data) : new Date(),
    data_venda:                            item.dataVenda ? new Date(item.dataVenda) : null,
    hora:                                  item.hora ?? null,
    data_hora_abertura_cupom:              item.dataHoraAberturaCupom ?? null,
    data_hora_fechamento_cupom:            item.dataHoraFechamentoCupom ?? null,
    criado_em:                             item.criadoEm ? new Date(item.criadoEm) : null,
    nome_consumidor:                       item.nomeConsumidor ?? null,
    cpf_consumidor:                        item.cpfConsumidor ?? null,
    // Valores financeiros — n() em vez de d()
    valor:                                 Number(item.valor ?? 0),
    acrescimo:                             n(item.acrescimo),
    desconto:                              n(item.desconto),
    valor_desconto_fidelidade:             n(item.valorDescontoFidelidade),
    valor_servico:                         n(item.valorServico),
    valor_itens_cancelados:                n(item.valorItensCancelados),
    margem_desconto:                       n(item.margemDesconto),
    qtd_itens_cupom:                       n(item.qtdItensCupom),
    qtd_itens_cancelados:                  n(item.qtdItensCancelados),
    qtd_unidades_cupom:                    n(item.qtdUnidadesCupom),
    qtd_unidades_canceladas:               n(item.qtdUnidadesCanceladas),
    cancelada:                             item.cancelada ?? null,
    imprimiu_nota_fiscal:                  item.imprimiuNotaFiscal ?? null,
    tem_itens_vendido_em_oferta:           item.temItensVendidoEmOferta ?? null,
    abono_servico:                         item.abonoServico ?? null,
    justificativa_cancelamento:            item.justificativaCancelamento ?? null,
    sequencial_cupom_cancelado:            item.sequencialCupomCancelado ?? null,
    codigo_motivo_cancelamento_id:         item.codigoMotivoCancelamentoId ? Number(item.codigoMotivoCancelamentoId) : null,
    justificativa_desconto:                item.justificativaDesconto ?? null,
    codigo_motivo_desconto_id:             item.codigoMotivoDescontoId ? Number(item.codigoMotivoDescontoId) : null,
    codigo_motivo_desconto_fidelidade_id:  item.codigoMotivoDescontoFidelidadeId ? Number(item.codigoMotivoDescontoFidelidadeId) : null,
    tipo_intermediador:                    item.tipoIntermediador ?? null,
    cnpj_do_intermediador:                 item.cnpjDoIntermediador ?? null,
    nome_do_intermediador:                 item.nomeDoIntermediador ?? null,
    indicador_de_presenca:                 item.indicadorDePresenca ?? null,
    cartao_fidelidade:                     item.cartaoFidelidade ?? null,
    loja_id:                               item.lojaId ? Number(item.lojaId) : null,
    cliente_id:                            item.clienteId ? Number(item.clienteId) : null,
    funcionario_id:                        item.funcionarioId ? Number(item.funcionarioId) : null,
    autorizador_id:                        item.autorizadorId ? Number(item.autorizadorId) : null,
    nota_fiscal_id:                        item.notaFiscalId ? Number(item.notaFiscalId) : null,
    pedido_venda_id:                       item.pedidoVendaId ? Number(item.pedidoVendaId) : null,
    tipo_preco:                            item.tipoPreco ?? null,
    transacao_venda_envelope:              item.transacaoVendaEnvelope ?? null,
  };
}

// ─── Mapper de Item do Cupom ──────────────────────────────────────────────────

export function mapCupomItemToDb(item: any, cupomExternalId: number) {
  return {
    cupom_external_id:                     cupomExternalId,
    external_item_id:                      item.id ? Number(item.id) : null,
    produto_id:                            item.produtoId ? Number(item.produtoId) : null,
    ncm:                                   item.ncm ?? null,
    csosn:                                 item.csosn ?? null,
    cfop:                                  item.cfop ?? null,
    codigo_auxiliar_id:                    item.codigoAuxiliarId ?? null,
    serie_produto:                         item.serieProduto ?? null,
    natureza:                              item.natureza ?? null,
    tipo:                                  item.tipo ?? null,
    tabela_a:                              item.tabelaA ?? null,
    tabela_b:                              item.tabelaB ?? null,
    tipo_preco:                            item.tipoPreco ?? null,
    // Quantidades e valores — n() em vez de d()
    quantidade_venda:                      n(item.quantidadeVenda),
    valor_unidade:                         n(item.valorUnidade),
    preco_venda:                           n(item.precoVenda),
    preco_custo:                           n(item.precoCusto),
    preco_custo_fiscal:                    n(item.precoCustoFiscal),
    preco_custo_medio:                     n(item.precoCustoMedio),
    valor_total:                           n(item.valorTotal),
    valor_servico:                         n(item.valorServico),
    valor_desconto:                        n(item.valorDesconto),
    tipo_de_desconto_aplicado:             item.tipoDeDescontoAplicado ?? null,
    valor_do_desconto_mega_caixa:          n(item.valorDoDescontoMegaCaixa),
    valor_acrescimo:                       n(item.valorAcrescimo),
    taxa_entrega:                          item.taxaEntrega ?? null,
    tributacao:                            item.tributacao ?? null,
    tributacao_aliquota:                   n(item.tributacaoAliquota),
    tributacao_valor_reducao:              n(item.tributacaoValorReducao),
    tributacao_aliquota_fecop:             n(item.tributacaoAliquotaFecop),
    tributacao_simbologia:                 item.tributacaoSimbologia ?? null,
    valor_fecop:                           n(item.valorFecop),
    aliquota_pis:                          n(item.aliquotaPIS),
    cst_pis:                               item.cstPIS ?? null,
    aliquota_cofins:                       n(item.aliquotaCOFINS),
    cst_cofins:                            item.cstCOFINS ?? null,
    tipo_bonificacao:                      item.tipoBonificacao ?? null,
    fator_bonificacao:                     n(item.fatorBonificacao),
    local_venda_id:                        item.localVendaId ? Number(item.localVendaId) : null,
    funcionario_vendedor_id:               item.funcionarioVendedorId ? Number(item.funcionarioVendedorId) : null,
    funcionario_autorizador_id:            item.funcionarioAutorizadorId ? Number(item.funcionarioAutorizadorId) : null,
    funcionario_captacao_prevenda_id:      item.funcionarioCaptacaoPrevendaId ?? null,
    funcionario_producao_id:               item.funcionarioProducaoId ?? null,
    setor_de_producao_id:                  item.setorDeProducaoId ? Number(item.setorDeProducaoId) : null,
    participou_promocao_desconto:          item.participouPromocaoDesconto ?? null,
    foi_vendido_em_oferta:                 item.foiVendidoEmOferta ?? null,
  };
}

// ─── Mapper de Finalização do Cupom ──────────────────────────────────────────

export function mapFinalizacaoToDb(item: any, cupomExternalId: number) {
  return {
    cupom_external_id:          cupomExternalId,
    external_finalizacao_id:    item.id ? Number(item.id) : null,
    finalizadora_id:            item.finalizadoraId ? Number(item.finalizadoraId) : null,
    sequencial:                 item.sequencial ?? null,
    tipo:                       item.tipo ?? null,
    especializacao:             item.especializacao ?? null,
    modalidade:                 item.modalidade ?? null,
    // valor obrigatório — n() garante number
    valor:                      Number(item.valor ?? 0),
    troco:                      n(item.troco),
    tipo_troco:                 item.tipoTroco ?? null,
    troco_doacao:               n(item.trocoDoacao),
    bandeira:                   item.bandeira ?? null,
    numero_cartao:              item.numeroCartao ?? null,
    numero_bin_cartao:          item.numeroBinCartao ?? null,
    nsu:                        item.nsu ?? null,
    nsu_autorizacao:            item.nsuAutorizacao ?? null,
    nsu_do_cancelamento:        item.nsuDoCancelamento ?? null,
    autorizacao_cartao:         item.autorizacaoCartao ?? null,
    rede_adquirente:            item.redeAdquirente ?? null,
    local_tef:                  item.localTef ?? null,
    quantidade_parcelas:        item.quantidadeParcelas ?? null,
    codigo_plano:               item.codigoPlano ?? null,
    plano_reducao:              item.planoReducao ?? null,
    juros_plano:                n(item.jurosPlano),
    solicita_plano:             item.solicitaPlano ?? null,
    emitente_cheque:            item.emitenteCheque ?? null,
    leitura_cmc7:               item.leituraCmc7 ?? null,
    data_vencimento:            item.dataVencimento ? new Date(item.dataVencimento) : null,
    numero_vale_compra:         item.numeroValeCompra ?? null,
    desconto_moeda:             n(item.descontoMoeda),
    codigo_origem:              item.codigoOrigem ?? null,
    codigo_agente:              item.codigoAgente ?? null,
    sangria_detalhada:          item.sangriaDetalhada ?? null,
    verifica_limite_credito:    item.verificaLimiteCredito ?? null,
    atualiza_limite_credito:    item.atualizaLimiteCredito ?? null,
    gera_fidelidade:            item.geraFidelidade ?? null,
    gera_conta_receber:         item.geraContaReceber ?? null,
    texto_livre1:               item.textoLivre1 ?? null,
    texto_livre2:               item.textoLivre2 ?? null,
    texto_livre3:               item.textoLivre3 ?? null,
    texto_livre4:               item.textoLivre4 ?? null,
  };
}
