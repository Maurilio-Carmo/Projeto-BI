// backend/src/modules/config/config.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig } from '../../database/schema';
import { SyncScheduler } from '../sync/sync.scheduler';
import type { EntityType, SyncConfig } from '../../database/schema/infra/sync-config';
import { CreateSyncConfigDto, UpdateSyncConfigDto } from './dto/sync-config.dto';

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
    const rows = await this.db.select().from(syncConfig).where(eq(syncConfig.id, id));
    if (!rows.length) throw new NotFoundException(`Configuração #${id} não encontrada`);
    return rows[0];
  }

  async create(dto: CreateSyncConfigDto): Promise<SyncConfig> {
    const result = await this.db.insert(syncConfig).values({
      entity_type:         dto.entityType,
      api_endpoint:        dto.apiEndpoint ?? '',
      interval_hours:      String(dto.intervalMinutes ? Math.round(dto.intervalMinutes / 60) : 6),
      is_active:           dto.isActive ?? true,
      base_url_encrypted:  dto.baseUrlEncrypted  ?? null,
      api_token_encrypted: dto.apiTokenEncrypted ?? null,
      description:         dto.description ?? null,
    });

    const newId = result.lastInsertRowid ? Number(result.lastInsertRowid) : 0;
    const created = await this.findOne(newId);

    if (created.is_active) {
      this.syncScheduler.registerJob(            // ← usa registerJob() (existe no scheduler)
        created.entity_type as EntityType,
        Number(created.interval_hours),
      );
    }
    return created;
  }

  async update(id: number, dto: UpdateSyncConfigDto): Promise<SyncConfig> {
    await this.findOne(id);
    const patch: Partial<typeof syncConfig.$inferInsert> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.intervalMinutes !== undefined)   patch.interval_hours      = String(Math.round(dto.intervalMinutes / 60));
    if (dto.isActive !== undefined)          patch.is_active           = dto.isActive;
    if (dto.apiEndpoint !== undefined)       patch.api_endpoint        = dto.apiEndpoint;
    if (dto.baseUrlEncrypted !== undefined)  patch.base_url_encrypted  = dto.baseUrlEncrypted;
    if (dto.apiTokenEncrypted !== undefined) patch.api_token_encrypted = dto.apiTokenEncrypted;
    if (dto.description !== undefined)       patch.description         = dto.description;

    await this.db.update(syncConfig).set(patch).where(eq(syncConfig.id, id));
    const updated = await this.findOne(id);

    if (updated.is_active) {
      this.syncScheduler.registerJob(           // ← usa registerJob() (NÃO reschedule)
        updated.entity_type as EntityType,
        Number(updated.interval_hours),
      );
    } else {
      this.syncScheduler.removeJob(updated.entity_type as EntityType);
    }
    return updated;
  }

  async resetLastSyncId(id: number): Promise<SyncConfig> {
    await this.findOne(id);
    await this.db.update(syncConfig)
      .set({ last_sync_id: 0, last_sync_at: null, updated_at: new Date().toISOString() })
      .where(eq(syncConfig.id, id));
    return this.findOne(id);
  }

  // ← método chamado pelo controller como .remove() — adicionado como alias
  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    this.syncScheduler.removeJob(config.entity_type as EntityType);
    await this.db.delete(syncConfig).where(eq(syncConfig.id, id));
  }

  // alias para compatibilidade com quem chama .delete()
  async delete(id: number): Promise<void> {
    return this.remove(id);
  }
}