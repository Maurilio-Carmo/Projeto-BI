// backend/src/database/drizzle.ts
// ── Driver: @libsql/client (libSQL) ─────────────────────────────────────────
// Motivo da troca: better-sqlite3 exige compilação nativa (Python + node-gyp).
// @libsql/client distribui binários pré-compilados para Windows/Linux/macOS —
// sem dependência de Python, node-gyp ou Visual Studio.
//
// API idêntica ao SQLite: lê/escreve o mesmo arquivo .db local.
// String de conexão para arquivo local: "file:./database/retailbi.db"
//
// ── CORREÇÃO ─────────────────────────────────────────────────────────────────
// Antes: 6 imports manuais com nomes de arquivo errados
//        (nota-venda, nota-compra, cupom — arquivos reais são notas-venda,
//         notas-compra, cupons-fiscais) e 40 schemas ignorados.
// Agora: importação única via schema/index.ts — todos os 46 schemas registrados.
// ─────────────────────────────────────────────────────────────────────────────
import { drizzle }      from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as path        from 'path';
import * as fs          from 'fs';

// ── Importa TODOS os 46 schemas de uma vez via index ─────────────────────────
import * as schema from './schema/index';
export { schema };

import type { LibSQLDatabase } from 'drizzle-orm/libsql';

/** Tipo da instância Drizzle — usado nos @Inject('DRIZZLE') dos services */
export type DrizzleDB = LibSQLDatabase<typeof schema>;

/**
 * Alias de compatibilidade — modules que importam `Database` de drizzle.ts.
 * Aponta para o mesmo tipo DrizzleDB.
 */
export type Database = DrizzleDB;

/**
 * Cria e retorna a instância Drizzle conectada ao arquivo SQLite via libSQL.
 *
 * @param filepath - Caminho do arquivo .db
 *                   Ex: './database/retailbi.db'
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
