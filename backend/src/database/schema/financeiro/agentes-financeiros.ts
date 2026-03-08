import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// AGENTES_FINANCEIROS — /v1/pessoa/agentes-financeiros
// Entidades bancárias e financeiras utilizadas nas contas correntes.
// Possui um endereço único (não array), portanto embutido na própria tabela.
// ─────────────────────────────────────────────────────────────────────────────

export const agentesFinanceiros = sqliteTable(
  'agentes_financeiros',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    // ── Identificação ────────────────────────────────────────────────────────
    nome:                 text('nome'),
    fantasia:             text('fantasia'),
    numeroDoDocumento:    text('numero_do_documento'),
    numeroDeIdentificacao: text('numero_de_identificacao'),
    inscricaoMunicipal:   text('inscricao_municipal'),
    codigoDoBanco:        text('codigo_do_banco'),
    holdingId:            integer('holding_id'),

    tipo: text('tipo', { enum: ['FISICA', 'JURIDICA', 'ESTRANGEIRO'] }),

    tipoContribuinte: text('tipo_contribuinte', {
      enum: ['CONTRIBUINTE', 'NAO_CONTRIBUINTE', 'ISENTO'],
    }),

    // ── Contato ──────────────────────────────────────────────────────────────
    email:     text('email'),
    telefone1: text('telefone_1'),
    telefone2: text('telefone_2'),
    fax:       text('fax'),
    homePage:  text('home_page'),
    twitter:   text('twitter'),
    comunicadorDeMensagensInstantaneas: text('comunicador_de_mensagens_instantaneas'),

    // ── Fiscal ───────────────────────────────────────────────────────────────
    cei:            text('cei'),
    suframa:        text('suframa'),
    orgaoExpedidor: text('orgao_expedidor'),

    // ── Endereço (único) ─────────────────────────────────────────────────────
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

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_agentes_fin_external_id').on(t.externalId),
    idxNome:       index('idx_agentes_fin_nome').on(t.nome),
    idxBanco:      index('idx_agentes_fin_banco').on(t.codigoDoBanco),
  }),
);

export type AgenteFinanceiro    = typeof agentesFinanceiros.$inferSelect;
export type NewAgenteFinanceiro = typeof agentesFinanceiros.$inferInsert;
