// backend/src/modules/sync/sync.service.ts
//
// Orquestrador do loop de sincronização incremental.
// Delega HTTP → SyncHttpService, upserts → Repositories.
//
// ── CORREÇÃO libSQL ──────────────────────────────────────────────────────────
// logResult[0].insertId → logResult.lastInsertRowid  (BigInt | undefined)
// ─────────────────────────────────────────────────────────────────────────────

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

  /** Evita execuções paralelas da mesma entidade */
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
    this.logger.log(`[${entityType}] Iniciando sync...`);

    // ── Configuração ─────────────────────────────────────────────────────────
    const configs = await this.db
      .select()
      .from(syncConfig)
      .where(eq(syncConfig.entity_type, entityType));

    if (!configs.length || !configs[0].is_active) {
      this.logger.warn(`[${entityType}] Configuração não encontrada ou inativa.`);
      this.runningJobs.delete(entityType);
      return;
    }

    const config = configs[0];

    // ── Credencial ───────────────────────────────────────────────────────────
    const creds = await this.db
      .select()
      .from(credencial)
      .where(eq(credencial.id, config.credencial_id));

    if (!creds.length) {
      this.logger.error(`[${entityType}] Credencial #${config.credencial_id} não encontrada.`);
      this.runningJobs.delete(entityType);
      return;
    }

    const cred = creds[0];

    // ── Cria log de execução ─────────────────────────────────────────────────
    const logResult = await this.db.insert(syncLogs).values({
      entity_type: entityType,
      status:      'running',
      start_id:    config.last_sync_id,
    });
    // libSQL: lastInsertRowid é BigInt | undefined — converte para number
    const logId = logResult.lastInsertRowid ? Number(logResult.lastInsertRowid) : 0;

    let totalImported = 0;
    let currentOffset = config.last_sync_id;
    let apiTotal: number | null = null;

    try {
      const BATCH_SIZE = 100;

      while (true) {
        this.logger.debug(
          `[${entityType}] Buscando lote: start=${currentOffset}` +
          (apiTotal !== null ? ` / total=${apiTotal}` : ''),
        );

        const result = await this.httpService.fetchBatch(
          entityType,
          cred.api_url,
          cred.api_key,
          currentOffset,
          BATCH_SIZE,
        );

        if (!result || result.items.length === 0) {
          this.logger.debug(`[${entityType}] Nenhum item retornado. Encerrando loop.`);
          break;
        }

        if (apiTotal === null) {
          apiTotal = result.total;
          this.logger.log(
            `[${entityType}] Total na API: ${apiTotal}. Offset inicial: ${currentOffset}.`,
          );
          if (currentOffset >= apiTotal) {
            this.logger.log(`[${entityType}] Nenhum registro novo. Sync concluído.`);
            break;
          }
        }

        const imported = await this.upsertBatch(entityType, result.items);
        totalImported += imported;
        currentOffset += result.items.length;

        this.logger.debug(
          `[${entityType}] Lote: ${imported} registros. Progresso: ${currentOffset}/${apiTotal}`,
        );

        if (currentOffset >= apiTotal) {
          this.logger.log(`[${entityType}] Offset atingiu total (${currentOffset}/${apiTotal}).`);
          break;
        }
      }

      // ── Atualiza cursor ───────────────────────────────────────────────────
      await this.db
        .update(syncConfig)
        .set({ last_sync_id: currentOffset, last_sync_at: new Date(), updated_at: new Date() })
        .where(eq(syncConfig.id, config.id));

      // ── Finaliza log com sucesso ──────────────────────────────────────────
      await this.db
        .update(syncLogs)
        .set({ status: 'success', end_id: currentOffset, records_imported: totalImported, finished_at: new Date() })
        .where(eq(syncLogs.id, logId));

      this.logger.log(
        `[${entityType}] Sync concluído. ${totalImported} registros. Novo offset: ${currentOffset}.`,
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`[${entityType}] Erro: ${errorMessage}`);

      await this.db
        .update(syncLogs)
        .set({ status: 'error', error_message: errorMessage, finished_at: new Date() })
        .where(eq(syncLogs.id, logId));

    } finally {
      this.runningJobs.delete(entityType);
    }
  }

  private async upsertBatch(entityType: EntityType, items: any[]): Promise<number> {
    let imported = 0;

    for (const item of items) {
      try {
        if (entityType === 'nota_venda')        await this.notaVendaRepo.upsert(item);
        else if (entityType === 'nota_compra')  await this.notaCompraRepo.upsert(item);
        else if (entityType === 'cupom')        await this.cupomRepo.upsert(item);
        imported++;
      } catch (err) {
        this.logger.error(`[${entityType}] Erro no upsert: ${String(err)}`);
      }
    }

    return imported;
  }
}
