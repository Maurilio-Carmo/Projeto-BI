// frontend/src/components/EntityCard.tsx
import { StatusBadge } from './StatusBadge';
import type { EntityType, SyncLog } from '../services/types';
import { ENTITY_LABELS } from '../services/types';

export const ENTITY_COLORS: Record<EntityType, { accent: string; bg: string }> = {
  nota_venda:  { accent: '#00FF88', bg: 'rgba(0,255,136,0.08)' },
  nota_compra: { accent: '#FFB800', bg: 'rgba(255,184,0,0.08)' },
  cupom:       { accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
};

const ENTITY_ICONS: Record<EntityType, string> = {
  nota_venda:  '📤',
  nota_compra: '📥',
  cupom:       '🧾',
};

interface EntityCardProps {
  entityType:   EntityType;
  lastLog:      SyncLog | null;
  totalRecords: number;
  isActive:     boolean;
  onSync:       () => void;
  syncing:      boolean;
}

export function EntityCard({
  entityType,
  lastLog,
  totalRecords,
  isActive,
  onSync,
  syncing,
}: EntityCardProps) {
  const { accent, bg } = ENTITY_COLORS[entityType];

  /**
   * As cores de acento variam por entidade, portanto usamos CSS custom properties
   * injetadas no elemento raiz do card — sem qualquer style inline nas folhas internas.
   */
  const cssVars = {
    '--card-accent': accent,
    '--card-bg':     bg,
    borderColor:     `${accent}33`,
  } as React.CSSProperties;

  const syncBtnStyle = syncing
    ? undefined
    : ({ background: bg, borderColor: `${accent}66`, color: accent } as React.CSSProperties);

  const duration =
    lastLog?.started_at && lastLog?.finished_at
      ? `${Math.round(
          (new Date(lastLog.finished_at).getTime() - new Date(lastLog.started_at).getTime()) / 1000,
        )}s`
      : null;

  return (
    <div className="entity-card" style={cssVars}>
      {/* ── Cabeçalho ── */}
      <div className="entity-card__header">
        <div className="entity-card__identity">
          <span className="entity-card__icon">{ENTITY_ICONS[entityType]}</span>
          <div>
            <div className="entity-card__name" style={{ color: accent }}>
              {ENTITY_LABELS[entityType]}
            </div>
            <div className="entity-card__status-row">
              <div className={`entity-card__dot${isActive ? ' entity-card__dot--active' : ''}`} />
              <span className={`entity-card__status-label${isActive ? ' entity-card__status-label--active' : ''}`}>
                {isActive ? 'Ativo' : 'Pausado'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSync}
          disabled={syncing}
          className="entity-card__sync-btn"
          style={syncBtnStyle}
        >
          {syncing ? '⟳ Sincronizando...' : '▶ Sync Manual'}
        </button>
      </div>

      {/* ── Métricas ── */}
      <div className="entity-card__metrics">
        <div className="entity-card__metric">
          <div className="entity-card__metric-label">Total Importado</div>
          <div className="entity-card__metric-value" style={{ color: accent }}>
            {totalRecords.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="entity-card__metric">
          <div className="entity-card__metric-label">Último Status</div>
          <div style={{ marginTop: '6px' }}>
            {lastLog
              ? <StatusBadge status={lastLog.status} />
              : <span style={{ color: '#333', fontSize: '12px' }}>—</span>
            }
          </div>
        </div>
      </div>

      {/* ── Detalhe do último sync ── */}
      {lastLog && (
        <div className="entity-card__detail">
          <div className="entity-card__detail-row">
            <span className="entity-card__detail-text">
              {lastLog.started_at ? new Date(lastLog.started_at).toLocaleString('pt-BR') : '—'}
            </span>
            <span className="entity-card__detail-text">
              {lastLog.records_imported} registros
              {lastLog.start_id != null && lastLog.end_id != null && (
                <> · ID {lastLog.start_id} → {lastLog.end_id}</>
              )}
              {duration && <> · {duration}</>}
            </span>
          </div>
          {lastLog.error_message && (
            <div className="entity-card__error">{lastLog.error_message}</div>
          )}
        </div>
      )}
    </div>
  );
}
