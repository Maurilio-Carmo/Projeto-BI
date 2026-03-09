// backend/src/modules/logs/logs.service.ts
//
// CORREÇÃO: acessos ao schema corrigidos para snake_case.
//   c.entityType      → c.entity_type
//   cfg.lastSyncAt    → cfg.last_sync_at
//   cfg.lastSyncId    → cfg.last_sync_id
//   cfg.isActive      → cfg.is_active
//   cfg.intervalMinutes → cfg.interval_hours  (campo agora é string de horas)
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Inject } from '@nestjs/common';
import { desc, eq, and, count } from 'drizzle-orm';
import { SQL } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncLogs }  from '../../database/schema/infra/sync-logs';
import { syncConfig } from '../../database/schema/infra/sync-config';
import type { SyncLog }    from '../../database/schema/infra/sync-logs';
import type { SyncConfig } from '../../database/schema/infra/sync-config';
import type { EntityType } from '../../database/schema/infra/sync-config';

interface FindLogsParams {
  entity?: EntityType;
  status?: 'success' | 'error' | 'running';
  page?: number;
  limit?: number;
}

@Injectable()
export class LogsService {
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async findAll(params: FindLogsParams) {
    const page   = Math.max(1, params.page ?? 1);
    const limit  = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (params.entity) {
      conditions.push(eq(syncLogs.entity_type, params.entity));
    }
    if (params.status) {
      conditions.push(eq(syncLogs.status, params.status));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(syncLogs)
        .where(where)
        .orderBy(desc(syncLogs.started_at))
        .limit(limit)
        .offset(offset),
      this.db.select({ total: count() }).from(syncLogs).where(where),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext:    page * limit < total,
        hasPrev:    page > 1,
      },
    };
  }

  async getStats() {
    const [lastLogs, configs] = await Promise.all([
      this.db
        .select()
        .from(syncLogs)
        .orderBy(desc(syncLogs.started_at))
        .limit(50),
      this.db.select().from(syncConfig),
    ]);

    const entities: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

    const result: Record<string, {
      lastLog:       SyncLog | null;
      lastSyncId:    number;
      lastSync:      string | null;
      isActive:      boolean;
      intervalHours: string | null;
    }> = {};

    for (const et of entities) {
      // CORREÇÃO: entity_type (snake_case)
      const cfg = configs.find((c: SyncConfig) => c.entity_type === et);
      const log = lastLogs.find((l: SyncLog)   => l.entity_type === et) ?? null;

      result[et] = {
        lastLog:       log,
        lastSyncId:    cfg?.last_sync_id   ?? 0,      // ← snake_case
        lastSync:      cfg?.last_sync_at   ?? null,   // ← snake_case
        isActive:      cfg?.is_active      ?? false,  // ← snake_case
        intervalHours: cfg?.interval_hours ?? null,   // ← interval_hours (não intervalMinutes)
      };
    }

    return { entities: result };
  }
}
