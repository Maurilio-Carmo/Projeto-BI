// backend/src/modules/sync/sync.scheduler.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. config.is_active    → config.isActive
// 2. config.entity_type  → config.entityType
// 3. config.interval_hours → config.intervalMinutes (÷ 60 → horas p/ cron)
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig } from '../../database/schema';
import { SyncService } from './sync.service';
import { intervalHoursToCron } from './utils/cron.utils';
import type { EntityType } from '../../database/schema/infra/sync-config';

const VALID_ENTITY_TYPES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

@Injectable()
export class SyncScheduler implements OnModuleInit {
  private readonly logger = new Logger(SyncScheduler.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly syncService: SyncService,
    @Inject('DRIZZLE') private readonly db: DrizzleDB,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando CronJobs de sincronização...');
    const configs = await this.db.select().from(syncConfig);

    for (const config of configs) {
      // isActive (camelCase, boolean)
      if (!config.isActive) continue;

      const entity = config.entityType as EntityType;
      if (!VALID_ENTITY_TYPES.includes(entity)) continue;

      // intervalMinutes → converter para horas para o utilitário cron
      const intervalHours = Math.max(1, Math.round((config.intervalMinutes ?? 60) / 60));
      this.registerJob(entity, intervalHours);
    }
  }

  /** Registra (ou substitui) um CronJob para a entidade. */
  registerJob(entity: EntityType, intervalHours: number): void {
    const jobName  = `sync_${entity}`;
    const cronExpr = intervalHoursToCron(intervalHours);

    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.log(`[${entity}] CronJob anterior removido.`);
    }

    const job = new CronJob(cronExpr, () => {
      this.logger.log(`[${entity}] CronJob disparado (a cada ${intervalHours}h)`);
      void this.syncService.syncEntity(entity);
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(`[${entity}] CronJob registrado: "${cronExpr}" (a cada ${intervalHours}h)`);
  }

  /** Remove o CronJob de uma entidade (chamado ao desativar ou deletar config). */
  removeJob(entity: EntityType): void {
    const jobName = `sync_${entity}`;
    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.log(`[${entity}] CronJob removido.`);
    }
  }

  /** Recarrega o CronJob de uma entidade (chamado ao salvar config). */
  async reloadJob(entity: EntityType): Promise<void> {
    const { eq } = await import('drizzle-orm');

    const rows = await this.db
      .select()
      .from(syncConfig)
      .where(eq(syncConfig.entityType, entity));

    if (!rows.length) {
      this.removeJob(entity);
      return;
    }

    const config = rows[0];

    if (!config.isActive) {
      this.removeJob(entity);
      return;
    }

    const intervalHours = Math.max(1, Math.round((config.intervalMinutes ?? 60) / 60));
    this.registerJob(entity, intervalHours);
  }

  /** Retorna status de todos os CronJobs registrados. */
  getJobsStatus(): Array<{ name: string; running: boolean }> {
    const jobs: Array<{ name: string; running: boolean }> = [];

    for (const entity of VALID_ENTITY_TYPES) {
      const jobName = `sync_${entity}`;
      const exists  = this.schedulerRegistry.doesExist('cron', jobName);
      jobs.push({ name: entity, running: exists });
    }

    return jobs;
  }
}
