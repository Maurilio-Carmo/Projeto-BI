// backend/src/modules/sync/repositories/nota-compra.repository.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Import: 'transacoes/nota-compra' não existe.
//    Correto: 'transacoes/notas-compra' → export: notasCompra
// 2. 'transacoes/nota-compra-item' → 'transacoes/notas-compra-itens' → notasCompraItens
// 3. Mapper retorna camelCase. FK: notaCompraId (era nota_compra_external_id)
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { notasCompra, notasCompraItens } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaCompraRepository {
  private readonly logger = new Logger(NotaCompraRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'COMPRA');

    const insertResult = await this.db
      .insert(notasCompra)
      .values(values)
      .onConflictDoNothing();

    const notaInternalId = insertResult.lastInsertRowid
      ? Number(insertResult.lastInsertRowid)
      : null;

    if (!notaInternalId) return;

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const itemValues = {
          ...mapItemNotaFiscalToDb(itemNota),
          notaCompraId: notaInternalId, // FK para notasCompra.id
        };

        await this.db
          .insert(notasCompraItens)
          .values(itemValues)
          .onConflictDoNothing();
      }
    }
  }
}
