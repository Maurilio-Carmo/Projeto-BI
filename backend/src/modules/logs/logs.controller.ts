// backend/src/modules/logs/logs.controller.ts
import {
  Controller, Get, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import type { EntityType } from '../../database/schema/sync-config';

const VALID_ENTITIES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];
const VALID_STATUSES = ['success', 'error', 'running'] as const;
type LogStatus = (typeof VALID_STATUSES)[number];

@Controller('api/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    // ✅ Recebidos como string | undefined do @Query — validados e convertidos abaixo
    @Query('entity') entityRaw?: string,
    @Query('status') statusRaw?: string,
  ) {
    // Valida e converte entity para EntityType (ou undefined se inválido)
    const entity = entityRaw && VALID_ENTITIES.includes(entityRaw as EntityType)
      ? (entityRaw as EntityType)
      : undefined;

    // Valida e converte status para o tipo union correto (ou undefined se inválido)
    const status = statusRaw && VALID_STATUSES.includes(statusRaw as LogStatus)
      ? (statusRaw as LogStatus)
      : undefined;

    return this.logsService.findAll({ entity, status, page, limit });
  }

  @Get('stats')
  getStats() {
    return this.logsService.getStats();
  }
}
