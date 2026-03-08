import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// GRUPOS — /v1/produto/secoes/{secaoId}/grupos
// Segundo nível da hierarquia de categorização. Pertence a uma seção.
// ─────────────────────────────────────────────────────────────────────────────

export const grupos = sqliteTable(
  'grupos',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(), // grupoId global

    idNaSecao:       integer('id_na_secao').notNull(),     // id relativo à seção
    secaoExternalId: integer('secao_external_id').notNull(),

    descricao: text('descricao').notNull(),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_grupos_external_id').on(t.externalId),
    idxSecao:      index('idx_grupos_secao_external_id').on(t.secaoExternalId),
  }),
);

export type Grupo    = typeof grupos.$inferSelect;
export type NewGrupo = typeof grupos.$inferInsert;
