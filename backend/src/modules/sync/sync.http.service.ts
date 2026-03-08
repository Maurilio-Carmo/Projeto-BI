// backend/src/modules/sync/sync.http.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { EntityType } from '../../database/schema/sync-config';

export interface ApiListResponse<T = unknown> {
  start:  number;
  count:  number;
  total:  number;
  items:  T[];
}

const ENDPOINT_MAP: Record<EntityType, string> = {
  nota_venda:  'venda/notas-fiscais',
  nota_compra: 'compra/notas-fiscais',
  cupom:       'venda/cupons-fiscais',
};

@Injectable()
export class SyncHttpService {
  private readonly logger = new Logger(SyncHttpService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Busca um lote de registros da API VarejoFácil.
   *
   * @param entityType   - Tipo da entidade
   * @param baseUrl      - URL base (ex: https://superios.varejofacil.com/api/v1)
   * @param apiToken     - Chave enviada no header x-api-key
   * @param startOffset  - Offset posicional do primeiro registro do lote
   *                       (ex: 0 → itens 0-99, 100 → itens 100-199, …)
   *                       NÃO confundir com item.id dos documentos fiscais.
   * @param count        - Quantidade de registros por lote (máx: 100)
   *
   * A resposta inclui o campo `total` que indica quantos registros existem
   * no total. O loop de paginação em SyncService usa esse valor como
   * breakpoint: continua buscando até que (startOffset + lotes) >= total.
   */
  async fetchBatch(
    entityType:  EntityType,
    baseUrl:     string,
    apiToken:    string,
    startOffset: number,
    count:       number,
  ): Promise<ApiListResponse | null> {
    const endpoint = ENDPOINT_MAP[entityType];
    const url      = `${baseUrl.replace(/\/$/, '')}/${endpoint}`;

    this.logger.debug(
      `[${entityType}] GET ${url} — start=${startOffset} count=${count}`,
    );

    const response = await firstValueFrom(
      this.httpService.get<ApiListResponse>(url, {
        params: {
          start: startOffset,
          count,
        },
        headers: {
          'x-api-key':    apiToken,
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      }),
    );

    return response.data;
  }
}
