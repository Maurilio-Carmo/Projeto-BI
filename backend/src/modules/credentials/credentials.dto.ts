// backend/src/modules/credentials/credentials.dto.ts
import { IsString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCredencialDto {
  @IsUrl()
  @IsNotEmpty()
  api_url!: string;

  @IsString()
  @IsNotEmpty()
  api_key!: string;
}

export class UpdateCredencialDto {
  @IsUrl()
  @IsOptional()
  api_url?: string;

  @IsString()
  @IsOptional()
  api_key?: string;
}
