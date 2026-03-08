// backend/src/database/schema/index.ts
// Exporta todos os schemas para uso no DrizzleORM e drizzle-kit
// ── Sem alterações de lógica — apenas os arquivos fontes mudaram (MySQL → SQLite)

export * from './credencial';
export * from './nota-venda';
export * from './nota-compra';
export * from './cupom';
export * from './sync-config';
export * from './sync-logs';
