// frontend/src/pages/Monitor.tsx

import { useState, useEffect, useCallback } from 'react';
import { EntityCard } from '../components/EntityCard';
import { LogsTable }  from '../components/LogsTable';
import { logsApi }    from '../services/logs.api';
import { syncApi }    from '../services/sync.api';
import type { SyncLog, EntityType, LogStats } from '../services/types';

const ENTITY_TYPES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

export default function Monitor() {
  const [stats,       setStats]       = useState<LogStats | null>(null);
  const [logs,        setLogs]        = useState<SyncLog[]>([]);
  const [syncing,     setSyncing]     = useState<Partial<Record<EntityType, boolean>>>({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(async () => {
    const [s, l] = await Promise.all([
      logsApi.stats(),
      logsApi.list({ limit: 20 }),
    ]);
    setStats(s);
    setLogs(l.data);
    setLastRefresh(new Date());
  }, []);

  /** Carrega na montagem e a cada 30 segundos */
  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const triggerSync = async (entityType: EntityType) => {
    setSyncing(s => ({ ...s, [entityType]: true }));
    try {
      await syncApi.trigger(entityType);
      setTimeout(() => void load(), 2_000);
    } finally {
      setTimeout(() => setSyncing(s => ({ ...s, [entityType]: false })), 3_000);
    }
  };

  return (
    <div>
      {/* ── Cabeçalho ── */}
      <div className="monitor__header">
        <div>
          <h2 className="monitor__title">Monitor de Sincronização</h2>
          <p className="monitor__subtitle">
            Atualizado em {lastRefresh.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <button className="btn-refresh" onClick={() => void load()}>
          ↻ Atualizar
        </button>
      </div>

      {/* ── Cards por entidade ── */}
      <div className="monitor__cards-grid">
        {ENTITY_TYPES.map(entityType => (
          <EntityCard
            key={entityType}
            entityType={entityType}
            lastLog={stats?.entities[entityType]?.lastLog ?? null}
            totalRecords={stats?.entities[entityType]?.lastSyncId ?? 0}
            isActive={stats?.entities[entityType]?.isActive ?? false}
            onSync={() => void triggerSync(entityType)}
            syncing={syncing[entityType] ?? false}
          />
        ))}
      </div>

      {/* ── Tabela de logs ── */}
      <LogsTable logs={logs} />
    </div>
  );
}
