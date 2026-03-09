// frontend/src/pages/Giro.tsx

const KPI = [
  { label: 'Produtos em Ruptura', value: '48',         change: '↑ 12 novos',    trend: 'down', accent: 'var(--red)' },
  { label: 'Estoque Excessivo',   value: '124 SKUs',   change: '→ acima do máx.',trend:'neutral',accent:'var(--yellow)' },
  { label: 'Cobertura Média',     value: '14,2 dias',  change: 'meta: 10-20d',  trend: 'up',   accent: 'var(--blue)' },
  { label: 'Giro Médio',          value: '28,4×/ano',  change: '↑ saudável',    trend: 'up',   accent: 'var(--green)' },
];

const RUPTURA_TABLE = [
  { prod: 'Frango Inteiro kg', cat: 'Açougue', dias: '3 dias', venda: 'R$ 128K', diasColor: 'var(--red)' },
  { prod: 'Pão Francês kg',    cat: 'Padaria', dias: '1 dia',  venda: 'R$ 42K',  diasColor: 'var(--red)' },
  { prod: 'Tomate kg',         cat: 'FLV',     dias: '2 dias', venda: 'R$ 28K',  diasColor: 'var(--yellow)' },
  { prod: 'Margarina 500g',    cat: 'Frios',   dias: '1 dia',  venda: 'R$ 18K',  diasColor: 'var(--yellow)' },
  { prod: 'Agua Mineral 1,5L', cat: 'Bebidas', dias: '4 dias', venda: 'R$ 16K',  diasColor: 'var(--red)' },
];

const RUPTURA_CAT = [
  { name: 'FLV',            pct: 8.4, color: 'red' },
  { name: 'Açougue',        pct: 6.1, color: 'red' },
  { name: 'Padaria',        pct: 4.8, color: 'yellow' },
  { name: 'Frios/Laticínios',pct: 3.2, color: 'yellow' },
  { name: 'Bebidas',        pct: 2.1, color: 'yellow' },
  { name: 'Mercearia Seca', pct: 0.8, color: 'green' },
];

export default function Giro() {
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
          <div className="chart-header">
            <div><div className="chart-title">Produtos em Ruptura</div><div className="chart-sub">Sem estoque · risco de venda perdida</div></div>
            <span className="status-chip chip-red">48 SKUs</span>
          </div>
          <table className="data-table">
            <thead><tr><th>Produto</th><th>Categoria</th><th>Dias s/ estoque</th><th>Venda/Mês</th></tr></thead>
            <tbody>
              {RUPTURA_TABLE.map(r => (
                <tr key={r.prod}>
                  <td className="td-bold">{r.prod}</td>
                  <td>{r.cat}</td>
                  <td className="td-mono" style={{ color: r.diasColor }}>{r.dias}</td>
                  <td className="td-mono">{r.venda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Ruptura por Categoria</div><div className="chart-sub">% SKUs zerados</div></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {RUPTURA_CAT.map(r => (
              <div key={r.name} className="ruptura-row">
                <div className="ruptura-label">{r.name}</div>
                <div className="ruptura-bar-wrap">
                  <div className="ruptura-bar-fill" style={{ width: `${r.pct / 10 * 100}%`, background: `var(--${r.color})` }} />
                </div>
                <div className="ruptura-val" style={{ color: `var(--${r.color})` }}>{r.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
