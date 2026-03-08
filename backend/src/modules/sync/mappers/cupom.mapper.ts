// backend/src/modules/sync/mappers/cupom.mapper.ts
//
// Converte objetos da API VarejoFácil para as tabelas:
//   cuponsFiscais, cupomItens, cupomFinalizacoes.
//
// ── CORREÇÃO CRÍTICA ─────────────────────────────────────────────────────────
// Drizzle ORM usa o nome da propriedade JS (camelCase) no .values().
// O mapper anterior retornava snake_case (cupom_external_id, numero_caixa…).
// Agora retorna camelCase correspondente aos nomes de campo do schema.
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Converte para number ou null */
const n = (v: unknown): number | null => (v != null ? Number(v) : null);

// ─── Mapper do Cupom Fiscal ───────────────────────────────────────────────────

export function mapCupomToDb(item: any) {
  return {
    // ── Identificação externa ─────────────────────────────────────────────────
    identificadorId: item.identificadorId ? Number(item.identificadorId) : null,

    // ── Cabeçalho ─────────────────────────────────────────────────────────────
    lojaId:           item.lojaId           ? Number(item.lojaId)           : null,
    clienteId:        item.clienteId        ? Number(item.clienteId)        : 0,
    funcionarioId:    item.funcionarioId    ? Number(item.funcionarioId)    : null,
    autorizadorId:    item.autorizadorId    ? Number(item.autorizadorId)    : null,
    pedidoVendaId:    item.pedidoVendaId    ? Number(item.pedidoVendaId)    : null,
    notaFiscalId:     item.notaFiscalId     ? Number(item.notaFiscalId)     : null,

    // ── Equipamento ───────────────────────────────────────────────────────────
    numeroCaixa:         item.numeroCaixa         ?? null,
    numeroEquipamento:   item.numeroEquipamento   ?? null,
    serieEquipamento:    item.serieEquipamento    ?? null,
    codigoImpressora:    item.codigoImpressora    ?? null,
    sequencial:          item.sequencial          ?? null,
    sequencialOperador:  item.sequencialOperador  ?? null,
    coo:                 item.coo                 ? Number(item.coo) : null,
    contadorDocumento:   item.contadorDocumento   ?? null,
    chaveEletronica:     item.chaveEletronica     ?? null,
    numeroDoProtocolo:   item.numeroDoProtocolo   ?? null,
    transacaoVendaEnvelope: item.transacaoVendaEnvelope ?? '',

    // ── Consumidor ────────────────────────────────────────────────────────────
    nomeConsumidor:  item.nomeConsumidor  ?? null,
    cpfConsumidor:   item.cpfConsumidor   ?? null,
    cartaoFidelidade: item.cartaoFidelidade ?? '',

    // ── Datas ─────────────────────────────────────────────────────────────────
    dataVenda:                item.dataVenda                ? new Date(item.dataVenda).toISOString().slice(0, 10) : null,
    data:                     item.data                     ? new Date(item.data).toISOString().slice(0, 10)      : new Date().toISOString().slice(0, 10),
    hora:                     item.hora                     ?? null,
    dataHoraAberturaCupom:    item.dataHoraAberturaCupom    ?? null,
    dataHoraFechamentoCupom:  item.dataHoraFechamentoCupom  ?? null,
    criadoEm:                 item.criadoEm                 ? new Date(item.criadoEm).toISOString() : null,
    statusXMLNota:            item.statusXMLNota            ?? null,

    // ── Valores financeiros ───────────────────────────────────────────────────
    valor:                      Number(item.valor ?? 0),
    acrescimo:                  n(item.acrescimo),
    desconto:                   n(item.desconto),
    valorDescontoFidelidade:    n(item.valorDescontoFidelidade),
    valorServico:               n(item.valorServico),
    valorItensCancelados:       n(item.valorItensCancelados),
    margemDesconto:             n(item.margemDesconto),
    qtdItensCupom:              n(item.qtdItensCupom),
    qtdItensCancelados:         n(item.qtdItensCancelados),
    qtdUnidadesCupom:           n(item.qtdUnidadesCupom),
    qtdUnidadesCanceladas:      n(item.qtdUnidadesCanceladas),

    // ── Flags ─────────────────────────────────────────────────────────────────
    cancelada:                  item.cancelada                  ?? null,
    imprimiuNotaFiscal:         item.imprimiuNotaFiscal         ?? null,
    temItensVendidoEmOferta:    item.temItensVendidoEmOferta    ?? null,
    abonoServico:               item.abonoServico               ?? null,

    // ── Cancelamento / desconto ───────────────────────────────────────────────
    justificativaCancelamento:           item.justificativaCancelamento           ?? null,
    sequencialCupomCancelado:            item.sequencialCupomCancelado            ?? null,
    codigoMotivoCancelamentoId:          item.codigoMotivoCancelamentoId          ? Number(item.codigoMotivoCancelamentoId)          : null,
    justificativaDesconto:               item.justificativaDesconto               ?? null,
    codigoMotivoDescontoId:              item.codigoMotivoDescontoId              ? Number(item.codigoMotivoDescontoId)              : null,
    codigoMotivoDescontoFidelidadeId:    item.codigoMotivoDescontoFidelidadeId    ? Number(item.codigoMotivoDescontoFidelidadeId)    : null,

    // ── Intermediador ─────────────────────────────────────────────────────────
    tipoIntermediador:    item.tipoIntermediador    ?? null,
    cnpjDoIntermediador:  item.cnpjDoIntermediador  ?? null,
    nomeDoIntermediador:  item.nomeDoIntermediador  ?? null,
    indicadorDePresenca:  item.indicadorDePresenca  ?? null,

    // ── Preço / meta ──────────────────────────────────────────────────────────
    tipoPreco:            item.tipoPreco ?? '',
  };
}

// ─── Mapper de Item do Cupom ──────────────────────────────────────────────────
// cupomFiscalId é preenchido pelo repository (ID interno após upsert do cupom)

export function mapCupomItemToDb(item: any, cupomFiscalId: number) {
  return {
    cupomFiscalId,

    produtoId:                     item.produtoId                    ? Number(item.produtoId)                    : null,
    codigoAuxiliarId:              item.codigoAuxiliarId             ?? null,
    localVendaId:                  item.localVendaId                 ? Number(item.localVendaId)                 : null,
    setorDeProducaoId:             item.setorDeProducaoId            ? Number(item.setorDeProducaoId)            : null,

    funcionarioVendedorId:         item.funcionarioVendedorId        ? Number(item.funcionarioVendedorId)        : null,
    funcionarioAutorizadorId:      item.funcionarioAutorizadorId     ? Number(item.funcionarioAutorizadorId)     : null,
    funcionarioProducaoId:         item.funcionarioProducaoId        ?? null,
    funcionarioCaptacaoPrevendaId: item.funcionarioCaptacaoPrevendaId ?? null,

    // ── Quantidades e valores ─────────────────────────────────────────────────
    quantidadeVenda:         n(item.quantidadeVenda)         ?? 0,
    valorUnidade:            n(item.valorUnidade)            ?? 0,
    valorTotal:              n(item.valorTotal)              ?? 0,
    valorAcrescimo:          n(item.valorAcrescimo)          ?? 0,
    valorDesconto:           n(item.valorDesconto)           ?? 0,
    valorServico:            n(item.valorServico)            ?? 0,
    precoVenda:              n(item.precoVenda)              ?? 0,
    precoCusto:              n(item.precoCusto)              ?? 0,
    precoCustoMedio:         n(item.precoCustoMedio)         ?? 0,
    precoCustoFiscal:        n(item.precoCustoFiscal)        ?? 0,
    fatorBonificacao:        n(item.fatorBonificacao)        ?? 0,
    valorDoDescontoMegaCaixa: n(item.valorDoDescontoMegaCaixa) ?? 0,

    // ── Tributação ────────────────────────────────────────────────────────────
    cfop:                   item.cfop             ?? '',
    ncm:                    item.ncm              ?? null,
    ncmExcecao:             item.ncmExcecao       ?? null,
    tributacao:             item.tributacao        ?? '',
    tributacaoAliquota:     n(item.tributacaoAliquota)     ?? 0,
    tributacaoAliquotaFecop: n(item.tributacaoAliquotaFecop),
    tributacaoValorReducao: n(item.tributacaoValorReducao) ?? 0,
    tributacaoSimbologia:   item.tributacaoSimbologia      ?? '',
    aliquotaPIS:            n(item.aliquotaPIS)            ?? 0,
    aliquotaCOFINS:         n(item.aliquotaCOFINS)         ?? 0,
    cstPIS:                 item.cstPIS             ?? '',
    cstCOFINS:              item.cstCOFINS          ?? '',
    csosn:                  item.csosn              ?? null,
    natureza:               item.natureza           ?? '',
    tabelaA:                item.tabelaA            ?? '',
    tabelaB:                item.tabelaB            ?? '',
    serieProduto:           item.serieProduto       ?? '',
    valorFecop:             n(item.valorFecop),
    valorICMSDesonerado:    n(item.valorICMSDesonerado),

    // ── Tipo / flags ──────────────────────────────────────────────────────────
    tipo:                        item.tipo                        ?? '',
    tipoPreco:                   item.tipoPreco                   ?? '',
    tipoBonificacao:             item.tipoBonificacao             ?? '',
    tipoDeDescontoAplicado:      item.tipoDeDescontoAplicado      ?? '',
    taxaEntrega:                 Boolean(item.taxaEntrega),
    participouPromocaoDesconto:  Boolean(item.participouPromocaoDesconto),
    foiVendidoEmOferta:          item.foiVendidoEmOferta !== undefined ? Boolean(item.foiVendidoEmOferta) : null,
  };
}

// ─── Mapper de Finalização do Cupom ──────────────────────────────────────────

export function mapFinalizacaoToDb(item: any, cupomFiscalId: number) {
  return {
    cupomFiscalId,

    finalizadoraId:     item.finalizadoraId ? Number(item.finalizadoraId) : 0,
    sequencial:         item.sequencial     ?? null,

    valor:              Number(item.valor ?? 0),
    troco:              n(item.troco),
    trocoDoacao:        n(item.trocoDoacao),
    descontoMoeda:      n(item.descontoMoeda),
    jurosPlano:         n(item.jurosPlano),

    bandeira:           item.bandeira          ?? null,
    numeroCartao:       item.numeroCartao      ?? null,
    numeroBinCartao:    item.numeroBinCartao   ?? null,
    redeAdquirente:     item.redeAdquirente    ?? null,
    nsu:                item.nsu               ?? null,
    nsuAutorizacao:     item.nsuAutorizacao    ?? null,
    nsuDoCancelamento:  item.nsuDoCancelamento ?? null,
    autorizacaoCartao:  item.autorizacaoCartao ?? null,
    quantidadeParcelas: item.quantidadeParcelas ?? null,
    codigoPlano:        item.codigoPlano        ?? null,
    codigoAgente:       item.codigoAgente       ?? null,
    localTef:           item.localTef           ?? null,

    emitenteCheque:     item.emitenteCheque  ?? null,
    leituraCmc7:        item.leituraCmc7     ?? null,

    tipo:               item.tipo            ?? null,
    especializacao:     item.especializacao  ?? null,
    modalidade:         item.modalidade      ?? null,
    tipoTroco:          item.tipoTroco       ?? '',
    geraFidelidade:     item.geraFidelidade  ?? null,
    geraContaReceber:   item.geraContaReceber ?? null,
    solicitaPlano:      item.solicitaPlano   ?? null,
    verificaLimiteCredito: item.verificaLimiteCredito ?? null,
    atualizaLimiteCredito: item.atualizaLimiteCredito ?? null,
    planoReducao:       item.planoReducao    ?? null,
    sangriaDetalhada:   item.sangriaDetalhada ?? null,
    codigoOrigem:       item.codigoOrigem    ?? null,
    numeroValeCompra:   item.numeroValeCompra ?? null,
    dataVencimento:     item.dataVencimento  ? new Date(item.dataVencimento).toISOString().slice(0, 10) : null,
    textoLivre1:        item.textoLivre1     ?? null,
    textoLivre2:        item.textoLivre2     ?? null,
    textoLivre3:        item.textoLivre3     ?? null,
    textoLivre4:        item.textoLivre4     ?? null,
  };
}
