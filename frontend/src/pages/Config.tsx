// frontend/src/pages/Config.tsx
import { useState } from 'react';

type SyncEntry = { name: string; endpoint: string; interval: string; on: boolean };

const INITIAL_SYNC: SyncEntry[] = [
  { name: 'Cupons Fiscais', endpoint: '/v1/venda/cupons-fiscais',     interval: '5 min',  on: true },
  { name: 'NF-e Vendas',    endpoint: '/v1/venda/notas-fiscais',      interval: '15 min', on: true },
  { name: 'NF-e Compras',   endpoint: '/v1/compra/notas-fiscais',     interval: '15 min', on: true },
  { name: 'Produtos',       endpoint: '/v1/produto/produtos',         interval: '60 min', on: true },
  { name: 'Preços',         endpoint: '/v1/produto/precos',           interval: '30 min', on: true },
  { name: 'Custos',         endpoint: '/v1/produto/custos',           interval: '30 min', on: false },
  { name: 'Estoque',        endpoint: '/v1/estoque/saldos',           interval: '30 min', on: false },
];

const SYNC_STATUS = [
  { name: 'Cupons Fiscais', lastId: '58.420', lastTime: '14:32:18', color: 'green' },
  { name: 'NF-e Vendas',    lastId: '1.847',  lastTime: '14:28:04', color: 'green' },
  { name: 'NF-e Compras',   lastId: '2.184',  lastTime: '14:10:22', color: 'red' },
  { name: 'Produtos',       lastId: '4.218',  lastTime: '14:20:11', color: 'green' },
  { name: 'Preços',         lastId: '4.218',  lastTime: '14:15:02', color: 'green' },
  { name: 'Estoque',        lastId: '—',      lastTime: 'Inativo',  color: 'text3' },
];

const DB_INFO = [
  ['Arquivo',               './database/retailbi.db'],
  ['Criptografia',          'AES-256-GCM · SQLCipher'],
  ['Tamanho',               '142 MB'],
  ['Cupons Importados',     '58.420'],
  ['NF-e Importadas',       '4.031'],
  ['Produtos Cadastrados',  '4.218'],
  ['Versão Schema',         'v1.0.0'],
];

export default function Config() {
  const [sync, setSync] = useState<SyncEntry[]>(INITIAL_SYNC);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | 'ok' | 'fail'>(null);

  const toggleSync = (name: string) => {
    setSync(prev => prev.map(s => s.name === name ? { ...s, on: !s.on } : s));
  };

  const testConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => { setTesting(false); setTestResult('ok'); }, 1500);
  };

  return (
    <div className="page-content">
      <div className="charts-row charts-row-2">
        {/* Left column */}
        <div>
          <div className="section-row"><span className="section-label">Configuração da API</span><div className="section-line" /></div>
          <div className="config-form">
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Base URL</div>
                <input className="form-input encrypted" defaultValue="••••••••••••••••••••••" />
              </div>
              <div className="form-group">
                <div className="form-label">Token da API</div>
                <input className="form-input encrypted" type="password" defaultValue="••••••••••••••••••••••" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Porta do Servidor</div>
                <input className="form-input" defaultValue="3000" />
              </div>
              <div className="form-group">
                <div className="form-label">Arquivo do Banco</div>
                <input className="form-input" defaultValue="./database/retailbi.db" />
              </div>
            </div>
            <div className="form-actions">
              {testResult === 'ok' && <span className="status-chip chip-green">✓ Conexão OK</span>}
              {testResult === 'fail' && <span className="status-chip chip-red">✗ Falha</span>}
              <button className="btn btn-secondary" onClick={testConnection} disabled={testing}>
                {testing ? 'Testando...' : 'Testar Conexão'}
              </button>
              <button className="btn btn-primary">Salvar</button>
            </div>
          </div>

          <div className="section-row"><span className="section-label">Sincronizações</span><div className="section-line" /></div>
          <div className="config-form">
            {sync.map(s => (
              <div key={s.name} className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-name">{s.name}</div>
                  <div className="toggle-desc">{s.endpoint} · A cada {s.interval}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>{s.interval}</span>
                  <button className={`toggle ${s.on ? 'on' : ''}`} onClick={() => toggleSync(s.name)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="section-row"><span className="section-label">Status do Sistema</span><div className="section-line" /></div>
          <div className="config-form">
            {SYNC_STATUS.map(s => (
              <div key={s.name} className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-name">{s.name}</div>
                  <div className="toggle-desc">
                    Último ID:{' '}
                    <span style={{ color: `var(--${s.color})`, fontFamily: 'var(--font-mono)' }}>{s.lastId}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: `var(--${s.color})` }}>{s.lastTime}</div>
                  <button
                    className="btn btn-danger"
                    style={{ marginTop: 4, padding: '3px 8px', fontSize: 10, borderRadius: 4 }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="section-row"><span className="section-label">Informações do Banco</span><div className="section-line" /></div>
          <div className="config-form">
            {DB_INFO.map(([k, v]) => (
              <div key={k} className="db-info-row">
                <span className="db-info-key">{k}</span>
                <span className="db-info-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
