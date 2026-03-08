// backend/src/modules/credentials/credentials.service.ts
//
// ── CORREÇÃO libSQL ──────────────────────────────────────────────────────────
// @libsql/client retorna ResultSet (não array).
// API correta: result.lastInsertRowid  (BigInt | undefined)
// Era: result[0].insertId  → TS7053 Property '0' does not exist on type 'ResultSet'
// ─────────────────────────────────────────────────────────────────────────────
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../database/drizzle';
import { credencial } from '../../database/schema';
import { CreateCredencialDto, UpdateCredencialDto } from './credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDB) {}

  async findAll() {
    return this.db.select().from(credencial);
  }

  async findOne(id: number) {
    const rows = await this.db.select().from(credencial).where(eq(credencial.id, id));
    if (!rows.length) throw new NotFoundException(`Credencial #${id} não encontrada`);
    return rows[0];
  }

  async create(dto: CreateCredencialDto) {
    const result = await this.db.insert(credencial).values(dto);
    // libSQL: lastInsertRowid é BigInt — converte para number
    const newId = result.lastInsertRowid ? Number(result.lastInsertRowid) : 0;
    return this.findOne(newId);
  }

  async update(id: number, dto: UpdateCredencialDto) {
    await this.findOne(id);
    await this.db
      .update(credencial)
      .set({ ...dto, updated_at: new Date() })
      .where(eq(credencial.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(credencial).where(eq(credencial.id, id));
  }
}
