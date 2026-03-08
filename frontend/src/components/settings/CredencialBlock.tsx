// frontend/src/components/settings/CredencialBlock.tsx
import { useState } from 'react';
import { credencialApi } from '../../services/credentials.api';
import type { Credencial } from '../../services/types';

interface CredencialBlockProps {
  creds:     Credencial[];
  onChanged: () => void;
}

export function CredencialBlock({ creds, onChanged }: CredencialBlockProps) {
  const existing = creds[0];

  const [apiUrl,   setApiUrl]   = useState(existing?.api_url ?? '');
  const [apiKey,   setApiKey]   = useState(existing?.api_key ?? '');
  const [showKey,  setShowKey]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      if (existing) {
        await credencialApi.update(existing.id, { api_url: apiUrl, api_key: apiKey });
      } else {
        await credencialApi.create({ api_url: apiUrl, api_key: apiKey });
      }
      setFeedback({ ok: true, msg: 'Credencial salva com sucesso.' });
      onChanged();
    } catch {
      setFeedback({ ok: false, msg: 'Erro ao salvar credencial.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="credencial-block">
      <h4 className="credencial-block__title">🔑 Credencial da API</h4>

      {/* ── Inputs ── */}
      <div className="field-grid-2">
        <div>
          <label className="field-label">URL da API</label>
          <input
            className="field-input"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            placeholder="https://mercado.varejofacil.com"
          />
        </div>
        <div>
          <label className="field-label">API Token</label>
          <div className="field-group">
            <input
              className="field-input field-input--padded-right"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="••••••••••••"
            />
            <button
              className="field-group__toggle"
              onClick={() => setShowKey(s => !s)}
              type="button"
              aria-label={showKey ? 'Ocultar token' : 'Mostrar token'}
            >
              {showKey ? '🙈' : '👁'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="action-row">
        <button
          className="btn btn--primary"
          onClick={() => void save()}
          disabled={saving}
        >
          {saving ? '⟳ Salvando...' : existing ? '💾 Atualizar' : '+ Criar'}
        </button>
        {feedback && (
          <span className={`feedback feedback--${feedback.ok ? 'ok' : 'error'}`}>
            {feedback.ok ? '✓' : '✗'} {feedback.msg}
          </span>
        )}
      </div>
    </div>
  );
}
