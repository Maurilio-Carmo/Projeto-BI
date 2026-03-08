import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// FORNECEDORES — /v1/pessoa/fornecedores
// ─────────────────────────────────────────────────────────────────────────────

export const fornecedores = sqliteTable(
  'fornecedores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // ── Identificação ────────────────────────────────────────────────────────
    nome:                 text('nome'),
    fantasia:             text('fantasia'),
    numeroDoDocumento:    text('numero_do_documento'),
    numeroDeIdentificacao: text('numero_de_identificacao'),
    inscricaoEstadual:    text('inscricao_estadual'),
    inscricaoMunicipal:   text('inscricao_municipal'),

    tipoDePessoa: text('tipo_de_pessoa', {
      enum: ['FISICA', 'JURIDICA', 'ESTRANGEIRO'],
    }),

    tipoDeFornecedor: text('tipo_de_fornecedor', {
      enum: ['INDUSTRIA', 'DISTRIBUIDORA', 'SIMPLES_NACIONAL', 'VAREJO', 'OUTROS'],
    }).notNull(),

    tipoContribuinte: text('tipo_contribuinte', {
      enum: ['CONTRIBUINTE', 'NAO_CONTRIBUINTE', 'ISENTO'],
    }),

    tipoAliquotasEspecificas: text('tipo_aliquotas_especificas', {
      enum: ['GERAL', 'ATACADO', 'VAREJO', 'SIMPLES'],
    }),

    // ── Contato ──────────────────────────────────────────────────────────────
    contato:   text('contato'),
    email:     text('email'),
    telefone1: text('telefone_1'),
    telefone2: text('telefone_2'),
    fax:       text('fax'),
    homePage:  text('home_page'),
    twitter:   text('twitter'),
    redeSocial: text('rede_social'),
    comunicadorDeMensagensInstantaneas: text('comunicador_de_mensagens_instantaneas'),

    // ── Fiscal ───────────────────────────────────────────────────────────────
    cei:    text('cei'),
    suframa: text('suframa'),
    orgaoExpedidor: text('orgao_expedidor'),
    regimeEstadualTributarioId: integer('regime_estadual_tributario_id'),
    ehIsentoDePisCofins: integer('eh_isento_de_pis_cofins', { mode: 'boolean' }),

    // ── Logística ────────────────────────────────────────────────────────────
    prazoDeEntrega: integer('prazo_de_entrega'),
    prazo:          integer('prazo'),

    tabelaPrazo: text('tabela_prazo', {
      enum: ['DF', 'PRZ', 'DFM', 'DFD', 'DFS', 'DFQ'],
    }),

    tipoDeFrete: text('tipo_de_frete', {
      enum: [
        'EMITENTE',
        'DESTINATARIO',
        'TERCEIRO',
        'SEM_FRETE',
        'EMITENTE_PROPRIO',
        'DESTINATARIO_PROPRIO',
      ],
    }),

    transportadora: integer('transportadora', { mode: 'boolean' }),
    servico:        integer('servico', { mode: 'boolean' }),
    produtorRural:  integer('produtor_rural', { mode: 'boolean' }),

    // ── Endereço (único por fornecedor) ──────────────────────────────────────
    endLogradouro:      text('end_logradouro'),
    endNumero:          text('end_numero'),
    endComplemento:     text('end_complemento'),
    endBairro:          text('end_bairro'),
    endMunicipio:       text('end_municipio'),
    endUf:              text('end_uf'),
    endCep:             text('end_cep'),
    endCodigoIbge:      integer('end_codigo_ibge'),
    endCodigoDoPais:    integer('end_codigo_do_pais'),
    endPontoDeReferencia: text('end_ponto_de_referencia'),
    endTipoDeEndereco:  text('end_tipo_de_endereco', { enum: ['PRINCIPAL', 'COBRANCA'] }),
    endRestricoes:      text('end_restricoes'),
    endDataDeSuspensao: text('end_data_de_suspensao'),

    // ── Outros ───────────────────────────────────────────────────────────────
    holdingId:   integer('holding_id'),
    observacao:  text('observacao'),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxDocumento:  index('idx_fornecedores_documento').on(t.numeroDoDocumento),
    idxNome:       index('idx_fornecedores_nome').on(t.nome),
    idxTipo:       index('idx_fornecedores_tipo').on(t.tipoDeFornecedor),
  }),
);

export type Fornecedor    = typeof fornecedores.$inferSelect;
export type NewFornecedor = typeof fornecedores.$inferInsert;
