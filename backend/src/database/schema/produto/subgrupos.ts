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

    secaoId: integer('secao_id').notNull(),
    grupoId: integer('grupo_id').notNull(),

    descricao: text('descricao').notNull(),

    criadoEm:     text('criado_em'),
    atualizadoEm: text('atualizado_em'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxGrupo:      index('idx_subgrupos_grupo_id').on(t.grupoId),
    idxSecao:      index('idx_subgrupos_secao_id').on(t.secaoId),
  }),
);

export type Subgrupo    = typeof subgrupos.$inferSelect;
export type NewSubgrupo = typeof subgrupos.$inferInsert;
