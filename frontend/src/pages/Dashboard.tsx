// frontend/src/pages/Dashboard.tsx
import { useEffect, useRef, useState } from 'react';

// ── Mock data (substitua pelas chamadas reais da API) ──────────────────────
const KPI_TOP = [
  { label: 'Faturamento Total', value: 'R$ 4,28M', change: '↑ 12,4% vs mês ant.', trend: 'up',     accent: 'var(--green)' },
  { label: 'Lucro Bruto',       value: 'R$ 856K',  change: '↑ 8,1%',              trend: 'up',     accent: 'var(--blue)' },
  { label: 'CMV Total',         value: 'R$ 3,42M', change: '↑ 13,2%',             trend: 'down',   accent: 'var(--yellow)' },
  { label: 'Ticket Médio',      value: 'R$ 127,40',change: '↑ 3,7%',              trend: 'up',     accent: 'var(--purple)' },
  { label: 'Margem Média',      value: '20,1%',    change: '↓ 0,4pp',             trend: 'down',   accent: 'var(--orange)' },
];

const KPI_BOT = [
  { label: 'Total Vendas (cupons)', value: '33.614', change: '↑ 5,2%',  trend: 'up',     accent: 'var(--green)' },
  { label: 'NF-e Emitidas',        value: '1.847',  change: '↑ 2,1%',  trend: 'up',     accent: 'var(--blue)' },
  { label: 'Total Comprado',        value: 'R$ 3,55M',change: '→ 0,3%', trend: 'neutral',accent: 'var(--yellow)' },
  { label: 'Valor em Estoque',      value: 'R$ 1,24M',change: '↑ 1,8%', trend: 'up',     accent: 'var(--purple)' },
];

const MONTHS   = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const FATURA   = [72,68,81,77,85,79,88,91,84,96,112,108];
const LUCRO    = [58,54,72,65,74,69,80,83,72,88,104,99];

const TOP_CAT = [
  { name: 'Mercearia Seca',   val: 'R$ 1,2M', pct: 88, color: 'var(--green)' },
  { name: 'FLV (Hortifrutti)',val: 'R$ 880K',  pct: 65, color: 'var(--blue)' },
  { name: 'Açougue',          val: 'R$ 742K',  pct: 55, color: 'var(--purple)' },
  { name: 'Frios e Laticínios',val: 'R$ 544K', pct: 40, color: 'var(--yellow)' },
  { name: 'Bebidas',          val: 'R$ 420K',  pct: 31, color: 'var(--orange)' },
];

const LOJAS = [
  { name: 'Loja Centro', pct: 38, color: 'var(--green)',  dashOff: 0 },
  { name: 'Loja Norte',  pct: 28, color: 'var(--blue)',   dashOff: -83.8 },
  { name: 'Loja Sul',    pct: 22, color: 'var(--purple)', dashOff: -145.5 },
  { name: 'Loja Leste',  pct: 12, color: 'var(--yellow)', dashOff: -194 },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function BarChart({ values, color = 'rgba(0,255,136,0.35)', highlight = 'var(--green)', label }: {
  values: number[]; color?: string; highlight?: string; label?: (i: number) => string;
}) {
  const max = Math.max(...values);
  return (
    <div className="bar-chart">
      {values.map((v, i) => (
        <div key={i} className="bar-group">
          <div
            className="bar"
            style={{ height: `${v / max * 100}%`, background: v === max ? highlight : color }}
          />
          <div className="bar-label">{label ? label(i) : ''}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="page-content">
      {/* ── KPI row 1 (5 cols) ── */}
      <div className="kpi-grid kpi-grid-5">
        {KPI_TOP.map(k => (
          <div key={k.label} className="kpi-card" style={{ '--accent': k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-change ${k.trend}`}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* ── KPI row 2 (4 cols) ── */}
      <div className="kpi-grid">
        {KPI_BOT.map(k => (
          <div key={k.label} className="kpi-card" style={{ '--accent': k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-change ${k.trend}`}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* ── Charts row 1 ── */}
      <div className="charts-row charts-row-32">
        {/* Faturamento por Mês */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Faturamento por Mês</div>
              <div className="chart-sub">Jan–Dez 2024 · R$ milhões</div>
            </div>
            <div className="chart-badge">2024</div>
          </div>
          <BarChart values={FATURA} label={i => MONTHS[i]} />
        </div>

        {/* Vendas por Loja – donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Vendas por Loja</div>
              <div className="chart-sub">Participação %</div>
            </div>
          </div>
          <div className="donut-wrap">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--border)" strokeWidth="14" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--green)"  strokeWidth="14" strokeDasharray="83.8 136.2"  strokeDashoffset="0"    transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--blue)"   strokeWidth="14" strokeDasharray="61.7 158.3"  strokeDashoffset="-83.8" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--purple)" strokeWidth="14" strokeDasharray="48.5 171.5"  strokeDashoffset="-145.5" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="var(--yellow)" strokeWidth="14" strokeDasharray="26.4 193.6"  strokeDashoffset="-194"  transform="rotate(-90 50 50)" />
            </svg>
            <div className="donut-legend">
              {LOJAS.map(l => (
                <div key={l.name} className="legend-item">
                  <div className="legend-dot" style={{ background: l.color }} />
                  <span className="legend-label">{l.name}</span>
                  <span className="legend-val" style={{ color: l.color }}>{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="charts-row charts-row-2">
        {/* Lucro por mês */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Lucro por Mês</div>
              <div className="chart-sub">Evolução mensal · R$ mil</div>
            </div>
            <span className="status-chip chip-green">+8,1%</span>
          </div>
          <BarChart
            values={LUCRO}
            color="rgba(0,194,255,0.3)"
            highlight="var(--blue)"
            label={i => MONTHS[i]}
          />
        </div>

        {/* Top Categorias */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Top Categorias</div>
              <div className="chart-sub">Por faturamento · Jan 2025</div>
            </div>
          </div>
          <div className="rank-list">
            {TOP_CAT.map((c, i) => (
              <div key={c.name} className="rank-item">
                <span className="rank-num">{i + 1}</span>
                <div className="rank-bar-wrap" style={{ '--bar-color': c.color } as React.CSSProperties}>
                  <div className="rank-name">{c.name}</div>
                  <div className="rank-bar-bg">
                    <div className="rank-bar-fill" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
                <span className="rank-val">{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
