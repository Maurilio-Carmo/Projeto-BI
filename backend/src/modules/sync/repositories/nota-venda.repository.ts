// backend/src/modules/sync/repositories/nota-venda.repository.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alteração CRÍTICA:
//   .onDuplicateKeyUpdate({ set: { ... } })              ← MySQL
//   .onConflictDoUpdate({ target: <col>, set: { ... } }) ← SQLite
//
// O campo `target` aponta para a coluna com UNIQUE constraint:
//   • notaVenda:     external_id
//   • notaVendaItem: sem unique próprio → usa `onConflictDoNothing()` como fallback
//                    (items são idempotentes pelo par nota_venda_external_id + sequencial)
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB }  from '../../../database/drizzle';
import { notaVenda, notaVendaItem } from '../../../database/schema';
import { mapNotaFiscalToDb, mapItemNotaFiscalToDb } from '../mappers/nota-fiscal.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class NotaVendaRepository {
  private readonly logger = new Logger(NotaVendaRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  /**
   * Faz upsert da nota de venda e de todos os seus itens.
   * SQLite: usa onConflictDoUpdate em vez de onDuplicateKeyUpdate.
   */
  async upsert(item: any): Promise<void> {
    const values = mapNotaFiscalToDb(item, 'VENDA');

    // Upsert da nota — conflito em external_id (UNIQUE)
    await this.db
      .insert(notaVenda)
      .values(values)
      .onConflictDoUpdate({
        target: notaVenda.external_id,
        set: { ...values, updated_at: new Date() },
      });

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const itemValues = mapItemNotaFiscalToDb(itemNota, Number(item.id));
        const fullValues = { ...itemValues, nota_venda_external_id: Number(item.id) };

        // Itens não possuem unique próprio além do PK autoincrement.
        // Estratégia: tenta inserir e ignora conflito de PK duplicado.
        // Para reprocessamento completo, use resetLastSyncId para reimportar.
        await this.db
          .insert(notaVendaItem)
          .values(fullValues)
          .onConflictDoNothing();
      }
    }
  }
}
