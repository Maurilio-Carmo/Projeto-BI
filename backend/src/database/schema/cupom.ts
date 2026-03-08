// backend/src/database/schema/cupom.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Conversões (mesmas regras dos outros schemas):
//   mysqlTable/mysqlEnum → sqliteTable / text({ enum: [...] })
//   int/bigint           → integer
//   varchar              → text
//   decimal              → real
//   date / timestamp     → integer({ mode: 'timestamp' })
//   boolean              → integer({ mode: 'boolean' })
//   ON UPDATE removido   → services já passam updated_at: new Date()
//   sql`CURRENT_TIMESTAMP` → sql`(unixepoch())`
// ─────────────────────────────────────────────────────────────────────────────
import {
  sqliteTable,
  integer,
  real,
  text,
  index,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Cupom Fiscal ────────────────────────────────────────────────────────────

export const cupom = sqliteTable(
  'cupom',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    /** `identificadorId` — identificador sequencial único do cupom fiscal na API */
    external_id: integer('external_id').notNull().unique(),

    // Identificação
    id_externo:          text('id_externo'),
    coo:                 integer('coo'),
    sequencial:          text('sequencial'),
    numero_caixa:        text('numero_caixa'),
    numero_equipamento:  text('numero_equipamento'),
    serie_equipamento:   text('serie_equipamento'),
    sequencial_operador: text('sequencial_operador'),
    codigo_impressora:   text('codigo_impressora'),
    contador_documento:  text('contador_documento'),
    chave_eletronica:    text('chave_eletronica').unique(),
    numero_do_protocolo: text('numero_do_protocolo'),

    status_xml_nota: text('status_xml_nota', {
      enum: ['PENDENTE', 'AUTORIZADA', 'PENDENTE_CANCELAMENTO', 'CANCELADA', 'ERRO', 'REJEITADA'],
    }),

    // Datas e horas
    data:                       integer('data',                       { mode: 'timestamp' }).notNull(),
    data_venda:                 integer('data_venda',                 { mode: 'timestamp' }),
    hora:                       text('hora'),
    data_hora_abertura_cupom:   text('data_hora_abertura_cupom'),
    data_hora_fechamento_cupom: text('data_hora_fechamento_cupom'),
    criado_em:                  integer('criado_em',                  { mode: 'timestamp' }),

    // Consumidor
    nome_consumidor: text('nome_consumidor'),
    cpf_consumidor:  text('cpf_consumidor'),

    // Valores financeiros
    valor:                      real('valor').notNull(),
    acrescimo:                  real('acrescimo'),
    desconto:                   real('desconto'),
    valor_desconto_fidelidade:  real('valor_desconto_fidelidade'),
    valor_servico:              real('valor_servico'),
    valor_itens_cancelados:     real('valor_itens_cancelados'),
    margem_desconto:            real('margem_desconto'),

    // Quantidades
    qtd_itens_cupom:       real('qtd_itens_cupom'),
    qtd_itens_cancelados:  real('qtd_itens_cancelados'),
    qtd_unidades_cupom:    real('qtd_unidades_cupom'),
    qtd_unidades_canceladas: real('qtd_unidades_canceladas'),

    // Status / flags
    cancelada:               integer('cancelada',               { mode: 'boolean' }),
    imprimiu_nota_fiscal:    integer('imprimiu_nota_fiscal',    { mode: 'boolean' }),
    tem_itens_vendido_em_oferta: integer('tem_itens_vendido_em_oferta', { mode: 'boolean' }),
    abono_servico:           integer('abono_servico',           { mode: 'boolean' }),

    // Cancelamento
    justificativa_cancelamento:    text('justificativa_cancelamento'),
    sequencial_cupom_cancelado:    text('sequencial_cupom_cancelado'),
    codigo_motivo_cancelamento_id: integer('codigo_motivo_cancelamento_id'),

    // Desconto
    justificativa_desconto:               text('justificativa_desconto'),
    codigo_motivo_desconto_id:            integer('codigo_motivo_desconto_id'),
    codigo_motivo_desconto_fidelidade_id: integer('codigo_motivo_desconto_fidelidade_id'),

    // Intermediador
    tipo_intermediador:    text('tipo_intermediador'),
    cnpj_do_intermediador: text('cnpj_do_intermediador'),
    nome_do_intermediador: text('nome_do_intermediador'),
    indicador_de_presenca: text('indicador_de_presenca'),

    // Fidelidade
    cartao_fidelidade: text('cartao_fidelidade'),

    // Relacionamentos
    loja_id:          integer('loja_id'),
    cliente_id:       integer('cliente_id'),
    funcionario_id:   integer('funcionario_id'),
    autorizador_id:   integer('autorizador_id'),
    nota_fiscal_id:   integer('nota_fiscal_id'),
    pedido_venda_id:  integer('pedido_venda_id'),

    // Preço
    tipo_preco:              text('tipo_preco'),
    transacao_venda_envelope: text('transacao_venda_envelope'),

    created_at: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    updated_at: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    externalIdIdx: index('idx_cupom_external_id').on(table.external_id),
    dataIdx:       index('idx_cupom_data').on(table.data),
    lojaIdx:       index('idx_cupom_loja_id').on(table.loja_id),
    chaveIdx:      index('idx_cupom_chave').on(table.chave_eletronica),
    canceladaIdx:  index('idx_cupom_cancelada').on(table.cancelada),
  }),
);

export type Cupom    = typeof cupom.$inferSelect;
export type NewCupom = typeof cupom.$inferInsert;

// ─── Itens do Cupom Fiscal ───────────────────────────────────────────────────

export const cupomItem = sqliteTable(
  'cupom_item',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cupom_external_id: integer('cupom_external_id').notNull(),
    external_item_id:  integer('external_item_id'),

    // Produto
    produto_id:        integer('produto_id'),
    ncm:               text('ncm'),
    csosn:             text('csosn'),
    cfop:              text('cfop'),
    codigo_auxiliar_id: text('codigo_auxiliar_id'),
    serie_produto:     text('serie_produto'),
    natureza:          text('natureza'),

    // Tipo e status
    tipo:       text('tipo'),
    tabela_a:   text('tabela_a'),
    tabela_b:   text('tabela_b'),
    tipo_preco: text('tipo_preco'),

    // Quantidades e valores
    quantidade_venda:   real('quantidade_venda'),
    valor_unidade:      real('valor_unidade'),
    preco_venda:        real('preco_venda'),
    preco_custo:        real('preco_custo'),
    preco_custo_fiscal: real('preco_custo_fiscal'),
    preco_custo_medio:  real('preco_custo_medio'),
    valor_total:        real('valor_total'),
    valor_servico:      real('valor_servico'),

    // Desconto / acréscimo
    valor_desconto:               real('valor_desconto'),
    tipo_de_desconto_aplicado:    text('tipo_de_desconto_aplicado'),
    valor_do_desconto_mega_caixa: real('valor_do_desconto_mega_caixa'),
    valor_acrescimo:              real('valor_acrescimo'),
    taxa_entrega:                 integer('taxa_entrega', { mode: 'boolean' }),

    // ICMS
    tributacao:                  text('tributacao'),
    tributacao_aliquota:         real('tributacao_aliquota'),
    tributacao_valor_reducao:    real('tributacao_valor_reducao'),
    tributacao_aliquota_fecop:   real('tributacao_aliquota_fecop'),
    tributacao_simbologia:       text('tributacao_simbologia'),
    valor_fecop:                 real('valor_fecop'),

    // PIS / COFINS
    aliquota_pis:   real('aliquota_pis'),
    cst_pis:        text('cst_pis'),
    aliquota_cofins: real('aliquota_cofins'),
    cst_cofins:     text('cst_cofins'),

    // Bonificação
    tipo_bonificacao:  text('tipo_bonificacao'),
    fator_bonificacao: real('fator_bonificacao'),

    // Relacionamentos
    local_venda_id:                   integer('local_venda_id'),
    funcionario_vendedor_id:          integer('funcionario_vendedor_id'),
    funcionario_autorizador_id:       integer('funcionario_autorizador_id'),
    funcionario_captacao_prevenda_id: text('funcionario_captacao_prevenda_id'),
    funcionario_producao_id:          text('funcionario_producao_id'),
    setor_de_producao_id:             integer('setor_de_producao_id'),

    // Flags
    participou_promocao_desconto: integer('participou_promocao_desconto', { mode: 'boolean' }),
    foi_vendido_em_oferta:        integer('foi_vendido_em_oferta',        { mode: 'boolean' }),

    created_at: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    updated_at: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    cupomExternalIdx: index('idx_ci_cupom_external_id').on(table.cupom_external_id),
    produtoIdx:       index('idx_ci_produto_id').on(table.produto_id),
  }),
);

export type CupomItem    = typeof cupomItem.$inferSelect;
export type NewCupomItem = typeof cupomItem.$inferInsert;

// ─── Finalizações do Cupom Fiscal ────────────────────────────────────────────

export const cupomFinalizacao = sqliteTable(
  'cupom_finalizacao',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    cupom_external_id:       integer('cupom_external_id').notNull(),
    external_finalizacao_id: integer('external_finalizacao_id'),
    finalizadora_id:         integer('finalizadora_id'),
    sequencial:              text('sequencial'),
    tipo:                    text('tipo'),
    especializacao:          text('especializacao'),
    modalidade:              text('modalidade'),
    valor:                   real('valor').notNull(),

    // Troco
    troco:      real('troco'),
    tipo_troco: text('tipo_troco'),
    troco_doacao: real('troco_doacao'),

    // Cartão
    bandeira:           text('bandeira'),
    numero_cartao:      text('numero_cartao'),
    numero_bin_cartao:  text('numero_bin_cartao'),
    nsu:                text('nsu'),
    nsu_autorizacao:    text('nsu_autorizacao'),
    nsu_do_cancelamento: text('nsu_do_cancelamento'),
    autorizacao_cartao: text('autorizacao_cartao'),
    rede_adquirente:    text('rede_adquirente'),
    local_tef:          text('local_tef'),

    // Parcelamento
    quantidade_parcelas: text('quantidade_parcelas'),
    codigo_plano:        text('codigo_plano'),
    plano_reducao:       text('plano_reducao'),
    juros_plano:         real('juros_plano'),
    solicita_plano:      text('solicita_plano'),

    // Cheque
    emitente_cheque: text('emitente_cheque'),
    leitura_cmc7:    text('leitura_cmc7'),
    data_vencimento: integer('data_vencimento', { mode: 'timestamp' }),

    // Vale compra / desconto
    numero_vale_compra: text('numero_vale_compra'),
    desconto_moeda:     real('desconto_moeda'),

    // Controle
    codigo_origem:           text('codigo_origem'),
    codigo_agente:           text('codigo_agente'),
    sangria_detalhada:       text('sangria_detalhada'),
    verifica_limite_credito: text('verifica_limite_credito'),
    atualiza_limite_credito: text('atualiza_limite_credito'),

    // Fidelidade / contas
    gera_fidelidade:    text('gera_fidelidade'),
    gera_conta_receber: text('gera_conta_receber'),

    // Texto livre
    texto_livre1: text('texto_livre1'),
    texto_livre2: text('texto_livre2'),
    texto_livre3: text('texto_livre3'),
    texto_livre4: text('texto_livre4'),

    created_at: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),

    updated_at: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    cupomExternalIdx: index('idx_cf_cupom_external_id').on(table.cupom_external_id),
    finalizadoraIdx:  index('idx_cf_finalizadora_id').on(table.finalizadora_id),
    tipoIdx:          index('idx_cf_tipo').on(table.tipo),
  }),
);

export type CupomFinalizacao    = typeof cupomFinalizacao.$inferSelect;
export type NewCupomFinalizacao = typeof cupomFinalizacao.$inferInsert;
