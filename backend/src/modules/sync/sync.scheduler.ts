// backend/src/modules/sync/sync.scheduler.ts
//
// CORREÇÃO: acessos ao schema corrigidos para snake_case.
//   config.isActive      → config.is_active
//   config.entityType    → config.entity_type
//   config.intervalMinutes → Number(config.interval_hours)  ← agora é string de horas
//   syncConfig.entityType  → syncConfig.entity_type
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { syncConfig } from '../../database/schema';
import { SyncService } from './sync.service';
import { intervalHoursToCron } from './utils/cron.utils';
import type { EntityType } from '../../database/schema/infra/sync-config';

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
      if (!config.is_active) continue;                              // ← snake_case

      const entity       = config.entity_type as EntityType;       // ← snake_case
      const intervalHours = Number(config.interval_hours);         // ← interval_hours (string→number)
      this.registerJob(entity, intervalHours);
    }
  }

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

  removeJob(entity: EntityType): void {
    const jobName = `sync_${entity}`;
    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.log(`[${entity}] CronJob removido.`);
    }
  }

  async reloadJob(entity: EntityType): Promise<void> {
    const configs = await this.db
      .select()
      .from(syncConfig)
      .where(eq(syncConfig.entity_type, entity));   // ← snake_case

    if (!configs.length) {
      this.removeJob(entity);
      return;
    }

    const config = configs[0];

    if (config.is_active) {                          // ← snake_case
      const intervalHours = Number(config.interval_hours); // ← interval_hours
      this.registerJob(entity, intervalHours);
    } else {
      this.removeJob(entity);
    }
  }

  getJobsStatus(): Record<string, { running: boolean; nextDate: string | null }> {
    const result: Record<string, { running: boolean; nextDate: string | null }> = {};
    const entities: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

    for (const entity of entities) {
      const jobName = `sync_${entity}`;
      const exists  = this.schedulerRegistry.doesExist('cron', jobName);

      if (exists) {
        const job      = this.schedulerRegistry.getCronJob(jobName);
        result[entity] = {
          running:  true,
          nextDate: job.nextDate()?.toISO() ?? null,
        };
      } else {
        result[entity] = { running: false, nextDate: null };
      }
    }

    return result;
  }
}
