// frontend/src/pages/Auditoria.tsx
import { useState } from 'react';

const AUDIT_ROWS = [
  { nota:'000841', serie:'1', data:'03/01/25', forn:'Nestlé Brasil Ltda',    cfop:'1.102', qtd:'48',  vi:'R$ 8.920',  vn:'R$ 12.440', icms:'R$ 1.991', pis:'R$ 498', status:'green' },
  { nota:'000842', serie:'1', data:'03/01/25', forn:'Ambev S.A.',            cfop:'1.102', qtd:'120', vi:'R$ 15.200', vn:'R$ 21.280', icms:'R$ 3.405', pis:'R$ 851', status:'green' },
  { nota:'000843', serie:'1', data:'04/01/25', forn:'JBS S.A.',              cfop:'1.102', qtd:'32',  vi:'R$ 6.840',  vn:'R$ 9.576',  icms:'R$ 1.532', pis:'R$ 383', status:'green' },
  { nota:'000844', serie:'1', data:'05/01/25', forn:'BRF S.A.',              cfop:'1.405', qtd:'64',  vi:'R$ 11.200', vn:'R$ 15.680', icms:'R$ 2.509', pis:'R$ 627', status:'yellow' },
  { nota:'000845', serie:'1', data:'05/01/25', forn:'Unilever Brasil',       cfop:'1.102', qtd:'28',  vi:'R$ 4.200',  vn:'R$ 5.880',  icms:'R$ 941',   pis:'R$ 235', status:'green' },
  { nota:'000846', serie:'1', data:'06/01/25', forn:'Forno de Minas',        cfop:'1.102', qtd:'15',  vi:'R$ 2.100',  vn:'R$ 2.940',  icms:'R$ 470',   pis:'R$ 118', status:'green' },
];

export default function Auditoria() {
  const [filters, setFilters] = useState({ periodo: '01/01/2025 — 31/01/2025', nota: '', produto: '', fornecedor: '', cfop: '' });

  return (
    <div className="page-content">
      <div className="audit-filters">
        {(['periodo','nota','produto','fornecedor','cfop'] as const).map(f => (
          <div key={f} className="form-group">
            <div className="form-label">
              {{ periodo: 'Período', nota: 'Nº Nota', produto: 'Produto', fornecedor: 'Fornecedor', cfop: 'CFOP' }[f]}
            </div>
            <input
              className="form-input"
              value={filters[f]}
              onChange={e => setFilters(p => ({ ...p, [f]: e.target.value }))}
              placeholder={f === 'periodo' ? '' : `Buscar ${f}...`}
            />
          </div>
        ))}
      </div>

      <div className="kpi-grid kpi-grid-3" style={{ marginBottom: 16 }}>
        <div className="kpi-card" style={{ '--accent': 'var(--blue)' } as React.CSSProperties}><div className="kpi-label">Registros Encontrados</div><div className="kpi-value">2.184</div></div>
        <div className="kpi-card" style={{ '--accent': 'var(--green)' } as React.CSSProperties}><div className="kpi-label">Total das Notas</div><div className="kpi-value">R$ 3,55M</div></div>
        <div className="kpi-card" style={{ '--accent': 'var(--yellow)' } as React.CSSProperties}><div className="kpi-label">Total Impostos</div><div className="kpi-value">R$ 740K</div></div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div><div className="chart-title">Consulta de Notas Fiscais</div><div className="chart-sub">Detalhamento operacional · Jan 2025</div></div>
          <div className="chart-badge">2.184 registros</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Nº Nota</th><th>Série</th><th>Data</th><th>Fornecedor/Cliente</th><th>CFOP</th><th>Qtd. Itens</th><th>Valor Item</th><th>Valor Nota</th><th>ICMS</th><th>PIS</th><th>Status</th></tr></thead>
            <tbody>
              {AUDIT_ROWS.map(r => (
                <tr key={r.nota}>
                  <td className="td-mono td-bold">{r.nota}</td>
                  <td className="td-mono">{r.serie}</td>
                  <td className="td-mono">{r.data}</td>
                  <td className="td-bold" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.forn}</td>
                  <td className="td-mono" style={{ color: 'var(--blue)' }}>{r.cfop}</td>
                  <td className="td-mono">{r.qtd}</td>
                  <td className="td-mono">{r.vi}</td>
                  <td className="td-mono td-bold">{r.vn}</td>
                  <td className="td-mono" style={{ color: 'var(--purple)' }}>{r.icms}</td>
                  <td className="td-mono" style={{ color: 'var(--green)' }}>{r.pis}</td>
                  <td><span className={`status-chip chip-${r.status}`}>{r.status === 'green' ? 'AUTORIZADA' : 'PENDENTE'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
