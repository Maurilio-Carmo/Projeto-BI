// frontend/src/services/api.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  summary:       () => apiClient.get('/analytics/sales-summary').then(r => r.data),
  revenue:       () => apiClient.get('/analytics/revenue').then(r => r.data),
  topProducts:   () => apiClient.get('/analytics/top-products').then(r => r.data),
  dailySales:    () => apiClient.get('/analytics/daily-sales').then(r => r.data),
  monthlySales:  () => apiClient.get('/analytics/monthly-sales').then(r => r.data),
};

// ── Sync ────────────────────────────────────────────────────────────────────
export const syncApi = {
  trigger: (entity: string) => apiClient.post(`/sync/run/${entity}`).then(r => r.data),
  jobs:    ()               => apiClient.get('/monitor/jobs').then(r => r.data),
};

// ── Monitor ─────────────────────────────────────────────────────────────────
export const monitorApi = {
  status:      () => apiClient.get('/monitor/status').then(r => r.data),
  lastImports: () => apiClient.get('/monitor/last-imports').then(r => r.data),
};

// ── Logs ─────────────────────────────────────────────────────────────────────
export const logsApi = {
  list:  () => apiClient.get('/logs').then(r => r.data),
  stats: () => apiClient.get('/logs/stats').then(r => r.data),
};

// ── Config ───────────────────────────────────────────────────────────────────
export const configApi = {
  list:    ()             => apiClient.get('/config').then(r => r.data),
  update:  (id: number, data: unknown) => apiClient.put(`/config/${id}`, data).then(r => r.data),
  create:  (data: unknown) => apiClient.post('/config', data).then(r => r.data),
  remove:  (id: number)   => apiClient.delete(`/config/${id}`).then(r => r.data),
  testConnection: ()      => apiClient.get('/config/test').then(r => r.data),
};
