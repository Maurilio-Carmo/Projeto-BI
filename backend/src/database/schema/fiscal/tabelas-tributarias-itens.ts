import { sqliteTable, integer, real, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { tabelasTributarias } from '../tabelas-tributarias';

// ─────────────────────────────────────────────────────────────────────────────
// TABELAS_TRIBUTARIAS_ITENS
// Array `itens` — regras de tributação ICMS por UF e classificação de pessoa.
// ─────────────────────────────────────────────────────────────────────────────

const CSOSN_ENUM = [
  'TRIBUTACAO_COM_PERMISSAO_DE_CREDITO_101',
  'TRIBUTACAO_SEM_PERMISSAO_DE_CREDITO_102',
  'ISENCAO_DO_ICSM_PARA_FAIXA_DE_RECEITA_BRUTA',
  'TRIBUTACAO_COM_PERMISSAO_DE_CREDITO_201',
  'TRIBUTACAO_SEM_PERMISSAO_DE_CREDITO_202',
  'ISENCAO_DO_ICMS',
  'IMUNE',
  'NAO_TRIBUTADO',
  'ICMS_COBRADO_ANTERIORMENTE_POR_SUBSTITUICAO_TRIBUTARIA',
  'OUTROS',
] as const;

export const tabelasTributariasItens = sqliteTable(
  'tabelas_tributarias_itens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    tabelaTributariaId: integer('tabela_tributaria_id')
      .notNull()
      .references(() => tabelasTributarias.id, { onDelete: 'cascade' }),

    uf: text('uf').notNull(),

    // ── Tributação geral ─────────────────────────────────────────────────────
    tributacao:      text('tributacao'),
    aliquota:        real('aliquota'),
    aliquotaInterna: real('aliquota_interna'),
    tributadoNF:     real('tributado_nf').notNull(),
    isentoNF:        real('isento_nf').notNull(),
    outrosNF:        real('outros_nf').notNull(),
    tributadoICMS:   real('tributado_icms'),
    cargaLiquida:    real('carga_liquida'),

    // ── ST ───────────────────────────────────────────────────────────────────
    stDestacado:              integer('st_destacado',               { mode: 'boolean' }),
    somaIPINaBaseDeCalculo:   integer('soma_ipi_na_base_de_calculo',{ mode: 'boolean' }),
    somaIPINaBaseDeCalculoST: integer('soma_ipi_na_base_de_calculo_st', { mode: 'boolean' }),
    agregado:                 real('agregado'),

    // ── ICMS especial ────────────────────────────────────────────────────────
    icmsDesonerado:       integer('icms_desonerado', { mode: 'boolean' }),
    icmsOrigem:           real('icms_origem'),
    icmsEfetivo:          integer('icms_efetivo', { mode: 'boolean' }),
    reducaoOrigem:        real('reducao_origem'),
    codigoBeneficioFiscal: text('codigo_beneficio_fiscal'),

    motivoDesoneracaoICMS: text('motivo_desoneracao_icms', {
      enum: [
        'TAXI', 'DEFICIENTE_FISICO', 'PRODUTOR_AGROPECUARI', 'FROTISTA_OU_LOCADORA',
        'DIPLOMATICO_CONSULAR', 'UTILITARIOS', 'SUFRAMA', 'VENDA_ORGÃO_PUBLICO',
        'OUTROS', 'DEFICIENTE_CONDUTOR', 'DEFICIENTE_NAO_COND', 'FOMENTO_AGRO_PECU',
      ],
    }),

    // ── FECOP ────────────────────────────────────────────────────────────────
    fecop:   real('fecop'),
    fecopST: real('fecop_st'),

    // ── CSOSN ────────────────────────────────────────────────────────────────
    csosn:                text('csosn',                  { enum: CSOSN_ENUM }),
    csosnCupomFiscal:     text('csosn_cupom_fiscal',     { enum: CSOSN_ENUM }),
    csosnDocumentoFiscal: text('csosn_documento_fiscal', { enum: CSOSN_ENUM }),

    // ── CFOPs e CST ──────────────────────────────────────────────────────────
    cfopId:              integer('cfop_id'),
    cfopCuponsFiscaisId: integer('cfop_cupons_fiscais_id'),
    cstId:               integer('cst_id'),

    // ── Classificação pessoa ─────────────────────────────────────────────────
    classificacaoDePessoa: text('classificacao_de_pessoa', {
      enum: [
        'ENTRADA_DE_INDUSTRIA', 'ENTRADA_DE_DISTRIBUIDOR', 'ENTRADA_DE_MICROEMPRESA',
        'ENTRADA_DE_VAREJO', 'ENTRADA_DE_TRANSFERENCIA', 'SAIDA_PARA_CONTRIBUINTE',
        'SAIDA_PARA_NAO_CONTRIBUINTE', 'SAIDA_PARA_TRANSFERENCIA',
      ],
    }),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxTabela: index('idx_tab_trib_item_tabela_id').on(t.tabelaTributariaId),
    idxUf:     index('idx_tab_trib_item_uf').on(t.uf),
  }),
);

export type TabelaTributariaItem    = typeof tabelasTributariasItens.$inferSelect;
export type NewTabelaTributariaItem = typeof tabelasTributariasItens.$inferInsert;
