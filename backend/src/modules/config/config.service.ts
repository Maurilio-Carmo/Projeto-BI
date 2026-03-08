// backend/src/modules/config/config.service.ts

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig } from '../../database/schema';
import { SyncScheduler } from '../sync/sync.scheduler';
import type { EntityType, SyncConfig } from '../../database/schema/sync-config';
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
    const result  = await this.db.insert(syncConfig).values(dto);
    const created = await this.findOne(Number(result[0].insertId));

    if (created.is_active) {
      this.syncScheduler.registerJob(created.entity_type as EntityType, Number(created.interval_hours));
    }

    return created;
  }

  async update(id: number, dto: UpdateSyncConfigDto): Promise<SyncConfig> {
    await this.findOne(id);
    await this.db.update(syncConfig).set({ ...dto, updated_at: new Date() }).where(eq(syncConfig.id, id));
    const updated = await this.findOne(id);

    if (updated.is_active) {
      this.syncScheduler.registerJob(updated.entity_type as EntityType, Number(updated.interval_hours));
    } else {
      this.syncScheduler.removeJob(updated.entity_type as EntityType);
    }

    return updated;
  }

  async resetLastSyncId(id: number): Promise<SyncConfig> {
    await this.findOne(id);
    await this.db.update(syncConfig).set({ last_sync_id: 0, updated_at: new Date() }).where(eq(syncConfig.id, id));
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    this.syncScheduler.removeJob(config.entity_type as EntityType);
    await this.db.delete(syncConfig).where(eq(syncConfig.id, id));
  }
}