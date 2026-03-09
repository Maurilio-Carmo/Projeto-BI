// backend/src/modules/sync/sync.service.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig, syncLogs, credencial } from '../../database/schema';
import type { EntityType } from '../../database/schema/infra/sync-config';
import { SyncHttpService } from './sync.http.service';
import { NotaVendaRepository } from './repositories/nota-venda.repository';
import { NotaCompraRepository } from './repositories/nota-compra.repository';
import { CupomRepository } from './repositories/cupom.repository';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly runningJobs = new Set<EntityType>();

  constructor(
    @Inject('DRIZZLE') private readonly db: DrizzleDB,
    private readonly httpService: SyncHttpService,
    private readonly notaVendaRepo: NotaVendaRepository,
    private readonly notaCompraRepo: NotaCompraRepository,
    private readonly cupomRepo: CupomRepository,
  ) {}

  isRunning(entity: EntityType): boolean {
    return this.runningJobs.has(entity);
  }

  async syncEntity(entityType: EntityType): Promise<void> {
    if (this.runningJobs.has(entityType)) {
      this.logger.warn(`[${entityType}] Sync já em execução, ignorando.`);
      return;
    }
    this.runningJobs.add(entityType);

    const configs = await this.db
      .select().from(syncConfig)
      .where(eq(syncConfig.entity_type, entityType));

    if (!configs.length || !configs[0].is_active) {
      this.logger.warn(`[${entityType}] Configuração não encontrada ou inativa.`);
      this.runningJobs.delete(entityType);
      return;
    }

    const config = configs[0];
    const creds  = await this.db.select().from(credencial).limit(1);

    if (!creds.length) {
      this.logger.error(`[${entityType}] Nenhuma credencial encontrada.`);
      this.runningJobs.delete(entityType);
      return;
    }

    const cred = creds[0];

    // startedAt é NOT NULL no schema — deve ser fornecido explicitamente
    const startedAt = new Date().toISOString();

    const logResult = await this.db.insert(syncLogs).values({
      entityType,                              // ← camelCase (nome JS da coluna)
      status:    'RUNNING',
      startId:   config.last_sync_id ?? 0,
      startedAt,                               // ← NOT NULL — obrigatório ✅
    });
    const logId = logResult.lastInsertRowid ? Number(logResult.lastInsertRowid) : 0;

    let totalImported = 0;
    let currentOffset = config.last_sync_id ?? 0;
    let apiTotal: number | null = null;

    try {
      const BATCH_SIZE = 100;
      const baseUrl    = cred.api_url ?? '';
      const apiToken   = cred.api_key ?? '';

      while (true) {
        const result = await this.httpService.fetchBatch(
          entityType, baseUrl, apiToken, currentOffset, BATCH_SIZE,
        );

        if (!result || result.items.length === 0) break;

        if (apiTotal === null) {
          apiTotal = result.total;
          if (currentOffset >= apiTotal) break;
        }

        const imported = await this.upsertBatch(entityType, result.items);
        totalImported += imported;
        currentOffset += result.items.length;

        if (currentOffset >= apiTotal!) break;
      }

      await this.db.update(syncConfig).set({
        last_sync_id: currentOffset,
        last_sync_at: new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      }).where(eq(syncConfig.entity_type, entityType));

      await this.db.update(syncLogs).set({
        status:          'SUCCESS',
        recordsImported: totalImported,
        endId:           currentOffset,
        finishedAt:      new Date().toISOString(),
        durationMs:      Date.now() - new Date(startedAt).getTime(),
      }).where(eq(syncLogs.id, logId));

      this.logger.log(`[${entityType}] Sync concluído. ${totalImported} registros.`);

    } catch (err: any) {
      this.logger.error(`[${entityType}] Erro: ${err.message}`);
      await this.db.update(syncLogs).set({
        status:       'ERROR',
        errorMessage: String(err.message),
        finishedAt:   new Date().toISOString(),
        durationMs:   Date.now() - new Date(startedAt).getTime(),
      }).where(eq(syncLogs.id, logId));

    } finally {
      this.runningJobs.delete(entityType);
    }
  }

  private async upsertBatch(entityType: EntityType, items: any[]): Promise<number> {
    let count = 0;
    for (const item of items) {
      try {
        switch (entityType) {
          case 'nota_venda':  await this.notaVendaRepo.upsert(item);  break;
          case 'nota_compra': await this.notaCompraRepo.upsert(item); break;
          case 'cupom':       await this.cupomRepo.upsert(item);      break;
        }
        count++;
      } catch (e: any) {
        this.logger.warn(`[${entityType}] Erro no item ${item.id}: ${e.message}`);
      }
    }
    return count;
  }
}