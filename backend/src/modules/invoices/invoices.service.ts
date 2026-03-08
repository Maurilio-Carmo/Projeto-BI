// backend/src/modules/invoices/invoices.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { desc, count, sql } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../../database/database.module';
import { Database } from '../../database/drizzle';
import { notaVenda } from '../../database/schema/nota-venda'; // ✅ era './schema/invoices'

@Injectable()
export class InvoicesService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: Database) {}

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page  = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;
    const search = params.search?.trim();

    // ✅ Campos reais da tabela nota_venda (numero_nota, chave_nfe, loja_id)
    const whereConditions = search
      ? sql`(
          ${notaVenda.numero_nota} LIKE ${`%${search}%`}
          OR ${notaVenda.chave_nfe}  LIKE ${`%${search}%`}
        )`
      : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(notaVenda)
        .where(whereConditions)
        .orderBy(desc(notaVenda.data_emissao))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(notaVenda)
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
    const [result] = await this.db.select({ total: count() }).from(notaVenda);
    return { total: result?.total ?? 0 };
  }
}
