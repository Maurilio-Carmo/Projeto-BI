// frontend/src/pages/Fornecedores.tsx

const KPI = [
  { label: 'Fornecedores Ativos', value: '184',       change: '→ 0',    trend: 'neutral', accent: 'var(--blue)' },
  { label: 'Total Comprado',      value: 'R$ 3,55M',  change: '↑ 4,8%', trend: 'up',     accent: 'var(--green)' },
  { label: 'Ticket Médio / Forn.',value: 'R$ 19,3K',  change: '↑ 2,4%', trend: 'up',     accent: 'var(--purple)' },
  { label: 'Produtos Fornecidos', value: '4.100+',    change: '→',      trend: 'neutral', accent: 'var(--yellow)' },
];

const FORNECEDORES = [
  { rank: '01', name: 'Nestlé Brasil Ltda',   cnpj: '60.894.000/0001', notas: '312', total: 'R$ 428K', pct: '12,1%', var: '+14%', varColor: 'var(--green)',  status: 'green', chip: 'Ativo' },
  { rank: '02', name: 'Ambev S.A.',           cnpj: '07.526.557/0001', notas: '228', total: 'R$ 325K', pct: '9,2%',  var: '+8%',  varColor: 'var(--green)',  status: 'green', chip: 'Ativo' },
  { rank: '03', name: 'JBS S.A.',             cnpj: '02.916.265/0001', notas: '184', total: 'R$ 265K', pct: '7,5%',  var: '+2%',  varColor: 'var(--yellow)', status: 'green', chip: 'Ativo' },
  { rank: '04', name: 'BRF S.A.',             cnpj: '01.838.723/0001', notas: '156', total: 'R$ 231K', pct: '6,5%',  var: '-3%',  varColor: 'var(--red)',    status: 'yellow',chip: 'Atenção' },
  { rank: '05', name: 'Unilever Brasil',      cnpj: '04.351.142/0001', notas: '142', total: 'R$ 188K', pct: '5,3%',  var: '+6%',  varColor: 'var(--green)',  status: 'green', chip: 'Ativo' },
  { rank: '06', name: 'Forno de Minas',       cnpj: '17.157.583/0001', notas: '98',  total: 'R$ 142K', pct: '4,0%',  var: '+11%', varColor: 'var(--green)',  status: 'green', chip: 'Ativo' },
];

export default function Fornecedores() {
  return (
    <div className="page-content">
      <div className="kpi-grid">
        {KPI.map(k => (
          <div key={k.label} className="kpi-card" style={{ '--accent': k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-change ${k.trend}`}>{k.change}</div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-header"><div><div className="chart-title">Ranking de Fornecedores</div><div className="chart-sub">Participação no volume de compras</div></div></div>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Fornecedor</th><th>CNPJ</th><th>Notas</th><th>Total</th><th>%</th><th>Variação</th><th>Status</th></tr>
          </thead>
          <tbody>
            {FORNECEDORES.map(r => (
              <tr key={r.rank}>
                <td className="td-mono td-bold">{r.rank}</td>
                <td className="td-bold">{r.name}</td>
                <td className="td-mono" style={{ fontSize: 10, color: 'var(--text3)' }}>{r.cnpj}</td>
                <td className="td-mono">{r.notas}</td>
                <td className="td-mono td-bold" style={{ color: r.status === 'green' ? 'var(--green)' : 'var(--text)' }}>{r.total}</td>
                <td className="td-mono">{r.pct}</td>
                <td className="td-mono" style={{ color: r.varColor }}>{r.var}</td>
                <td><span className={`status-chip chip-${r.status}`}>{r.chip}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
