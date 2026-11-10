import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Card, PageHeader, Spinner, Badge, Button, EmptyState } from '@/components/ui';
import { useToast } from '@/components/Toast';
import type { Paquete, Chofer } from '@/types';
import { Link } from 'react-router-dom';

const ESTADOS = ['PENDIENTE_RECOGIDA', 'RECIBIDO', 'ASIGNADO', 'EN_TRANSITO', 'ENTREGADO', 'INCIDENCIA', 'DEVUELTO', 'CANCELADO'];
const colorEstado: Record<string, string> = {
  PENDIENTE_RECOGIDA: 'yellow', RECIBIDO: 'blue', ASIGNADO: 'purple', EN_TRANSITO: 'blue',
  ENTREGADO: 'green', INCIDENCIA: 'red', DEVUELTO: 'gray', CANCELADO: 'red',
};

export default function AdminPaquetes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const idRemiseria = user?.admin?.idRemiseria;

  const cargar = () => {
    Promise.all([
      api.get<Paquete[]>('/paquetes', { params: idRemiseria ? { idRemiseria } : {} }),
      api.get<Chofer[]>('/choferes'),
    ]).then(([p, c]) => { setPaquetes(p.data); setChoferes(c.data); })
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const asignar = async (p: Paquete, idChofer: number) => {
    if (!idChofer) return;
    try {
      await api.patch(`/paquetes/${p.idPaquete}/asignar`, { idChofer });
      toast('success', `${p.codigoSeguimiento} asignado`);
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo asignar');
    }
  };

  const recibir = async (p: Paquete) => {
    try {
      await api.patch(`/paquetes/${p.idPaquete}/recibir`);
      toast('success', `${p.codigoSeguimiento} marcado como recibido`);
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo marcar recibido');
    }
  };

  if (loading) return <Spinner />;

  const filtrados = filtro ? paquetes.filter((p) => p.estado === filtro) : paquetes;
  const pendientes = paquetes.filter((p) => p.estado === 'PENDIENTE_RECOGIDA').length;

  return (
    <>
      <PageHeader title="Centro de Paquetería" subtitle="Gestión y asignación de envíos"
        action={<Badge color="yellow">{pendientes} sin asignar</Badge>} />

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant={filtro === '' ? 'primary' : 'ghost'} onClick={() => setFiltro('')}>Todos</Button>
        {ESTADOS.map((e) => (
          <Button key={e} variant={filtro === e ? 'primary' : 'ghost'} onClick={() => setFiltro(e)}>
            {e.replace(/_/g, ' ')}
          </Button>
        ))}
      </div>

      {filtrados.length === 0 ? <EmptyState message="No hay paquetes en este estado" /> : (
        <div className="space-y-3">
          {filtrados.map((p) => (
            <Card key={p.idPaquete}>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="font-mono font-bold text-primary-700">{p.codigoSeguimiento}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{p.descripcion}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{p.origen?.direccion} → {p.destino?.direccion}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Remitente: {p.pasajeroRemitente?.usuario?.nombre} {p.pasajeroRemitente?.usuario?.apellido}
                    {' — '}Chofer: {p.chofer?.usuario ? `${p.chofer.usuario.nombre} ${p.chofer.usuario.apellido}` : 'sin asignar'}
                  </p>
                </div>
                <Badge color={colorEstado[p.estado]}>{p.estado.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex gap-2 mt-3 items-center flex-wrap">
                {p.estado === 'PENDIENTE_RECOGIDA' && (
                  <Button variant="secondary" onClick={() => recibir(p)}>📥 Marcar recibido</Button>
                )}
                {p.estado === 'RECIBIDO' && (
                  <select
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    defaultValue=""
                    onChange={(e) => asignar(p, Number(e.target.value))}
                  >
                    <option value="" disabled>Asignar chofer...</option>
                    {choferes.map((c) => (
                      <option key={c.idChofer} value={c.idChofer}>
                        {c.usuario?.nombre} {c.usuario?.apellido}
                      </option>
                    ))}
                  </select>
                )}
                <Link to={`/track/${p.codigoSeguimiento}`} className="text-sm text-primary-600 hover:underline">Tracking →</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
