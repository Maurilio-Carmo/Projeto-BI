import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS — /v1/produto/produtos
// Tabela principal. Sub-tabelas com FK referenciando esta:
//   • product_impostos_federais
//   • product_estoque
//   • product_componentes
//   • product_pautas
//   • product_regimes
//   • product_codigos_auxiliares
//   • product_precos
//   • product_custos
//   • product_fornecedores
// ─────────────────────────────────────────────────────────────────────────────

export const products = sqliteTable(
  'products',
  {
    // ── Chave local ──────────────────────────────────────────────────────────
    id: integer('id').primaryKey({ autoIncrement: true }),

    // ── Chave externa (API) ──────────────────────────────────────────────────
    externalId: integer('external_id').notNull().unique(),

    // ── Identificação ────────────────────────────────────────────────────────
    descricao:         text('descricao').notNull(),
    descricaoReduzida: text('descricao_reduzida').notNull(),
    codigoInterno:     text('codigo_interno'),
    modelo:            text('modelo'),
    imagem:            text('imagem'),
    endereco:          text('endereco'), // localização no depósito

    // ── Classificação ────────────────────────────────────────────────────────
    secaoId:    integer('secao_id'),
    grupoId:    integer('grupo_id'),
    subgrupoId: integer('subgrupo_id'),
    marcaId:    integer('marca_id'),
    familiaId:  integer('familia_id'),
    generoId:   integer('genero_id'),
    naturezaId: text('natureza_id'),

    // ── Composição ───────────────────────────────────────────────────────────
    composicao: text('composicao', {
      enum: ['NORMAL', 'COMPOSTO', 'KIT', 'RENDIMENTO'],
    }).notNull(),
    associacao: text('associacao', { enum: ['NORMAL'] }),

    // ── Unidades ─────────────────────────────────────────────────────────────
    unidadeDeVenda:        text('unidade_de_venda').notNull(),
    unidadeDeCompra:       text('unidade_de_compra').notNull(),
    unidadeDeTransferencia: text('unidade_de_transferencia'),
    unidadeDeReferencia:   text('unidade_de_referencia'),

    // ── Fatores / embalagem ───────────────────────────────────────────────────
    itensEmbalagem:              real('itens_embalagem').notNull(),
    itensEmbalagemVenda:         real('itens_embalagem_venda'),
    itensEmbalagemTransferencia: real('itens_embalagem_transferencia'),
    fatorRendimentoUnidade:      real('fator_rendimento_unidade').notNull(),
    fatorRendimentoCusto:        real('fator_rendimento_custo').notNull(),
    fatorBonificacao:            real('fator_bonificacao'),
    quantidadeComposto:          real('quantidade_composto'),
    medidaReferencial:           real('medida_referencial'),
    quantidadeEtiqueta:          integer('quantidade_etiqueta'),
    qtdMaximaVenda:              real('qtd_maxima_venda'),

    // ── Dimensões / peso ─────────────────────────────────────────────────────
    pesoLiquido: real('peso_liquido'),
    pesoBruto:   real('peso_bruto'),
    largura:     text('largura'),
    altura:      text('altura'),
    comprimento: text('comprimento'),

    // ── Fiscal ───────────────────────────────────────────────────────────────
    ncmId:                    text('ncm_id'),
    cest:                     integer('cest'),
    nomeclaturaMercosulId:    text('nomeclatura_mercosul_id').notNull(),
    nomeclaturaMercosulExcecaoId: text('nomeclatura_mercosul_excecao_id'),
    situacaoFiscalId:         integer('situacao_fiscal_id').notNull(),
    situacaoFiscalSaidaId:    integer('situacao_fiscal_saida_id'),
    tributacaoId:             text('tributacao_id'),
    naturezaDeImpostoFederalId: integer('natureza_de_imposto_federal_id').notNull(),

    tabelaA: text('tabela_a', {
      enum: [
        'NACIONAL',
        'IMPORTACAO_DIRETA',
        'ADQUIRIDO_DO_MERCADO_INTERNO',
        'MERCADORIA_CONTENDO_IMPORTACAO_SUPERIOR_40',
        'CUJO_PRODUCAO_TENHA_SIDO_FEITO',
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
    compoeTotalDaNota: integer('compoe_total_da_nota', { mode: 'boolean' }),
    incentivoZonaFranca: text('incentivo_zona_franca'),

    // ── Estoque / controles ──────────────────────────────────────────────────
    controlaEstoque:     integer('controla_estoque', { mode: 'boolean' }),
    controlaValidade:    integer('controla_validade', { mode: 'boolean' }),
    controlaNumeroSerie: integer('controla_numero_serie', { mode: 'boolean' }),
    diasDeSeguranca:     integer('dias_de_seguranca'),
    validadeMinima:      integer('validade_minima'),
    validade:            text('validade'),
    enviaBalanca:        integer('envia_balanca', { mode: 'boolean' }),

    // ── Venda ────────────────────────────────────────────────────────────────
    frenteLoja:        integer('frente_loja', { mode: 'boolean' }),
    ativoNoEcommerce:  integer('ativo_no_ecommerce', { mode: 'boolean' }),
    permiteDesconto:   integer('permite_desconto', { mode: 'boolean' }),
    descontoMaximo1:   real('desconto_maximo_1'),
    descontoMaximo2:   real('desconto_maximo_2'),
    descontoMaximo3:   real('desconto_maximo_3'),
    precoVariavel:     integer('preco_variavel', { mode: 'boolean' }),
    descricaoVariavel: integer('descricao_variavel', { mode: 'boolean' }),

    pesoVariavel: text('peso_variavel', {
      enum: ['SIM', 'PESO', 'NAO', 'UNITARIO', 'PENDENTE'],
    }).notNull(),

    tipoFatorKit: text('tipo_fator_kit', { enum: ['PRECO', 'FATOR'] }),

    // ── Comissão / bonificação ────────────────────────────────────────────────
    pagaComissao:       integer('paga_comissao', { mode: 'boolean' }),
    comissaoVenda:      real('comissao_venda'),
    comissaoProducao:   real('comissao_producao'),
    comissaoCapitacao:  real('comissao_capitacao'),
    tipoBonificacao:    text('tipo_bonificacao', {
      enum: ['NAO_GERA_PONTOS', 'GERA_PONTOS_POR_PRECO', 'GERA_PONTOS_POR_QUANTIDADE'],
    }),

    // ── Relacionamentos ───────────────────────────────────────────────────────
    fornecedorId:    integer('fornecedor_id'),
    funcionarioId:   integer('funcionario_id'),
    produtoDestinoId: integer('produto_destino_id'),
    localDeImpressaoId: integer('local_de_impressao_id'),

    // ── Custo ────────────────────────────────────────────────────────────────
    custoMedio: real('custo_medio'),

    // ── Finalidade / produção ────────────────────────────────────────────────
    finalidadeProduto: text('finalidade_produto', {
      enum: ['COMERCIALIZACAO', 'CONSUMO', 'IMOBILIZADO', 'INDUSTRIALIZADO', 'MATERIA_PRIMA', 'OUTROS'],
    }),
    producao: text('producao', { enum: ['PROPRIO', 'TERCEIROS'] }),

    // ── Flags diversas ───────────────────────────────────────────────────────
    baixaNaVendaComposto: integer('baixa_na_venda_composto', { mode: 'boolean' }),
    participaCotacao:     integer('participa_cotacao', { mode: 'boolean' }),
    atualizaFamilia:      integer('atualiza_familia', { mode: 'boolean' }),
    foraDeLinha:          text('fora_de_linha'),
    mix:                  text('mix'),
    textoDaReceita:       text('texto_da_receita'),
    observacao:           text('observacao'),
    identificadorDeOrigem: text('identificador_de_origem'),

    // ── Datas ────────────────────────────────────────────────────────────────
    dataInclusao:  text('data_inclusao'),
    dataSaida:     text('data_saida'),
    dataAlteracao: text('data_alteracao'),

    // ── Controle interno ─────────────────────────────────────────────────────
    percentualPerda:      real('percentual_perda'),
    tipoDeImpressaoId:    integer('tipo_de_impressao_id'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId:  index('idx_products_external_id').on(t.externalId),
    idxSecao:       index('idx_products_secao_id').on(t.secaoId),
    idxGrupo:       index('idx_products_grupo_id').on(t.grupoId),
    idxSubgrupo:    index('idx_products_subgrupo_id').on(t.subgrupoId),
    idxMarca:       index('idx_products_marca_id').on(t.marcaId),
    idxNcm:         index('idx_products_ncm_id').on(t.ncmId),
    idxFornecedor:  index('idx_products_fornecedor_id').on(t.fornecedorId),
    idxDataAlteracao: index('idx_products_data_alteracao').on(t.dataAlteracao),
  }),
);

export type Product    = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
