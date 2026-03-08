// backend/src/modules/coupons/coupons.service.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Import: 'transacoes/cupom' não existe.
//    Correto: importa cuponsFiscais de '../../database/schema' (via index)
// 2. Campos camelCase:
//    cupom.sequencial       → cuponsFiscais.sequencial       (já era camelCase)
//    cupom.chave_eletronica → cuponsFiscais.chaveEletronica
//    cupom.numero_caixa     → cuponsFiscais.numeroCaixa
//    cupom.data             → cuponsFiscais.dataVenda
// 3. Token: DRIZZLE_TOKEN removido, usa '@Inject("DRIZZLE")' direto
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Inject } from '@nestjs/common';
import { desc, count, sql } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { cuponsFiscais } from '../../database/schema';

@Injectable()
export class CouponsService {
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page   = Math.max(1, params.page ?? 1);
    const limit  = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;
    const search = params.search?.trim();

    const whereConditions = search
      ? sql`(
          ${cuponsFiscais.sequencial}       LIKE ${`%${search}%`}
          OR ${cuponsFiscais.chaveEletronica} LIKE ${`%${search}%`}
          OR ${cuponsFiscais.numeroCaixa}     LIKE ${`%${search}%`}
        )`
      : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(cuponsFiscais)
        .where(whereConditions)
        .orderBy(desc(cuponsFiscais.dataVenda))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(cuponsFiscais)
        .where(whereConditions),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getStats() {
    const [result] = await this.db
      .select({ total: count() })
      .from(cuponsFiscais);
    return { total: result?.total ?? 0 };
  }
}
