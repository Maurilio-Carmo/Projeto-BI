// backend/src/modules/logs/logs.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { desc, eq, and, count } from 'drizzle-orm';
import { SQL } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncLogs } from '../../database/schema/sync-logs';
import { syncConfig } from '../../database/schema/sync-config';
import type { EntityType } from '../../database/schema/sync-config';

interface FindLogsParams {
  // ✅ Tipo alinhado com o enum real do banco: 'nota_venda' | 'nota_compra' | 'cupom'
  // Era: 'invoices' | 'coupons' — incompatível com mysqlEnum do schema
  entity?: EntityType;
  status?: 'success' | 'error' | 'running';
  page?: number;
  limit?: number;
}

@Injectable()
export class LogsService {
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async findAll(params: FindLogsParams) {
    const page  = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (params.entity) {
      // ✅ params.entity agora é EntityType válido — sem erro TS2769
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
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getStats() {
    // Últimos logs por entidade e configurações
    const [lastLogs, configs] = await Promise.all([
      this.db
        .select()
        .from(syncLogs)
        .orderBy(desc(syncLogs.started_at))
        .limit(50),
      this.db.select().from(syncConfig),
    ]);

    // ✅ Comparações corrigidas — usam os valores reais do enum do banco
    // Era: 'invoices' / 'coupons' — agora: 'nota_venda' / 'nota_compra' / 'cupom'
    const lastNotaVendaSync = lastLogs.find((l) => l.entity_type === 'nota_venda');
    const lastNotaCompraSync = lastLogs.find((l) => l.entity_type === 'nota_compra');
    const lastCupomSync     = lastLogs.find((l) => l.entity_type === 'cupom');

    const notaVendaConfig  = configs.find((c) => c.entity_type === 'nota_venda');
    const notaCompraConfig = configs.find((c) => c.entity_type === 'nota_compra');
    const cupomConfig      = configs.find((c) => c.entity_type === 'cupom');

    return {
      entities: {
        nota_venda: {
          lastLog:    lastNotaVendaSync ?? null,
          lastSyncId: notaVendaConfig?.last_sync_id ?? 0,
          isActive:   notaVendaConfig?.is_active ?? false,
        },
        nota_compra: {
          lastLog:    lastNotaCompraSync ?? null,
          lastSyncId: notaCompraConfig?.last_sync_id ?? 0,
          isActive:   notaCompraConfig?.is_active ?? false,
        },
        cupom: {
          lastLog:    lastCupomSync ?? null,
          lastSyncId: cupomConfig?.last_sync_id ?? 0,
          isActive:   cupomConfig?.is_active ?? false,
        },
      },
    };
  }
}
