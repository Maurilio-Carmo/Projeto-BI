// backend/src/database/schema/cupom.ts
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
 * Tabela de Cupons Fiscais (NFC-e / ECF)
 * Campos mapeados diretamente da API: GET /v1/venda/cupons-fiscais
 * Objeto: CupomFiscal
 */
export const cupom = mysqlTable(
  'cupom',
  {
    id: int('id').autoincrement().primaryKey(),

    // `identificadorId` — identificador sequencial único do cupom fiscal na API
    external_id: bigint('external_id', { mode: 'number' }).notNull().unique(),

    // Identificação do cupom
    /** `id` — Identificador único (string UUID ou interno) */
    id_externo: varchar('id_externo', { length: 36 }),
    /** `coo` — Código sequencial que identifica o cupom impresso pela ECF */
    coo: int('coo'),
    /** `sequencial` — Sequencial da venda */
    sequencial: varchar('sequencial', { length: 20 }),
    /** `numeroCaixa` — Número do caixa */
    numero_caixa: varchar('numero_caixa', { length: 3 }),
    /** `numeroEquipamento` — Número do equipamento */
    numero_equipamento: varchar('numero_equipamento', { length: 50 }),
    /** `serieEquipamento` — Série do equipamento */
    serie_equipamento: varchar('serie_equipamento', { length: 50 }),
    /** `sequencialOperador` — Sequencial do operador */
    sequencial_operador: varchar('sequencial_operador', { length: 20 }),
    /** `codigoImpressora` — Código da impressora */
    codigo_impressora: varchar('codigo_impressora', { length: 20 }),
    /** `contadorDocumento` — Contador do documento */
    contador_documento: varchar('contador_documento', { length: 20 }),
    /** `chaveEletronica` — Chave eletrônica */
    chave_eletronica: varchar('chave_eletronica', { length: 50 }).unique(),
    /** `numeroDoProtocolo` — Número do protocolo de autorização */
    numero_do_protocolo: varchar('numero_do_protocolo', { length: 50 }),
    /** `statusXMLNota` — Status do XML da nota */
    status_xml_nota: mysqlEnum('status_xml_nota', [
      'PENDENTE', 'AUTORIZADA', 'PENDENTE_CANCELAMENTO', 'CANCELADA', 'ERRO', 'REJEITADA',
    ]),

    // Datas e horas
    /** `data` — Data da venda */
    data: date('data').notNull(),
    /** `dataVenda` — Data da venda (campo extra) */
    data_venda: date('data_venda'),
    /** `hora` — Hora da venda */
    hora: varchar('hora', { length: 8 }),
    /** `dataHoraAberturaCupom` */
    data_hora_abertura_cupom: varchar('data_hora_abertura_cupom', { length: 30 }),
    /** `dataHoraFechamentoCupom` */
    data_hora_fechamento_cupom: varchar('data_hora_fechamento_cupom', { length: 30 }),
    /** `criadoEm` — Data de criação */
    criado_em: date('criado_em'),

    // Consumidor
    /** `nomeConsumidor` */
    nome_consumidor: varchar('nome_consumidor', { length: 200 }),
    /** `cpfConsumidor` */
    cpf_consumidor: varchar('cpf_consumidor', { length: 14 }),

    // Valores financeiros
    /** `valor` — Valor da venda */
    valor: decimal('valor', { precision: 15, scale: 4 }).notNull(),
    /** `acrescimo` */
    acrescimo: decimal('acrescimo', { precision: 15, scale: 4 }),
    /** `desconto` */
    desconto: decimal('desconto', { precision: 15, scale: 4 }),
    /** `valorDescontoFidelidade` */
    valor_desconto_fidelidade: decimal('valor_desconto_fidelidade', { precision: 15, scale: 4 }),
    /** `valorServico` */
    valor_servico: decimal('valor_servico', { precision: 15, scale: 4 }),
    /** `valorItensCancelados` */
    valor_itens_cancelados: decimal('valor_itens_cancelados', { precision: 15, scale: 4 }),
    /** `margemDesconto` */
    margem_desconto: decimal('margem_desconto', { precision: 10, scale: 4 }),

    // Quantidades
    /** `qtdItensCupom` */
    qtd_itens_cupom: decimal('qtd_itens_cupom', { precision: 10, scale: 4 }),
    /** `qtdItensCancelados` */
    qtd_itens_cancelados: decimal('qtd_itens_cancelados', { precision: 10, scale: 4 }),
    /** `qtdUnidadesCupom` */
    qtd_unidades_cupom: decimal('qtd_unidades_cupom', { precision: 10, scale: 4 }),
    /** `qtdUnidadesCanceladas` */
    qtd_unidades_canceladas: decimal('qtd_unidades_canceladas', { precision: 10, scale: 4 }),

    // Status / flags
    /** `cancelada` */
    cancelada: boolean('cancelada'),
    /** `imprimiuNotaFiscal` */
    imprimiu_nota_fiscal: boolean('imprimiu_nota_fiscal'),
    /** `temItensVendidoEmOferta` */
    tem_itens_vendido_em_oferta: boolean('tem_itens_vendido_em_oferta'),
    /** `abonoServico` */
    abono_servico: boolean('abono_servico'),

    // Cancelamento
    /** `justificativaCancelamento` */
    justificativa_cancelamento: text('justificativa_cancelamento'),
    /** `sequencialCupomCancelado` */
    sequencial_cupom_cancelado: varchar('sequencial_cupom_cancelado', { length: 20 }),
    /** `codigoMotivoCancelamentoId` */
    codigo_motivo_cancelamento_id: bigint('codigo_motivo_cancelamento_id', { mode: 'number' }),

    // Desconto
    /** `justificativaDesconto` */
    justificativa_desconto: text('justificativa_desconto'),
    /** `codigoMotivoDescontoId` */
    codigo_motivo_desconto_id: bigint('codigo_motivo_desconto_id', { mode: 'number' }),
    /** `codigoMotivoDescontoFidelidadeId` */
    codigo_motivo_desconto_fidelidade_id: bigint('codigo_motivo_desconto_fidelidade_id', { mode: 'number' }),

    // Intermediador
    /** `tipoIntermediador` */
    tipo_intermediador: varchar('tipo_intermediador', { length: 20 }),
    /** `cnpjDoIntermediador` */
    cnpj_do_intermediador: varchar('cnpj_do_intermediador', { length: 20 }),
    /** `nomeDoIntermediador` */
    nome_do_intermediador: varchar('nome_do_intermediador', { length: 200 }),
    /** `indicadorDePresenca` */
    indicador_de_presenca: varchar('indicador_de_presenca', { length: 10 }),

    // Fidelidade
    /** `cartaoFidelidade` */
    cartao_fidelidade: varchar('cartao_fidelidade', { length: 50 }),

    // Relacionamentos
    /** `lojaId` */
    loja_id: bigint('loja_id', { mode: 'number' }),
    /** `clienteId` */
    cliente_id: bigint('cliente_id', { mode: 'number' }),
    /** `funcionarioId` */
    funcionario_id: int('funcionario_id'),
    /** `autorizadorId` */
    autorizador_id: int('autorizador_id'),
    /** `notaFiscalId` — se gerou NF-e */
    nota_fiscal_id: bigint('nota_fiscal_id', { mode: 'number' }),
    /** `pedidoVendaId` */
    pedido_venda_id: bigint('pedido_venda_id', { mode: 'number' }),

    // Preço
    /** `tipoPreco` */
    tipo_preco: varchar('tipo_preco', { length: 20 }),
    /** `transacaoVendaEnvelope` */
    transacao_venda_envelope: text('transacao_venda_envelope'),

    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    externalIdIdx: index('idx_cupom_external_id').on(table.external_id),
    dataIdx: index('idx_cupom_data').on(table.data),
    lojaIdx: index('idx_cupom_loja_id').on(table.loja_id),
    chaveIdx: index('idx_cupom_chave').on(table.chave_eletronica),
    canceladaIdx: index('idx_cupom_cancelada').on(table.cancelada),
  }),
);

export type Cupom = typeof cupom.$inferSelect;
export type NewCupom = typeof cupom.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tabela de Itens dos Cupons Fiscais
 * Campos mapeados de ItemVenda na API: /v1/venda/cupons-fiscais → itensVenda
 */
export const cupomItem = mysqlTable(
  'cupom_item',
  {
    id: int('id').autoincrement().primaryKey(),

    /** FK para cupom (external_id do cupom) */
    cupom_external_id: bigint('cupom_external_id', { mode: 'number' }).notNull(),

    /** `id` — Identificador do item de venda */
    external_item_id: int('external_item_id'),

    // Produto
    /** `produtoId` */
    produto_id: bigint('produto_id', { mode: 'number' }),
    /** `ncm` */
    ncm: varchar('ncm', { length: 8 }),
    /** `csosn` */
    csosn: varchar('csosn', { length: 10 }),
    /** `cfop` */
    cfop: varchar('cfop', { length: 10 }),
    /** `codigoAuxiliarId` */
    codigo_auxiliar_id: varchar('codigo_auxiliar_id', { length: 50 }),
    /** `serieProduto` */
    serie_produto: varchar('serie_produto', { length: 20 }),
    /** `natureza` — Natureza dos itens da venda */
    natureza: varchar('natureza', { length: 10 }),

    // Tipo e status do item
    /** `tipo` — 1=Item Vendido, 2=Item Cancelado */
    tipo: varchar('tipo', { length: 5 }),
    /** `tabelaA` — Tipo do item da venda */
    tabela_a: varchar('tabela_a', { length: 10 }),
    /** `tabelaB` — Percentual de desconto */
    tabela_b: varchar('tabela_b', { length: 10 }),
    /** `tipoPreco` */
    tipo_preco: varchar('tipo_preco', { length: 20 }),

    // Quantidades e valores
    /** `quantidadeVenda` */
    quantidade_venda: decimal('quantidade_venda', { precision: 15, scale: 4 }),
    /** `valorUnidade` — Valor unitário */
    valor_unidade: decimal('valor_unidade', { precision: 15, scale: 4 }),
    /** `precoVenda` */
    preco_venda: decimal('preco_venda', { precision: 15, scale: 4 }),
    /** `precoCusto` */
    preco_custo: decimal('preco_custo', { precision: 15, scale: 4 }),
    /** `precoCustoFiscal` */
    preco_custo_fiscal: decimal('preco_custo_fiscal', { precision: 15, scale: 4 }),
    /** `precoCustoMedio` */
    preco_custo_medio: decimal('preco_custo_medio', { precision: 15, scale: 4 }),
    /** `valorTotal` — Valor total da venda do item */
    valor_total: decimal('valor_total', { precision: 15, scale: 4 }),
    /** `valorServico` */
    valor_servico: decimal('valor_servico', { precision: 15, scale: 4 }),

    // Desconto
    /** `valorDesconto` */
    valor_desconto: decimal('valor_desconto', { precision: 15, scale: 4 }),
    /** `tipoDeDescontoAplicado` */
    tipo_de_desconto_aplicado: varchar('tipo_de_desconto_aplicado', { length: 20 }),
    /** `valorDoDescontoMegaCaixa` */
    valor_do_desconto_mega_caixa: decimal('valor_do_desconto_mega_caixa', { precision: 15, scale: 4 }),

    // Acréscimo
    /** `valorAcrescimo` */
    valor_acrescimo: decimal('valor_acrescimo', { precision: 15, scale: 4 }),

    // Taxa e entrega
    /** `taxaEntrega` */
    taxa_entrega: boolean('taxa_entrega'),

    // ICMS
    /** `tributacao` */
    tributacao: varchar('tributacao', { length: 10 }),
    /** `tributacaoAliquota` */
    tributacao_aliquota: decimal('tributacao_aliquota', { precision: 10, scale: 4 }),
    /** `tributacaoValorReducao` */
    tributacao_valor_reducao: decimal('tributacao_valor_reducao', { precision: 15, scale: 4 }),
    /** `tributacaoAliquotaFecop` */
    tributacao_aliquota_fecop: decimal('tributacao_aliquota_fecop', { precision: 10, scale: 4 }),
    /** `tributacaoSimbologia` */
    tributacao_simbologia: varchar('tributacao_simbologia', { length: 10 }),
    /** `valorFecop` */
    valor_fecop: decimal('valor_fecop', { precision: 15, scale: 4 }),

    // PIS / COFINS
    /** `aliquotaPIS` */
    aliquota_pis: decimal('aliquota_pis', { precision: 10, scale: 4 }),
    /** `cstPIS` */
    cst_pis: varchar('cst_pis', { length: 5 }),
    /** `aliquotaCOFINS` */
    aliquota_cofins: decimal('aliquota_cofins', { precision: 10, scale: 4 }),
    /** `cstCOFINS` */
    cst_cofins: varchar('cst_cofins', { length: 5 }),

    // Bonificação
    /** `tipoBonificacao` */
    tipo_bonificacao: varchar('tipo_bonificacao', { length: 20 }),
    /** `fatorBonificacao` */
    fator_bonificacao: decimal('fator_bonificacao', { precision: 10, scale: 4 }),

    // Relacionamentos
    /** `localVendaId` */
    local_venda_id: bigint('local_venda_id', { mode: 'number' }),
    /** `funcionarioVendedorId` */
    funcionario_vendedor_id: int('funcionario_vendedor_id'),
    /** `funcionarioAutorizadorId` */
    funcionario_autorizador_id: int('funcionario_autorizador_id'),
    /** `funcionarioCaptacaoPrevendaId` */
    funcionario_captacao_prevenda_id: varchar('funcionario_captacao_prevenda_id', { length: 50 }),
    /** `funcionarioProducaoId` */
    funcionario_producao_id: varchar('funcionario_producao_id', { length: 50 }),
    /** `setorDeProducaoId` */
    setor_de_producao_id: int('setor_de_producao_id'),

    // Flags
    /** `participouPromocaoDesconto` */
    participou_promocao_desconto: boolean('participou_promocao_desconto'),
    /** `foiVendidoEmOferta` */
    foi_vendido_em_oferta: boolean('foi_vendido_em_oferta'),

    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    cupomExternalIdx: index('idx_ci_cupom_external_id').on(table.cupom_external_id),
    produtoIdx: index('idx_ci_produto_id').on(table.produto_id),
  }),
);

export type CupomItem = typeof cupomItem.$inferSelect;
export type NewCupomItem = typeof cupomItem.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tabela de Finalizações dos Cupons Fiscais
 * Campos mapeados de Finalizacao na API: /v1/venda/cupons-fiscais → finalizacoes
 * Representa as formas de pagamento utilizadas no cupom.
 */
export const cupomFinalizacao = mysqlTable(
  'cupom_finalizacao',
  {
    id: int('id').autoincrement().primaryKey(),

    /** FK para cupom (external_id do cupom) */
    cupom_external_id: bigint('cupom_external_id', { mode: 'number' }).notNull(),

    /** `id` — Identificador único da finalização */
    external_finalizacao_id: int('external_finalizacao_id'),

    /** `finalizadoraId` — Identificador único da finalizadora */
    finalizadora_id: int('finalizadora_id'),

    /** `sequencial` — Sequencial da finalização (max 3 chars) */
    sequencial: varchar('sequencial', { length: 3 }),

    /** `tipo` — Tipo de finalização (ex: DINHEIRO, CARTAO, CHEQUE…) */
    tipo: varchar('tipo', { length: 30 }),

    /** `especializacao` — Especialização da finalização */
    especializacao: varchar('especializacao', { length: 50 }),

    /** `modalidade` — Modalidade da finalização */
    modalidade: varchar('modalidade', { length: 50 }),

    /** `valor` — Valor da finalização */
    valor: decimal('valor', { precision: 15, scale: 4 }).notNull(),

    // Troco
    /** `troco` */
    troco: decimal('troco', { precision: 15, scale: 4 }),
    /** `tipoTroco` — T ou C */
    tipo_troco: varchar('tipo_troco', { length: 1 }),
    /** `trocoDoacao` */
    troco_doacao: decimal('troco_doacao', { precision: 15, scale: 4 }),

    // Cartão
    /** `bandeira` */
    bandeira: varchar('bandeira', { length: 50 }),
    /** `numeroCartao` */
    numero_cartao: varchar('numero_cartao', { length: 30 }),
    /** `numeroBinCartao` */
    numero_bin_cartao: varchar('numero_bin_cartao', { length: 10 }),
    /** `nsu` */
    nsu: varchar('nsu', { length: 30 }),
    /** `nsuAutorizacao` */
    nsu_autorizacao: varchar('nsu_autorizacao', { length: 30 }),
    /** `nsuDoCancelamento` */
    nsu_do_cancelamento: varchar('nsu_do_cancelamento', { length: 30 }),
    /** `autorizacaoCartao` */
    autorizacao_cartao: varchar('autorizacao_cartao', { length: 30 }),
    /** `redeAdquirente` */
    rede_adquirente: varchar('rede_adquirente', { length: 50 }),

    // TEF / POS
    /** `localTef` — POS, TEF, DISCADA */
    local_tef: varchar('local_tef', { length: 10 }),

    // Parcelamento
    /** `quantidadeParcelas` */
    quantidade_parcelas: varchar('quantidade_parcelas', { length: 5 }),
    /** `codigoPlano` */
    codigo_plano: varchar('codigo_plano', { length: 20 }),
    /** `planoReducao` */
    plano_reducao: varchar('plano_reducao', { length: 20 }),
    /** `jurosPlano` */
    juros_plano: decimal('juros_plano', { precision: 10, scale: 4 }),
    /** `solicitaPlano` — S ou N */
    solicita_plano: varchar('solicita_plano', { length: 1 }),

    // Cheque
    /** `emitenteCheque` */
    emitente_cheque: varchar('emitente_cheque', { length: 100 }),
    /** `leituraCmc7` */
    leitura_cmc7: varchar('leitura_cmc7', { length: 50 }),
    /** `dataVencimento` */
    data_vencimento: date('data_vencimento'),

    // Vale compra / crédito
    /** `numeroValeCompra` */
    numero_vale_compra: varchar('numero_vale_compra', { length: 50 }),
    /** `descontoMoeda` */
    desconto_moeda: decimal('desconto_moeda', { precision: 15, scale: 4 }),

    // Outros
    /** `codigoOrigem` */
    codigo_origem: varchar('codigo_origem', { length: 20 }),
    /** `codigoAgente` */
    codigo_agente: varchar('codigo_agente', { length: 20 }),
    /** `sangriaDetalhada` */
    sangria_detalhada: varchar('sangria_detalhada', { length: 50 }),

    // Flags de crédito
    /** `verificaLimiteCredito` */
    verifica_limite_credito: varchar('verifica_limite_credito', { length: 1 }),
    /** `atualizaLimiteCredito` */
    atualiza_limite_credito: varchar('atualiza_limite_credito', { length: 1 }),

    // Fidelidade / contas
    /** `geraFidelidade` — S ou N */
    gera_fidelidade: varchar('gera_fidelidade', { length: 1 }),
    /** `geraContaReceber` — S ou N */
    gera_conta_receber: varchar('gera_conta_receber', { length: 1 }),

    // Texto livre (impressão no cupom)
    texto_livre1: varchar('texto_livre1', { length: 200 }),
    texto_livre2: varchar('texto_livre2', { length: 200 }),
    texto_livre3: varchar('texto_livre3', { length: 200 }),
    texto_livre4: varchar('texto_livre4', { length: 200 }),

    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    cupomExternalIdx: index('idx_cf_cupom_external_id').on(table.cupom_external_id),
    finalizadoraIdx: index('idx_cf_finalizadora_id').on(table.finalizadora_id),
    tipoIdx: index('idx_cf_tipo').on(table.tipo),
  }),
);

export type CupomFinalizacao = typeof cupomFinalizacao.$inferSelect;
export type NewCupomFinalizacao = typeof cupomFinalizacao.$inferInsert;
