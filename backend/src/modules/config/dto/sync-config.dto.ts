// backend/src/modules/config/dto/sync-config.dto.ts
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export type EntityType    = 'nota_venda' | 'nota_compra' | 'cupom';
export type IntervalHours = '1' | '2' | '4' | '6' | '12' | '24';

export class CreateSyncConfigDto {
  @IsEnum(['nota_venda', 'nota_compra', 'cupom'], {
    message: 'entity_type deve ser "nota_venda", "nota_compra" ou "cupom"',
  })
  entity_type!: EntityType;

  @IsInt()
  @IsPositive()
  credencial_id!: number;

  @IsEnum(['1', '2', '4', '6', '12', '24'], {
    message: 'interval_hours deve ser 1, 2, 4, 6, 12 ou 24',
  })
  interval_hours!: IntervalHours;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateSyncConfigDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  credencial_id?: number;

  @IsEnum(['1', '2', '4', '6', '12', '24'], {
    message: 'interval_hours deve ser 1, 2, 4, 6, 12 ou 24',
  })
  @IsOptional()
  interval_hours?: IntervalHours;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  last_sync_id?: number;
}