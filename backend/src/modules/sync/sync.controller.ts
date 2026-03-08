// backend/src/modules/sync/sync.controller.ts
import {
  Controller, Post, Get, Param, BadRequestException, HttpCode, HttpStatus,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncScheduler } from './sync.scheduler';
import type { EntityType } from '../../database/schema/infra/sync-config';

const VALID_ENTITY_TYPES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

@Controller('api/sync')
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly syncScheduler: SyncScheduler,
  ) {}

  /** Dispara sync manual imediato para a entidade especificada */
  @Post('trigger/:entityType')
  @HttpCode(HttpStatus.ACCEPTED)
  triggerSync(@Param('entityType') entityType: string) {
    if (!VALID_ENTITY_TYPES.includes(entityType as EntityType)) {
      throw new BadRequestException(
        `entityType inválido. Use: ${VALID_ENTITY_TYPES.join(', ')}`,
      );
    }

    const entity = entityType as EntityType;

    if (this.syncService.isRunning(entity)) {
      return { message: `Sync "${entity}" já está em execução`, triggered: false };
    }

    void this.syncService.syncEntity(entity);

    return {
      message: `Sync "${entity}" disparado com sucesso`,
      entityType: entity,
      triggered: true,
      timestamp: new Date().toISOString(),
    };
  }

  /** Retorna status dos CronJobs */
  @Get('jobs')
  getJobsStatus() {
    return {
      jobs: this.syncScheduler.getJobsStatus(),
      running: {
        nota_venda: this.syncService.isRunning('nota_venda'),
        nota_compra: this.syncService.isRunning('nota_compra'),
        cupom: this.syncService.isRunning('cupom'),
      },
    };
  }
}
