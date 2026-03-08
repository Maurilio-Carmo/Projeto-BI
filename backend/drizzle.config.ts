// backend/drizzle.config.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • dialect:      'mysql'  → 'sqlite'
//   • dbCredentials: { host, port, user, password, database }
//                 → { url: DATABASE_FILE }
// ─────────────────────────────────────────────────────────────────────────────
import type { Config } from 'drizzle-kit';
import * as dotenv     from 'dotenv';
import * as path       from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const toSlash = (p: string) => p.replace(/\\/g, '/');

export default {
  schema: toSlash(path.join(__dirname, 'src/database/schema/index.ts')),
  out:    toSlash(path.join(__dirname, 'src/database/migrations')),

  dialect: 'sqlite',

  dbCredentials: {
    url: process.env.DATABASE_FILE ?? './database/retailbi.db',
  },

  verbose: true,
  strict:  true,
} satisfies Config;
