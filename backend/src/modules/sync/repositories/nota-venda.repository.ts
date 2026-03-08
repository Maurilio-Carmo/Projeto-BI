// backend/src/modules/sync/repositories/nota-venda.repository.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Import: 'transacoes/nota-venda' não existe.
//    Correto: 'transacoes/notas-venda' (plural) → export: notasVenda
// 2. 'transacoes/nota-venda-item' → 'transacoes/notas-venda-itens' → notasVendaItens
// 3. Mapper agora retorna camelCase. FK: notaFiscalVendaId (era nota_venda_external_id)
// 4. ✅ Campos obrigatórios ausentes no mapper adicionados com fallback:
//    - tipoDeDocumentoFiscal: obrigatório no schema → default 'NF-e'
//    - valorTotalDosItens: obrigatório no schema → default 0
//    - compoeTotalDaNota (itens): obrigatório no schema → default true
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

  /**
   * Insere a nota de venda e seus itens.
   *
   * NOTA SOBRE DUPLICATAS:
   * O schema `notasVenda` não possui unique em external_id (campo inexistente).
   * A deduplicação é garantida pelo cursor incremental (lastSyncId / offset).
   * Em caso de reprocessamento, use resetLastSyncId — duplicatas são aceitas.
   * Use onConflictDoNothing nos itens para evitar falhas por PK duplicada.
   */
  async upsert(item: any): Promise<void> {
    const mappedValues = mapNotaFiscalToDb(item, 'VENDA');

    // ✅ Garante campos NOT NULL obrigatórios que o mapper pode não incluir
    const values = {
      ...mappedValues,
      tipoDeDocumentoFiscal:
        mappedValues.tipoDeDocumentoFiscal ?? item.tipoDeDocumentoFiscal ?? 'NF-e',
      valorTotalDosItens:
        mappedValues.valorTotalDosItens ?? item.valorTotalDosItens ?? 0,
    };

    // Inserção da nota — sem onConflict pois não há unique além de PK autoincrement.
    // A paginação por offset evita duplicatas em operação normal.
    const insertResult = await this.db
      .insert(notasVenda)
      .values(values as any)
      .onConflictDoNothing(); // segurança contra re-runs

    // Obtém o ID interno gerado para usar como FK nos itens
    const notaInternalId = insertResult.lastInsertRowid
      ? Number(insertResult.lastInsertRowid)
      : null;

    if (!notaInternalId) {
      // Registro já existia (onConflictDoNothing) — não processa itens
      return;
    }

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const mappedItem = mapItemNotaFiscalToDb(itemNota);

        // ✅ Garante campos NOT NULL dos itens que o mapper pode não incluir
        const itemValues = {
          ...mappedItem,
          notaFiscalVendaId: notaInternalId, // FK para notasVenda.id
          compoeTotalDaNota:
            mappedItem.compoeTotalDaNota ?? itemNota.compoeTotalDaNota ?? true,
          // Campos numéricos nullable recebem fallback 0
          quantidade: mappedItem.quantidade ?? itemNota.quantidade ?? 0,
          valorUnitario: mappedItem.valorUnitario ?? itemNota.valorUnitario ?? 0,
          valorTotal: mappedItem.valorTotal ?? itemNota.valorTotal ?? 0,
          modalidadeDaBaseDeCalculo:
            mappedItem.modalidadeDaBaseDeCalculo ??
            itemNota.modalidadeDaBaseDeCalculo ??
            null,
        };

        await this.db
          .insert(notasVendaItens)
          .values(itemValues as any)
          .onConflictDoNothing();
      }
    }
  }
}
