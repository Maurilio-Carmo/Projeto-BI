// backend/src/modules/coupons/coupons.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { desc, count, sql } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../../database/database.module';
import { Database } from '../../database/drizzle';
import { cupom } from '../../database/schema/transacoes/cupom'; // ✅ era './schema/coupons'

@Injectable()
export class CouponsService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: Database) {}

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page  = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;
    const search = params.search?.trim();

    // ✅ Campos reais da tabela cupom (sequencial, chave_eletronica, numero_caixa)
    const whereConditions = search
      ? sql`(
          ${cupom.sequencial}      LIKE ${`%${search}%`}
          OR ${cupom.chave_eletronica} LIKE ${`%${search}%`}
          OR ${cupom.numero_caixa}     LIKE ${`%${search}%`}
        )`
      : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(cupom)
        .where(whereConditions)
        .orderBy(desc(cupom.data))           // ✅ campo correto no schema: 'data' (não 'data_emissao')
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(cupom)
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
    const [result] = await this.db.select({ total: count() }).from(cupom);
    return { total: result?.total ?? 0 };
  }
}
