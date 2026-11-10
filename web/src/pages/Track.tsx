import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import Mapa, { type Marcador } from '@/components/Mapa';
import { Card, Spinner, Badge, Button } from '@/components/ui';
import type { TrackingPaquete } from '@/types';

const colorEstado: Record<string, string> = {
  PENDIENTE_RECOGIDA: 'yellow', RECIBIDO: 'blue', ASIGNADO: 'purple', EN_TRANSITO: 'blue',
  ENTREGADO: 'green', INCIDENCIA: 'red', DEVUELTO: 'gray', CANCELADO: 'red',
};
const iconEstado: Record<string, string> = {
  CREADO: '📦', PENDIENTE_RECOGIDA: '📦', RECIBIDO: '🏢', ASIGNADO: '👨‍✈️',
  EN_TRANSITO: '🚗', ENTREGADO: '✅', INCIDENCIA: '⚠️', DEVUELTO: '↩️', CANCELADO: '✕',
};

export default function Track() {
  const { codigo: codigoUrl } = useParams();
  const [codigo, setCodigo] = useState(codigoUrl || '');
  const [data, setData] = useState<TrackingPaquete | null>(null);
  const [loading, setLoading] = useState(!!codigoUrl);
  const [error, setError] = useState('');

  const buscar = (cod: string) => {
    if (!cod.trim()) return;
    setLoading(true);
    setError('');
    api.get<TrackingPaquete>(`/paquetes/track/${cod.trim().toUpperCase()}`)
      .then((r) => setData(r.data))
      .catch(() => { setData(null); setError('Código no encontrado. Revisá el ticket.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (codigoUrl) buscar(codigoUrl); }, [codigoUrl]);

  // WS: actualización en vivo del paquete
  useEffect(() => {
    if (!data?.codigoSeguimiento) return;
    const socket = getSocket();
    socket.emit('join', { userId: 'publico', type: 'paquete', id: data.codigoSeguimiento });
    const handler = () => buscar(data.codigoSeguimiento);
    socket.on('paquete_actualizado', handler);
    return () => {
      socket.off('paquete_actualizado', handler);
      socket.emit('leave', { type: 'paquete', id: data.codigoSeguimiento });
    };
  }, [data?.codigoSeguimiento]);

  const marcadores: Marcador[] = data?.ubicacionActual
    ? [{ lat: data.ubicacionActual.latitud, lng: data.ubicacionActual.longitud, emoji: '📦' }]
    : [];

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">DES</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Seguimiento de envío</p>
          </div>
          <Link to="/login" className="text-sm text-primary-600 hover:underline">Ingresar →</Link>
        </div>

        <Card className="mb-4">
          <div className="flex gap-2">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar(codigo)}
              placeholder="Código del ticket (ej: DES-AB3F5K2M)"
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={() => buscar(codigo)}>Buscar</Button>
          </div>
        </Card>

        {loading ? <Spinner /> : error ? (
          <Card><p className="text-center text-red-600 dark:text-red-400 py-6">{error}</p></Card>
        ) : data ? (
          <>
            <Card className="mb-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-mono text-lg font-bold text-primary-700">{data.codigoSeguimiento}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{data.descripcion}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Desde: {data.origenDireccion} → {data.destinoDireccion}</p>
                  {data.remiseria && <p className="text-xs text-gray-400 dark:text-gray-500">Operador: {data.remiseria}</p>}
                </div>
                <Badge color={colorEstado[data.estado]}>{data.estado.replace(/_/g, ' ')}</Badge>
              </div>
            </Card>

            {data.ubicacionActual && (
              <div className="mb-4" style={{ height: 280 }}>
                <Mapa marcadores={marcadores} />
              </div>
            )}

            <Card>
              <h3 className="font-semibold mb-4">Historial del envío</h3>
              <div className="space-y-0">
                {data.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 pb-5 relative">
                    {i < data.timeline.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${i === 0 ? 'bg-primary-100 ring-2 ring-primary-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      {iconEstado[t.estado] || '📌'}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm ${i === 0 ? 'font-semibold' : 'text-gray-600 dark:text-gray-400 dark:text-gray-500'}`}>
                        {t.estado.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(t.fecha).toLocaleString('es-AR')}
                      </p>
                      {t.observaciones && <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{t.observaciones}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 dark:text-gray-500 py-6">Ingresá el código de tu ticket para ver el seguimiento</p></Card>
        )}
      </div>
    </div>
  );
}
