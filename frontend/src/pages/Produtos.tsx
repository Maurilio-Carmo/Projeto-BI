// frontend/src/pages/Produtos.tsx

const KPI = [
  { label: 'Produto + Vendido',   value: 'Arroz Branco 5kg', change: '12.840 un.',   trend: 'up',     accent: 'var(--green)',  small: true },
  { label: 'Total SKUs Ativos',   value: '4.218',            change: '↑ 34 novos',    trend: 'up',     accent: 'var(--blue)' },
  { label: 'Faturamento/Produto', value: 'R$ 1.014',         change: 'média mensal',  trend: 'neutral',accent: 'var(--purple)' },
  { label: 'Margem/Produto',      value: '21,3%',            change: '↑ 0,8pp',       trend: 'up',     accent: 'var(--yellow)' },
];

const TOP10 = [
  ['Arroz Branco 5kg',        'R$ 184K', 100, 'green'],
  ['Feijão Carioca 1kg',      'R$ 142K', 77,  'blue'],
  ['Frango Inteiro kg',       'R$ 128K', 70,  'purple'],
  ['Leite Integral 1L',       'R$ 116K', 63,  'yellow'],
  ['Açúcar Cristal 5kg',      'R$ 98K',  53,  'orange'],
  ['Óleo Soja 900ml',         'R$ 84K',  46,  'green'],
  ['Macarrão Espag. 500g',    'R$ 72K',  39,  'blue'],
  ['Café Torrado 500g',       'R$ 68K',  37,  'purple'],
  ['Farinha Trigo 1kg',       'R$ 56K',  30,  'yellow'],
  ['Papel Hig. 12un',         'R$ 48K',  26,  'orange'],
] as const;

const ABC = [
  { cls: 'A', skus: '422', pct: '10%', fat: 'R$ 2,99M', fatPct: '70%', chipColor: 'chip-green' },
  { cls: 'B', skus: '844', pct: '20%', fat: 'R$ 1,07M', fatPct: '25%', chipColor: 'chip-yellow' },
  { cls: 'C', skus: '2.952',pct:'70%', fat: 'R$ 214K',  fatPct: '5%',  chipColor: 'chip-red' },
];

export default function Produtos() {
  return (
    <div className="page-content">
      <div className="kpi-grid">
        {KPI.map(k => (
          <div key={k.label} className="kpi-card" style={{ '--accent': k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={k.small ? { fontSize: 14, marginTop: 4 } : {}}>{k.value}</div>
            <div className={`kpi-change ${k.trend}`}>{k.change}</div>
          </div>
        ))}
      </div>

      <div className="charts-row charts-row-2">
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Top 10 Produtos por Faturamento</div><div className="chart-sub">Jan 2025</div></div></div>
          <div className="rank-list">
            {TOP10.map(([name, val, pct, color], i) => (
              <div key={name} className="rank-item">
                <span className="rank-num">{i + 1}</span>
                <div className="rank-bar-wrap" style={{ '--bar-color': `var(--${color})` } as React.CSSProperties}>
                  <div className="rank-name">{name}</div>
                  <div className="rank-bar-bg"><div className="rank-bar-fill" style={{ width: `${pct}%` }} /></div>
                </div>
                <span className="rank-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Curva ABC</div><div className="chart-sub">Classificação de produtos</div></div></div>
          <table className="data-table">
            <thead><tr><th>Classe</th><th>SKUs</th><th>%</th><th>Faturamento</th><th>%</th></tr></thead>
            <tbody>
              {ABC.map(r => (
                <tr key={r.cls}>
                  <td><span className={`status-chip ${r.chipColor}`}>Classe {r.cls}</span></td>
                  <td className="td-mono td-bold">{r.skus}</td>
                  <td className="td-mono">{r.pct}</td>
                  <td className="td-mono td-bold">{r.fat}</td>
                  <td className="td-mono">{r.fatPct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
