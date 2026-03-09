// frontend/src/App.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import './css/index.css';

import Dashboard    from './pages/Dashboard';
import Vendas       from './pages/Vendas';
import Produtos     from './pages/Produtos';
import Margem       from './pages/Margem';
import Compras      from './pages/Compras';
import Fornecedores from './pages/Fornecedores';
import Estoque      from './pages/Estoque';
import Giro         from './pages/Giro';
import Fiscal       from './pages/Fiscal';
import Auditoria    from './pages/Auditoria';
import Monitor      from './pages/Monitor';
import Config       from './pages/Config';

type PageId =
  | 'dashboard' | 'vendas'  | 'produtos' | 'margem'
  | 'compras'   | 'fornecedores' | 'estoque' | 'giro'
  | 'fiscal'    | 'auditoria'   | 'monitor' | 'config';

const ALL_PAGES: PageId[] = [
  'dashboard','vendas','produtos','margem',
  'compras','fornecedores','estoque','giro',
  'fiscal','auditoria','monitor','config',
];

interface NavItem { id: PageId; label: string; icon: React.ReactNode; }

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

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Gerencial',
    items: [
      { id: 'dashboard', label: 'Dashboard',      icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> },
      { id: 'vendas',    label: 'Vendas',          icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 9,9 15,3"/><polyline points="11,3 15,3 15,7"/></svg> },
      { id: 'produtos',  label: 'Produtos',        icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"/><path d="M8 1V15M2 4.5L14 4.5"/></svg> },
      { id: 'margem',    label: 'Margem & Lucro',  icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 4v4l3 2"/></svg> },
    ],
  },
  {
    section: 'Suprimentos',
    items: [
      { id: 'compras',      label: 'Compras',        icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 2h2l2 8h8l1-5H5"/><circle cx="7" cy="13" r="1"/><circle cx="12" cy="13" r="1"/></svg> },
      { id: 'fornecedores', label: 'Fornecedores',   icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="5" height="6" rx="1"/><rect x="9" y="5" width="5" height="10" rx="1"/><path d="M4.5 9V6a3.5 3.5 0 017 0v1"/></svg> },
      { id: 'estoque',      label: 'Estoque',        icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V3a3 3 0 016 0v2"/><path d="M5 10h6"/></svg> },
      { id: 'giro',         label: 'Giro & Ruptura', icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 3A7 7 0 102 11"/><polyline points="13 3 13 7 9 7"/></svg> },
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
      { id: 'monitor', label: 'Monitor',       icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="10" rx="1.5"/><path d="M5 15h6M8 12v3"/><polyline points="4,9 6,6 9,8 12,5"/></svg> },
      { id: 'config',  label: 'Configurações', icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/></svg> },
    ],
  },
];

const FILTERS = ['Jan 2025', 'Fev 2025', 'Mar 2025', 'Todas as Lojas ▾'];

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

export default function App() {
  const navigate            = useNavigate();
  const { pathname }        = useLocation();
  const isMobile            = useIsMobile();
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);

  const goTo = (id: PageId) => {
    navigate(`/app/${id}`);
    if (isMobile) setMobileOpen(false);
  };

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const segment = pathname.split('/').pop() ?? '';
  const page: PageId = (ALL_PAGES.includes(segment as PageId) ? segment : 'dashboard') as PageId;

  // Uma única classe controla os três estados
  const sidebarClass = [
    'sidebar',
    !isMobile && collapsed  ? 'sidebar--collapsed' : '',
    isMobile  && mobileOpen ? 'sidebar--open'      : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="app">

      {/* Overlay — mobile drawer */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── SIDEBAR — estrutura exatamente igual ao original ── */}
      <nav className={sidebarClass}>
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
                onClick={() => goTo(item.id)}
                title={item.label}
              >
                {item.icon}
                <span className="nav-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="status-badge">
            <div className="status-dot" />
            <span className="sidebar-footer-label">SYNC ATIVO</span>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="main">

        <div className="topbar">

          {/* ── ÚNICO botão de toggle ── */}
          <button
            className="btn-sidebar-toggle"
            onClick={() => isMobile ? setMobileOpen(o => !o) : setCollapsed(c => !c)}
            aria-label="Toggle sidebar"
          >
            {isMobile ? (
              mobileOpen
                ? /* X */
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
                  </svg>
                : /* Hamburguer */
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="2" y1="4"  x2="14" y2="4"/>
                    <line x1="2" y1="8"  x2="14" y2="8"/>
                    <line x1="2" y1="12" x2="14" y2="12"/>
                  </svg>
            ) : (
              /* Seta — rotaciona quando colapsado */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }}>
                <polyline points="9,2 4,7 9,12"/>
              </svg>
            )}
          </button>

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
              <span className="btn-sync-text">Sync Agora</span>
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/"                 element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app"              element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard"    element={<Dashboard />} />
          <Route path="/app/vendas"       element={<Vendas />} />
          <Route path="/app/produtos"     element={<Produtos />} />
          <Route path="/app/margem"       element={<Margem />} />
          <Route path="/app/compras"      element={<Compras />} />
          <Route path="/app/fornecedores" element={<Fornecedores />} />
          <Route path="/app/estoque"      element={<Estoque />} />
          <Route path="/app/giro"         element={<Giro />} />
          <Route path="/app/fiscal"       element={<Fiscal />} />
          <Route path="/app/auditoria"    element={<Auditoria />} />
          <Route path="/app/monitor"      element={<Monitor />} />
          <Route path="/app/config"       element={<Config />} />
          <Route path="*"                 element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
