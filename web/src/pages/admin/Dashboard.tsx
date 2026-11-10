import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui';
import Mapa, { type Marcador } from '@/components/Mapa';
import Icon from '@/components/Icon';
import type { Chofer, Viaje, Paquete } from '@/types';

export default function AdminDashboard() {
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const cargar = () =>
    Promise.all([
      api.get<Chofer[]>('/choferes'),
      api.get<Viaje[]>('/viajes'),
      api.get<Paquete[]>('/paquetes'),
    ]).then(([c, v, p]) => {
      setChoferes(c.data);
      setViajes(v.data);
      setPaquetes(p.data);
      setUpdatedAt(new Date());
    }).finally(() => setLoading(false));

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner />;

  const hoy = new Date().toISOString().slice(0, 10);
  const activos = choferes.filter((c) => c.estadoChofer === 'DISPONIBLE' || c.estadoChofer === 'EN_VIAJE').length;
  const viajesHoy = viajes.filter((v) => v.fechaSalida === hoy).length;
  const ingresos = viajes.reduce(
    (a, v) =>
      a +
      (v.reservas || [])
        .filter((r) => r.estadoPago === 'PAGADO')
        .reduce((x, r) => x + Number(r.importeTotal), 0),
    0,
  );
  const enTransito = paquetes.filter((p) => p.estado === 'EN_TRANSITO').length;

  const kpis = [
    ['car', 'Choferes activos', String(activos), `de ${choferes.length}`, 'success'],
    ['route', 'Viajes de hoy', String(viajesHoy), `${viajes.length} totales`, 'violet'],
    ['wallet', 'Ingresos', `$${ingresos.toLocaleString('es-AR')}`, 'pagos confirmados', 'warning'],
    ['package', 'Paquetes en tránsito', String(enTransito), `${paquetes.length} totales`, 'danger'],
  ];

  const marcadores: Marcador[] = choferes
    .filter((c) => c.latitud != null && c.longitud != null)
    .map((c) => ({
      lat: Number(c.latitud),
      lng: Number(c.longitud),
      emoji: c.estadoChofer === 'EN_VIAJE' ? '🚗' : '🟢',
      label: c.usuario?.nombre,
    }));

  // Feed de actividad: mezcla reservas recientes + paquetes recientes
  const actividad = [
    ...viajes.flatMap((v) =>
      (v.reservas || []).map((r) => ({
        ini: (r.pasajero?.usuario?.nombre || 'P')[0] + (r.pasajero?.usuario?.apellido || 'X')[0],
        texto: `${r.pasajero?.usuario?.nombre || 'Pasajero'} reservó ${v.origen?.nombre} → ${v.destino?.nombre}`,
        detalle: `$${r.importeTotal} · ${r.estadoPago}`,
        tone: r.estadoPago === 'PAGADO' ? 'violet' : 'neutral',
        ts: new Date(r.createdAt || 0).getTime(),
      })),
    ),
    ...paquetes.map((p) => ({
      ini: '📦',
      texto: `Paquete ${p.codigoSeguimiento} — ${String(p.estado).replace(/_/g, ' ').toLowerCase()}`,
      detalle: `${p.origen?.direccion || ''} → ${p.destino?.direccion || ''}`,
      tone: p.estado === 'ENTREGADO' ? 'success' : 'warning',
      ts: new Date(p.createdAt || 0).getTime(),
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 5);

  const fechaLarga = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div>
      <div className="supervisor-heading">
        <div>
          <span>{fechaLarga.toUpperCase()}</span>
          <h2>Buenas tardes</h2>
          <p>Así está funcionando DES ahora.</p>
        </div>
        <div className="live-status">
          <i />
          Actualiza cada 15s{updatedAt ? ` · ${updatedAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="card kpi" key={k[1]}>
            <div className={`kpi-icon ${k[4]}`}>
              <Icon name={k[0]} />
            </div>
            <div>
              <span>{k[1]}</span>
              <strong>{k[2]}</strong>
              <small className={k[4]}>{k[3]}</small>
            </div>
            <Icon name="more" />
          </div>
        ))}
      </div>

      <div className="supervisor-main-grid">
        <section className="card fleet-map-card">
          <div className="card-heading">
            <div>
              <h3>Flota en tiempo real</h3>
              <p>{activos} choferes activos en el área</p>
            </div>
          </div>
          <Mapa marcadores={marcadores} />
          <div className="map-legend">
            <span><i className="green" />Disponible ({choferes.filter((c) => c.estadoChofer === 'DISPONIBLE').length})</span>
            <span><i className="violet" />En viaje ({choferes.filter((c) => c.estadoChofer === 'EN_VIAJE').length})</span>
            <span><i className="amber" />Descanso/otros ({choferes.length - activos})</span>
          </div>
        </section>

        <section className="card activity-card">
          <div className="card-heading">
            <div>
              <h3>Actividad reciente</h3>
              <p>Últimos movimientos</p>
            </div>
          </div>
          <div className="activity-list">
            {actividad.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: 12, padding: 12 }}>Sin actividad todavía</p>
            )}
            {actividad.map((a, i) => (
              <div className="activity" key={i}>
                <div className={`mini-avatar ${a.tone}`}>{a.ini}</div>
                <div>
                  <strong>{a.texto}</strong>
                  <span>{a.detalle}</span>
                </div>
                <i />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
