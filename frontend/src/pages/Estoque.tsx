// frontend/src/pages/Estoque.tsx

const KPI = [
  { label: 'Valor em Estoque',   value: 'R$ 1,24M', change: '→ 1,8%', trend: 'neutral', accent: 'var(--yellow)' },
  { label: 'Qtd Total em Estoque',value:'84.220 un.',change: '↑ 2,4%', trend: 'up',     accent: 'var(--green)' },
  { label: 'SKUs Zerados',       value: '48',        change: '↑ 12 novos', trend: 'down', accent: 'var(--red)' },
  { label: 'Giro de Estoque',    value: '28,4×/ano', change: '↑ benchmark', trend: 'up', accent: 'var(--blue)' },
];

const BY_CAT = [
  { name: 'Mercearia Seca',  val: 'R$ 342K', pct: 100, color: 'green' },
  { name: 'Bebidas',         val: 'R$ 286K', pct: 84,  color: 'blue' },
  { name: 'Frios/Laticínios',val: 'R$ 218K', pct: 64,  color: 'purple' },
  { name: 'FLV',             val: 'R$ 142K', pct: 42,  color: 'yellow' },
  { name: 'Açougue',         val: 'R$ 112K', pct: 33,  color: 'orange' },
  { name: 'Higiene/Limpeza', val: 'R$ 98K',  pct: 29,  color: 'green' },
];

const GIRO_TABLE = [
  { prod: 'Arroz Branco 5kg', estoque: '840',    venda: '12.840', giro: '15,3×', giroColor: 'var(--green)' },
  { prod: 'Leite Integral 1L',estoque: '1.240',  venda: '18.600', giro: '15,0×', giroColor: 'var(--green)' },
  { prod: 'Feijão Carioca',   estoque: '620',    venda: '7.440',  giro: '12,0×', giroColor: 'var(--blue)' },
  { prod: 'Açúcar Cristal',   estoque: '480',    venda: '4.320',  giro: '9,0×',  giroColor: 'var(--yellow)' },
  { prod: 'Alcaparras 200g',  estoque: '124',    venda: '7',      giro: '0,06×', giroColor: 'var(--red)' },
];

export default function Estoque() {
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
          <div className="chart-header"><div><div className="chart-title">Estoque por Categoria</div><div className="chart-sub">Valor em R$</div></div></div>
          <div className="rank-list">
            {BY_CAT.map((c, i) => (
              <div key={c.name} className="rank-item">
                <span className="rank-num">{i + 1}</span>
                <div className="rank-bar-wrap" style={{ '--bar-color': `var(--${c.color})` } as React.CSSProperties}>
                  <div className="rank-name">{c.name}</div>
                  <div className="rank-bar-bg"><div className="rank-bar-fill" style={{ width: `${c.pct}%` }} /></div>
                </div>
                <span className="rank-val">{c.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Giro por Produto</div><div className="chart-sub">Rotatividade mensal</div></div></div>
          <table className="data-table">
            <thead><tr><th>Produto</th><th>Estoque</th><th>Venda/mês</th><th>Giro</th></tr></thead>
            <tbody>
              {GIRO_TABLE.map(r => (
                <tr key={r.prod}>
                  <td className="td-bold">{r.prod}</td>
                  <td className="td-mono">{r.estoque}</td>
                  <td className="td-mono">{r.venda}</td>
                  <td className="td-mono td-bold" style={{ color: r.giroColor }}>{r.giro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
