// frontend/src/services/credentials.api.ts
import apiClient from './api.client';
import type { Credencial } from './types';

export const credencialApi = {
  list: () =>
    apiClient.get<Credencial[]>('/credentials').then(r => r.data),

  create: (data: Omit<Credencial, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<Credencial>('/credentials', data).then(r => r.data),

  update: (id: number, data: Partial<Omit<Credencial, 'id' | 'created_at' | 'updated_at'>>) =>
    apiClient.put<Credencial>(`/credentials/${id}`, data).then(r => r.data),

  remove: (id: number) =>
    apiClient.delete(`/credentials/${id}`),
};
