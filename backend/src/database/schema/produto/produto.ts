import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { secoes } from './secoes';
import { grupos } from './grupos';
import { subgrupos } from './subgrupos';
import { marcas } from './marcas';
import { familias } from './familias';

// PRODUTOS — /v1/produto/produtos
export const produtos = sqliteTable('produtos', {
  id: integer('produto_id').primaryKey(),

  // ── Identificação ────────────────────────────────────────────────────────
  descricao:         text('descricao').notNull(),
  descricaoReduzida: text('descricao_reduzida').notNull(),

  // ── Classificação (FKs pelo padrão tableName+Id) ─────────────────────────
  secaoId:    integer('secao_id').references(() => secoes.secaoId),
  grupoId:    integer('grupo_id').references(() => grupos.grupoId),
  subgrupoId: integer('subgrupo_id').references(() => subgrupos.subgrupoId),
  marcaId:    integer('marca_id').references(() => marcas.marcaId),
  familiaId:  integer('familia_id').references(() => familias.familiaId),

  // ── Composição ───────────────────────────────────────────────────────────
  composicao: text('composicao', {
    enum: ['NORMAL', 'COMPOSTO', 'KIT', 'RENDIMENTO'],
  }).notNull(),
  associacao: text('associacao', { enum: ['NORMAL'] }),

  // ── Unidades ─────────────────────────────────────────────────────────────
  unidadeDeVenda:            text('unidade_de_venda').notNull(),
  unidadeDeCompra:           text('unidade_de_compra').notNull(),
  unidadeDeTransferencia:    text('unidade_de_transferencia'),
  unidadeDeReferencia:       text('unidade_de_referencia'),

  // ── Fatores / embalagem ───────────────────────────────────────────────────
  itensEmbalagem:               real('itens_embalagem').notNull(),
  itensEmbalagemVenda:          real('itens_embalagem_venda'),
  itensEmbalagemTransferencia:  real('itens_embalagem_transferencia'),
  fatorRendimentoUnidade:       real('fator_rendimento_unidade').notNull(),
  fatorRendimentoCusto:         real('fator_rendimento_custo').notNull(),
  fatorBonificacao:             real('fator_bonificacao'),
  quantidadeComposto:           real('quantidade_composto'),
  medidaReferencial:            real('medida_referencial'),
  quantidadeEtiqueta:           integer('quantidade_etiqueta'),
  qtdMaximaVenda:               real('qtd_maxima_venda'),

  // ── Dimensões / peso ─────────────────────────────────────────────────────
  pesoLiquido: real('peso_liquido'),
  pesoBruto:   real('peso_bruto'),
  largura:     text('largura'),
  altura:      text('altura'),
  comprimento: text('comprimento'),

  // ── Fiscal ───────────────────────────────────────────────────────────────
  ncmId:                       text('ncm_id'),
  cest:                        integer('cest'),
  nomeclaturaMercosulId:       text('nomeclatura_mercosul_id').notNull(),
  nomeclaturaMercosulExcecaoId: text('nomeclatura_mercosul_excecao_id'),
  situacaoFiscalId:            integer('situacao_fiscal_id').notNull(),
  situacaoFiscalSaidaId:       integer('situacao_fiscal_saida_id'),
  tributacaoId:                text('tributacao_id'),
  generoId:   integer('genero_id'),
  naturezaId: text('natureza_id'),
  naturezaDeImpostoFederalId:  integer('natureza_de_imposto_federal_id').notNull(),

  tabelaA: text('tabela_a', {
    enum: [
      'NACIONAL', 'IMPORTACAO_DIRETA', 'ADQUIRIDO_DO_MERCADO_INTERNO',
      'MERCADORIA_CONTENDO_IMPORTACAO_SUPERIOR_40', 'CUJO_PRODUCAO_TENHA_SIDO_FEITO',
      'MERCADORIA_COM_CONTEUDO_DE_IMPORTACAO_EM_CONFORMIDADE',
      'IMPORTACAO_DIRETA_SEM_SIMILAR_NACIONAL',
      'ADQUIRIDO_DO_MERCADO_INTERNO_SEM_SIMILAR_NACIONAL',
      'MERCADORIA_COM_CONTEUDO_DE_IMPORTACAO_SUPERIOR_A_70',
    ],
  }).notNull(),

  ipi:           real('ipi'),
  tipoIPI:       text('tipo_ipi', { enum: ['PERCENTUAL', 'VALOR'] }),
  incidenciaIPI: text('incidencia_ipi', { enum: ['COMPRA', 'VENDA', 'AMBOS'] }),
  codigoANP:     text('codigo_anp'),
  tipoAgregacao: text('tipo_agregacao', { enum: ['PAUTA', 'MARGEM'] }),
  valorAgregacao: real('valor_agregacao'),
  indiceAT:      text('indice_at', { enum: ['ARREDONDA', 'TRUNCA'] }),

  // ── Custo ────────────────────────────────────────────────────────────────
  custoMedio: real('custo_medio'),

  // ── Finalidade / produção ─────────────────────────────────────────────────
  finalidadeProduto: text('finalidade_produto', {
    enum: ['COMERCIALIZACAO', 'CONSUMO', 'IMOBILIZADO', 'INDUSTRIALIZADO', 'MATERIA_PRIMA', 'OUTROS'],
  }),
  producao: text('producao', { enum: ['PROPRIO', 'TERCEIROS'] }),

  // ── Flags diversas ───────────────────────────────────────────────────────
  baixaNaVendaComposto: integer('baixa_na_venda_composto', { mode: 'boolean' }),
  participaCotacao:     integer('participa_cotacao', { mode: 'boolean' }),
  atualizaFamilia:      integer('atualiza_familia', { mode: 'boolean' }),
  controlaEstoque:      integer('controla_estoque', { mode: 'boolean' }),
  permiteDesconto:      integer('permite_desconto', { mode: 'boolean' }),
  foraDeLinha:          text('fora_de_linha'),
  mix:                  text('mix'),
  observacao:           text('observacao'),
  pesoVariavel:         text('peso_variavel', { enum: ['SIM', 'PESO', 'NAO', 'UNITARIO', 'PENDENTE'] }),
  precoVariavel:        integer('preco_variavel', { mode: 'boolean' }),
  enviaBalanca:         integer('envia_balanca', { mode: 'boolean' }),
  ativoNoEcommerce:     integer('ativo_no_ecommerce', { mode: 'boolean' }),
  validadeMinima:       integer('validade_minima'),
  percentualPerda:      real('percentual_perda'),
  tipoDeImpressaoId:    integer('tipo_de_impressao_id'),
  descontoMaximo1:      real('desconto_maximo_1'),
  funcionarioId:        integer('funcionario_id'),

  // ── Datas ────────────────────────────────────────────────────────────────
  dataInclusao:  text('data_inclusao'),
  dataSaida:     text('data_saida'),
  dataAlteracao: text('data_alteracao'),

  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
}, (t) => ({
  idxSecao:        index('idx_produtos_secao_id').on(t.secaoId),
  idxGrupo:        index('idx_produtos_grupo_id').on(t.grupoId),
  idxSubgrupo:     index('idx_produtos_subgrupo_id').on(t.subgrupoId),
  idxMarca:        index('idx_produtos_marca_id').on(t.marcaId),
  idxNcm:          index('idx_produtos_ncm_id').on(t.ncmId),
  idxDataAlteracao: index('idx_produtos_data_alteracao').on(t.dataAlteracao),
}));

export type Produto    = typeof produtos.$inferSelect;
export type NewProduto = typeof produtos.$inferInsert;