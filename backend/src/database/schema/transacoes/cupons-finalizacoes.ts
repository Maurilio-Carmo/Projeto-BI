import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { cuponsFiscais } from './cupons-fiscais';

// ─────────────────────────────────────────────────────────────────────────────
// CUPOM_FINALIZACOES
// Array `finalizacoes` — formas de pagamento utilizadas no cupom.
// ─────────────────────────────────────────────────────────────────────────────

export const cupomFinalizacoes = sqliteTable(
  'cupom_finalizacoes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cupomFiscalId: integer('cupom_fiscal_id')
      .notNull()
      .references(() => cuponsFiscais.id, { onDelete: 'cascade' }),

    finalizadoraId: integer('finalizadora_id').notNull(),
    sequencial:     text('sequencial'),

    // ── Valores ──────────────────────────────────────────────────────────────
    valor:          real('valor').notNull(),
    troco:          real('troco'),
    trocoDoacao:    real('troco_doacao'),
    descontoMoeda:  real('desconto_moeda'),
    jurosPlano:     real('juros_plano'),

    // ── Cartão ───────────────────────────────────────────────────────────────
    bandeira:          text('bandeira'),
    numeroCartao:      text('numero_cartao'),
    numeroBinCartao:   text('numero_bin_cartao'),
    redeAdquirente:    text('rede_adquirente'),
    nsu:               text('nsu'),
    nsuAutorizacao:    text('nsu_autorizacao'),
    nsuDoCancelamento: text('nsu_do_cancelamento'),
    autorizacaoCartao: text('autorizacao_cartao'),
    quantidadeParcelas: text('quantidade_parcelas'),
    codigoPlano:       text('codigo_plano'),
    codigoAgente:      text('codigo_agente'),

    localTef: text('local_tef', {
      enum: ['POS', 'TEF', 'DISCADA'],
    }),

    // ── Cheque ────────────────────────────────────────────────────────────────
    emitenteCheque: text('emitente_cheque'),
    leituraCmc7:    text('leitura_cmc7'),

    // ── Flags e metadados ────────────────────────────────────────────────────
    tipo:              text('tipo'),
    especializacao:    text('especializacao'),
    modalidade:        text('modalidade'),
    tipoTroco:         text('tipo_troco').notNull(), // 'T' ou 'C'
    geraFidelidade:    text('gera_fidelidade'),      // 'S' ou 'N'
    geraContaReceber:  text('gera_conta_receber'),   // 'S' ou 'N'
    solicitaPlano:     text('solicita_plano'),       // 'S' ou 'N'
    verificaLimiteCredito: text('verifica_limite_credito'),
    atualizaLimiteCredito: text('atualiza_limite_credito'),
    planoReducao:          text('plano_reducao'),
    sangriaDetalhada:      text('sangria_detalhada'),
    codigoOrigem:          text('codigo_origem'),
    numeroValeCompra:      text('numero_vale_compra'),

    // ── Textos livres ─────────────────────────────────────────────────────────
    textoLivre1: text('texto_livre_1'),
    textoLivre2: text('texto_livre_2'),
    textoLivre3: text('texto_livre_3'),
    textoLivre4: text('texto_livre_4'),

    dataVencimento: text('data_vencimento'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxCupomFiscalId: index('idx_cup_fisc_fin_cupom_id').on(t.cupomFiscalId),
    idxFinalizadora:  index('idx_cup_fisc_fin_finalizadora_id').on(t.finalizadoraId),
    idxTipo:          index('idx_cup_fisc_fin_tipo').on(t.tipo),
  }),
);

export type CupomFinalizacao    = typeof cupomFinalizacoes.$inferSelect;
export type NewCupomFinalizacao = typeof cupomFinalizacoes.$inferInsert;
