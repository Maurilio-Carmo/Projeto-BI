// backend/src/modules/sync/repositories/cupom.repository.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. 'transacoes/cupom' não existe → 'transacoes/cupons-fiscais' → cuponsFiscais
// 2. 'cupomItem' não existe → cupomItens (de 'transacoes/cupons-itens')
// 3. 'cupomFinalizacao' não existe → cupomFinalizacoes (de 'transacoes/cupons-finalizacoes')
// 4. cupomFiscalId: FK para cuponsFiscais.id (ID interno), obtido via lastInsertRowid.
// 5. Mapper retorna camelCase → campos do schema corretos.
// 6. ✅ Campos numéricos nullable recebem fallback ?? 0 para compatibilidade
//    com colunas NOT NULL do schema Drizzle (ex: acrescimo, desconto, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { cuponsFiscais, cupomItens, cupomFinalizacoes } from '../../../database/schema';
import {
  mapCupomToDb,
  mapCupomItemToDb,
  mapFinalizacaoToDb,
} from '../mappers/cupom.mapper';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Aplica fallback numérico em todos os campos que possam ser null/undefined
 *  mas o schema Drizzle exige como NOT NULL number.
 *  Mantém a assinatura do objeto intacta para o insert. */
function sanitizeCupomValues(values: Record<string, any>): Record<string, any> {
  const numericNotNullFields = [
    'acrescimo',
    'desconto',
    'valorTotal',
    'subtotal',
    'totalPago',
    'troco',
    'totalDesconto',
    'totalAcrescimo',
    'percentualDesconto',
    'percentualAcrescimo',
  ];

  const sanitized = { ...values };
  for (const field of numericNotNullFields) {
    if (sanitized[field] === null || sanitized[field] === undefined) {
      sanitized[field] = 0;
    }
  }
  return sanitized;
}

/** Sanitiza os valores dos itens do cupom */
function sanitizeCupomItemValues(values: Record<string, any>): Record<string, any> {
  const numericNotNullFields = [
    'quantidade',
    'valorUnitario',
    'valorTotal',
    'desconto',
    'acrescimo',
    'percentualDesconto',
    'percentualAcrescimo',
    'valorCusto',
  ];

  const sanitized = { ...values };
  for (const field of numericNotNullFields) {
    if (sanitized[field] === null || sanitized[field] === undefined) {
      sanitized[field] = 0;
    }
  }
  return sanitized;
}

@Injectable()
export class CupomRepository {
  private readonly logger = new Logger(CupomRepository.name);

  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  /**
   * Insere o cupom fiscal, seus itens de venda e suas finalizações.
   *
   * O ID interno (`cuponsFiscais.id` autoincrement) é recuperado via
   * `lastInsertRowid` e usado como FK nas sub-tabelas.
   *
   * NOTA: `identificadorId` (ID do VarejoFácil) não tem UNIQUE declarado
   * no schema. Duplicatas são evitadas pelo cursor incremental (lastSyncId).
   */
  async upsert(item: any): Promise<void> {
    // ✅ Sanitiza campos numéricos antes do insert para evitar null em NOT NULL
    const rawValues = mapCupomToDb(item);
    const values = sanitizeCupomValues(rawValues);

    // Insere o cupom — onConflictDoNothing como proteção contra re-runs
    const insertResult = await this.db
      .insert(cuponsFiscais)
      .values(values as any)
      .onConflictDoNothing();

    // libSQL: lastInsertRowid é BigInt | undefined
    const cupomInternalId = insertResult.lastInsertRowid
      ? Number(insertResult.lastInsertRowid)
      : null;

    if (!cupomInternalId) {
      // Cupom já existia — não processa sub-registros para evitar duplicatas
      return;
    }

    // ── Itens de venda ────────────────────────────────────────────────────────
    if (Array.isArray(item.itensVenda)) {
      for (const itemVenda of item.itensVenda) {
        const rawItemValues = mapCupomItemToDb(itemVenda, cupomInternalId);
        const itemValues = sanitizeCupomItemValues(rawItemValues);

        await this.db
          .insert(cupomItens)
          .values(itemValues as any)
          .onConflictDoNothing();
      }
    }

    // ── Finalizações (formas de pagamento) ────────────────────────────────────
    if (Array.isArray(item.finalizacoes)) {
      for (const fin of item.finalizacoes) {
        const finValues = mapFinalizacaoToDb(fin, cupomInternalId);
        await this.db
          .insert(cupomFinalizacoes)
          .values(finValues as any)
          .onConflictDoNothing();
      }
    }
  }
}
