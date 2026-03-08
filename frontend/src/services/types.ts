// frontend/src/services/types.ts
// Tipos centralizados usados por todos os módulos de API e componentes.

export type EntityType = 'nota_venda' | 'nota_compra' | 'cupom';

export const ENTITY_LABELS: Record<EntityType, string> = {
  nota_venda:  'NF-e Venda',
  nota_compra: 'NF-e Compra',
  cupom:       'Cupom Fiscal',
};

export const ENTITY_ENDPOINTS: Record<EntityType, string> = {
  nota_venda:  '/v1/venda/notas-fiscais',
  nota_compra: '/v1/compra/notas-fiscais',
  cupom:       '/v1/venda/cupons-fiscais',
};

export interface Credencial {
  id: number;
  api_url: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface SyncConfig {
  id: number;
  entity_type: EntityType;
  credencial_id: number;
  interval_hours: '1' | '2' | '4' | '6' | '12' | '24';
  is_active: boolean;
  last_sync_id: number;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: number;
  entity_type: EntityType;
  status: 'success' | 'error' | 'running';
  start_id: number | null;
  end_id: number | null;
  records_imported: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface LogStats {
  total: number;
  success: number;
  error: number;
  running: number;
  entities: Record<EntityType, {
    lastSync: string | null;
    lastSyncId: number;
    nextSync: string | null;
    isActive: boolean;
    intervalHours: string | null;
    lastLog: SyncLog | null;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
