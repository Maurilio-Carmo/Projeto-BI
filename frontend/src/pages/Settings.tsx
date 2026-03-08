// frontend/src/pages/Settings.tsx
import { useState, useEffect, useCallback } from 'react';
import { CredencialBlock } from '../components/settings/CredencialBlock';
import { EntitySyncBlock } from '../components/settings/EntitySyncBlock';
import { credencialApi }   from '../services/credentials.api';
import { configApi }       from '../services/config.api';
import type { Credencial, SyncConfig, EntityType } from '../services/types';

const ENTITY_TYPES: EntityType[] = ['nota_venda', 'nota_compra', 'cupom'];

export default function Settings() {
  const [configs,  setConfigs]  = useState<SyncConfig[]>([]);
  const [creds,    setCreds]    = useState<Credencial[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cfgs, crds] = await Promise.all([configApi.list(), credencialApi.list()]);
      setConfigs(cfgs);
      setCreds(crds);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const getConfig = (et: EntityType) => configs.find(c => c.entity_type === et);

  return (
    <div className="settings">
      {/* ── Cabeçalho ── */}
      <div className="settings__header">
        <h2 className="settings__title">Configurações</h2>
        <p className="settings__desc">
          Gerencie a credencial de API e os intervalos de sincronização por tipo de documento.
        </p>
      </div>

      {loading ? (
        <div className="settings__loading">Carregando...</div>
      ) : (
        <div className="settings__card">
          {/* Credencial única */}
          <CredencialBlock creds={creds} onChanged={() => void load()} />

          {/* Configs por entidade */}
          <h4 className="settings__section-title">
            ⚙️ Sincronização por Tipo de Documento
          </h4>

          <div className="settings__entity-list">
            {ENTITY_TYPES.map(et => (
              <EntitySyncBlock
                key={et}
                entityType={et}
                existing={getConfig(et)}
                credencial={creds[0]}
                onSaved={() => void load()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
