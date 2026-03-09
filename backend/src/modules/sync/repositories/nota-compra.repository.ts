// backend/src/modules/sync/repositories/nota-compra.repository.ts
//
// CORREÇÕES:
//  1. notaCompra     → notasCompra      (nome exportado em notas-compra.ts)
//  2. notaCompraItem → notasCompraItens (nome exportado em notas-compra-itens.ts)
//  3. mapItemNotaFiscalToDb(itemNota, N) → mapItemNotaFiscalToDb(itemNota)
//     (mapper aceita apenas 1 argumento na versão atual)
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

    await this.db
      .insert(notasCompra)                            // ← notasCompra (plural)
      .values(values)
      .onConflictDoUpdate({
        target: notasCompra.externalId,
        set: { ...values, updatedAt: new Date().toISOString() },
      });

    if (!Array.isArray(item.itens)) return;

    for (const itemNota of item.itens) {
      const itemValues = mapItemNotaFiscalToDb(itemNota);  // ← 1 argumento

      await this.db
        .insert(notasCompraItens)                     // ← notasCompraItens (plural)
        .values({
          ...itemValues,
          notaCompraId: Number(item.id),
        })
        .onConflictDoNothing();
    }
  }
}
