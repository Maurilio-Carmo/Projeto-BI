import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// CUPONS_FISCAIS — /v1/venda/cupons-fiscais
// Cupons emitidos no PDV (ECF / SAT / NFC-e).
// Sub-tabelas:
//   • cupom-fiscal-itens-venda.ts   (array `itensVenda`)
//   • cupom-fiscal-finalizacoes.ts  (array `finalizacoes`)
// ─────────────────────────────────────────────────────────────────────────────

export const cuponsFiscais = sqliteTable(
  'cupons_fiscais',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    identificadorId: integer('identificador_id'),

    // ── Cabeçalho da venda ───────────────────────────────────────────────────
    lojaId:        integer('loja_id'),
    clienteId:     integer('cliente_id').notNull(),
    funcionarioId: integer('funcionario_id'),
    autorizadorId: integer('autorizador_id'),
    pedidoVendaId: integer('pedido_venda_id'),
    notaFiscalId:  integer('nota_fiscal_id'),

    // ── Equipamento / série ──────────────────────────────────────────────────
    numeroCaixa:          text('numero_caixa'),
    numeroEquipamento:    text('numero_equipamento'),
    serieEquipamento:     text('serie_equipamento'),
    codigoImpressora:     text('codigo_impressora'),
    sequencial:           text('sequencial'),
    sequencialOperador:   text('sequencial_operador'),
    coo:                  integer('coo'),
    contadorDocumento:    text('contador_documento'),
    chaveEletronica:      text('chave_eletronica'),
    numeroDoProtocolo:    text('numero_do_protocolo'),
    transacaoVendaEnvelope: text('transacao_venda_envelope').notNull(),

    // ── Consumidor ───────────────────────────────────────────────────────────
    nomeConsumidor: text('nome_consumidor'),
    cpfConsumidor:  text('cpf_consumidor'),
    cartaoFidelidade: text('cartao_fidelidade').notNull(),

    // ── Valores ──────────────────────────────────────────────────────────────
    valor:                  real('valor').notNull(),
    acrescimo:              real('acrescimo').notNull(),
    desconto:               real('desconto').notNull(),
    valorServico:           real('valor_servico').notNull(),
    margemDesconto:         real('margem_desconto').notNull(),
    valorDescontoFidelidade: real('valor_desconto_fidelidade'),
    valorItensCancelados:   real('valor_itens_cancelados').notNull(),

    // ── Quantidades ──────────────────────────────────────────────────────────
    qtdUnidadesCupom:      real('qtd_unidades_cupom').notNull(),
    qtdItensCupom:         real('qtd_itens_cupom').notNull(),
    qtdUnidadesCanceladas: real('qtd_unidades_canceladas').notNull(),
    qtdItensCancelados:    real('qtd_itens_cancelados').notNull(),

    // ── Datas / hora ─────────────────────────────────────────────────────────
    data:                     text('data'),
    dataVenda:                text('data_venda').notNull(),
    hora:                     text('hora'),
    dataHoraAberturaCupom:    text('data_hora_abertura_cupom'),
    dataHoraFechamentoCupom:  text('data_hora_fechamento_cupom'),
    criadoEm:                 text('criado_em'),

    // ── Status / flags ───────────────────────────────────────────────────────
    cancelada:                 integer('cancelada',                  { mode: 'boolean' }),
    imprimiuNotaFiscal:        integer('imprimiu_nota_fiscal',       { mode: 'boolean' }).notNull(),
    abonoServico:              integer('abono_servico',              { mode: 'boolean' }).notNull(),
    temItensVendidoEmOferta:   integer('tem_itens_vendido_em_oferta',{ mode: 'boolean' }),

    statusXMLNota: text('status_xml_nota', {
      enum: ['PENDENTE', 'AUTORIZADA', 'PENDENTE_CANCELAMENTO', 'CANCELADA', 'ERRO', 'REJEITADA'],
    }),

    // ── Cancelamento / desconto ──────────────────────────────────────────────
    justificativaCancelamento:       text('justificativa_cancelamento'),
    justificativaDesconto:           text('justificativa_desconto'),
    sequencialCupomCancelado:        text('sequencial_cupom_cancelado'),
    codigoMotivoCancelamentoId:      integer('codigo_motivo_cancelamento_id'),
    codigoMotivoDescontoId:          integer('codigo_motivo_desconto_id'),
    codigoMotivoDescontoFidelidadeId: integer('codigo_motivo_desconto_fidelidade_id'),

    // ── Intermediador ─────────────────────────────────────────────────────────
    tipoIntermediador:   text('tipo_intermediador'),
    cnpjDoIntermediador: text('cnpj_do_intermediador'),
    nomeDoIntermediador: text('nome_do_intermediador'),
    indicadorDePresenca: text('indicador_de_presenca'),

    // ── Preço ─────────────────────────────────────────────────────────────────
    tipoPreco: text('tipo_preco').notNull(),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxDataVenda:     index('idx_cup_fisc_data_venda').on(t.dataVenda),
    idxLojaId:        index('idx_cup_fisc_loja_id').on(t.lojaId),
    idxClienteId:     index('idx_cup_fisc_cliente_id').on(t.clienteId),
    idxCancelada:     index('idx_cup_fisc_cancelada').on(t.cancelada),
    idxStatusXml:     index('idx_cup_fisc_status_xml').on(t.statusXMLNota),
    idxNotaFiscalId:  index('idx_cup_fisc_nota_fiscal_id').on(t.notaFiscalId),
  }),
);

export type CupomFiscal    = typeof cuponsFiscais.$inferSelect;
export type NewCupomFiscal = typeof cuponsFiscais.$inferInsert;
