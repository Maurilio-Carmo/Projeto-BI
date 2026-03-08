// backend/src/database/drizzle.ts
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as credencialSchema from './schema/credencial';
import * as notaVendaSchema  from './schema/nota-venda';
import * as notaCompraSchema from './schema/nota-compra';
import * as cupomSchema      from './schema/cupom';
import * as syncConfigSchema from './schema/sync-config';
import * as syncLogsSchema   from './schema/sync-logs';

export const schema = {
  ...credencialSchema,
  ...notaVendaSchema,
  ...notaCompraSchema,
  ...cupomSchema,
  ...syncConfigSchema,
  ...syncLogsSchema,
};

export type Database = ReturnType<typeof createDrizzleInstance>;
export type DrizzleDB = Database;

export function createDrizzleInstance(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}) {
  const pool = createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return drizzle(pool, { schema, mode: 'default' });
}
