// backend/src/modules/sync/repositories/nota-venda.repository.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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

    // notasVenda não tem externalId — usa onConflictDoNothing como proteção
    await this.db.insert(notasVenda).values(values).onConflictDoNothing();

    if (!Array.isArray(item.itens)) return;

    // Recupera o ID interno via chaveDaNfe com eq() correto do Drizzle
    let notaFiscalVendaId: number = Number(item.id ?? 0);

    if (values.chaveDaNfe) {
      const rows = await this.db
        .select({ id: notasVenda.id })
        .from(notasVenda)
        .where(eq(notasVenda.chaveDaNfe, values.chaveDaNfe))  // ← eq() correto ✅
        .limit(1);
      if (rows.length) notaFiscalVendaId = rows[0].id;
    }

    for (const itemNota of item.itens) {
      const itemValues = mapItemNotaFiscalToDb(itemNota);

      await this.db
        .insert(notasVendaItens)
        .values({
          ...itemValues,
          notaFiscalVendaId,
          // Campos NOT NULL que o mapper deixa sem default — garantir fallback
          quantidadeDeItensNaUnidade: itemValues.quantidadeDeItensNaUnidade ?? 1, // ← NOT NULL ✅
          valorDaEmbalagem:           itemValues.valorDaEmbalagem           ?? 0, // ← NOT NULL ✅
          compoeTotalDaNota:          itemNota.compoeTotalDaNota            ?? true,
        })
        .onConflictDoNothing();
    }
  }
}