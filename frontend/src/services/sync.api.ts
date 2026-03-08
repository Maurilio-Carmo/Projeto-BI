// frontend/src/services/sync.api.ts
import apiClient from './api.client';
import type { EntityType } from './types';

export const syncApi = {
  trigger: (entityType: EntityType) =>
    apiClient.post(`/sync/trigger/${entityType}`).then(r => r.data),

  jobs: () =>
    apiClient.get('/sync/jobs').then(r => r.data),
};
