// backend/src/modules/sync/repositories/nota-compra.repository.ts
//
// Isola toda a lógica de persistência (upsert) da entidade nota_compra.

import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { notaCompra, notaCompraItem } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaCompraRepository {
  private readonly logger = new Logger(NotaCompraRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  /**
   * Faz upsert da nota de compra e de todos os seus itens.
   * Usa onDuplicateKeyUpdate para garantir idempotência.
   */
  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'COMPRA');

    await this.db
      .insert(notaCompra)
      .values(values)
      .onDuplicateKeyUpdate({ set: { ...values, updated_at: new Date() } });

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const itemValues = mapItemNotaFiscalToDb(itemNota, Number(item.id));
        await this.db
          .insert(notaCompraItem)
          .values({ ...itemValues, nota_compra_external_id: Number(item.id) })
          .onDuplicateKeyUpdate({ set: { ...itemValues, updated_at: new Date() } });
      }
    }
  }
}
