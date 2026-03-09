// backend/src/database/schema/infra/sync-config.ts
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// SYNC_CONFIG
// Configuração de sincronização por entidade.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CORREÇÃO: EntityType restrito às 3 entidades reais do sistema.
 * Antes havia 'produto' | 'cliente' | 'fornecedor' extras que:
 *   1. Causavam erro em ENDPOINT_MAP do sync.http.service.ts (incompleto)
 *   2. Impossibilitavam type-narrowing correto no config.controller.ts
 */
export type EntityType = 'nota_venda' | 'nota_compra' | 'cupom';

export const syncConfig = sqliteTable(
  'sync_config',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    entity_type: text('entity_type').notNull().unique(),
    api_endpoint: text('api_endpoint').notNull(),

    // ── Dados criptografados (AES-256-GCM) ───────────────────────────────────
    api_token_encrypted: text('api_token_encrypted'),
    base_url_encrypted:  text('base_url_encrypted'),

    // ── Agendamento ───────────────────────────────────────────────────────────
    interval_hours: text('interval_hours').notNull().default('6'),
    is_active:      integer('is_active', { mode: 'boolean' }).notNull().default(true),

    // ── Controle incremental ──────────────────────────────────────────────────
    last_sync_id: integer('last_sync_id').default(0),
    last_sync_at: text('last_sync_at'),

    description: text('description'),

    created_at: text('created_at').default(sql`(datetime('now'))`),
    updated_at: text('updated_at').default(sql`(datetime('now'))`),
  },
  (t) => ({
    idxEntityType: index('idx_sync_cfg_entity_type').on(t.entity_type),
    idxIsActive:   index('idx_sync_cfg_is_active').on(t.is_active),
  }),
);

export type SyncConfig    = typeof syncConfig.$inferSelect;
export type NewSyncConfig = typeof syncConfig.$inferInsert;
