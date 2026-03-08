// backend/src/modules/sync/repositories/cupom.repository.ts
// ── MIGRAÇÃO MySQL → SQLite ──────────────────────────────────────────────────
// Alterações:
//   • cupom principal:     onConflictDoUpdate target: cupom.external_id
//   • cupomItem:           onConflictDoNothing (sem unique composta)
//   • cupomFinalizacao:    onConflictDoNothing (sem unique composta)
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Logger, Inject } from '@nestjs/common';
import { DrizzleDB }  from '../../../database/drizzle';
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
   * SQLite: usa onConflictDoUpdate / onConflictDoNothing.
   */
  async upsert(item: any): Promise<void> {
    const values = mapCupomToDb(item);

    // Upsert do cupom — conflito em external_id (UNIQUE)
    await this.db
      .insert(cupom)
      .values(values)
      .onConflictDoUpdate({
        target: cupom.external_id,
        set: { ...values, updated_at: new Date() },
      });

    const cupomExtId = Number(item.identificadorId);

    // Upsert dos itens de venda
    if (Array.isArray(item.itensVenda)) {
      for (const itemVenda of item.itensVenda) {
        const itemValues = mapCupomItemToDb(itemVenda, cupomExtId);
        await this.db
          .insert(cupomItem)
          .values(itemValues)
          .onConflictDoNothing();
      }
    }

    // Upsert das finalizações (formas de pagamento)
    if (Array.isArray(item.finalizacoes)) {
      for (const fin of item.finalizacoes) {
        const finValues = mapFinalizacaoToDb(fin, cupomExtId);
        await this.db
          .insert(cupomFinalizacao)
          .values(finValues)
          .onConflictDoNothing();
      }
    }
  }
}
