import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Card, PageHeader, Spinner, Badge, Button, EmptyState } from '@/components/ui';
import { useToast } from '@/components/Toast';
import type { Paquete } from '@/types';

const colorEstado: Record<string, string> = {
  PENDIENTE_RECOGIDA: 'yellow', RECIBIDO: 'blue', ASIGNADO: 'purple', EN_TRANSITO: 'blue',
  ENTREGADO: 'green', INCIDENCIA: 'red', DEVUELTO: 'gray', CANCELADO: 'red',
};

export default function ChoferPaquetes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [incidencia, setIncidencia] = useState<{id: number; motivo: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const idChofer = user?.chofer?.idChofer;

  const cargar = () => {
    if (!idChofer) { setLoading(false); return; }
    api.get<Paquete[]>(`/paquetes/chofer/${idChofer}`)
      .then((r) => setPaquetes(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, [idChofer]);

  const actualizar = (paquete: Paquete, estado: string, obs?: string) => {
    const enviar = (lat?: number, lng?: number) => {
      api.patch(`/paquetes/${paquete.idPaquete}/estado`, {
        estado, latitud: lat, longitud: lng, observaciones: obs,
      })
        .then(() => { toast('info', `Paquete ${estado.toLowerCase().replace(/_/g, ' ')}`); cargar(); })
        .catch((err: any) => toast('error', err.response?.data?.message || 'No se pudo actualizar'));
    };
    if (!('geolocation' in navigator)) return enviar();
    navigator.geolocation.getCurrentPosition(
      (p) => enviar(p.coords.latitude, p.coords.longitude),
      () => enviar(),
      { timeout: 5000 },
    );
  };

  if (loading) return <Spinner />;
  if (!idChofer) return <EmptyState message="No se encontró tu perfil de chofer" />;

  const activos = paquetes.filter((p) => !['ENTREGADO', 'DEVUELTO', 'CANCELADO'].includes(p.estado));
  const cerrados = paquetes.filter((p) => ['ENTREGADO', 'DEVUELTO', 'CANCELADO'].includes(p.estado));

  const Fila = ({ p }: { p: Paquete }) => (
    <Card className="mb-3">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <p className="font-mono font-bold text-primary-700">{p.codigoSeguimiento}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{p.descripcion} — <Badge color="purple">{p.prioridad}</Badge></p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            📤 {p.origen?.direccion} → 📥 {p.destino?.direccion}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">📞 {p.destino?.contacto}: {p.destino?.telefono}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">${p.tarifa}</p>
        </div>
        <Badge color={colorEstado[p.estado]}>{p.estado.replace(/_/g, ' ')}</Badge>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        {p.estado === 'ASIGNADO' && (
          <Button onClick={() => actualizar(p, 'EN_TRANSITO', 'Paquete retirado')}>Retirar (en tránsito)</Button>
        )}
        {p.estado === 'EN_TRANSITO' && (
          <>
            <Button onClick={() => actualizar(p, 'ENTREGADO', 'Entrega realizada')}>✅ Entregar</Button>
            <Button variant="secondary" onClick={() => setIncidencia({ id: p.idPaquete, motivo: '' })}>⚠️ Incidencia</Button>
          </>
        )}
        {p.estado === 'INCIDENCIA' && (
          <>
            <Button variant="secondary" onClick={() => actualizar(p, 'EN_TRANSITO', 'Reintento de entrega')}>Reintentar</Button>
            <Button variant="ghost" onClick={() => actualizar(p, 'DEVUELTO', 'Devuelto al origen')}>Devolver</Button>
          </>
        )}
        <Link to={`/track/${p.codigoSeguimiento}`} className="self-center text-sm text-primary-600 hover:underline">Tracking →</Link>
      </div>
    </Card>
  );

  return (
    <>
      <PageHeader title="Paquetería" subtitle="Envíos asignados a tu vehículo" />
      <h2 className="text-lg font-semibold mb-3">Activos ({activos.length})</h2>
      {activos.length === 0 ? <EmptyState message="No tenés paquetes asignados" /> : activos.map((p) => <Fila key={p.idPaquete} p={p} />)}
      {cerrados.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 mt-8">Cerrados</h2>
          {cerrados.map((p) => <Fila key={p.idPaquete} p={p} />)}
        </>
      )}

      {incidencia && (
        <div className="confirm-overlay" onClick={() => setIncidencia(null)}>
          <div className="card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>Registrar incidencia</h3>
            <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 12 }}>
              Describí qué pasó con el paquete.
            </p>
            <input
              className="incidencia-input"
              placeholder="ej: Destinatario ausente, dirección incorrecta…"
              value={incidencia.motivo}
              onChange={(e) => setIncidencia({ ...incidencia, motivo: e.target.value })}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="secondary-button" style={{ flex: 1 }} onClick={() => setIncidencia(null)}>Volver</button>
              <button className="primary-button" style={{ flex: 1 }} disabled={!incidencia.motivo.trim()}
                onClick={() => {
                  const p = paquetes.find((x) => x.idPaquete === incidencia.id);
                  if (p) actualizar(p, 'INCIDENCIA', incidencia.motivo.trim());
                  setIncidencia(null);
                }}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
