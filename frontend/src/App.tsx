// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Monitor  from './pages/Monitor';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* ── Top Navigation ── */}
        <nav className="navbar">
          {/* Logo */}
          <div className="navbar__logo">
            <div className="navbar__logo-icon">⚡</div>
            <span className="navbar__logo-text">
              Fiscal<span>Sync</span>
            </span>
          </div>

          {/* Tabs — NavLink adiciona a classe "active" automaticamente quando a rota bate */}
          <div className="navbar__tabs">
            <NavLink
              to="/app/monitor"
              className={({ isActive }) =>
                `navbar__tab${isActive ? ' navbar__tab--active' : ''}`
              }
            >
              📊 Monitor
            </NavLink>

            <NavLink
              to="/app/configuracao"
              className={({ isActive }) =>
                `navbar__tab${isActive ? ' navbar__tab--active' : ''}`
              }
            >
              ⚙️ Configurações
            </NavLink>
          </div>

          <span className="navbar__version">v1.0.0</span>
        </nav>

        {/* ── Rotas ── */}
        <main className="page-content">
          <Routes>
            {/* Redireciona / e /app para a aba padrão */}
            <Route path="/"            element={<Navigate to="/app/monitor" replace />} />
            <Route path="/app"         element={<Navigate to="/app/monitor" replace />} />

            {/* Páginas reais */}
            <Route path="/app/monitor"      element={<Monitor />} />
            <Route path="/app/configuracao" element={<Settings />} />

            {/* Qualquer rota desconhecida volta para o monitor */}
            <Route path="*" element={<Navigate to="/app/monitor" replace />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}
