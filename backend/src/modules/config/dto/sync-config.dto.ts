// backend/src/modules/config/dto/sync-config.dto.ts
//
// ── CORREÇÕES ────────────────────────────────────────────────────────────────
// Mapeados para o novo schema de sync_config:
//   - sem credencial_id (credenciais agora ficam em syncConfig inline)
//   - intervalMinutes (era interval_hours)
//   - apiEndpoint, baseUrlEncrypted, apiTokenEncrypted
// ─────────────────────────────────────────────────────────────────────────────
import {
  IsString,
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export type EntityType = 'nota_venda' | 'nota_compra' | 'cupom';

export class CreateSyncConfigDto {
  @IsString()
  @IsNotEmpty()
  entityType!: EntityType;

  /** Endpoint relativo, ex: /v1/venda/notas-fiscais */
  @IsString()
  @IsNotEmpty()
  apiEndpoint!: string;

  /** URL base da API (plaintext ou criptografado) */
  @IsString()
  @IsOptional()
  baseUrlEncrypted?: string;

  /** Token da API (plaintext ou criptografado) */
  @IsString()
  @IsOptional()
  apiTokenEncrypted?: string;

  /** Intervalo em minutos (60 = 1h, 360 = 6h, 1440 = 24h) */
  @IsInt()
  @IsPositive()
  @Min(10)
  @Max(10080)
  intervalMinutes!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSyncConfigDto {
  @IsString()
  @IsOptional()
  apiEndpoint?: string;

  @IsString()
  @IsOptional()
  baseUrlEncrypted?: string;

  @IsString()
  @IsOptional()
  apiTokenEncrypted?: string;

  @IsInt()
  @IsPositive()
  @Min(10)
  @Max(10080)
  @IsOptional()
  intervalMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
