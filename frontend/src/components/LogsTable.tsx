// frontend/src/components/LogsTable.tsx
import { StatusBadge }  from './StatusBadge';
import { ENTITY_COLORS } from './EntityCard';
import type { SyncLog, EntityType } from '../services/types';
import { ENTITY_LABELS } from '../services/types';

interface LogsTableProps {
  logs: SyncLog[];
}

const COLUMNS = ['Entidade', 'Status', 'Registros', 'Faixa de IDs', 'Início', 'Duração'];

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="logs-table">
      {/* ── Header ── */}
      <div className="logs-table__header">
        <h3 className="logs-table__title">Histórico de Execuções</h3>
      </div>

      {/* ── Table ── */}
      <div className="logs-table__scroll">
        <table className="logs-table__table">
          <thead className="logs-table__thead">
            <tr>
              {COLUMNS.map(h => (
                <th key={h} className="logs-table__th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="logs-table__empty">
                  Nenhuma execução registrada ainda.
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const colors = ENTITY_COLORS[log.entity_type as EntityType]
                  ?? { accent: '#888', bg: 'transparent' };

                const duration =
                  log.started_at && log.finished_at
                    ? `${Math.round(
                        (new Date(log.finished_at).getTime() -
                          new Date(log.started_at).getTime()) / 1000,
                      )}s`
                    : '—';

                return (
                  <tr key={log.id} className="logs-table__tr">
                    <td className="logs-table__td">
                      <span
                        className="logs-table__entity-label"
                        style={{ color: colors.accent }}
                      >
                        {ENTITY_LABELS[log.entity_type as EntityType] ?? log.entity_type}
                      </span>
                    </td>
                    <td className="logs-table__td">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="logs-table__td logs-table__td--primary">
                      {log.records_imported.toLocaleString('pt-BR')}
                    </td>
                    <td className="logs-table__td">
                      {log.start_id != null && log.end_id != null
                        ? `${log.start_id} → ${log.end_id}`
                        : '—'}
                    </td>
                    <td className="logs-table__td">
                      {log.started_at
                        ? new Date(log.started_at).toLocaleString('pt-BR')
                        : '—'}
                    </td>
                    <td className="logs-table__td">{duration}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
