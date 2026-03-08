// frontend/src/components/settings/EntitySyncBlock.tsx
import { useState } from 'react';
import { configApi } from '../../services/config.api';
import type { SyncConfig, Credencial, EntityType } from '../../services/types';
import { ENTITY_LABELS } from '../../services/types';
import { ENTITY_COLORS } from '../EntityCard';

interface EntitySyncBlockProps {
  entityType: EntityType;
  existing:   SyncConfig | undefined;
  credencial: Credencial | undefined;
  onSaved:    () => void;
}

const INTERVAL_OPTIONS = [
  { value: '1',  label: '1 hora'   },
  { value: '2',  label: '2 horas'  },
  { value: '4',  label: '4 horas'  },
  { value: '6',  label: '6 horas'  },
  { value: '12', label: '12 horas' },
  { value: '24', label: '24 horas' },
];

export function EntitySyncBlock({ entityType, existing, credencial, onSaved }: EntitySyncBlockProps) {
  const [intervalHours, setIntervalHours] = useState<string>(existing?.interval_hours ?? '6');
  const [isActive,      setIsActive]      = useState<boolean>(existing?.is_active ?? true);
  const [saving,        setSaving]        = useState(false);
  const [feedback,      setFeedback]      = useState<{ ok: boolean; msg: string } | null>(null);

  const { accent } = ENTITY_COLORS[entityType];

  const save = async () => {
    if (!credencial) {
      setFeedback({ ok: false, msg: 'Crie uma credencial antes.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        entity_type:    entityType,
        credencial_id:  credencial.id,
        interval_hours: intervalHours as SyncConfig['interval_hours'],
        is_active:      isActive,
      };
      if (existing) {
        await configApi.update(existing.id, payload);
      } else {
        await configApi.create(payload);
      }
      setFeedback({ ok: true, msg: 'Salvo.' });
      onSaved();
    } catch {
      setFeedback({ ok: false, msg: 'Erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  const resetId = async () => {
    if (!existing) return;
    setSaving(true);
    try {
      await configApi.resetLastSyncId(existing.id);
      setFeedback({ ok: true, msg: 'ID resetado.' });
      onSaved();
    } catch {
      setFeedback({ ok: false, msg: 'Erro ao resetar.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="entity-sync-block">

      {/* ── Cabeçalho: nome + toggle ── */}
      <div className="entity-sync-block__header">
        <span className="entity-sync-block__name" style={{ color: accent }}>
          {ENTITY_LABELS[entityType]}
        </span>
        <label className="toggle" title={isActive ? 'Desativar' : 'Ativar'}>
          <input
            className="toggle__input"
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
          <span className="toggle__slider" />
        </label>
      </div>

      {/* ── Intervalo ── */}
      <div className="entity-sync-block__field">
        <label className="field-label">Intervalo</label>
        <select
          className="entity-sync-block__select"
          value={intervalHours}
          onChange={e => setIntervalHours(e.target.value)}
        >
          {INTERVAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* ── Último ID ── */}
      <div className="entity-sync-block__field">
        <label className="field-label">Último ID sincronizado</label>
        <span className="sync-id-value">{existing?.last_sync_id ?? 0}</span>
      </div>

      {/* ── Salvar + Resetar juntos na mesma linha ── */}
      <div className="entity-sync-block__actions">
        <button
          className="btn btn--primary"
          onClick={() => void save()}
          disabled={saving}
        >
          {saving ? '⟳ Salvando...' : existing ? '💾 Salvar' : '+ Criar'}
        </button>

        {existing && (
          <button
            className="btn btn--danger"
            onClick={() => void resetId()}
            disabled={saving}
            title="Zera o last_sync_id para reimportar tudo"
          >
            ↺ Resetar
          </button>
        )}

        {feedback && (
          <span className={`feedback feedback--${feedback.ok ? 'ok' : 'error'}`}>
            {feedback.ok ? '✓' : '✗'} {feedback.msg}
          </span>
        )}
      </div>

    </div>
  );
}
