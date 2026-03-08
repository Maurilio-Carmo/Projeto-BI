// backend/src/modules/sync/repositories/cupom.repository.ts
//
// Isola toda a lógica de persistência (upsert) das entidades
// cupom, cupom_item e cupom_finalizacao.

import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB } from '../../../database/drizzle';
import { cupom, cupomItem, cupomFinalizacao } from '../../../database/schema';
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
   * Faz upsert do cupom fiscal, seus itens de venda e suas finalizações.
   * Usa onDuplicateKeyUpdate para garantir idempotência.
   */
  async upsert(item: any): Promise<void> {
    const values = mapCupomToDb(item);

    await this.db
      .insert(cupom)
      .values(values)
      .onDuplicateKeyUpdate({ set: { ...values, updated_at: new Date() } });

    const cupomExtId = Number(item.identificadorId);

    // Upsert dos itens de venda
    if (Array.isArray(item.itensVenda)) {
      for (const itemVenda of item.itensVenda) {
        const itemValues = mapCupomItemToDb(itemVenda, cupomExtId);
        await this.db
          .insert(cupomItem)
          .values(itemValues)
          .onDuplicateKeyUpdate({ set: { ...itemValues, updated_at: new Date() } });
      }
    }

    // Upsert das finalizações (formas de pagamento)
    if (Array.isArray(item.finalizacoes)) {
      for (const fin of item.finalizacoes) {
        const finValues = mapFinalizacaoToDb(fin, cupomExtId);
        await this.db
          .insert(cupomFinalizacao)
          .values(finValues)
          .onDuplicateKeyUpdate({ set: { ...finValues, updated_at: new Date() } });
      }
    }
  }
}
