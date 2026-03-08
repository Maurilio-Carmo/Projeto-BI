// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as os from 'os';

function getLocalIP(): string {
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return 'localhost';
}

async function bootstrap() {
  const logger = new Logger('FiscalSync');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port        = configService.get<number>('PORT', 3000);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
  const allowedOriginsEnv = configService.get<string>('ALLOWED_ORIGINS', '');
  const allowedOrigins: string[] | boolean =
    allowedOriginsEnv === '*'
      ? true
      : [
          frontendUrl,
          'http://localhost:5173',
          'http://localhost:3001',
          ...allowedOriginsEnv
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        ];

  app.enableCors({
    origin:         allowedOrigins,
    methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials:    allowedOrigins !== true, // credentials só com origin específica
  });

  // Escuta em todas as interfaces (LAN, VPN, etc.)
  await app.listen(port, '0.0.0.0');
  
  const localIP = getLocalIP();

  logger.log(`🚀 FiscalSync Backend rodando em: http://${localIP}:${port}`);
  logger.log(`📊 API disponível em: http://${localIP}:${port}/api/config`);
  logger.log(`🌐 Origins permitidas: ${JSON.stringify(allowedOrigins)}`);
}

void bootstrap();