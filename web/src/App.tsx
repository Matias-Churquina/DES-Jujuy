import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminChoferes from './pages/admin/Choferes';
import AdminViajes from './pages/admin/Viajes';
import AdminRemiserias from './pages/admin/Remiserias';
import AdminDestinos from './pages/admin/Destinos';
import ChoferDashboard from './pages/chofer/Dashboard';
import ChoferViajes from './pages/chofer/Viajes';
import BuscarViajes from './pages/pasajero/BuscarViajes';
import MisReservas from './pages/pasajero/MisReservas';
import MiViaje from './pages/pasajero/MiViaje';
import Paqueteria from './pages/pasajero/Paqueteria';
import ChoferPaquetes from './pages/chofer/Paquetes';
import AdminPaquetes from './pages/admin/Paquetes';
import Track from './pages/Track';
import Landing from './pages/Landing';
import type { Rol } from './types';

function ProtectedRoute({ roles, children }: { roles: Rol[]; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user!.rol)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Landing />;
  const routes: Record<Rol, string> = { ADMIN: '/admin', CHOFER: '/chofer', PASAJERO: '/pasajero' };
  return <Navigate to={routes[user!.rol]} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/track" element={<Track />} />
      <Route path="/track/:codigo" element={<Track />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<AppLayout />}>
        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/choferes" element={<ProtectedRoute roles={['ADMIN']}><AdminChoferes /></ProtectedRoute>} />
        <Route path="/admin/viajes" element={<ProtectedRoute roles={['ADMIN']}><AdminViajes /></ProtectedRoute>} />
        <Route path="/admin/remiserias" element={<ProtectedRoute roles={['ADMIN']}><AdminRemiserias /></ProtectedRoute>} />
        <Route path="/admin/destinos" element={<ProtectedRoute roles={['ADMIN']}><AdminDestinos /></ProtectedRoute>} />
        <Route path="/admin/paquetes" element={<ProtectedRoute roles={['ADMIN']}><AdminPaquetes /></ProtectedRoute>} />

        {/* Chofer */}
        <Route path="/chofer" element={<ProtectedRoute roles={['CHOFER']}><ChoferDashboard /></ProtectedRoute>} />
        <Route path="/chofer/viajes" element={<ProtectedRoute roles={['CHOFER']}><ChoferViajes /></ProtectedRoute>} />
        <Route path="/chofer/paquetes" element={<ProtectedRoute roles={['CHOFER']}><ChoferPaquetes /></ProtectedRoute>} />

        {/* Pasajero */}
        <Route path="/pasajero" element={<ProtectedRoute roles={['PASAJERO']}><BuscarViajes /></ProtectedRoute>} />
        <Route path="/pasajero/reservas" element={<ProtectedRoute roles={['PASAJERO']}><MisReservas /></ProtectedRoute>} />
        <Route path="/pasajero/viaje" element={<ProtectedRoute roles={['PASAJERO']}><MiViaje /></ProtectedRoute>} />
        <Route path="/pasajero/paqueteria" element={<ProtectedRoute roles={['PASAJERO']}><Paqueteria /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
