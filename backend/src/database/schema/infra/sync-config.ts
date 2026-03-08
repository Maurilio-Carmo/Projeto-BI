import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY TYPE
// Tipo literal exportado para uso em todo o sistema (sync, logs, scheduler).
// ─────────────────────────────────────────────────────────────────────────────

export const ENTITY_TYPES = [
  'cupom',
  'nota_venda',
  'nota_compra',
  'produto',
  'cliente',
  'fornecedor',
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// SYNC_CONFIG
// Configuração de sincronização por entidade.
// api_token e base_url são armazenados criptografados (AES-256-GCM).
// ─────────────────────────────────────────────────────────────────────────────

export const syncConfig = sqliteTable(
  'sync_config',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // Nome da entidade: 'cupom', 'nota_venda', 'nota_compra' etc.
    entityType: text('entity_type').notNull().unique(),

    // Endpoint da API (ex: /v1/produto/produtos)
    apiEndpoint: text('api_endpoint').notNull(),

    // ── Dados criptografados (AES-256-GCM) ───────────────────────────────────
    apiTokenEncrypted: text('api_token_encrypted'),
    baseUrlEncrypted: text('base_url_encrypted'),

    // ── Agendamento ───────────────────────────────────────────────────────────
    intervalMinutes: integer('interval_minutes').notNull().default(60),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),

    // ── Controle incremental ──────────────────────────────────────────────────
    lastSyncId: integer('last_sync_id').default(0),
    lastSyncAt: text('last_sync_at'),

    description: text('description'),

    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEntityType: index('idx_sync_cfg_entity_type').on(t.entityType),
    idxIsActive: index('idx_sync_cfg_is_active').on(t.isActive),
  }),
);

export type SyncConfig = typeof syncConfig.$inferSelect;
export type NewSyncConfig = typeof syncConfig.$inferInsert;
