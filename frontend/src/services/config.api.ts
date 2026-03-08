// frontend/src/services/config.api.ts
import apiClient from './api.client';
import type { SyncConfig } from './types';

export const configApi = {
  list: () =>
    apiClient.get<SyncConfig[]>('/config').then(r => r.data),

  create: (data: Omit<SyncConfig, 'id' | 'last_sync_id' | 'last_sync_at' | 'created_at' | 'updated_at'>) =>
    apiClient.post<SyncConfig>('/config', data).then(r => r.data),

  update: (id: number, data: Partial<SyncConfig>) =>
    apiClient.put<SyncConfig>(`/config/${id}`, data).then(r => r.data),

  resetLastSyncId: (id: number) =>
    apiClient.patch<SyncConfig>(`/config/${id}/reset`).then(r => r.data),

  remove: (id: number) =>
    apiClient.delete(`/config/${id}`),
};
