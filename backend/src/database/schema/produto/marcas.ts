import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// MARCAS — /v1/produto/marcas
// ─────────────────────────────────────────────────────────────────────────────

export const marcas = sqliteTable(
  'marcas',
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
    idxExternalId: index('idx_marcas_external_id').on(t.externalId),
  }),
);

export type Marca    = typeof marcas.$inferSelect;
export type NewMarca = typeof marcas.$inferInsert;
