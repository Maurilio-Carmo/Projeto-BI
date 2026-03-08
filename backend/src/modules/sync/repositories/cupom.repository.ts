// backend/src/modules/sync/repositories/cupom.repository.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. 'transacoes/cupom' não existe → 'transacoes/cupons-fiscais' → cuponsFiscais
// 2. 'cupomItem' não existe → cupomItens (de 'transacoes/cupons-itens')
// 3. 'cupomFinalizacao' não existe → cupomFinalizacoes (de 'transacoes/cupons-finalizacoes')
// 4. cupomFiscalId: FK para cuponsFiscais.id (ID interno), obtido via lastInsertRowid.
// 5. Mapper retorna camelCase → campos do schema corretos.
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
    const values = mapCupomToDb(item);

    // Insere o cupom — onConflictDoNothing como proteção contra re-runs
    const insertResult = await this.db
      .insert(cuponsFiscais)
      .values(values)
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
        const itemValues = mapCupomItemToDb(itemVenda, cupomInternalId);
        await this.db
          .insert(cupomItens)
          .values(itemValues)
          .onConflictDoNothing();
      }
    }

    // ── Finalizações (formas de pagamento) ────────────────────────────────────
    if (Array.isArray(item.finalizacoes)) {
      for (const fin of item.finalizacoes) {
        const finValues = mapFinalizacaoToDb(fin, cupomInternalId);
        await this.db
          .insert(cupomFinalizacoes)
          .values(finValues)
          .onConflictDoNothing();
      }
    }
  }
}
