// backend/src/modules/config/config.dto.ts
import { IsEnum, IsInt, IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class CreateSyncConfigDto {
  @IsEnum(['nota_venda', 'nota_compra', 'cupom'])
  entity_type!: 'nota_venda' | 'nota_compra' | 'cupom';

  @IsInt()
  @IsPositive()
  credencial_id!: number;

  @IsEnum(['1', '2', '4', '6', '12', '24'])
  interval_hours!: '1' | '2' | '4' | '6' | '12' | '24';

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateSyncConfigDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  credencial_id?: number;

  @IsEnum(['1', '2', '4', '6', '12', '24'])
  @IsOptional()
  interval_hours?: '1' | '2' | '4' | '6' | '12' | '24';

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
