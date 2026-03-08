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
import type { SyncConfig } from '../../database/schema/sync-config';

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

    if (result?.is_active) {
      await this.syncScheduler.reloadJob(result.entity_type);
    }

    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSyncConfigDto) {
    const result = await this.configService.update(id, dto);

    if (!result) return result;
    await this.syncScheduler.reloadJob(result.entity_type);

    return result;
  }

  @Patch(':id/reset')
  @HttpCode(HttpStatus.OK)
  async resetLastSyncId(@Param('id', ParseIntPipe) id: number) {
    const result = await this.configService.resetLastSyncId(id);

    if (result.is_active) {
      await this.syncScheduler.reloadJob(result.entity_type);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const configs = await this.configService.findAll();
    const config  = configs.find((c: SyncConfig) => c.id === id);

    const result = await this.configService.remove(id);

    if (config) {
      this.syncScheduler.removeJob(config.entity_type);
    }

    return result;
  }
}
