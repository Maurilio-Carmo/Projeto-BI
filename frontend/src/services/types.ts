// frontend/src/services/types.ts

export type EntityType = 'cupons_fiscais' | 'notas_venda' | 'notas_compra' | 'produtos' | 'precos' | 'estoque';

export interface SyncJob {
  entity: EntityType;
  name: string;
  endpoint: string;
  frequency: string;
  status: 'RODANDO' | 'PAUSADO' | 'ERRO';
  records: number;
  active: boolean;
  color: string;
  icon: string;
  lastSync?: string;
}

export interface SyncLog {
  id: number;
  entity: string;
  status: 'success' | 'error' | 'running';
  records: number;
  startId?: number;
  endId?: number;
  duration: string;
  startedAt: string;
}

export interface AnalyticsSummary {
  faturamento: number;
  lucroBruto: number;
  cmv: number;
  ticketMedio: number;
  margemMedia: number;
  totalCupons: number;
  totalNfe: number;
  totalCompras: number;
  valorEstoque: number;
}

export interface ConfigEntity {
  id: number;
  entity: EntityType;
  name: string;
  endpoint: string;
  intervalMinutes: number;
  isActive: boolean;
  lastSyncId: number;
  lastSyncAt: string;
}

export interface SyncStatus {
  entity: string;
  name: string;
  lastId: string;
  lastTime: string;
  color: string;
}
