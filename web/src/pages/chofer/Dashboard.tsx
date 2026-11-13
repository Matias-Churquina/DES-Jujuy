import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/Toast';
import Mapa, { type Marcador } from '@/components/Mapa';
import Icon from '@/components/Icon';
import ChatInbox from '@/components/ChatInbox';
import type { Viaje, Chofer, Reserva } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function ChoferDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chofer, setChofer] = useState<Chofer | null>(null);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpsOn, setGpsOn] = useState(false);
  const watchId = useRef<number | null>(null);
  const lastSent = useRef(0);

  const idChofer = user?.chofer?.idChofer;
  const disponible = chofer?.estadoChofer === 'DISPONIBLE' || chofer?.estadoChofer === 'EN_VIAJE';

  const viajeActual = viajes.find(
    (v) => v.estadoViaje === 'ABIERTO' || v.estadoViaje === 'COMPLETO' || v.estadoViaje === 'EN_CURSO',
  );

  const cargar = () => {
    if (!idChofer) { setLoading(false); return; }
    Promise.all([
      api.get<Chofer>(`/choferes/${idChofer}`),
      api.get<Viaje[]>(`/choferes/${idChofer}/viajes`),
    ]).then(([c, v]) => {
      setChofer(c.data);
      setViajes(v.data);
      const actual = v.data.find(
        (x) => x.estadoViaje === 'ABIERTO' || x.estadoViaje === 'COMPLETO' || x.estadoViaje === 'EN_CURSO',
      );
      if (actual) {
        api.get<Reserva[]>(`/reservas/viaje/${actual.idViaje}`)
          .then((r) => setReservas(r.data.filter((x) => x.estadoReserva !== 'CANCELADA')))
          .catch(() => {});
      } else {
        setReservas([]);
      }
    }).finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cargar, [idChofer]);

  // GPS: cuando el viaje está EN_CURSO, reportar ubicación cada ~10s
  useEffect(() => {
    if (!idChofer || viajeActual?.estadoViaje !== 'EN_CURSO') {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
        setGpsOn(false);
      }
      return;
    }
    if (!('geolocation' in navigator) || watchId.current !== null) return;

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const ahora = Date.now();
        if (ahora - lastSent.current < 10000) return;
        lastSent.current = ahora;
        api.patch(`/choferes/${idChofer}/ubicacion`, {
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          precision: pos.coords.accuracy,
        }).catch(() => {});
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true },
    );
    setGpsOn(true);

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
        setGpsOn(false);
      }
    };
  }, [idChofer, viajeActual?.estadoViaje]);

  const cambiarEstado = async () => {
    if (!idChofer || !chofer) return;
    const nuevo = disponible ? 'DESCANSO' : 'DISPONIBLE';
    try {
      await api.patch(`/choferes/${idChofer}/estado`, { estadoChofer: nuevo });
      cargar();
    } catch {
      toast('error', 'No se pudo cambiar tu estado');
    }
  };

  const iniciarViaje = async () => {
    if (!viajeActual) return;
    try {
      await api.patch(`/viajes/${viajeActual.idViaje}/estado`, { estado: 'EN_CURSO' });
      toast('success', 'Viaje iniciado. ¡Buen recorrido!');
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo iniciar el viaje');
    }
  };

  const finalizarViaje = async () => {
    if (!viajeActual) return;
    try {
      await api.patch(`/viajes/${viajeActual.idViaje}/estado`, { estado: 'FINALIZADO' });
      toast('success', 'Viaje finalizado');
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo finalizar');
    }
  };

  if (loading) return <Spinner />;
  if (!idChofer) return <EmptyState message="No se encontró tu perfil de chofer" />;

  // Asientos: un seat por lugar del auto, coloreado por estado de pago
  const capacidad = (viajeActual as any)?.auto?.capacidadAsientos || 4;
  const asientosOcupados = capacidad - (viajeActual?.asientosDisponibles ?? capacidad);
  const seats: { tone: string; label: string }[] = [];
  reservas.forEach((r) => {
    const nombre = r.pasajero?.usuario?.nombre || 'Pax';
    const tone = r.estadoPago === 'PAGADO' ? 'paid' : r.canalPago === 'EFECTIVO' ? 'cash' : 'occupied';
    for (let i = 0; i < r.cantidadAsientos && seats.length < capacidad; i++) {
      seats.push({ tone, label: nombre });
    }
  });
  while (seats.length < capacidad) seats.push({ tone: 'free', label: 'Libre' });

  const ganancia = reservas
    .filter((r) => r.estadoPago === 'PAGADO')
    .reduce((a, r) => a + Number(r.importeTotal), 0);
  const viajesHoy = viajes.filter((v) => v.fechaSalida === new Date().toISOString().slice(0, 10)).length;

  const marcadores: Marcador[] = viajeActual
    ? [
        ...(viajeActual.origen?.latitud != null
          ? [{ lat: viajeActual.origen.latitud, lng: viajeActual.origen.longitud!, emoji: '🏠' }]
          : []),
        ...(viajeActual.destino?.latitud != null
          ? [{ lat: viajeActual.destino.latitud, lng: viajeActual.destino.longitud!, emoji: '📍' }]
          : []),
        ...(chofer?.latitud != null && chofer?.longitud != null
          ? [{ lat: chofer.latitud, lng: chofer.longitud, emoji: '🚗' }]
          : []),
      ]
    : [];

  return (
    <div>
      <section className="driver-welcome card">
        <div>
          <span className={`status-pulse ${disponible ? '' : 'off'}`} />
          <div>
            <strong>{disponible ? 'Estás disponible' : 'Estás en descanso'}</strong>
            <span>{disponible ? 'Podés recibir nuevos viajes' : 'No recibirás nuevas solicitudes'}</span>
          </div>
        </div>
        <button className={`availability ${disponible ? 'on' : ''}`} onClick={cambiarEstado}>
          <span />
          {disponible ? 'DISPONIBLE' : 'DESCANSO'}
        </button>
      </section>

      <div className="driver-grid">
        <section className="current-trip card">
          <div className="card-title">
            <div>
              <span className="badge violet"><span className="badge-dot" />{viajeActual ? (viajeActual.estadoViaje === 'EN_CURSO' ? 'EN CURSO' : 'PRÓXIMO VIAJE') : 'SIN VIAJE'}</span>
              {viajeActual ? (
                <>
                  <h2>{viajeActual.origen?.nombre} → {viajeActual.destino?.nombre}</h2>
                  <p>Salida {viajeActual.fechaSalida} · {viajeActual.horaSalida}</p>
                </>
              ) : (
                <>
                  <h2>Sin viaje programado</h2>
                  <p>Creá un viaje desde Mis Viajes</p>
                </>
              )}
            </div>
            <span className={`badge ${gpsOn ? 'success' : ''}`}>
              <span className="badge-dot" />{gpsOn ? 'GPS activo' : 'GPS inactivo'}
            </span>
          </div>
          {viajeActual && (
            <>
              <div className="driver-trip-body">
                <div className="driver-map">
                  <Mapa marcadores={marcadores} />
                </div>
                <div className="seats-panel">
                  <div className="seat-title">
                    <strong>Ocupación</strong>
                    <span>{asientosOcupados} de {capacidad} asientos</span>
                  </div>
                  <div className="seat-map">
                    <div className="steering">◉</div>
                    {seats.map((s, i) => (
                      <div key={i} className={`seat ${s.tone}`}>
                        <Icon name="seat" size={20} />
                        <small>{s.label}</small>
                      </div>
                    ))}
                  </div>
                  <div className="seat-legend">
                    <span><i className="green" />Pagado</span>
                    <span><i className="amber" />Efectivo</span>
                    <span><i className="blue" />Reservado</span>
                    <span><i />Libre</span>
                  </div>
                </div>
              </div>
              <div className="driver-cta">
                <button className="secondary-button" onClick={() => navigate('/chofer/viajes')}>
                  <Icon name="users" />
                  Ver reservas
                </button>
                {viajeActual.estadoViaje === 'EN_CURSO' ? (
                  <button className="primary-button" onClick={finalizarViaje}>
                    Finalizar viaje
                    <Icon name="arrow" />
                  </button>
                ) : (
                  <button className="primary-button" onClick={iniciarViaje}>
                    Iniciar viaje
                    <Icon name="arrow" />
                  </button>
                )}
              </div>
            </>
          )}
          {!viajeActual && (
            <div className="driver-cta" style={{ borderTop: 0 }}>
              <button className="primary-button" onClick={() => navigate('/chofer/viajes')}>
                <Icon name="plus" />
                Crear viaje
              </button>
            </div>
          )}
        </section>

        <aside className="driver-side">
          <div className="earning-card card">
            <div className="card-title">
              <div>
                <span>GANANCIA ESTIMADA</span>
                <h2>${ganancia.toLocaleString('es-AR')}</h2>
              </div>
              <div className="trend-bubble">
                <Icon name="trend" />
              </div>
            </div>
            <div className="earning-bar">
              <span style={{ width: `${Math.min(100, Math.round((ganancia / 25000) * 100))}%` }} />
            </div>
            <div className="earning-meta">
              <span>Meta diaria</span>
              <strong>$25.000</strong>
            </div>
          </div>
          <div className="stat-pair">
            <div className="card mini-stat">
              <Icon name="route" />
              <strong>{viajesHoy}</strong>
              <span>Viajes hoy</span>
            </div>
            <div className="card mini-stat">
              <Icon name="route" />
              <strong>{reservas.reduce((a, r) => a + r.cantidadAsientos, 0)}</strong>
              <span>Pasajeros</span>
            </div>
          </div>
          <div className="weather-driver card">
            <span className="sun-orb" />
            <div>
              <strong>24° · Despejado</strong>
              <span>Buen clima para viajar</span>
            </div>
            <small>{new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</small>
          </div>
        </aside>
      </div>

      <ChatInbox />
    </div>
  );
}
