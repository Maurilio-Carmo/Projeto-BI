// backend/src/modules/logs/logs.service.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. syncLogs.entity_type  → syncLogs.entityType
// 2. syncLogs.started_at   → syncLogs.startedAt
// 3. syncLogs.status enum  → 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIAL'
// 4. records_imported      → recordsImported
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Inject } from '@nestjs/common';
import { desc, eq, and, count, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { DrizzleDB }  from '../../database/drizzle';
import { syncLogs }   from '../../database/schema/infra/sync-logs';
import { syncConfig } from '../../database/schema/infra/sync-config';
import type { SyncLog }    from '../../database/schema/infra/sync-logs';
import type { EntityType } from '../../database/schema/infra/sync-config';

type LogStatus = 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIAL';

interface FindLogsParams {
  entity?: string;
  status?: string;
  page?:   number;
  limit?:  number;
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
      conditions.push(eq(syncLogs.entityType, params.entity));
    }

    if (params.status) {
      conditions.push(eq(syncLogs.status, params.status.toUpperCase() as LogStatus));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(syncLogs)
        .where(where)
        .orderBy(desc(syncLogs.startedAt))
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
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getStats() {
    const [totals] = await this.db
      .select({
        total:   count(),
        running: sql<number>`SUM(CASE WHEN ${syncLogs.status} = 'RUNNING'  THEN 1 ELSE 0 END)`,
        success: sql<number>`SUM(CASE WHEN ${syncLogs.status} = 'SUCCESS'  THEN 1 ELSE 0 END)`,
        error:   sql<number>`SUM(CASE WHEN ${syncLogs.status} = 'ERROR'    THEN 1 ELSE 0 END)`,
        partial: sql<number>`SUM(CASE WHEN ${syncLogs.status} = 'PARTIAL'  THEN 1 ELSE 0 END)`,
      })
      .from(syncLogs);

    // Dados por entidade
    const configs = await this.db.select().from(syncConfig);

    const ENTITY_TYPES = ['nota_venda', 'nota_compra', 'cupom'] as const;
    const entities: Record<string, object> = {};

    for (const et of ENTITY_TYPES) {
      const cfg = configs.find(c => c.entityType === et);

      const [lastLog] = await this.db
        .select()
        .from(syncLogs)
        .where(eq(syncLogs.entityType, et))
        .orderBy(desc(syncLogs.startedAt))
        .limit(1);

      entities[et] = {
        lastSync:      cfg?.lastSyncAt ?? null,
        lastSyncId:    cfg?.lastSyncId ?? 0,
        isActive:      cfg?.isActive   ?? false,
        intervalMin:   cfg?.intervalMinutes ?? null,
        lastLog:       lastLog ?? null,
      };
    }

    return {
      total:   totals?.total   ?? 0,
      running: totals?.running ?? 0,
      success: totals?.success ?? 0,
      error:   totals?.error   ?? 0,
      partial: totals?.partial ?? 0,
      entities,
    };
  }
}
