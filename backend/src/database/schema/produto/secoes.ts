import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// SECOES — /v1/produto/secoes
// Primeiro nível da hierarquia de categorização de produtos.
// ─────────────────────────────────────────────────────────────────────────────

export const secoes = sqliteTable(
  'secoes',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(),

    descricao: text('descricao').notNull(),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_secoes_external_id').on(t.externalId),
  }),
);

export type Secao    = typeof secoes.$inferSelect;
export type NewSecao = typeof secoes.$inferInsert;
