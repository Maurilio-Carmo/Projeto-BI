// backend/src/database/drizzle.ts
// ── Driver: @libsql/client (libSQL) ─────────────────────────────────────────
// Motivo da troca: better-sqlite3 exige compilação nativa (Python + node-gyp).
// @libsql/client distribui binários pré-compilados para Windows/Linux/macOS —
// sem dependência de Python, node-gyp ou Visual Studio.
//
// API idêntica ao SQLite: lê/escreve o mesmo arquivo .db local.
// String de conexão para arquivo local: "file:./database/fiscalsync.db"
// ─────────────────────────────────────────────────────────────────────────────
import { drizzle }      from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as path        from 'path';
import * as fs          from 'fs';
import * as credencialSchema from './schema/infra/credencial';
import * as notaVendaSchema  from './schema/transacoes/nota-venda';
import * as notaCompraSchema from './schema/transacoes/nota-compra';
import * as cupomSchema      from './schema/transacoes/cupom';
import * as syncConfigSchema from './schema/infra/sync-config';
import * as syncLogsSchema   from './schema/infra/sync-logs';

export const schema = {
  ...credencialSchema,
  ...notaVendaSchema,
  ...notaCompraSchema,
  ...cupomSchema,
  ...syncConfigSchema,
  ...syncLogsSchema,
};

// ── Tipo explícito do drizzle-orm/libsql ─────────────────────────────────────
// Não usar ReturnType<typeof createDrizzleInstance> — causaria referência circular.
// LibSQLDatabase<schema> é o tipo interno correto para o driver libsql.
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

/** Tipo da instância Drizzle — usado nos @Inject('DRIZZLE') dos services */
export type DrizzleDB = LibSQLDatabase<typeof schema>;

/**
 * Alias de compatibilidade — modules legados importam `Database` de drizzle.ts.
 * Aponta para o mesmo tipo DrizzleDB.
 */
export type Database = DrizzleDB;

/**
 * Cria e retorna a instância Drizzle conectada ao arquivo SQLite via libSQL.
 *
 * @param filepath - Caminho do arquivo .db
 *                   Ex: './database/fiscalsync.db'
 */
export function createDrizzleInstance(filepath: string): DrizzleDB {
  // Garante que o diretório existe antes de abrir o banco
  const absolutePath = path.resolve(filepath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  // libSQL usa prefixo "file:" para arquivos locais
  const client = createClient({
    url: `file:${absolutePath}`,
  });

  return drizzle(client, { schema });
}
