import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTES — /v1/pessoa/clientes
// Endereços (array) estão em `cliente-enderecos.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const clientes = sqliteTable(
  'clientes',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),

    // ── Identificação ────────────────────────────────────────────────────────
    nome:                 text('nome').notNull(),
    fantasia:             text('fantasia').notNull(),
    numeroDoDocumento:    text('numero_do_documento').notNull(),
    numeroDeIdentificacao: text('numero_de_identificacao'),

    tipoDePessoa: text('tipo_de_pessoa', {
      enum: ['FISICA', 'JURIDICA', 'ESTRANGEIRO'],
    }).notNull(),

    tipoDeCliente: text('tipo_de_cliente', {
      enum: ['TITULAR', 'DEPENDENTE'],
    }).notNull(),

    tipoContribuinte: text('tipo_contribuinte', {
      enum: ['CONTRIBUINTE', 'NAO_CONTRIBUINTE', 'ISENTO'],
    }),

    tipoAliquotasEspecificas: text('tipo_aliquotas_especificas', {
      enum: ['GERAL', 'ATACADO', 'VAREJO', 'SIMPLES'],
    }),

    // ── Contato ──────────────────────────────────────────────────────────────
    email:     text('email'),
    telefone1: text('telefone_1'),
    telefone2: text('telefone_2'),
    fax:       text('fax'),
    homePage:  text('home_page'),
    twitter:   text('twitter'),
    redeSocial: text('rede_social'),
    comunicadorDeMensagensInstantaneas: text('comunicador_de_mensagens_instantaneas'),
    pessoaParaContato: text('pessoa_para_contato'),

    // ── Fiscal ───────────────────────────────────────────────────────────────
    inscricaoMunicipal: text('inscricao_municipal'),
    cei:                text('cei'),
    suframa:            text('suframa'),
    orgaoExpedidor:     text('orgao_expedidor'),
    naturalidade:       text('naturalidade'),

    // ── Dados pessoais ───────────────────────────────────────────────────────
    sexo: text('sexo', { enum: ['MASCULINO', 'FEMININO'] }),

    estadoCivil: text('estado_civil', {
      enum: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'OUTROS'],
    }),

    dataDeNascimento: text('data_de_nascimento'),

    // ── Financeiro / crédito ─────────────────────────────────────────────────
    renda:       real('renda'),
    outraRenda:  real('outra_renda'),
    atividade:   text('atividade'),
    orgaoPublico: text('orgao_publico'),
    comprovanteDeRenda:      text('comprovante_de_renda'),
    comprovanteDeResidencia: text('comprovante_de_residencia'),

    tipoDeResidencia: text('tipo_de_residencia', {
      enum: ['OUTRAS', 'ALUGADA', 'FINANCIADA', 'PROPRIA', 'DE_PARENTE'],
    }),

    tempoDeResidencia:             text('tempo_de_residencia'),
    tempoDeTrabalhoNaEmpresaAtual: text('tempo_de_trabalho_na_empresa_atual'),

    descontoConcedidoAoCliente: real('desconto_concedido_ao_cliente'),
    tipoDePreco:      integer('tipo_de_preco'),
    clienteRetemISS:  text('cliente_retem_iss'),

    tabelaPrazo: text('tabela_prazo', {
      enum: ['DF', 'DD', 'PRZ', 'DFM', 'DFD', 'DFS', 'DFQ'],
    }),

    prazo:          integer('prazo'),
    diaDeFechamento: text('dia_de_fechamento'),

    // ── Status / controle ────────────────────────────────────────────────────
    statusId:           integer('status_id').notNull(),
    lojaId:             integer('loja_id'),
    holdingId:          integer('holding_id').notNull(),
    vendedorId:         integer('vendedor_id'),
    ramoId:             integer('ramo_id'),
    chaveDaRetaguarda:  integer('chave_da_retaguarda'),
    versaoDaRetaguarda: integer('versao_da_retaguarda'),
    versao:             integer('versao'),

    situacaoDaAprovacao: text('situacao_da_aprovacao', {
      enum: ['PENDENTE', 'SIM', 'NAO'],
    }),

    tipoDeBloqueio:    text('tipo_de_bloqueio'),
    dataDeBloqueio:    text('data_de_bloqueio'),
    dataDeCadastro:    text('data_de_cadastro'),
    origemDeAlteracao: text('origem_de_alteracao'),
    senha:             text('senha'),
    observacao:        text('observacao'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxDocumento:   index('idx_clientes_documento').on(t.numeroDoDocumento),
    idxNome:        index('idx_clientes_nome').on(t.nome),
    idxStatus:      index('idx_clientes_status_id').on(t.statusId),
    idxLoja:        index('idx_clientes_loja_id').on(t.lojaId),
    idxDatCadastro: index('idx_clientes_data_cadastro').on(t.dataDeCadastro),
  }),
);

export type Cliente    = typeof clientes.$inferSelect;
export type NewCliente = typeof clientes.$inferInsert;
