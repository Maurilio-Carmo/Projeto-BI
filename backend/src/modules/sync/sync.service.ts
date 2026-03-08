// backend/src/modules/sync/sync.service.ts
//
// Orquestrador do loop de sincronização incremental.
// Delega HTTP → SyncHttpService, upserts → Repositories.
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. syncConfig: todos os campos agora em camelCase (entityType, isActive,
//    lastSyncId, lastSyncAt) — sem FK credencial_id.
//    Credenciais lidas de syncConfig.baseUrlEncrypted / apiTokenEncrypted.
// 2. syncLogs: status enum em MAIÚSCULAS ('RUNNING','SUCCESS','ERROR').
//    Campos: entityType, startId, endId, recordsImported, errorMessage,
//    startedAt, finishedAt — tudo camelCase.
// 3. lastInsertRowid → BigInt; converte com Number().
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Logger, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig, syncLogs } from '../../database/schema';
import type { EntityType } from '../../database/schema/infra/sync-config';
import { SyncHttpService } from './sync.http.service';
import { NotaVendaRepository } from './repositories/nota-venda.repository';
import { NotaCompraRepository } from './repositories/nota-compra.repository';
import { CupomRepository } from './repositories/cupom.repository';

/* eslint-disable @typescript-eslint/no-explicit-any */

const VALID_ENTITY_TYPES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

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
    // syncConfig.entityType é o campo camelCase (coluna: entity_type)
    const configs = await this.db
      .select()
      .from(syncConfig)
      .where(eq(syncConfig.entityType, entityType));

    if (!configs.length || !configs[0].isActive) {
      this.logger.warn(`[${entityType}] Configuração não encontrada ou inativa.`);
      this.runningJobs.delete(entityType);
      return;
    }

    const config = configs[0];

    // ── Credenciais inline no syncConfig ─────────────────────────────────────
    // baseUrlEncrypted e apiTokenEncrypted são armazenados em sync_config.
    // TODO: descriptografar com EncryptionService quando implementado.
    const baseUrl  = config.baseUrlEncrypted  ?? '';
    const apiToken = config.apiTokenEncrypted ?? '';

    if (!baseUrl || !apiToken) {
      this.logger.error(`[${entityType}] URL ou token ausentes na configuração.`);
      this.runningJobs.delete(entityType);
      return;
    }

    // ── Cria log de execução ─────────────────────────────────────────────────
    const now = new Date().toISOString();
    const logResult = await this.db.insert(syncLogs).values({
      entityType,
      status:    'RUNNING',
      startId:   config.lastSyncId ?? 0,
      startedAt: now,
    });
    // libSQL: lastInsertRowid é BigInt | undefined — converte para number
    const logId = logResult.lastInsertRowid
      ? Number(logResult.lastInsertRowid)
      : 0;

    let totalImported = 0;
    let currentOffset = config.lastSyncId ?? 0;
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
          baseUrl,
          apiToken,
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
        .set({
          lastSyncId: currentOffset,
          lastSyncAt: new Date().toISOString(),
          updatedAt:  new Date().toISOString(),
        })
        .where(eq(syncConfig.id, config.id));

      // ── Finaliza log com sucesso ──────────────────────────────────────────
      await this.db
        .update(syncLogs)
        .set({
          status:          'SUCCESS',
          endId:           currentOffset,
          recordsImported: totalImported,
          finishedAt:      new Date().toISOString(),
        })
        .where(eq(syncLogs.id, logId));

      this.logger.log(
        `[${entityType}] Sync concluído. ${totalImported} registros. Novo offset: ${currentOffset}.`,
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`[${entityType}] Erro: ${errorMessage}`);

      await this.db
        .update(syncLogs)
        .set({
          status:       'ERROR',
          errorMessage,
          finishedAt:   new Date().toISOString(),
        })
        .where(eq(syncLogs.id, logId));

    } finally {
      this.runningJobs.delete(entityType);
    }
  }

  private async upsertBatch(entityType: EntityType, items: any[]): Promise<number> {
    let imported = 0;

    for (const item of items) {
      try {
        if      (entityType === 'nota_venda')  await this.notaVendaRepo.upsert(item);
        else if (entityType === 'nota_compra') await this.notaCompraRepo.upsert(item);
        else if (entityType === 'cupom')       await this.cupomRepo.upsert(item);
        imported++;
      } catch (err) {
        this.logger.error(`[${entityType}] Erro no upsert: ${String(err)}`);
      }
    }

    return imported;
  }
}
