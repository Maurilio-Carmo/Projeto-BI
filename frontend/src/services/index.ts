// frontend/src/services/index.ts
// Ponto único de importação para todos os módulos de API e tipos.

export * from './types';
export { default as apiClient } from './api.client';
export { credencialApi }        from './credentials.api';
export { configApi }            from './config.api';
export { syncApi }              from './sync.api';
export { logsApi }              from './logs.api';
