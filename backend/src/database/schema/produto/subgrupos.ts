import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// SUBGRUPOS — /v1/produto/secoes/{secaoId}/grupos/{grupoId}/subgrupos
// Terceiro nível da hierarquia. Pertence a grupo × seção.
// ─────────────────────────────────────────────────────────────────────────────

export const subgrupos = sqliteTable(
  'subgrupos',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    externalId: integer('external_id').notNull().unique(), // subgrupoId global

    idNoGrupo:       integer('id_no_grupo').notNull(),     // id relativo ao grupo
    secaoExternalId: integer('secao_external_id').notNull(),
    grupoExternalId: integer('grupo_external_id').notNull(),

    descricao: text('descricao').notNull(),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxExternalId: index('idx_subgrupos_external_id').on(t.externalId),
    idxGrupo:      index('idx_subgrupos_grupo_external_id').on(t.grupoExternalId),
    idxSecao:      index('idx_subgrupos_secao_external_id').on(t.secaoExternalId),
  }),
);

export type Subgrupo    = typeof subgrupos.$inferSelect;
export type NewSubgrupo = typeof subgrupos.$inferInsert;
