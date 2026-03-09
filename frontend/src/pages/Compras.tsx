// frontend/src/pages/Compras.tsx
const KPI = [
  { label: 'Total Comprado',     value: 'R$ 3,55M', change: '↑ 4,8%', trend: 'up', accent: 'var(--yellow)' },
  { label: 'Nº NF-e Compras',   value: '2.184',     change: '↑ 2,1%', trend: 'up', accent: 'var(--blue)' },
  { label: 'Fornecedores Ativos',value: '184',       change: '→ 0',    trend: 'neutral', accent: 'var(--purple)' },
  { label: 'Ticket Médio Forn.', value: 'R$ 19,3K', change: '↑ 2,4%', trend: 'up', accent: 'var(--green)' },
];

const COMPRAS_HIST = [280,265,310,295,330,305,345,360,325,378,442,418];
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];

export default function Compras() {
  const max = Math.max(...COMPRAS_HIST);
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
      <div className="chart-card" style={{ marginBottom: 14 }}>
        <div className="chart-header"><div><div className="chart-title">Volume de Compras por Mês</div><div className="chart-sub">2024 · R$ mil</div></div><div className="chart-badge">2024</div></div>
        <div className="bar-chart">
          {COMPRAS_HIST.map((v, i) => (
            <div key={i} className="bar-group">
              <div className="bar" style={{ height: `${v / max * 100}%`, background: v === max ? 'var(--yellow)' : 'rgba(255,184,0,0.3)' }} />
              <div className="bar-label">{MONTHS[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
