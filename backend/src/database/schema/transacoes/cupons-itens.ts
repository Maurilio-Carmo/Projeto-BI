import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { cuponsFiscais } from './cupons-fiscais';

// ─────────────────────────────────────────────────────────────────────────────
// CUPOM_FISCAL_ITENS_VENDA
// Array `itensVenda` — linhas de produto do cupom fiscal.
// ─────────────────────────────────────────────────────────────────────────────

export const cupomItens = sqliteTable(
  'cupom_itens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cupomFiscalId: integer('cupom_fiscal_id')
      .notNull()
      .references(() => cuponsFiscais.id, { onDelete: 'cascade' }),

    produtoId:      integer('produto_id'),
    codigoAuxiliarId: text('codigo_auxiliar_id'),
    localVendaId:   integer('local_venda_id'),
    setorDeProducaoId: integer('setor_de_producao_id'),

    // ── Funcionários ─────────────────────────────────────────────────────────
    funcionarioVendedorId:    integer('funcionario_vendedor_id'),
    funcionarioAutorizadorId: integer('funcionario_autorizador_id'),
    funcionarioProducaoId:    text('funcionario_producao_id'),
    funcionarioCaptacaoPrevendaId: text('funcionario_captacao_prevenda_id'),

    // ── Quantidades e valores ─────────────────────────────────────────────────
    quantidadeVenda: real('quantidade_venda').notNull(),
    valorUnidade:    real('valor_unidade').notNull(),
    valorTotal:      real('valor_total').notNull(),
    valorAcrescimo:  real('valor_acrescimo').notNull(),
    valorDesconto:   real('valor_desconto').notNull(),
    valorServico:    real('valor_servico').notNull(),
    precoVenda:      real('preco_venda').notNull(),
    precoCusto:      real('preco_custo').notNull(),
    precoCustoMedio: real('preco_custo_medio').notNull(),
    precoCustoFiscal: real('preco_custo_fiscal').notNull(),
    fatorBonificacao: real('fator_bonificacao').notNull(),
    valorDoDescontoMegaCaixa: real('valor_do_desconto_mega_caixa').notNull(),

    // ── Tributação ───────────────────────────────────────────────────────────
    cfop:             text('cfop').notNull(),
    ncm:              text('ncm'),
    ncmExcecao:       text('ncm_excecao'),
    tributacao:       text('tributacao').notNull(),
    tributacaoAliquota:       real('tributacao_aliquota').notNull(),
    tributacaoAliquotaFecop:  real('tributacao_aliquota_fecop'),
    tributacaoValorReducao:   real('tributacao_valor_reducao').notNull(),
    tributacaoSimbologia:     text('tributacao_simbologia').notNull(),
    aliquotaPIS:      real('aliquota_pis').notNull(),
    aliquotaCOFINS:   real('aliquota_cofins').notNull(),
    cstPIS:           text('cst_pis').notNull(),
    cstCOFINS:        text('cst_cofins').notNull(),
    csosn:            text('csosn'),
    natureza:         text('natureza').notNull(),
    tabelaA:          text('tabela_a').notNull(),
    tabelaB:          text('tabela_b').notNull(),
    serieProduto:     text('serie_produto').notNull(),
    valorFecop:       real('valor_fecop'),
    valorICMSDesonerado: real('valor_icms_desonerado'),

    // ── Tipo ─────────────────────────────────────────────────────────────────
    tipo:      text('tipo').notNull(),    // 1=Vendido, 2=Cancelado
    tipoPreco: text('tipo_preco').notNull(),
    tipoBonificacao:        text('tipo_bonificacao').notNull(),
    tipoDeDescontoAplicado: text('tipo_de_desconto_aplicado').notNull(),

    // ── Flags ────────────────────────────────────────────────────────────────
    taxaEntrega:                integer('taxa_entrega',                 { mode: 'boolean' }).notNull(),
    participouPromocaoDesconto: integer('participou_promocao_desconto', { mode: 'boolean' }).notNull(),
    foiVendidoEmOferta:         integer('foi_vendido_em_oferta',        { mode: 'boolean' }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxCupomFiscalId: index('idx_cup_fisc_iv_cupom_id').on(t.cupomFiscalId),
    idxProdutoId:     index('idx_cup_fisc_iv_produto_id').on(t.produtoId),
    idxTipo:          index('idx_cup_fisc_iv_tipo').on(t.tipo),
  }),
);

export type CupomItemVenda    = typeof cupomItens.$inferSelect;
export type NewCupomItemVenda = typeof cupomItens.$inferInsert;
