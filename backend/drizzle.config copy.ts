// backend/drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega explicitamente o backend/.env independente de onde o comando é executado
// __dirname aponta para a pasta do arquivo (backend/), então resolve corretamente
dotenv.config({ path: path.resolve(__dirname, '.env') });

const toSlash = (p: string) => p.replace(/\\/g, '/');

export default {
  schema: toSlash(path.join(__dirname, 'src/database/schema/index.ts')),
  out:    toSlash(path.join(__dirname, 'src/database/migrations')),
  dialect: 'mysql',
  dbCredentials: {
    host:     process.env.DATABASE_HOST     ?? 'localhost',
    port:     Number(process.env.DATABASE_PORT ?? 3306),
    user:     process.env.DATABASE_USER     ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME     ?? 'fiscalsync',
  },
  verbose: true,
  strict: true,
} satisfies Config;
