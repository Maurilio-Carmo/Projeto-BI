import { sqliteTable, integer, text, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// SUBGRUPOS — /v1/produto/subgrupos
// ── FK removida intencionalmente ─────────────────────────────────────────────
// A PK de `grupos` é composta (secao_id, grupo_id). O DrizzleORM + SQLite
// não suporta FK composta via .references() inline em colunas individuais.
// A integridade é mantida via código (sync hierárquico) e pelos índices abaixo.
// ─────────────────────────────────────────────────────────────────────────────
export const subgrupos = sqliteTable('subgrupos', {
  secaoId:    integer('secao_id').notNull(),
  grupoId:    integer('grupo_id').notNull(),
  subgrupoId: integer('subgrupo_id').notNull(),
  descricao:  text('descricao').notNull(),
  createdAt:  text('created_at').default(sql`(datetime('now'))`),
  updatedAt:  text('updated_at').default(sql`(datetime('now'))`),
}, (t) => ({
  pk:          primaryKey({ columns: [t.secaoId, t.grupoId, t.subgrupoId] }),
  fkGrupo:     index('idx_subgrupos_secao_grupo').on(t.secaoId, t.grupoId),
  idxSecaoId:  index('idx_subgrupos_secao_id').on(t.secaoId),
}));

export type Subgrupo    = typeof subgrupos.$inferSelect;
export type NewSubgrupo = typeof subgrupos.$inferInsert;
