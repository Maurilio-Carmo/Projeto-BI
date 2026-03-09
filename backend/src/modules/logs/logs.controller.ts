// backend/src/modules/logs/logs.controller.ts
import {
  Controller, Get, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import type { EntityType } from '../../database/schema/infra/sync-config';

const VALID_ENTITIES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

// Status aceito pelo schema e pelo service (UPPERCASE)
type StatusParam = 'SUCCESS' | 'ERROR' | 'RUNNING' | 'PARTIAL';
const VALID_STATUSES: StatusParam[] = ['SUCCESS', 'ERROR', 'RUNNING', 'PARTIAL'];

@Controller('api/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('entity') entityRaw?: string,
    @Query('status') statusRaw?: string,
  ) {
    const entity = entityRaw && VALID_ENTITIES.includes(entityRaw as EntityType)
      ? (entityRaw as EntityType)
      : undefined;

    // Normaliza para UPPERCASE antes de validar — aceita tanto 'error' quanto 'ERROR'
    const statusUpper = statusRaw?.toUpperCase() as StatusParam | undefined;
    const status: StatusParam | undefined =
      statusUpper && VALID_STATUSES.includes(statusUpper)
        ? statusUpper
        : undefined;

    return this.logsService.findAll({ entity, status, page, limit });
  }

  @Get('stats')
  getStats() {
    return this.logsService.getStats();
  }
}