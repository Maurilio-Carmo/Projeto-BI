// backend/src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleInstance, Database } from './drizzle';

// Token único como string — deve ser igual ao @Inject('DRIZZLE') usado em todos os services
export const DRIZZLE_TOKEN = 'DRIZZLE';

/**
 * DatabaseModule — Global, injetado em toda a aplicação.
 * Provê a instância do DrizzleORM configurada via variáveis de ambiente.
 */
@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Database => {
        return createDrizzleInstance({
          host:     configService.get<string>('DATABASE_HOST', 'localhost'),
          port:     configService.get<number>('DATABASE_PORT', 3306),
          user:     configService.get<string>('DATABASE_USER', 'root'),
          password: configService.get<string>('DATABASE_PASSWORD', ''),
          database: configService.get<string>('DATABASE_NAME', 'fiscalsync'),
        });
      },
    },
  ],
  exports: [DRIZZLE_TOKEN],
})
export class DatabaseModule {}