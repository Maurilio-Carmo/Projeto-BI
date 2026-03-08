import { sqliteTable, integer, text, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// GRUPOS — /v1/produto/secoes/{secaoId}/grupos
export const grupos = sqliteTable('grupos', {
  secaoId:   integer('secao_id').notNull(),
  grupoId:   integer('grupo_id').notNull(),
  descricao: text('descricao').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
}, (t) => ({
  pk:         primaryKey({ columns: [t.secaoId, t.grupoId] }),
  idxSecaoId: index('idx_grupos_secao_id').on(t.secaoId),
}));

export type Grupo    = typeof grupos.$inferSelect;
export type NewGrupo = typeof grupos.$inferInsert;