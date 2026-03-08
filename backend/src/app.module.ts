// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { DatabaseModule }    from './database/database.module';
import { SyncModule }        from './modules/sync/sync.module';
import { AppConfigModule }   from './modules/config/config.module';
import { InvoicesModule }    from './modules/invoices/invoices.module';
import { CouponsModule }     from './modules/coupons/coupons.module';
import { LogsModule }        from './modules/logs/logs.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { AllExceptionsFilter } from './config/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'backend/.env' }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    SyncModule,
    AppConfigModule,
    InvoicesModule,
    CouponsModule,
    LogsModule,
    CredentialsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}