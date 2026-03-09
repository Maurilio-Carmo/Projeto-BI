// frontend/src/pages/Fiscal.tsx

const TAXES = [
  { name: 'ICMS',    val: 'R$ 684K', color: 'var(--blue)' },
  { name: 'ICMS ST', val: 'R$ 212K', color: 'var(--purple)' },
  { name: 'PIS',     val: 'R$ 64K',  color: 'var(--green)' },
  { name: 'COFINS',  val: 'R$ 296K', color: 'var(--yellow)' },
  { name: 'IPI',     val: 'R$ 28K',  color: 'var(--orange)' },
  { name: 'FECOP',   val: 'R$ 18K',  color: 'var(--red)' },
];

const MONTHS    = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const TAX_HIST  = [52,48,58,55,62,57,66,70,61,72,88,84];

const CFOP_TABLE = [
  { cfop: '5.102', desc: 'Venda merc. adquirida', base: 'R$ 2,8M', total: 'R$ 448K', totalColor: 'var(--purple)' },
  { cfop: '5.405', desc: 'Venda merc. c/ ST',     base: 'R$ 1,1M', total: 'R$ 212K', totalColor: 'var(--blue)' },
  { cfop: '5.152', desc: 'Transferência',          base: 'R$ 284K', total: 'R$ 48K',  totalColor: 'var(--yellow)' },
  { cfop: '6.102', desc: 'Venda interestadual',    base: 'R$ 128K', total: 'R$ 32K',  totalColor: 'var(--text)' },
];

export default function Fiscal() {
  const max = Math.max(...TAX_HIST);
  return (
    <div className="page-content">
      <div className="tax-big-grid">
        {TAXES.map(t => (
          <div key={t.name} className="tax-card">
            <div className="tax-name">{t.name}</div>
            <div className="tax-val" style={{ color: t.color }}>{t.val}</div>
          </div>
        ))}
      </div>

      <div className="charts-row charts-row-2">
        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Impostos por Mês</div><div className="chart-sub">Evolução 2024</div></div></div>
          <div className="bar-chart">
            {TAX_HIST.map((v, i) => (
              <div key={i} className="bar-group">
                <div className="bar" style={{ height: `${v / max * 100}%`, background: 'rgba(155,109,255,0.4)' }} />
                <div className="bar-label">{MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Impostos por CFOP</div><div className="chart-sub">Distribuição percentual</div></div></div>
          <table className="data-table">
            <thead><tr><th>CFOP</th><th>Descrição</th><th>Base</th><th>Total Imp.</th></tr></thead>
            <tbody>
              {CFOP_TABLE.map(r => (
                <tr key={r.cfop}>
                  <td className="td-mono td-bold" style={{ color: 'var(--blue)' }}>{r.cfop}</td>
                  <td>{r.desc}</td>
                  <td className="td-mono">{r.base}</td>
                  <td className="td-mono td-bold" style={{ color: r.totalColor }}>{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
