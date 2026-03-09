// frontend/src/pages/Margem.tsx

const KPI = [
  { label: 'Margem Bruta',       value: '20,1%',    change: '↓ 0,4pp',  trend: 'down',   accent: 'var(--green)' },
  { label: 'Lucro Bruto Total',  value: 'R$ 856K',  change: '↑ 8,1%',   trend: 'up',     accent: 'var(--blue)' },
  { label: 'CMV Total',          value: 'R$ 3,42M', change: '↑ 13,2%',  trend: 'down',   accent: 'var(--yellow)' },
  { label: 'Margem / Produto',   value: '21,3%',    change: '↑ 0,8pp',  trend: 'up',     accent: 'var(--purple)' },
];

const MARGEM_CAT = [
  { cat: 'FLV (Hortifrutti)',  margem: '34,2%', fat: 'R$ 880K',  lucro: 'R$ 301K',  color: 'green' },
  { cat: 'Açougue',            margem: '28,1%', fat: 'R$ 742K',  lucro: 'R$ 208K',  color: 'blue' },
  { cat: 'Padaria',            margem: '42,0%', fat: 'R$ 180K',  lucro: 'R$ 76K',   color: 'purple' },
  { cat: 'Frios/Laticínios',   margem: '22,4%', fat: 'R$ 544K',  lucro: 'R$ 122K',  color: 'yellow' },
  { cat: 'Bebidas',            margem: '15,2%', fat: 'R$ 420K',  lucro: 'R$ 64K',   color: 'orange' },
  { cat: 'Mercearia Seca',     margem: '12,8%', fat: 'R$ 1,20M', lucro: 'R$ 154K',  color: 'green' },
];

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const MARGEM_HIST = [19.2,18.8,20.1,19.6,20.8,20.2,21.1,21.4,20.8,21.9,22.4,21.8];

export default function Margem() {
  const max = Math.max(...MARGEM_HIST);
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

      <div className="charts-row charts-row-2">
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Evolução de Margem %</div><div className="chart-sub">Jan–Dez 2024</div></div></div>
          <div className="bar-chart">
            {MARGEM_HIST.map((v, i) => (
              <div key={i} className="bar-group">
                <div className="bar" style={{
                  height: `${v / max * 100}%`,
                  background: v === max ? 'var(--green)' : 'rgba(155,109,255,0.35)',
                }} />
                <div className="bar-label">{MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Margem por Categoria</div><div className="chart-sub">Jan 2025</div></div></div>
          <table className="data-table">
            <thead><tr><th>Categoria</th><th>Margem %</th><th>Faturamento</th><th>Lucro Bruto</th></tr></thead>
            <tbody>
              {MARGEM_CAT.map(r => (
                <tr key={r.cat}>
                  <td className="td-bold">{r.cat}</td>
                  <td className="td-mono" style={{ color: `var(--${r.color})`, fontWeight: 700 }}>{r.margem}</td>
                  <td className="td-mono">{r.fat}</td>
                  <td className="td-mono td-bold">{r.lucro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
