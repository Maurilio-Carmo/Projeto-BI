// backend/src/modules/sync/repositories/nota-venda.repository.ts
//
// CORREÇÕES:
//  1. notaVenda     → notasVenda      (nome exportado em notas-venda.ts)
//  2. notaVendaItem → notasVendaItens (nome exportado em notas-venda-itens.ts)
//  3. mapItemNotaFiscalToDb(itemNota, N) → mapItemNotaFiscalToDb(itemNota)
//     (mapper aceita apenas 1 argumento na versão atual)
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { notasVenda, notasVendaItens } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaVendaRepository {
  private readonly logger = new Logger(NotaVendaRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'VENDA');

    await this.db
      .insert(notasVenda)                            // ← notasVenda (plural)
      .values(values)
      .onConflictDoUpdate({
        target: notasVenda.externalId,
        set: { ...values, updatedAt: new Date().toISOString() },
      });

    if (!Array.isArray(item.itens)) return;

    for (const itemNota of item.itens) {
      const itemValues = mapItemNotaFiscalToDb(itemNota);  // ← 1 argumento

      await this.db
        .insert(notasVendaItens)                     // ← notasVendaItens (plural)
        .values({
          ...itemValues,
          notaFiscalVendaId: Number(item.id),
        })
        .onConflictDoNothing();
    }
  }
}
