// backend/src/modules/config/config.service.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Todos os campos de syncConfig agora em camelCase:
//    entity_type → entityType, is_active → isActive,
//    interval_hours → intervalMinutes, last_sync_id → lastSyncId,
//    last_sync_at → lastSyncAt, updated_at → updatedAt
// 2. Removido credencial_id (não existe mais no schema).
//    Credenciais ficam em baseUrlEncrypted / apiTokenEncrypted.
// 3. lastInsertRowid (BigInt) → Number()
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig } from '../../database/schema';
import { SyncScheduler } from '../sync/sync.scheduler';
import type { SyncConfig } from '../../database/schema/infra/sync-config';
import { CreateSyncConfigDto, UpdateSyncConfigDto } from './dto/sync-config.dto';
import type { EntityType } from './dto/sync-config.dto';

@Injectable()
export class SyncConfigService {
  constructor(
    @Inject('DRIZZLE') private readonly db: DrizzleDB,
    private readonly syncScheduler: SyncScheduler,
  ) {}

  async findAll(): Promise<SyncConfig[]> {
    return this.db.select().from(syncConfig);
  }

  async findOne(id: number): Promise<SyncConfig> {
    const rows = await this.db
      .select()
      .from(syncConfig)
      .where(eq(syncConfig.id, id));

    if (!rows.length) {
      throw new NotFoundException(`Configuração #${id} não encontrada`);
    }
    return rows[0];
  }

  async create(dto: CreateSyncConfigDto): Promise<SyncConfig> {
    const result = await this.db.insert(syncConfig).values({
      entityType:        dto.entityType,
      apiEndpoint:       dto.apiEndpoint,
      baseUrlEncrypted:  dto.baseUrlEncrypted,
      apiTokenEncrypted: dto.apiTokenEncrypted,
      intervalMinutes:   dto.intervalMinutes,
      isActive:          dto.isActive ?? true,
      description:       dto.description,
    });

    // libSQL: lastInsertRowid é BigInt — converte para number
    const newId   = result.lastInsertRowid ? Number(result.lastInsertRowid) : 0;
    const created = await this.findOne(newId);

    if (created.isActive) {
      const intervalHours = Math.max(1, Math.round((created.intervalMinutes ?? 60) / 60));
      this.syncScheduler.registerJob(created.entityType as EntityType, intervalHours);
    }

    return created;
  }

  async update(id: number, dto: UpdateSyncConfigDto): Promise<SyncConfig> {
    await this.findOne(id);

    const patch: Partial<typeof syncConfig.$inferInsert> = {
      updatedAt: new Date().toISOString(),
    };

    if (dto.apiEndpoint       !== undefined) patch.apiEndpoint       = dto.apiEndpoint;
    if (dto.baseUrlEncrypted  !== undefined) patch.baseUrlEncrypted  = dto.baseUrlEncrypted;
    if (dto.apiTokenEncrypted !== undefined) patch.apiTokenEncrypted = dto.apiTokenEncrypted;
    if (dto.intervalMinutes   !== undefined) patch.intervalMinutes   = dto.intervalMinutes;
    if (dto.isActive          !== undefined) patch.isActive          = dto.isActive;
    if (dto.description       !== undefined) patch.description       = dto.description;

    await this.db.update(syncConfig).set(patch).where(eq(syncConfig.id, id));
    const updated = await this.findOne(id);

    const intervalHours = Math.max(1, Math.round((updated.intervalMinutes ?? 60) / 60));

    if (updated.isActive) {
      this.syncScheduler.registerJob(updated.entityType as EntityType, intervalHours);
    } else {
      this.syncScheduler.removeJob(updated.entityType as EntityType);
    }

    return updated;
  }

  /** Zera o cursor incremental (reimporta tudo no próximo sync). */
  async resetLastSyncId(id: number): Promise<SyncConfig> {
    await this.findOne(id);
    await this.db
      .update(syncConfig)
      .set({ lastSyncId: 0, updatedAt: new Date().toISOString() })
      .where(eq(syncConfig.id, id));
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const config = await this.findOne(id);
    this.syncScheduler.removeJob(config.entityType as EntityType);
    await this.db.delete(syncConfig).where(eq(syncConfig.id, id));
    return { message: `Configuração #${id} removida.` };
  }
}
