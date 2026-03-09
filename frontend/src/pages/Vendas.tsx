// frontend/src/pages/Vendas.tsx

const KPI = [
  { label: 'Total Vendido',  value: 'R$ 4,28M', change: '↑ 12,4%', trend: 'up',  accent: 'var(--green)' },
  { label: 'Itens Vendidos', value: '487.220',   change: '↑ 6,8%',  trend: 'up',  accent: 'var(--blue)' },
  { label: 'Ticket Médio',   value: 'R$ 127,40', change: '↑ 3,7%',  trend: 'up',  accent: 'var(--purple)' },
  { label: 'Nº Cupons',      value: '33.614',    change: '↑ 5,2%',  trend: 'up',  accent: 'var(--yellow)' },
];

const DAY_VALS = [128,142,115,137,155,180,162,138,144,150,167,185,172,148,156,163,178,190,170,158,145,148,165,182,175,160,152,158,172,188,165];
const HEAT_HOURS = ['8h','10h','12h','14h','16h','18h','20h'];
const HEAT_DAYS  = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const HEAT_DATA  = [
  [0.2,0.3,0.25,0.3,0.4,0.7,0.5],
  [0.3,0.4,0.35,0.4,0.5,0.8,0.6],
  [0.8,0.9,0.85,0.9,1.0,0.9,0.7],
  [0.4,0.5,0.4,0.45,0.55,0.7,0.5],
  [0.6,0.7,0.65,0.7,0.8,0.85,0.6],
  [0.9,0.95,0.9,0.95,1.0,0.95,0.8],
  [0.5,0.55,0.5,0.55,0.65,0.7,0.5],
];

const LOJAS = [
  { name: 'Loja Centro · R$ 1,62M', pct: 100, part: '38%', color: 'var(--green)' },
  { name: 'Loja Norte · R$ 1,20M',  pct: 74,  part: '28%', color: 'var(--blue)' },
  { name: 'Loja Sul · R$ 942K',     pct: 58,  part: '22%', color: 'var(--purple)' },
  { name: 'Loja Leste · R$ 514K',   pct: 32,  part: '12%', color: 'var(--yellow)' },
];

const CAT_TABLE = [
  { cat: 'Mercearia Seca', val: 'R$ 1,20M', pct: '28%', var: '+14%', varColor: 'var(--green)',  valColor: 'var(--green)' },
  { cat: 'FLV',            val: 'R$ 880K',  pct: '21%', var: '+9%',  varColor: 'var(--green)',  valColor: 'var(--blue)' },
  { cat: 'Açougue',        val: 'R$ 742K',  pct: '17%', var: '+18%', varColor: 'var(--green)',  valColor: 'var(--purple)' },
  { cat: 'Frios/Latic.',   val: 'R$ 544K',  pct: '13%', var: '+2%',  varColor: 'var(--yellow)', valColor: '' },
  { cat: 'Bebidas',        val: 'R$ 420K',  pct: '10%', var: '-3%',  varColor: 'var(--red)',    valColor: '' },
  { cat: 'Outros',         val: 'R$ 494K',  pct: '11%', var: '+5%',  varColor: 'var(--green)',  valColor: '' },
];

export default function Vendas() {
  const max = Math.max(...DAY_VALS);
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
        {/* Vendas por dia */}
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Vendas por Dia</div><div className="chart-sub">Janeiro 2025</div></div>
            <div className="chart-badge">R$/dia</div>
          </div>
          <div className="bar-chart">
            {DAY_VALS.map((v, i) => (
              <div key={i} className="bar-group">
                <div className="bar" style={{
                  height: `${v / max * 100}%`,
                  background: v >= 180 ? 'var(--green)' : 'rgba(0,255,136,0.3)',
                }} />
                <div className="bar-label">{(i + 1) % 5 === 0 ? i + 1 : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap por hora */}
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Vendas por Hora</div><div className="chart-sub">Mapa de calor semanal</div></div>
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <div style={{ width: 24, flexShrink: 0 }} />
            {HEAT_DAYS.map(d => (
              <div key={d} style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', textAlign: 'center' }}>{d}</div>
            ))}
          </div>
          {HEAT_HOURS.map((h, hi) => (
            <div key={h} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', width: 24, flexShrink: 0 }}>{h}</div>
              {HEAT_DATA[hi].map((v, di) => (
                <div key={di} style={{ flex: 1, height: 18, borderRadius: 3, background: `rgba(0,255,136,${v})` }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="charts-row charts-row-2">
        {/* Rank lojas */}
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Vendas por Loja</div><div className="chart-sub">Comparativo mensal</div></div></div>
          <div className="rank-list">
            {LOJAS.map((l, i) => (
              <div key={l.name} className="rank-item">
                <span className="rank-num">{i + 1}</span>
                <div className="rank-bar-wrap" style={{ '--bar-color': l.color } as React.CSSProperties}>
                  <div className="rank-name">{l.name}</div>
                  <div className="rank-bar-bg"><div className="rank-bar-fill" style={{ width: `${l.pct}%` }} /></div>
                </div>
                <span className="rank-val">{l.part}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela categorias */}
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Vendas por Categoria</div><div className="chart-sub">Jan 2025</div></div></div>
          <table className="data-table">
            <thead><tr><th>Categoria</th><th>Valor</th><th>%</th><th>Var.</th></tr></thead>
            <tbody>
              {CAT_TABLE.map(r => (
                <tr key={r.cat}>
                  <td className="td-bold">{r.cat}</td>
                  <td className="td-mono" style={{ color: r.valColor || 'var(--text)', fontWeight: 700 }}>{r.val}</td>
                  <td className="td-mono">{r.pct}</td>
                  <td className="td-mono" style={{ color: r.varColor }}>{r.var}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
