// frontend/src/App.tsx
import { useState } from 'react';
import '../src/css/index.css';

import Dashboard   from './pages/Dashboard';
import Vendas      from './pages/Vendas';
import Produtos    from './pages/Produtos';
import Margem      from './pages/Margem';
import Compras     from './pages/Compras';
import Fornecedores from './pages/Fornecedores';
import Estoque     from './pages/Estoque';
import Giro        from './pages/Giro';
import Fiscal      from './pages/Fiscal';
import Auditoria   from './pages/Auditoria';
import Monitor     from './pages/Monitor';
import Config      from './pages/Config';

// ── Types ──────────────────────────────────────────────────────────────────
type PageId =
  | 'dashboard' | 'vendas'  | 'produtos' | 'margem'
  | 'compras'   | 'fornecedores' | 'estoque' | 'giro'
  | 'fiscal'    | 'auditoria'   | 'monitor' | 'config';

interface NavItem { id: PageId; label: string; icon: React.ReactNode; }

// ── SVG Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, extra }: { d: string; extra?: string }) => (
  <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d={d} />{extra && <path d={extra} />}
  </svg>
);

const PAGE_TITLES: Record<PageId, string> = {
  dashboard:    'Dashboard Executivo',
  vendas:       'Análise de Vendas',
  produtos:     'Performance de Produtos',
  margem:       'Margem & Lucratividade',
  compras:      'Controle de Compras',
  fornecedores: 'Avaliação de Fornecedores',
  estoque:      'Gestão de Estoque',
  giro:         'Giro & Ruptura',
  fiscal:       'Painel Fiscal',
  auditoria:    'Auditoria & Consulta',
  monitor:      'Monitor de Importações',
  config:       'Configurações do Sistema',
};

const PAGE_COMPONENTS: Record<PageId, React.ComponentType> = {
  dashboard:    Dashboard,
  vendas:       Vendas,
  produtos:     Produtos,
  margem:       Margem,
  compras:      Compras,
  fornecedores: Fornecedores,
  estoque:      Estoque,
  giro:         Giro,
  fiscal:       Fiscal,
  auditoria:    Auditoria,
  monitor:      Monitor,
  config:       Config,
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Gerencial',
    items: [
      { id: 'dashboard', label: 'Dashboard',     icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> },
      { id: 'vendas',    label: 'Vendas',        icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 9,9 15,3"/><polyline points="11,3 15,3 15,7"/></svg> },
      { id: 'produtos',  label: 'Produtos',      icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"/><path d="M8 1V15M2 4.5L14 4.5"/></svg> },
      { id: 'margem',    label: 'Margem & Lucro',icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 4v4l3 2"/></svg> },
    ],
  },
  {
    section: 'Suprimentos',
    items: [
      { id: 'compras',      label: 'Compras',      icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 2h2l2 8h8l1-5H5"/><circle cx="7" cy="13" r="1"/><circle cx="12" cy="13" r="1"/></svg> },
      { id: 'fornecedores', label: 'Fornecedores', icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="5" height="6" rx="1"/><rect x="9" y="5" width="5" height="10" rx="1"/><path d="M4.5 9V6a3.5 3.5 0 017 0v1"/></svg> },
      { id: 'estoque',      label: 'Estoque',      icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V3a3 3 0 016 0v2"/><path d="M5 10h6"/></svg> },
      { id: 'giro',         label: 'Giro & Ruptura',icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 3A7 7 0 102 11"/><polyline points="13 3 13 7 9 7"/></svg> },
    ],
  },
  {
    section: 'Controle',
    items: [
      { id: 'fiscal',    label: 'Fiscal',    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2h10a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M5 6h6M5 9h6M5 12h3"/></svg> },
      { id: 'auditoria', label: 'Auditoria', icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg> },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { id: 'monitor', label: 'Monitor',        icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="10" rx="1.5"/><path d="M5 15h6M8 12v3"/><polyline points="4,9 6,6 9,8 12,5"/></svg> },
      { id: 'config',  label: 'Configurações',  icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/></svg> },
    ],
  },
];

// ── Filter pills state ─────────────────────────────────────────────────────
const FILTERS = ['Jan 2025', 'Fev 2025', 'Mar 2025', 'Todas as Lojas ▾'];

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [activeFilter, setActiveFilter] = useState(0);

  const PageComponent = PAGE_COMPONENTS[page];

  return (
    <div className="app">
      {/* ── SIDEBAR ── */}
      <nav className="sidebar">
        <div className="logo">
          <div className="logo-text">Retail<span>BI</span> Sync</div>
          <div className="logo-sub">v1.0 · VarejoFácil API</div>
        </div>

        {NAV.map(({ section, items }) => (
          <div key={section} className="nav-section">
            <div className="nav-label">{section}</div>
            {items.map(item => (
              <button
                key={item.id}
                className={`nav-item${page === item.id ? ' active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="status-badge">
            <div className="status-dot" />
            SYNC ATIVO
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="page-title">{PAGE_TITLES[page]}</div>
          <div className="topbar-right">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                className={`filter-pill${activeFilter === i ? ' active' : ''}`}
                onClick={() => setActiveFilter(i)}
              >
                {f}
              </button>
            ))}
            <button className="btn-sync">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 3A7 7 0 102 11" /><polyline points="13 3 13 7 9 7" />
              </svg>
              Sync Agora
            </button>
          </div>
        </div>

        {/* Page */}
        <PageComponent key={page} />
      </div>
    </div>
  );
}
