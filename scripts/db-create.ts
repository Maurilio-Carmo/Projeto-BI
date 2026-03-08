// scripts/db-create.ts
// Cria o banco de dados caso não exista, antes do drizzle-kit push

import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const connection = await createConnection({
    host:     process.env.DATABASE_HOST     ?? 'localhost',
    port:     Number(process.env.DATABASE_PORT ?? 3306),
    user:     process.env.DATABASE_USER     ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    // ← sem `database` aqui, pois ele ainda não existe
  });

  const dbName = process.env.DATABASE_NAME ?? 'fiscalsync';

  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci`
  );

  console.log(`✅ Banco de dados "${dbName}" pronto.`);
  await connection.end();
}

createDatabase().catch((err) => {
  console.error('❌ Erro ao criar banco de dados:', err.message);
  process.exit(1);
});