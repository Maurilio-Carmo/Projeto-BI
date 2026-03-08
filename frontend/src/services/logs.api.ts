// frontend/src/services/logs.api.ts
import apiClient from './api.client';
import type { EntityType, SyncLog, LogStats, PaginatedResponse } from './types';

export const logsApi = {
  list: (params?: {
    entity?: EntityType;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient
      .get<PaginatedResponse<SyncLog>>('/logs', { params })
      .then(r => r.data),

  stats: () =>
    apiClient.get<LogStats>('/logs/stats').then(r => r.data),
};
