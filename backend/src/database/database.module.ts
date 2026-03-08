// backend/src/database/database.module.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • useFactory: recebia 5 vars (host/port/user/pass/db)
//                 agora recebe apenas DATABASE_FILE (caminho do .db)
//   • createDrizzleInstance: assinatura mudou de objeto para string
// ─────────────────────────────────────────────────────────────────────────────
import { Module, Global } from '@nestjs/common';
import { ConfigService }  from '@nestjs/config';
import { createDrizzleInstance, DrizzleDB } from './drizzle';

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
      useFactory: (configService: ConfigService): DrizzleDB => {
        const filepath = configService.get<string>(
          'DATABASE_FILE',
          './database/retailbi.db',
        );
        return createDrizzleInstance(filepath);
      },
    },
  ],
  exports: [DRIZZLE_TOKEN],
})
export class DatabaseModule {}
