// backend/src/modules/sync/mappers/nota-fiscal.mapper.ts
//
// Converte objetos da API VarejoFácil para as tabelas notasVenda / notasCompra.
//
// ── CORREÇÃO CRÍTICA ─────────────────────────────────────────────────────────
// Drizzle ORM usa o nome da propriedade JS (camelCase) no .values().
// O mapper anterior retornava snake_case (external_id, numero_nota, …).
// Agora retorna camelCase correspondente aos nomes de campo do schema:
//   notasVenda.numeroNota, .chaveDaNfe, .lojaId, .dataEmissao, etc.
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Converte valor para number ou null — compatível com colunas `real` do SQLite */
const n = (v: unknown): number | null => (v != null ? Number(v) : null);

/** Converte para string ISO ou null — compatível com colunas `text` de data */
const d = (v: unknown): string | null =>
  v ? new Date(v as string).toISOString().slice(0, 10) : null;

// ─── Mapper da Nota Fiscal (venda ou compra) ──────────────────────────────────

export function mapNotaFiscalToDb(item: any, classificacao: 'VENDA' | 'COMPRA') {
  return {
    // ── Partes envolvidas ─────────────────────────────────────────────────────
    lojaId:                 item.lojaId                 ? Number(item.lojaId)                 : 0,
    fornecedorId:           item.fornecedorId            ? Number(item.fornecedorId)            : 0,
    clienteId:              item.clienteId               ? Number(item.clienteId)               : 0,
    operacaoId:             item.operacaoId              ? Number(item.operacaoId)              : 0,
    cfopId:                 item.cfopId                  ? Number(item.cfopId)                  : 0,
    localId:                item.localId                 ? Number(item.localId)                 : null,
    funcionarioEmissorId:   item.funcionarioEmissorId    ? Number(item.funcionarioEmissorId)    : null,
    funcionarioCompradorId: item.funcionarioCompradorId  ? Number(item.funcionarioCompradorId)  : null,

    // ── Identificação da nota ─────────────────────────────────────────────────
    numeroNota:             String(item.numeroNota ?? ''),
    serie:                  item.serie ?? null,
    chaveDaNfe:             item.chaveDaNfe ?? null,

    // ── Situação / tipo ───────────────────────────────────────────────────────
    situacao:               item.situacao ?? 'PENDENTE',
    tipoDocumentoFiscal:    item.tipoDeDocumentoFiscal ?? null,
    tipoDeOperacao:         item.tipoDeOperacao ?? null,
    modalidade:             item.modalidade ?? null,
    processoDeEmissao:      item.processoDeEmissao ?? null,
    tipoDeGeracao:          item.tipoDeGeracao ?? null,
    classificacao,

    // ── Datas ─────────────────────────────────────────────────────────────────
    dataEmissao:            d(item.dataEmissao)    ?? new Date().toISOString().slice(0, 10),
    dataOperacao:           d(item.dataOperacao),
    dataAlteracao:          d(item.dataAlteracao),
    dataExclusao:           d(item.dataExclusao),
    dataPostoFiscal:        d(item.dataPostoFiscal),

    // ── Valores financeiros ───────────────────────────────────────────────────
    valorDoDocumento:       n(item.valorDoDocumento)    ?? 0,
    valorDoFrete:           n(item.valorDoFrete),
    valorDoSeguro:          n(item.valorDoSeguro),
    valorDoDesconto:        n(item.valorDoDesconto),
    valorDasDespesasAcessorias: n(item.valorDasDespesasAcessorias),
    valorDoPIS:             n(item.valorDoPIS),
    valorDoCOFINS:          n(item.valorDoCOFINS),
    valorDoIPI:             n(item.valorDoIPI),
    valorFecop:             n(item.valorFecop),

    // ── ICMS ─────────────────────────────────────────────────────────────────
    valorDoICMS:                                      n(item.valorDoICMS),
    valorDoICMSSubstituicaoTributaria:                n(item.valorDoICMSSubstituicaoTributaria),
    valorDoICMSDesonerado:                            n(item.valorDoICMSDesonerado),
    baseDeCalculoDoICMS:                              n(item.baseDeCalculoDoICMS),
    baseDeCalculoDoICMSSubstituicaoTributaria:        n(item.baseDeCalculoDoICMSSubstituicaoTributaria),
    baseDeCalculoFecop:                               n(item.baseDeCalculoFecop),
    baseDeCalculoFecopSubstituicaoTributaria:         n(item.baseDeCalculoFecopSubstituicaoTributaria),
    valorFecopSubstituicaoTributaria:                 n(item.valorFecopSubstituicaoTributaria),

    // ── Operação / fluxo ─────────────────────────────────────────────────────
    operacaoId2:            item.operacaoId2   ? Number(item.operacaoId2)   : null,  // só se existir no schema
    tipoDeFrete:            item.tipoDeFrete   ?? null,
    condicaoDePagamento:    item.condicaoDePagamento ?? null,

    // ── Flags ─────────────────────────────────────────────────────────────────
    geraFiscal:             item.geraFiscal      ?? null,
    atualizaEstoque:        item.atualizaEstoque ?? null,
    atualizaCusto:          item.atualizaCusto   ?? null,
    compoeABC:              item.compoeABC       ?? null,

    observacao:             item.observacao      ?? null,
  };
}

// ─── Mapper de Item da Nota Fiscal ────────────────────────────────────────────

export function mapItemNotaFiscalToDb(item: any) {
  return {
    // ── FKs de classificação ─────────────────────────────────────────────────
    produtoId:              item.produtoId        ? Number(item.produtoId)        : 0,
    situacaoFiscalId:       item.situacaoFiscalId ? Number(item.situacaoFiscalId) : 0,
    cfopId:                 item.cfopId           ? Number(item.cfopId)           : 0,
    cstDoPISId:             item.cstDoPISId       ? Number(item.cstDoPISId)       : null,
    cstDoCOFINSId:          item.cstDoCOFINSId    ? Number(item.cstDoCOFINSId)    : null,
    cstDoIPI:               item.cstDoIPI         ? Number(item.cstDoIPI)         : null,

    // ── Identificação ─────────────────────────────────────────────────────────
    sequencial:             item.sequencial        ? Number(item.sequencial)       : null,
    ncm:                    item.ncm               ?? null,
    cest:                   item.cest              ?? null,
    tributacao:             item.tributacao         ?? null,
    csosn:                  item.csosn             ?? null,
    unidadeDeMedida:        item.unidadeDeMedida   ?? '',
    numeroPedido:           item.numeroPedido      ?? null,
    sequencialItemPedido:   item.sequencialItemPedido ?? null,

    // ── Quantidades ───────────────────────────────────────────────────────────
    quantidade:                      n(item.quantidade)                  ?? 0,
    quantidadeDeItensNaUnidade:      n(item.quantidadeDeItensNaUnidade) ?? 0,
    quantidadeCompleta:              n(item.quantidadeCompleta),

    // ── Valores ───────────────────────────────────────────────────────────────
    valorDaEmbalagem:                n(item.valorDaEmbalagem)            ?? 0,
    valorTotalDoItem:                n(item.valorTotalDoItem),
    valorDoDesconto:                 n(item.valorDoDesconto),
    valorDoDescontoTributado:        n(item.valorDoDescontoTributado),
    valorDoDescontoNaoTributado:     n(item.valorDoDescontoNaoTributado),
    valorDoFrete:                    n(item.valorDoFrete),
    valorDoSeguro:                   n(item.valorDoSeguro),
    valorDoDAE:                      n(item.valorDoDAE),
    valorOutrasDespesas:             n(item.valorOutrasDespesas),

    // ── Custos ────────────────────────────────────────────────────────────────
    custoReposicao:                  n(item.custoReposicao),
    custoMedio:                      n(item.custoMedio),
    custoFiscal:                     n(item.custoFiscal),

    // ── Percentuais ───────────────────────────────────────────────────────────
    percentualDoDesconto:            n(item.percentualDoDesconto),
    percentualDoFrete:               n(item.percentualDoFrete),
    percentualDoSeguro:              n(item.percentualDoSeguro),
    percentualDoDAE:                 n(item.percentualDoDAE),
    percentualOutrasDespesas:        n(item.percentualOutrasDespesas),
    percentualTributado:             n(item.percentualTributado),
    percentualDiferimento:           n(item.percentualDiferimento),
    percentualICMSDeCompra:          n(item.percentualICMSDeCompra),
    percentualDeAgregacao:           n(item.percentualDeAgregacao),

    // ── ICMS ─────────────────────────────────────────────────────────────────
    aliquotaDoICMS:                  n(item.aliquotaDoICMS),
    aliquotaNoSimples:               n(item.aliquotaNoSimples),
    aliquotaEstadual:                n(item.aliquotaEstadual),
    aliquotaNacional:                n(item.aliquotaNacional),
    aliquotaImportado:               n(item.aliquotaImportado),
    baseDeCalculoDoICMS:             n(item.baseDeCalculoDoICMS),
    valorDoICMS:                     n(item.valorDoICMS),
    valorDoICMSNoSimples:            n(item.valorDoICMSNoSimples),
    valorDoICMSDesonerado:           n(item.valorDoICMSDesonerado),
    motivoDesoneracao:               item.motivoDesoneracao ?? null,
    modalidadeDaBaseDeCalculo:       item.modalidadeDaBaseDeCalculo ?? null,
  };
}
