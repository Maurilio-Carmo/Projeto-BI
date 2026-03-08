// backend/src/modules/config/config.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SyncConfigService } from './config.service';
import { CreateSyncConfigDto, UpdateSyncConfigDto } from './dto/sync-config.dto';
import { SyncScheduler } from '../sync/sync.scheduler';
import type { SyncConfig } from '../../database/schema/infra/sync-config';

@Controller('api/config')
export class ConfigController {
  constructor(
    private readonly configService: SyncConfigService,
    private readonly syncScheduler: SyncScheduler,
  ) {}

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSyncConfigDto) {
    const result = await this.configService.create(dto);

    // ✅ Corrigido: is_active → isActive / entity_type → entityType
    if (result?.isActive) {
      await this.syncScheduler.reloadJob(result.entityType);
    }

    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSyncConfigDto) {
    const result = await this.configService.update(id, dto);

    if (!result) return result;

    // ✅ Corrigido: entity_type → entityType
    await this.syncScheduler.reloadJob(result.entityType);

    return result;
  }

  @Patch(':id/reset')
  @HttpCode(HttpStatus.OK)
  async resetLastSyncId(@Param('id', ParseIntPipe) id: number) {
    const result = await this.configService.resetLastSyncId(id);

    // ✅ Corrigido: is_active → isActive / entity_type → entityType
    if (result.isActive) {
      await this.syncScheduler.reloadJob(result.entityType);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const configs = await this.configService.findAll();
    const config = configs.find((c: SyncConfig) => c.id === id);

    const result = await this.configService.remove(id);

    if (config) {
      // ✅ Corrigido: entity_type → entityType
      this.syncScheduler.removeJob(config.entityType);
    }

    return result;
  }
}
