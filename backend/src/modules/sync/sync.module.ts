// backend/src/modules/sync/sync.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { SyncScheduler } from './sync.scheduler';
import { SyncHttpService } from './sync.http.service';
import { NotaVendaRepository } from './repositories/nota-venda.repository';
import { NotaCompraRepository } from './repositories/nota-compra.repository';
import { CupomRepository } from './repositories/cupom.repository';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [
    HttpModule.register({ timeout: 30_000, maxRedirects: 3 }),
    forwardRef(() => AppConfigModule),
  ],
  controllers: [SyncController],
  providers: [
    SyncService,
    SyncScheduler,
    SyncHttpService,
    NotaVendaRepository,
    NotaCompraRepository,
    CupomRepository,
  ],
  exports: [SyncService, SyncScheduler],
})
export class SyncModule {}
