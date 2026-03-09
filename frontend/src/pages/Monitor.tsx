// frontend/src/pages/Monitor.tsx
import { useState, useEffect } from 'react';

type JobColor = 'green' | 'blue' | 'purple' | 'yellow' | 'orange' | 'red';

interface Job {
  icon: string;
  name: string;
  endpoint: string;
  freq: string;
  status: 'RODANDO' | 'PAUSADO' | 'ERRO';
  count: string;
  active: boolean;
  color: JobColor;
}

const INITIAL_JOBS: Job[] = [
  { icon:'🧾', name:'Cupons Fiscais',  endpoint:'venda/cupons-fiscais',     freq:'A cada 5 min',  status:'RODANDO', count:'12.840', active:true,  color:'green' },
  { icon:'📄', name:'NF-e Vendas',     endpoint:'venda/notas-fiscais',      freq:'A cada 15 min', status:'RODANDO', count:'1.847',  active:true,  color:'green' },
  { icon:'🛒', name:'NF-e Compras',    endpoint:'compra/notas-fiscais',     freq:'A cada 15 min', status:'RODANDO', count:'2.184',  active:true,  color:'blue' },
  { icon:'📦', name:'Produtos',        endpoint:'produto/produtos',         freq:'A cada 60 min', status:'RODANDO', count:'4.218',  active:true,  color:'purple' },
  { icon:'💰', name:'Preços',          endpoint:'produto/precos',           freq:'A cada 30 min', status:'RODANDO', count:'4.218',  active:true,  color:'yellow' },
  { icon:'📊', name:'Estoque',         endpoint:'estoque/saldos',           freq:'A cada 30 min', status:'PAUSADO', count:'0',      active:false, color:'red' },
];

const LOGS = [
  { entity:'Cupons Fiscais', color:'green', status:'SUCESSO', records:'842', duration:'3s',  time:'14:32:18' },
  { entity:'NF-e Vendas',    color:'green', status:'SUCESSO', records:'12',  duration:'5s',  time:'14:28:04' },
  { entity:'Produtos',       color:'green', status:'SUCESSO', records:'4',   duration:'3s',  time:'14:20:11' },
  { entity:'Preços',         color:'green', status:'SUCESSO', records:'64',  duration:'4s',  time:'14:15:02' },
  { entity:'Cupons Fiscais', color:'green', status:'SUCESSO', records:'836', duration:'3s',  time:'14:27:18' },
  { entity:'NF-e Compras',   color:'red',   status:'ERRO',    records:'0',   duration:'1s',  time:'14:10:22' },
];

const COLOR_MAP: Record<JobColor, { dim: string; border: string }> = {
  green:  { dim: 'var(--green-dim)',  border: 'rgba(0,255,136,0.3)' },
  blue:   { dim: 'var(--blue-dim)',   border: 'rgba(0,194,255,0.3)' },
  purple: { dim: 'var(--purple-dim)', border: 'rgba(155,109,255,0.3)' },
  yellow: { dim: 'var(--yellow-dim)', border: 'rgba(255,184,0,0.3)' },
  orange: { dim: 'var(--orange-dim)', border: 'rgba(255,107,53,0.3)' },
  red:    { dim: 'var(--red-dim)',    border: 'rgba(255,68,102,0.3)' },
};

export default function Monitor() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  const handleSync = (name: string) => {
    setSyncing(p => ({ ...p, [name]: true }));
    setTimeout(() => setSyncing(p => ({ ...p, [name]: false })), 2000);
  };

  const toggleJob = (name: string) => {
    setJobs(prev => prev.map(j =>
      j.name === name ? { ...j, active: !j.active, status: j.active ? 'PAUSADO' : 'RODANDO', color: j.active ? 'red' : j.color === 'red' ? 'green' : j.color } : j
    ));
  };

  const activeCount = jobs.filter(j => j.active).length;

  return (
    <div className="page-content">
      <div className="kpi-grid kpi-grid-3">
        <div className="kpi-card" style={{ '--accent': 'var(--green)' } as React.CSSProperties}>
          <div className="kpi-label">Jobs Ativos</div>
          <div className="kpi-value">{activeCount} / {jobs.length}</div>
          <div className={`kpi-change ${activeCount === jobs.length ? 'up' : 'neutral'}`}>
            {activeCount === jobs.length ? 'Todos rodando' : `${jobs.length - activeCount} pausado(s)`}
          </div>
        </div>
        <div className="kpi-card" style={{ '--accent': 'var(--blue)' } as React.CSSProperties}>
          <div className="kpi-label">Registros Hoje</div>
          <div className="kpi-value">14.228</div>
          <div className="kpi-change up">↑ desde meia-noite</div>
        </div>
        <div className="kpi-card" style={{ '--accent': 'var(--yellow)' } as React.CSSProperties}>
          <div className="kpi-label">Último Sync</div>
          <div className="kpi-value">há 4 min</div>
          <div className="kpi-change neutral">14:32:18</div>
        </div>
      </div>

      <div className="section-row"><span className="section-label">Jobs em Execução</span><div className="section-line" /></div>

      {jobs.map(job => {
        const colors = COLOR_MAP[job.color] ?? COLOR_MAP.green;
        const isSync = syncing[job.name];
        return (
          <div key={job.name} className="job-card">
            <div className="job-icon" style={{ background: colors.dim }}>{job.icon}</div>
            <div className="job-info">
              <div className="job-name">{job.name}</div>
              <div className="job-meta">/v1/{job.endpoint} · {job.freq}</div>
            </div>
            <div style={{ margin: '0 20px' }}>
              <span className={`status-chip chip-${job.active ? job.color : 'red'}`}>{job.status}</span>
            </div>
            <div className="job-right">
              <div className="job-count" style={{ color: `var(--${job.color})` }}>{job.count}</div>
              <div className="job-count-label">registros</div>
            </div>
            <div className="job-actions">
              <button
                className="job-btn"
                onClick={() => handleSync(job.name)}
                disabled={isSync}
                style={{ background: 'var(--green-dim)', borderColor: 'rgba(0,255,136,0.3)', color: 'var(--green)' }}
              >
                {isSync ? '⟳' : '▶ Sync'}
              </button>
              <button
                className="job-btn"
                onClick={() => toggleJob(job.name)}
                style={{ background: 'var(--card2)', borderColor: 'var(--border2)', color: 'var(--text2)' }}
              >
                {job.active ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        );
      })}

      <div className="section-row" style={{ marginTop: 8 }}><span className="section-label">Últimas Execuções</span><div className="section-line" /></div>

      <div className="chart-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Entidade</th><th>Status</th><th>Registros</th>
              <th>ID Inicial</th><th>ID Final</th><th>Duração</th><th>Início</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, i) => (
              <tr key={i}>
                <td className="td-bold">{log.entity}</td>
                <td><span className={`status-chip chip-${log.color}`}>{log.status}</span></td>
                <td className="td-mono">{log.records}</td>
                <td className="td-mono" style={{ color: 'var(--text3)' }}>last+1</td>
                <td className="td-mono" style={{ color: 'var(--text3)' }}>last+{log.records}</td>
                <td className="td-mono">{log.duration}</td>
                <td className="td-mono">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
