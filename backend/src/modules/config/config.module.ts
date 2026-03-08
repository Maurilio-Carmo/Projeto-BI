// backend/src/modules/config/config.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { SyncConfigService } from './config.service';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [forwardRef(() => SyncModule)],
  controllers: [ConfigController],
  providers: [SyncConfigService],
  exports: [SyncConfigService],
})
export class AppConfigModule {}
