// backend/src/modules/sync/repositories/nota-venda.repository.ts
//
// Isola toda a lógica de persistência (upsert) da entidade nota_venda.
// Recebe o item bruto da API e delega o mapeamento ao nota-fiscal.mapper.

import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { notaVenda, notaVendaItem } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaVendaRepository {
  private readonly logger = new Logger(NotaVendaRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  /**
   * Faz upsert da nota de venda e de todos os seus itens.
   * Usa onDuplicateKeyUpdate para garantir idempotência.
   */
  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'VENDA');

    await this.db
      .insert(notaVenda)
      .values(values)
      .onDuplicateKeyUpdate({ set: { ...values, updated_at: new Date() } });

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const itemValues = mapItemNotaFiscalToDb(itemNota, Number(item.id));
        await this.db
          .insert(notaVendaItem)
          .values({ ...itemValues, nota_venda_external_id: Number(item.id) })
          .onDuplicateKeyUpdate({ set: { ...itemValues, updated_at: new Date() } });
      }
    }
  }
}
