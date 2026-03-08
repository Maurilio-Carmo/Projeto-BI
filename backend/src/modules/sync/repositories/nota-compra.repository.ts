// backend/src/modules/sync/repositories/nota-compra.repository.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Mesma lógica de nota-venda.repository.ts:
//   onDuplicateKeyUpdate → onConflictDoUpdate (nota principal)
//   onDuplicateKeyUpdate → onConflictDoNothing (itens sem unique próprio)
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB }  from '../../../database/drizzle';
import { notaCompra, notaCompraItem } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaCompraRepository {
  private readonly logger = new Logger(NotaCompraRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  /**
   * Faz upsert da nota de compra e de todos os seus itens.
   * SQLite: usa onConflictDoUpdate em vez de onDuplicateKeyUpdate.
   */
  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'COMPRA');

    // Upsert da nota — conflito em external_id (UNIQUE)
    await this.db
      .insert(notaCompra)
      .values(values)
      .onConflictDoUpdate({
        target: notaCompra.external_id,
        set: { ...values, updated_at: new Date() },
      });

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const itemValues = mapItemNotaFiscalToDb(itemNota, Number(item.id));
        await this.db
          .insert(notaCompraItem)
          .values({ ...itemValues, nota_compra_external_id: Number(item.id) })
          .onConflictDoNothing();
      }
    }
  }
}
