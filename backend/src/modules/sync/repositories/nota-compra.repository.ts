// backend/src/modules/sync/repositories/nota-compra.repository.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Import: 'transacoes/nota-compra' não existe.
//    Correto: 'transacoes/notas-compra' → export: notasCompra
// 2. 'transacoes/nota-compra-item' → 'transacoes/notas-compra-itens' → notasCompraItens
// 3. Mapper retorna camelCase. FK: notaCompraId (era nota_compra_external_id)
// 4. ✅ Campos obrigatórios ausentes no mapper adicionados com fallback:
//    - tipoDeDocumentoFiscal: obrigatório no schema → default 'NF-e'
//    - valorTotalDosItens: obrigatório no schema → default 0
//    - compoeTotalDaNota (itens): obrigatório no schema → default true
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
    const mappedValues = mapNotaFiscalToDb(item, 'COMPRA');

    // ✅ Garante campos NOT NULL obrigatórios que o mapper pode não incluir
    const values = {
      ...mappedValues,
      tipoDeDocumentoFiscal:
        mappedValues.tipoDeDocumentoFiscal ?? item.tipoDeDocumentoFiscal ?? 'NF-e',
      valorTotalDosItens:
        mappedValues.valorTotalDosItens ?? item.valorTotalDosItens ?? 0,
    };

    const insertResult = await this.db
      .insert(notasCompra)
      .values(values as any)
      .onConflictDoNothing();

    const notaInternalId = insertResult.lastInsertRowid
      ? Number(insertResult.lastInsertRowid)
      : null;

    if (!notaInternalId) return;

    if (Array.isArray(item.itens)) {
      for (const itemNota of item.itens) {
        const mappedItem = mapItemNotaFiscalToDb(itemNota);

        // ✅ Garante campos NOT NULL dos itens que o mapper pode não incluir
        const itemValues = {
          ...mappedItem,
          notaCompraId: notaInternalId, // FK para notasCompra.id
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
          .insert(notasCompraItens)
          .values(itemValues as any)
          .onConflictDoNothing();
      }
    }
  }
}
