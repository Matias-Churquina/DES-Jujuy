import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { getTheme, toggleTheme } from '@/lib/theme';
import Icon from '@/components/Icon';
import { useToast } from '@/components/Toast';

const menu: Record<string, { to: string; label: string; icon: string }[]> = {
  ADMIN: [
    { to: '/admin', label: 'Resumen', icon: 'chart' },
    { to: '/admin/choferes', label: 'Choferes', icon: 'car' },
    { to: '/admin/viajes', label: 'Viajes', icon: 'route' },
    { to: '/admin/remiserias', label: 'Remiserías', icon: 'pin' },
    { to: '/admin/destinos', label: 'Destinos', icon: 'search' },
    { to: '/admin/paquetes', label: 'Paquetería', icon: 'package' },
  ],
  CHOFER: [
    { to: '/chofer', label: 'Inicio', icon: 'home' },
    { to: '/chofer/viajes', label: 'Mis Viajes', icon: 'route' },
    { to: '/chofer/paquetes', label: 'Paquetes', icon: 'package' },
  ],
  PASAJERO: [
    { to: '/pasajero', label: 'Inicio', icon: 'home' },
    { to: '/pasajero/viaje', label: 'Mi viaje', icon: 'route' },
    { to: '/pasajero/reservas', label: 'Reservas', icon: 'calendar' },
    { to: '/pasajero/paqueteria', label: 'Envíos', icon: 'package' },
  ],
};

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark">
        <span>D</span>
      </div>
      <div>
        <strong>DES</strong>
        <small>Destino Express</small>
      </div>
    </div>
  );
}

const rolLabel: Record<string, string> = {
  ADMIN: 'Supervisor',
  CHOFER: 'Chofer verificado',
  PASAJERO: 'Pasajero/a',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());
  const { toast } = useToast();
  if (!user) return <Navigate to="/login" replace />;

  const items = menu[user.rol] || menu.PASAJERO;
  const current =
    items.find((i) => i.to === location.pathname) ||
    items.find((i) => location.pathname.startsWith(i.to + '/'));
  const initials = `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase();

  const onToggle = () => {
    toggleTheme();
    setTheme(getTheme());
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="side-nav" aria-label="Navegación principal">
          <span className="nav-label">MENÚ PRINCIPAL</span>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/chofer' || item.to === '/pasajero'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {location.pathname === item.to && <span className="active-pip" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">
              <Icon name="message" size={18} />
            </div>
            <strong>¿Necesitás ayuda?</strong>
            <span>Estamos en línea</span>
            <button onClick={() => (window.location.href = 'mailto:soporte@des.local')}>
              Contactar soporte
            </button>
          </div>
          <div className="user-row">
            <div className="avatar">{initials}</div>
            <div>
              <strong>{user.nombre} {user.apellido}</strong>
              <span>{rolLabel[user.rol] || user.rol}</span>
            </div>
            <button onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión" style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}>
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="page-title">
            <h1>{current?.label || 'Inicio'}</h1>
            <p>{user.rol === 'ADMIN' ? 'Operaciones en tiempo real' : 'San Salvador de Jujuy'}</p>
          </div>
          <div className="top-actions">
            <button
              className="icon-button theme-toggle"
              aria-label="Cambiar tema"
              onClick={onToggle}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="icon-button"
              aria-label="Notificaciones"
              onClick={() => toast('info', 'No tenés notificaciones nuevas')}
            >
              <Icon name="bell" />
            </button>
            <button className="icon-button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}>
              <Icon name="logout" />
            </button>
            <div className="top-avatar avatar">{initials}</div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/chofer' || item.to === '/pasajero'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
