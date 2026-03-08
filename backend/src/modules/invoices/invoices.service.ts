// backend/src/modules/invoices/invoices.service.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// 1. Import: 'transacoes/nota-venda' não existe.
//    Correto: importa notasVenda de '../../database/schema' (via index)
// 2. Campos camelCase:
//    notaVenda.numero_nota → notasVenda.numeroNota
//    notaVenda.chave_nfe   → notasVenda.chaveDaNfe
//    notaVenda.data_emissao → notasVenda.dataEmissao
// 3. Token: DRIZZLE_TOKEN removido, usa '@Inject("DRIZZLE")' direto
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, Inject } from '@nestjs/common';
import { desc, count, sql } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { notasVenda } from '../../database/schema';

@Injectable()
export class InvoicesService {
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page   = Math.max(1, params.page ?? 1);
    const limit  = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;
    const search = params.search?.trim();

    const whereConditions = search
      ? sql`(
          ${notasVenda.numeroNota} LIKE ${`%${search}%`}
          OR ${notasVenda.chaveDaNfe}  LIKE ${`%${search}%`}
        )`
      : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(notasVenda)
        .where(whereConditions)
        .orderBy(desc(notasVenda.dataEmissao))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(notasVenda)
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
      .from(notasVenda);
    return { total: result?.total ?? 0 };
  }
}
