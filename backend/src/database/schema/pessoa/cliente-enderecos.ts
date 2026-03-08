import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { clientes } from './clientes';

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTE_ENDERECOS
// Array `enderecos` embutido em Cliente — múltiplos endereços por cliente.
// ─────────────────────────────────────────────────────────────────────────────

export const clienteEnderecos = sqliteTable(
  'cliente_enderecos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id, { onDelete: 'cascade' }),

    tipoDeEndereco: text('tipo_de_endereco', {
      enum: ['PRINCIPAL', 'COBRANCA'],
    }),

    logradouro:       text('logradouro').notNull(),
    numero:           text('numero').notNull(),
    complemento:      text('complemento'),
    bairro:           text('bairro').notNull(),
    municipio:        text('municipio'),
    uf:               text('uf').notNull(),
    cep:              text('cep').notNull(),
    codigoIbge:       integer('codigo_ibge').notNull(),
    codigoDoPais:     integer('codigo_do_pais').notNull(),
    pontoDeReferencia: text('ponto_de_referencia'),
    restricoes:       text('restricoes'),
    dataDeSuspensao:  text('data_de_suspensao'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxClienteId: index('idx_cli_end_cliente_id').on(t.clienteId),
    idxUf:        index('idx_cli_end_uf').on(t.uf),
  }),
);

export type ClienteEndereco    = typeof clienteEnderecos.$inferSelect;
export type NewClienteEndereco = typeof clienteEnderecos.$inferInsert;
